#!/usr/bin/env python3
"""Run reviewed source specs through the audited DeepSeek Flash translator.

Uses a process-local call profile; never edits the production model registry.
Output and checkpoints stay private until completeness and editorial review.
"""
import argparse
import dataclasses
import json
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('specs', nargs='+', type=Path)
parser.add_argument('--backend', type=Path, default=Path('/home/grass/leninbot'))
parser.add_argument('--concurrency', type=int, default=5)
args = parser.parse_args()
sys.path.insert(0, str(args.backend))
from llm import call_registry
from runtime_tools.archival_translation import core

original_resolve = call_registry.resolve
def resolve(feature, **defaults):
    profile = original_resolve(feature, **defaults)
    if feature.startswith('archival_document_translation_'):
        profile = dataclasses.replace(profile, provider='deepseek',
            model='deepseek-flash', timeout=180, max_tokens=16000,
            extra={'thinking': {'type': 'disabled'}})
    return profile
call_registry.resolve = resolve

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
    active_repairs = spec.get('translationRepairs', {})
    active_tables = set(spec.get('tableCellMarkers', []))
    output = Path(spec['output'])
    output.parent.mkdir(parents=True, exist_ok=True)
    result = core.run(spec, core.Options(
        cache_path=output.with_suffix('.deepseek.cache.jsonl'),
        concurrency=args.concurrency),
        lambda event: print(json.dumps({'spec': spec['id'], **event},
            ensure_ascii=False, default=str), flush=True))
    output.with_suffix('.result.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2, default=str)+'\n')
    if result.get('failures'):
        raise SystemExit(f"Incomplete translation: {spec['id']}")
