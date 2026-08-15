#!/usr/bin/env python3
"""Bulk RU→KO translation harness (DeepSeek) for book-length works.

Successor to translate_naumov.py / translate_ezhov.py / retranslate_qa.py,
fixing the root cause of their consistency failures: stateless chunks.

Per chunk it now:
 1. injects a glossary filtered from glossary-db.json (extract_glossary.py)
    plus the fixed policy card style-card.ko.md into the prompt;
 2. appends the tail of the previous chunk's finished translation as
    rolling context (register/terminology carry-over) — hence sequential;
 3. runs QA gates (CJK leak, register flip, paragraph-count match,
    glossary conformance) with problem-specific reinforced retries.

A chunk that still fails a gate after MAX_ATTEMPTS keeps its best attempt
and is recorded with flags; <src>.flags.txt lists everything needing
human review. Only empty/truncated output is fatal.

Usage:
  translate_bulk.py SRC.txt [--mode scholarly|testimony] [--desc "책 소개 한 줄"]
                            [--limit N] [--dry-run] [--chunk-chars 3500]

Checkpoints to SRC.ko.jsonl ({"i","ko","flags"}); safe to re-run.
Assembles SRC.ko.txt when all chunks are done.
"""
import argparse
import json
import re
import time
from pathlib import Path

from openai import OpenAI

MODEL = "deepseek-v4-flash"
# All provider calls go through the local LLM proxy (sole holder of API keys).
PROXY_BASE = "http://127.0.0.1:8110/deepseek"
MAX_ATTEMPTS = 4
TAIL_PARAS = 2
TAIL_CAP = 700

HERE = Path(__file__).parent
STYLE_CARD = (HERE / "style-card.ko.md").read_text(encoding="utf-8")

BASE = {
    "scholarly": (
        "러시아어 역사서를 한국어로 옮기는 전문 번역가다. {desc}\n\n"
        "- 학술서에 맞는 자연스러운 한국어 문어체(「~했다/~이다」체)로 옮긴다. "
        "본문 서술에 「~습니다」체를 쓰지 않는다. 다만 원문이 직접 인용하는 진술·발언은 "
        "원문 어조대로 옮긴다.\n"
        "- 원문의 의미를 빠뜨리거나 덧붙이지 않는다."
    ),
    "testimony": (
        "소련 시대 사료(신문 조서·진술서·최후 진술)를 한국어로 옮기는 전문 번역가다. {desc}\n\n"
        "- 신문 조서의 문답은 「문:」/「답:」으로 옮긴다(Вопрос→문, Ответ→답). "
        "1인칭 진술문은 모두 정중한 문어체(「~습니다」, 문은 「~습니까」·「~하십시오」)로 옮기고 "
        "반말 평서체(「~했다」)를 쓰지 않는다. 편자 해설만 「~했다/~이다」체로 옮긴다.\n"
        "- 원문의 의미를 빠뜨리거나 덧붙이지 않는다."
    ),
}

STRUCTURE = (
    "입력 형식: 사용자 메시지에는 [용어집], [직전 문맥], [번역할 원문] 구획이 올 수 있다.\n"
    "- [용어집]의 표기는 반드시 그대로 쓴다.\n"
    "- [직전 문맥]은 이미 번역이 끝난 직전 부분이다. 문체와 용어를 그대로 이어받되, "
    "다시 번역하거나 출력하지 마라.\n"
    "- [번역할 원문]만 번역해 출력한다. 번역문 외에 해설·주석·머리말을 덧붙이지 않는다.\n"
    "- 문단 구분(빈 줄)을 원문 그대로 유지한다. 문단을 합치거나 쪼개지 않는다."
)


def chunks_of(text, chunk_chars):
    paras = [p for p in text.split("\n\n") if p.strip()]
    out, cur, size = [], [], 0
    for p in paras:
        if cur and size + len(p) > chunk_chars:
            out.append("\n\n".join(cur))
            cur, size = [], 0
        cur.append(p)
        size += len(p) + 2
    if cur:
        out.append("\n\n".join(cur))
    return out


def n_paras(text):
    return len([p for p in text.split("\n\n") if p.strip()])


# ---- glossary ----------------------------------------------------------

def load_glossary():
    path = HERE / "glossary-db.json"
    if not path.exists():
        raise SystemExit("glossary-db.json 없음 — 먼저 extract_glossary.py를 실행할 것")
    gloss = json.loads(path.read_text(encoding="utf-8"))
    # A person mention is the cased stem (plus its ALL-CAPS variant, common in
    # interrogation records) followed by at most 3 lowercase inflection
    # letters. Boundaries stop substring hits (Кон in конечно, Ким in таким).
    for p in gloss["people"]:
        m = re.escape(p["match"])
        up = re.escape(p["match"].upper())
        p["rx"] = re.compile(
            rf"(?<![А-Яа-яЁё])(?:{m}[а-яё]{{0,3}}|{up}[А-ЯЁ]{{0,3}})(?![А-Яа-яЁё])")
    for t in gloss["terms"]:
        t["rx"] = [
            [re.compile(rf"(?<![а-яё]){re.escape(s)}[а-яё]{{0,4}}(?![а-яё])",
                        re.IGNORECASE) for s in group]
            for group in t["groups"]]
    return gloss


def match_glossary(gloss, chunk):
    people = [p for p in gloss["people"] if p["rx"].search(chunk)]
    terms = [t for t in gloss["terms"]
             if any(all(rx.search(chunk) for rx in group) for group in t["rx"])]
    return people, terms


def glossary_block(people, terms):
    lines = []
    for p in people:
        line = f"{p['cyr']} → {p['ko']}"
        if p["pat_cyr"] and p["pat_ko"]:
            line += f" (부칭 {p['pat_cyr']} → {p['pat_ko']})"
        lines.append(line)
    for t in terms:
        lines.append(f"{t['ru']} → {t['ko']}")
    if not lines:
        return ""
    return "[용어집] 아래 고유명사·용어는 반드시 이 표기를 쓴다:\n" + "\n".join(lines)


def conformance_targets(people):
    """Only surnames whose matched entries agree on one nonempty family_ko
    are hard-checked (same surname, two spellings → skip). Terms are
    deliberately NOT gated: their Russian originals are often polysemous
    common nouns (лагерь = camp vs bloc), so a hard check burns retries on
    false positives — the glossary line in the prompt is their lever."""
    by_stem = {}
    for p in people:
        ko = p["family_ko"] or p["ko"]
        if ko:
            by_stem.setdefault(p["match"].lower(), {})[ko] = p["cyr"]
    return [(cyr, ko) for stem, d in by_stem.items() if len(d) == 1
            for ko, cyr in d.items()]


# ---- QA gates ----------------------------------------------------------

def qa_problems(src_chunk, ko, mode, names):
    probs = []
    if re.search(r"[一-鿿]", ko):
        probs.append(("cjk", None))
    hab = len(re.findall(r"니다|니까", ko))
    hada = len(re.findall(r'(?:했|였|았|었|이|한)다[.\s"”」)]', ko))
    if mode == "testimony" and hada > hab and hada > 3:
        probs.append(("register", f"니다 {hab} vs 다체 {hada}"))
    if mode == "scholarly" and hab > hada and hab > 3:
        probs.append(("register", f"다체 {hada} vs 니다 {hab}"))
    want = n_paras(src_chunk)
    got = n_paras(ko)
    if want != got:
        probs.append(("paragraphs", f"{want} → {got}"))
    if "**" in ko and "**" not in src_chunk:
        probs.append(("markdown", None))
    missing_names = [(c, k) for c, k in names if k not in ko]
    if missing_names:
        probs.append(("names", missing_names))
    return probs


def reinforcement(probs, mode, src_chunk):
    lines = ["주의 — 직전 시도에서 다음 규칙을 어겼다. 이번에는 반드시 지켜라:"]
    for kind, detail in probs:
        if kind == "cjk":
            lines.append("- 한자·중국어를 한 글자도 출력하지 마라.")
        elif kind == "register" and mode == "testimony":
            lines.append("- 모든 진술 문장을 「~습니다/~았습니다/~입니다」체로 끝내라. "
                         "「~했다/~였다」체 금지.")
        elif kind == "register":
            lines.append("- 본문 서술을 「~했다/~이다」체로 끝내라. 직접 인용문 밖에서 "
                         "「~습니다」체 금지.")
        elif kind == "paragraphs":
            lines.append(f"- 원문은 문단이 정확히 {n_paras(src_chunk)}개다. 번역도 같은 "
                         "개수의 문단으로 출력하고, 문단을 합치거나 쪼개거나 "
                         "[직전 문맥]을 다시 출력하지 마라.")
        elif kind == "markdown":
            lines.append("- 마크다운 서식(**, ## 등)을 붙이지 마라. 원문에 없는 강조를 만들지 마라.")
        elif kind == "names":
            pairs = ", ".join(f"{c}→{k}" for c, k in detail)
            lines.append(f"- 다음 표기를 반드시 그대로 써라: {pairs}")
    return "\n".join(lines) + "\n\n"


# ---- main --------------------------------------------------------------

def tail_of(ko):
    paras = [p for p in ko.split("\n\n") if p.strip()]
    tail = "\n\n".join(paras[-TAIL_PARAS:])
    return tail[-TAIL_CAP:]


def build_user(gloss_text, prev_tail, chunk, extra=""):
    parts = []
    if gloss_text:
        parts.append(gloss_text)
    if prev_tail:
        parts.append("[직전 문맥] 참고만 하고 다시 번역하지 마라:\n" + prev_tail)
    parts.append("[번역할 원문]\n" + extra + chunk)
    return "\n\n".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--mode", choices=["scholarly", "testimony"], default="scholarly")
    ap.add_argument("--desc", default="소련 시대(NKVD·대숙청) 관련 저작을 번역한다.")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--chunk-chars", type=int, default=3500)
    args = ap.parse_args()

    src = Path(args.src)
    text = src.read_text(encoding="utf-8")
    chunks = chunks_of(text, args.chunk_chars)
    ckpt = src.with_suffix(".ko.jsonl")
    out_path = src.with_suffix(".ko.txt")
    flags_path = src.with_suffix(".flags.txt")

    system = BASE[args.mode].format(desc=args.desc) + "\n\n" + STRUCTURE + "\n\n" + STYLE_CARD
    gloss = load_glossary()

    done, flagged = {}, {}
    if ckpt.exists():
        for line in ckpt.read_text(encoding="utf-8").splitlines():
            if line.strip():
                rec = json.loads(line)
                if rec["ko"].strip():
                    done[rec["i"]] = rec["ko"]
                    if rec.get("flags"):
                        flagged[rec["i"]] = rec["flags"]

    todo = [i for i in range(len(chunks)) if i not in done]
    if args.limit is not None:
        todo = todo[:args.limit]
    print(f"{src.name}: {len(chunks)} chunks, {len(done)} done, {len(todo)} to go "
          f"(mode={args.mode})", flush=True)

    if args.dry_run:
        i = todo[0] if todo else 0
        people, terms = match_glossary(gloss, chunks[i])
        prev = tail_of(done[i - 1]) if i > 0 and (i - 1) in done else ""
        print("=" * 30, f"SYSTEM ({len(system)} chars)", "=" * 30)
        print(system)
        print("=" * 30, f"USER (chunk {i})", "=" * 30)
        print(build_user(glossary_block(people, terms), prev, chunks[i]))
        return

    client = OpenAI(api_key="proxy-injected", base_url=PROXY_BASE,
                    timeout=300, max_retries=3)
    usage = {"in": 0, "out": 0, "n": 0, "retries": 0}
    t0 = time.time()

    for i in todo:
        chunk = chunks[i]
        people, terms = match_glossary(gloss, chunk)
        gloss_text = glossary_block(people, terms)
        names = conformance_targets(people)
        prev_tail = tail_of(done[i - 1]) if i > 0 and (i - 1) in done else ""

        best, best_probs, extra = None, None, ""
        for attempt in range(MAX_ATTEMPTS):
            resp = client.chat.completions.create(
                model=MODEL, temperature=1.0, max_tokens=8000,
                extra_body={"thinking": {"type": "disabled"}},
                messages=[{"role": "system", "content": system},
                          {"role": "user",
                           "content": build_user(gloss_text, prev_tail, chunk, extra)}])
            usage["in"] += resp.usage.prompt_tokens
            usage["out"] += resp.usage.completion_tokens
            ko = (resp.choices[0].message.content or "").strip()
            fin = resp.choices[0].finish_reason
            if not ko or fin != "stop":
                print(f"  chunk {i} attempt {attempt}: empty/truncated ({fin})", flush=True)
                usage["retries"] += 1
                continue
            probs = qa_problems(chunk, ko, args.mode, names)
            if best is None or len(probs) < len(best_probs):
                best, best_probs = ko, probs
            if not probs:
                break
            desc = ", ".join(k for k, _ in probs)
            print(f"  chunk {i} attempt {attempt}: {desc}", flush=True)
            usage["retries"] += 1
            extra = reinforcement(probs, args.mode, chunk)
        if best is None:
            raise SystemExit(f"chunk {i}: no usable content after {MAX_ATTEMPTS} attempts")

        flags = [f"{k}: {d}" if d else k for k, d in (best_probs or [])]
        with ckpt.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"i": i, "ko": best, "flags": flags},
                               ensure_ascii=False) + "\n")
        done[i] = best
        if flags:
            flagged[i] = flags
            print(f"  chunk {i} FLAGGED: {flags}", flush=True)
        usage["n"] += 1
        if usage["n"] % 10 == 0 or usage["n"] == len(todo):
            el = time.time() - t0
            print(f"  {usage['n']}/{len(todo)} chunks, {el/60:.1f}min, "
                  f"retries={usage['retries']}, tokens in={usage['in']} out={usage['out']}",
                  flush=True)

    cost = usage["in"] * 0.14 / 1e6 + usage["out"] * 0.28 / 1e6
    print(f"session: {usage['n']} chunks, retries={usage['retries']}, "
          f"in={usage['in']} out={usage['out']} tokens, ~${cost:.3f}", flush=True)

    if flagged:
        report = "\n".join(f"chunk {i}: {'; '.join(fl)}" for i, fl in sorted(flagged.items()))
        flags_path.write_text(report + "\n", encoding="utf-8")
        print(f"{len(flagged)} flagged chunks → {flags_path.name} (사람 검수 필요)", flush=True)

    if len(done) == len(chunks):
        out_path.write_text("\n\n".join(done[i] for i in range(len(chunks))) + "\n",
                            encoding="utf-8")
        print(f"assembled {out_path}", flush=True)
    else:
        print(f"{len(chunks) - len(done)} chunks still missing; not assembling.", flush=True)


if __name__ == "__main__":
    main()
