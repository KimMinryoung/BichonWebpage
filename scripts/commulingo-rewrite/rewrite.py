#!/usr/bin/env python3
"""자본론 문항 재작업 하네스 — 장 단위로 Claude에 초안을 받고 gate.js로 검사한다.

  python3 scripts/commulingo-rewrite/rewrite.py --chapters capital-v1-ch01,capital-v1-ch02
  python3 scripts/commulingo-rewrite/rewrite.py --part v1-p1 [--limit N] [--dry-run]
  python3 scripts/commulingo-rewrite/rewrite.py --volume 1 --budget-usd 5

장마다: 원문 캐시(fetch_chapter.js) → 프롬프트 조립(prompt.system.md + prompt.user.md)
→ 프록시(127.0.0.1:8110/anthropic) 경유 호출 → 후보 JSON 저장 → gate.js 판정 →
hard 위반이면 위반 목록을 강화 지시로 붙여 최대 MAX_ATTEMPTS회 재시도 → 최선 시도를
temp_dev/commulingo-rewrite/candidates/<chapterId>.json 에 두고 .flags.txt 와
progress.jsonl 에 기록한다. 순차 실행: 앞 장 후보의 terminology 가 뒤 장의 용어
카드에 더해진다. 진행 기록에 clean/flagged 로 남은 장은 --force 없이는 건너뛴다.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import time
from pathlib import Path

import anthropic
from openai import OpenAI

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
WORK = ROOT / "temp_dev" / "commulingo-rewrite"
CANDIDATES = WORK / "candidates"
PROGRESS = WORK / "progress.jsonl"
USAGE = WORK / "usage.jsonl"
# All provider calls go through the local LLM proxy (sole holder of API keys);
# the key value is a placeholder the proxy replaces.
PROXY_BASE = "http://127.0.0.1:8110/anthropic"
PROXY_BASE_DEEPSEEK = "http://127.0.0.1:8110/deepseek"
API_KEY = "via-llm-proxy"
# Default provider is DeepSeek (V4 Pro): Claude via the API is pay-per-token
# and a chapter cost about $0.30 per attempt there; V4 Pro is ~$0.04.
DEFAULT_MODEL = "deepseek-v4-pro"
MAX_ATTEMPTS = 3
# USD per million tokens: input, output, cache read, cache write.
PRICES = {
    "claude-sonnet-5": (2.00, 10.00, 0.20, 2.50),
    "claude-opus-5": (5.00, 25.00, 0.50, 6.25),
    "deepseek-v4-pro": (0.435, 0.87, 0.003625, 0.435),
    "deepseek-v4-flash": (0.14, 0.28, 0.0028, 0.14),
}

def provider_of(model):
    return "deepseek" if model.startswith("deepseek") else "anthropic"

SYSTEM = (HERE / "prompt.system.md").read_text(encoding="utf-8")
USER_TEMPLATE = (HERE / "prompt.user.md").read_text(encoding="utf-8")
TERMS = json.loads((HERE / "terminology.json").read_text(encoding="utf-8"))


def node(script, *args):
    proc = subprocess.run(["node", str(HERE / script), *args], cwd=ROOT, capture_output=True, text=True)
    if proc.returncode != 0:
        raise SystemExit(f"{script} {' '.join(args)} failed:\n{proc.stderr}")
    return proc.stdout


def list_chapters():
    return json.loads(node("dump_chapter.js", "--list"))


def select_chapters(args, rows):
    order = {row["id"]: i for i, row in enumerate(rows)}
    picked = []
    if args.chapters:
        for token in args.chapters.split(","):
            token = token.strip()
            if ".." in token:
                a, b = token.split("..", 1)
                if a not in order or b not in order:
                    raise SystemExit(f"unknown chapter in range {token}")
                picked.extend(rows[order[a]: order[b] + 1])
            elif token in order:
                picked.append(rows[order[token]])
            else:
                raise SystemExit(f"unknown chapter {token}")
    if args.part:
        m = re.fullmatch(r"v(\d+)-p(\d+)", args.part)
        if not m:
            raise SystemExit("--part looks like v1-p3")
        picked.extend(r for r in rows if r["volume"] == int(m.group(1)) and r["part"] == int(m.group(2)))
    if args.volume:
        picked.extend(r for r in rows if r["volume"] == args.volume)
    seen, out = set(), []
    for r in picked:
        if r["id"] not in seen:
            seen.add(r["id"])
            out.append(r)
    return out[: args.limit] if args.limit else out


def read_jsonl(path):
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def append_jsonl(path, row):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def chapter_text(chapter_id):
    file = WORK / "marxists" / f"{chapter_id}.json"
    if not file.exists():
        node("fetch_chapter.js", chapter_id)
    return json.loads(file.read_text(encoding="utf-8"))


def fmt_questions(chapter):
    lines = []
    for lesson in chapter["lessons"]:
        for q in lesson["questions"]:
            lines.append(f"## {lesson['level']}/{q['id']}")
            lines.append(f"prompt.ko: {q['prompt']['ko']}")
            lines.append(f"prompt.en: {q['prompt']['en']}")
            for i, (ko, en) in enumerate(zip(q["choices"]["ko"], q["choices"]["en"])):
                tag = "정답" if i == 0 else "오답"
                lines.append(f"choice[{i}] ({tag}) ko: {ko}")
                lines.append(f"choice[{i}] ({tag}) en: {en}")
            lines.append(f"explanation.ko: {q['explanation']['ko']}")
            lines.append(f"explanation.en: {q['explanation']['en']}")
            lines.append("")
    return "\n".join(lines)


def fmt_terms(extra):
    lines = [f"- {en} → {' / '.join(ko) if isinstance(ko, list) else ko}" for en, ko in TERMS["strict"].items()]
    lines.append("(선호 표기)")
    lines += [f"- {en} → {ko}" for en, ko in TERMS["preferred"].items()]
    if extra:
        lines.append("(앞 장에서 고정된 표기)")
        lines += [f"- {en} → {ko}" for en, ko in extra.items()]
    return "\n".join(lines)


def build_user(chapter_row, chapter, text, extra_terms, reinforcement, max_chars):
    body = text["text"]
    trim_note = ""
    if len(body) > max_chars:
        body = body[:max_chars]
        trim_note = f" — 길어서 앞 {max_chars:,}자만 실었다; 발췌는 실린 부분에서만 고른다"
    sections = ", ".join(f"#{s['anchor']} {s['title']}" for s in text["sections"]) or "(절 앵커 없음: anchor 를 비운다)"
    fill = {
        "collectionTitle": chapter["collectionTitle"]["ko"],
        "collectionId": chapter["collection"],
        "chapterNumber": chapter_row["chapterNumber"],
        "titleKo": chapter["chapter"]["title"]["ko"],
        "titleEn": chapter["chapter"]["title"]["en"],
        "partTitleKo": (chapter["chapter"].get("partTitle") or {}).get("ko", ""),
        "partTitleEn": (chapter["chapter"].get("partTitle") or {}).get("en", ""),
        "summaryKo": chapter["chapter"]["summary"]["ko"],
        "summaryEn": chapter["chapter"]["summary"]["en"],
        "focusKo": chapter["chapter"]["learningFocus"]["ko"],
        "focusEn": chapter["chapter"]["learningFocus"]["en"],
        "sourceUrl": chapter["chapter"]["sourceUrl"],
        "sections": sections,
        "conceptMap": json.dumps(chapter["chapter"]["conceptMap"], ensure_ascii=False, indent=1),
        "conceptBrief": json.dumps(chapter["chapter"].get("conceptBrief"), ensure_ascii=False, indent=1),
        "questions": fmt_questions(chapter["chapter"]),
        "terminology": fmt_terms(None),
        "extraTerminology": fmt_terms_extra(extra_terms),
        "trimNote": trim_note,
        "chapterText": body,
        "reinforcement": reinforcement,
    }
    out = USER_TEMPLATE
    for key, value in fill.items():
        out = out.replace("{{" + key + "}}", str(value))
    return out


def fmt_terms_extra(extra):
    if not extra:
        return ""
    return "(앞 장에서 고정된 표기)\n" + "\n".join(f"- {en} → {ko}" for en, ko in extra.items())


def extract_json(text):
    """First complete JSON object in the reply: inside the ```json fence when
    there is one, otherwise from the first brace. raw_decode stops at the end
    of that object, so trailing commentary or a second block is ignored."""
    m = re.search(r"```json\s*(\{.*)", text, re.S)
    raw = m.group(1) if m else text[text.find("{"):]
    decoder = json.JSONDecoder()
    # DeepSeek sometimes drops one closing brace before a `]` or `,`
    # ("…"}}],"advanced":[ where a question object never closed). Insert a
    # brace at the error position and retry a few times before giving up.
    for _ in range(6):
        try:
            obj, _ = decoder.raw_decode(raw)
            return obj
        except json.JSONDecodeError as err:
            if "delimiter" in err.msg and err.pos < len(raw) and raw[err.pos] in "],":
                raw = raw[:err.pos] + "}" + raw[err.pos:]
                continue
            raise
    raise json.JSONDecodeError("unrepairable", raw, 0)


def cost_of(model, usage):
    p_in, p_out, p_cache_read, p_cache_write = PRICES.get(model, PRICES["claude-sonnet-5"])
    return (usage["input"] * p_in + usage["output"] * p_out
            + usage["cache_read"] * p_cache_read + usage["cache_write"] * p_cache_write) / 1_000_000


def call_model(client, model, user, max_tokens, effort):
    if provider_of(model) == "deepseek":
        return call_deepseek(client, model, user, max_tokens)
    system_blocks = [{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}]
    # Claude 5 models take adaptive thinking plus an effort level; the installed
    # SDK predates both, so they go through extra_body (the proxy is a byte
    # passthrough).
    extra = {"thinking": {"type": "adaptive"}, "output_config": {"effort": effort}}
    with client.messages.stream(
        model=model, max_tokens=max_tokens, system=system_blocks,
        messages=[{"role": "user", "content": user}], extra_body=extra,
    ) as stream:
        final = stream.get_final_message()
    text = "".join(b.text for b in final.content if getattr(b, "type", "") == "text").strip()
    u = final.usage
    usage = {
        "input": u.input_tokens, "output": u.output_tokens,
        "cache_read": getattr(u, "cache_read_input_tokens", 0) or 0,
        "cache_write": getattr(u, "cache_creation_input_tokens", 0) or 0,
    }
    return text, usage, final.stop_reason


def call_deepseek(client, model, user, max_tokens):
    """OpenAI-compatible route of the proxy (the contract of
    scripts/bulk-translate/translate_bulk.py); thinking on for V4 Pro."""
    resp = client.chat.completions.create(
        model=model, temperature=1.0, max_tokens=max_tokens,
        extra_body={"thinking": {"type": "enabled"}},
        messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}],
    )
    choice = resp.choices[0]
    text = (choice.message.content or "").strip()
    u = resp.usage
    cache_read = getattr(u, "prompt_cache_hit_tokens", 0) or 0
    usage = {"input": u.prompt_tokens - cache_read, "output": u.completion_tokens, "cache_read": cache_read, "cache_write": 0}
    return text, usage, choice.finish_reason


def reinforcement_text(verdict):
    hard = verdict["hard"]
    lines = ["# 앞 시도의 위반 (전부 고칠 것; 나머지는 그대로 유지)"]
    lines += [f"- {h}" for h in hard[:40]]
    if len(hard) > 40:
        lines.append(f"- … {len(hard) - 40}건 더")
    lines.append("특히 quote.en 은 위 원문에서 복사해 한 글자도 바꾸지 말 것, keep 문항은 프롬프트·보기를 그대로 둘 것, 한국어 필드에 —·경어체·한자를 넣지 말 것.")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--chapters", help="쉼표 목록, a..b 범위 가능")
    ap.add_argument("--part", help="v1-p3 꼴")
    ap.add_argument("--volume", type=int)
    ap.add_argument("--limit", type=int)
    ap.add_argument("--dry-run", action="store_true", help="프롬프트만 만들고 호출하지 않음")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="deepseek-v4-pro(기본, 종량 저가) | deepseek-v4-flash | claude-sonnet-5(Anthropic API 종량, 비쌈)")
    ap.add_argument("--budget-usd", type=float, default=5.0, help="이 실행의 누적 비용 상한")
    ap.add_argument("--max-tokens", type=int, default=48000, help="사고 토큰을 포함한 출력 상한")
    ap.add_argument("--effort", default="medium", choices=["low", "medium", "high", "max"], help="adaptive thinking 의 effort (high 는 사고에 3만 토큰 넘게 쓴다)")
    ap.add_argument("--max-chapter-chars", type=int, default=150000)
    ap.add_argument("--force", action="store_true", help="이미 기록된 장도 다시")
    args = ap.parse_args()

    rows = select_chapters(args, list_chapters())
    if not rows:
        raise SystemExit("no chapters selected")
    done = {r["chapterId"]: r for r in read_jsonl(PROGRESS)}
    CANDIDATES.mkdir(parents=True, exist_ok=True)

    # Terminology fixed by earlier accepted candidates, in chapter order.
    extra_terms = {}
    for row in list_chapters():
        cand = CANDIDATES / f"{row['id']}.json"
        if cand.exists() and row["id"] in done:
            for pair in json.loads(cand.read_text(encoding="utf-8")).get("terminology") or []:
                if isinstance(pair, dict) and pair.get("en") and pair.get("ko"):
                    extra_terms.setdefault(pair["en"], pair["ko"])

    if args.dry_run:
        client = None
    elif provider_of(args.model) == "deepseek":
        client = OpenAI(api_key=API_KEY, base_url=PROXY_BASE_DEEPSEEK, timeout=900, max_retries=2)
    else:
        client = anthropic.Anthropic(api_key=API_KEY, base_url=PROXY_BASE, timeout=900, max_retries=2)
    spent = 0.0
    for row in rows:
        cid = row["id"]
        if cid in done and not args.force:
            print(f"{cid}: skip ({done[cid]['status']}, {done[cid]['attempts']} attempts)")
            continue
        chapter = json.loads(node("dump_chapter.js", cid))
        text = chapter_text(cid)
        user = build_user(row, chapter, text, extra_terms, "", args.max_chapter_chars)
        if args.dry_run:
            print(f"{cid}: system {len(SYSTEM):,} chars, user {len(user):,} chars (text {text['chars']:,}), sections {len(text['sections'])}")
            (WORK / f"dry-run.{cid}.md").write_text(user, encoding="utf-8")
            continue

        best, best_verdict, reinforcement = None, None, ""
        attempts, chapter_cost = 0, 0.0
        t0 = time.time()
        for attempt in range(1, MAX_ATTEMPTS + 1):
            attempts = attempt
            if attempt > 1:
                user = build_user(row, chapter, text, extra_terms, reinforcement, args.max_chapter_chars)
            out, usage, stop = call_model(client, args.model, user, args.max_tokens, args.effort)
            cost = cost_of(args.model, usage)
            spent += cost
            chapter_cost += cost
            append_jsonl(USAGE, {"chapterId": cid, "attempt": attempt, "model": args.model, **usage, "usd": round(cost, 4), "stop": stop, "at": time.strftime("%Y-%m-%dT%H:%M:%S")})
            try:
                candidate = extract_json(out)
            except Exception as err:  # noqa: BLE001
                print(f"  {cid} attempt {attempt}: unparsable output ({err}); stop={stop}", flush=True)
                (CANDIDATES / f"{cid}.attempt{attempt}.txt").write_text(out, encoding="utf-8")
                reinforcement = "# 앞 시도는 JSON으로 읽히지 않았다. ```json 펜스 안에 완전한 JSON 하나만 출력할 것."
                continue
            tmp = CANDIDATES / f"{cid}.attempt{attempt}.json"
            tmp.write_text(json.dumps(candidate, ensure_ascii=False, indent=1), encoding="utf-8")
            verdict = json.loads(node("gate.js", str(tmp), "--chapter", cid))
            print(f"  {cid} attempt {attempt}: hard {len(verdict['hard'])}, soft {len(verdict['soft'])}, ${cost:.3f}, {int(time.time() - t0)}s", flush=True)
            for h in verdict["hard"][:8]:
                print(f"      - {h}")
            if best is None or len(verdict["hard"]) < len(best_verdict["hard"]):
                best, best_verdict = candidate, verdict
            if verdict["ok"]:
                break
            reinforcement = reinforcement_text(verdict)
            if spent > args.budget_usd:
                print(f"budget ${args.budget_usd} exceeded (${spent:.2f}); stopping after this chapter", flush=True)
                break
        if best is None:
            print(f"{cid}: no usable candidate after {attempts} attempts")
            append_jsonl(PROGRESS, {"chapterId": cid, "status": "failed", "attempts": attempts, "usd": round(chapter_cost, 4), "at": time.strftime("%Y-%m-%d")})
            if spent > args.budget_usd:
                break
            continue
        final = CANDIDATES / f"{cid}.json"
        final.write_text(json.dumps(best, ensure_ascii=False, indent=1), encoding="utf-8")
        for p in CANDIDATES.glob(f"{cid}.attempt*"):
            p.unlink()
        status = "clean" if best_verdict["ok"] and not best_verdict["soft"] else ("soft" if best_verdict["ok"] else "flagged")
        flags = [f"HARD {h}" for h in best_verdict["hard"]] + [f"soft {s}" for s in best_verdict["soft"]]
        flag_file = CANDIDATES / f"{cid}.flags.txt"
        if flags:
            flag_file.write_text("\n".join(flags) + "\n", encoding="utf-8")
        elif flag_file.exists():
            flag_file.unlink()
        for pair in best.get("terminology") or []:
            if isinstance(pair, dict) and pair.get("en") and pair.get("ko"):
                extra_terms.setdefault(pair["en"], pair["ko"])
        append_jsonl(PROGRESS, {"chapterId": cid, "status": status, "attempts": attempts, "hard": len(best_verdict["hard"]), "soft": len(best_verdict["soft"]), "usd": round(chapter_cost, 4), "model": args.model, "at": time.strftime("%Y-%m-%d")})
        print(f"{cid}: {status} after {attempts} attempt(s), ${chapter_cost:.2f} (run total ${spent:.2f})", flush=True)
        if spent > args.budget_usd:
            print("budget reached; stopping")
            break


if __name__ == "__main__":
    main()
