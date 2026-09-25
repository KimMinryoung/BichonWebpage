#!/usr/bin/env python3
"""Run reviewed source specs through the audited DeepSeek Flash translator.

Uses a process-local call profile; never edits the production model registry.
Output and checkpoints stay private until completeness and editorial review.
"""
import argparse
import dataclasses
import json
import os
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('specs', nargs='+', type=Path)
parser.add_argument('--backend', type=Path,
                    default=Path(os.environ.get('LENINBOT_DIR', '/home/grass/leninbot')))
parser.add_argument('--concurrency', type=int, default=5)
parser.add_argument('--thinking', choices=['enabled', 'disabled'], default='enabled')
parser.add_argument('--plan', action='store_true')
args = parser.parse_args()
sys.path.insert(0, str(args.backend))
from llm import call_registry
from runtime_tools.archival_translation import core

# Al-Jabarti's source is Arabic. Reuse the shared executor and validators,
# but register a process-local source-language adapter, never label it French.
import re
_arabic_script = re.compile(r"[\u0621-\u064a\u0671-\u06d3]")
_arabic_words = re.compile(r"[\u0621-\u064a\u0671-\u06d3]+")
_arabic_prompt = core._latin_prompt(
    '아랍어', '18세기',
    '이집트 연대기의 관찰·전언·종교적 판단을 구별하고 원저자의 관점을 보존한다.',
    notation='\n- 히즈라력 날짜를 임의로 양력으로 바꾸지 않는다. '
             '인명은 아랍어 발음으로 옮기고 첫 등장 괄호에는 아랍어 원문을 둔다.')
_arabic_prompt = _arabic_prompt.replace('로마자 원문', '아랍어 원문')
core.LANGUAGES['ar'] = dataclasses.replace(core.FRENCH,
    code='ar', label='아랍어', system_prompt=_arabic_prompt,
    script=_arabic_script, stray_word=_arabic_words, stray_min=2,
    chars_per_token=2.0, output_ratio=0.8, latin=False)
# The adapter reuses the existing registered archival call site solely for
# routing; sourceLang, prompt, script validation and cache identity are Arabic.

original_resolve = call_registry.resolve
def resolve(feature, **defaults):
    profile = original_resolve(feature, **defaults)
    if feature.startswith('archival_document_translation_'):
        profile = dataclasses.replace(profile, provider='deepseek_anthropic',
            model='deepseek-flash', timeout=600, max_tokens=48000,
            extra={'thinking': {'type': args.thinking},
                   'output_config': {'effort': 'high'}})
    return profile
call_registry.resolve = resolve
# max_tokens covers reasoning AND visible translation. Shared executor usage
# includes both and accounts for every retry, including exhausted attempts.
print(json.dumps({'provider': 'deepseek_anthropic', 'model': 'deepseek-flash',
    'thinking': args.thinking, 'maxTokensIncludingReasoning': 48000,
    'retryOutputCapIncludingReasoning': call_registry.OUTPUT_BUDGET_CAP}), flush=True)

# The source's French/Russian guillemets are valid quotation marks, but the
# shared sentence-completion gate only recognises Korean/English quotes.
# Normalise glyphs before validation; do not relax the completeness gate.
original_parse = core.parse_response
def parse_response(text):
    parsed = original_parse(text.replace('«', '“').replace('»', '”'))
    parsed.cell_ids = {}
    for idx, lines in parsed.items():
        cells = []
        for i, line in enumerate(lines):
            import re
            match = re.match(r'^⟦cell(\d+)⟧\s*(.*)', line)
            if match:
                cells.append(int(match[1]))
                lines[i] = match[2]
        if cells: parsed.cell_ids[idx] = cells
    return parsed
core.parse_response = parse_response
# Arabic name glosses in parentheses are legitimate for an Arabic source.
# Keep rejecting Arabic outside parentheses, and all unrelated scripts.
active_source_lang = None
original_foreign_letters = core.foreign_letters
def foreign_letters(text):
    if active_source_lang == 'ar':
        text = re.compile(r"[(（][^)）]*[)）]").sub(
            lambda m: _arabic_script.sub('', m.group(0)), text)
    return original_foreign_letters(text)
core.foreign_letters = foreign_letters
original_validate = core.validate
def validate(chunk, translated, lang=None):
    problems = original_validate(chunk, translated, lang)
    for idx, block in chunk:
        if block['tag'] == 'table' and idx in translated:
            wanted, actual = len(block['lines']), len(translated[idx])
            if wanted != actual:
                problems.append(f'[[{idx}]] 표 셀 번역은 입력 순서대로 정확히 '
                    f'{wanted}줄이어야 한다(현재 {actual}줄). 셀을 합치거나 생략하지 말 것.')
            cells = getattr(translated, 'cell_ids', {}).get(idx)
            if cells and cells != list(range(1, wanted+1)):
                problems.append(f'[[{idx}]] 셀 번호 순서가 입력과 다르다: {cells}')
    return problems
core.validate = validate
original_render_prompt = core._render_prompt
active_repairs = {}
active_tables = set()
def render_prompt(chunk, body, terms):
    numbered = False
    for idx, block in chunk:
        if idx in active_tables and block['tag'] == 'table':
            plain = f"[[{idx}|table]]\n"+'\n'.join(block['lines'])
            marked = f"[[{idx}|table]]\n"+'\n'.join(
                f'⟦cell{n}⟧ {line}' for n,line in enumerate(block['lines'],1))
            body = body.replace(plain, marked)
            numbered = True
    prompt = original_render_prompt(chunk, body, terms)
    if numbered:
        prompt += ('\n\n표의 각 ⟦cell번호⟧는 서로 독립된 셀이다. 번호를 그대로 '
            '유지하고 각 셀마다 한 줄로 번역한다. 한 단어짜리 셀도 합치지 않는다. '
            '서로 이어지는 문장처럼 보여도 각 번호와 번역을 반드시 별도 줄로 반환한다.')
    notes = {active_repairs.get(str(idx)) for idx, _ in chunk}
    notes.discard(None)
    if notes:
        prompt += '\n\n추가 번역 지시:\n' + '\n'.join(sorted(notes))
    return prompt
core._render_prompt = render_prompt

for path in args.specs:
    spec = json.loads(path.read_text())
    active_source_lang = spec.get('sourceLang')
    active_repairs = spec.get('translationRepairs', {})
    active_tables = set(spec.get('tableCellMarkers', []))
    output = Path(spec['output'])
    output.parent.mkdir(parents=True, exist_ok=True)
    if args.plan:
        print(json.dumps(core.plan(spec), ensure_ascii=False, default=str), flush=True)
        continue
    result = core.run(spec, core.Options(
        cache_path=output.with_suffix('.deepseek.cache.jsonl'),
        concurrency=args.concurrency),
        lambda event: print(json.dumps({'spec': spec['id'], **event},
            ensure_ascii=False, default=str), flush=True))
    output.with_suffix('.result.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2, default=str)+'\n')
    if result.get('failures'):
        raise SystemExit(f"Incomplete translation: {spec['id']}")
