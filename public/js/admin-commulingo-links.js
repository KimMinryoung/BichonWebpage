(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const API = '/commulingo/admin/api/link-reviews';
    const policies = { search: '검색 전용', context: '문맥 확인', auto: '자동 연결' };
    let offset = 0, total = 0, selected = null, token = null, requestVersion = 0;
    function node(tag, text) { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; return el; }
    function status(id, text, error) { $(id).textContent = text; $(id).classList.toggle('review-error', !!error); }
    async function api(path, body) {
        const response = await fetch(API + path, body === undefined ? {} : { method: 'POST', headers: {
            'Content-Type': 'application/json', 'x-csrf-token': document.querySelector('meta[name=csrf-token]').content,
        }, body: JSON.stringify(body) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || '요청 실패: ' + response.status);
        return data;
    }
    async function load() {
        const version = ++requestVersion;
        const form = $('review-filter').elements;
        const query = new URLSearchParams({ q: form.q.value, kind: form.kind.value, pending: form.pending.checked ? '1' : '0', risk: form.risk.checked ? '1' : '0', offset: String(offset) });
        status('review-status', '목록을 불러오는 중…');
        try {
            const data = await api('?' + query);
            if (version !== requestVersion) return;
            total = data.total;
            $('review-list').replaceChildren();
            data.rows.forEach(row => {
                const item = node('article'); item.className = 'review-row';
                const info = node('div'); info.append(node('strong', row.text));
                info.append(node('small', row.lang + ' · ' + row.kind + ' · ' + row.label + ' · ' + policies[row.policy] + (row.reviewed ? '' : ' · 미검토')));
                if (row.collisions.length || row.risks.length) info.append(node('small', '다른 항목 중복 ' + row.collisions.length + ' · 일반 이름 주의 ' + row.risks.length));
                const button = node('button', '검토'); button.className = 'btn'; button.addEventListener('click', () => edit(row));
                item.append(info, button); $('review-list').append(item);
            });
            status('review-status', '해당 표현 ' + total + '개 · 전체 미검토 ' + data.pending + '개 · ' + (total ? offset + 1 : 0) + '–' + Math.min(offset + 60, total));
            $('review-prev').disabled = offset === 0; $('review-next').disabled = offset + 60 >= total;
        } catch (error) { status('review-status', error.message, true); }
    }
    function invalidate() { token = null; $('review-save').disabled = true; }
    function edit(row) {
        selected = row; invalidate(); $('review-editor').hidden = false;
        $('review-heading').textContent = row.text;
        $('review-target').textContent = row.kind + ' · ' + row.id + ' · ' + row.label;
        $('review-warnings').replaceChildren();
        row.risks.forEach(text => $('review-warnings').append(node('li', text)));
        row.collisions.forEach(other => $('review-warnings').append(node('li', '중복: ' + other.kind + ' · ' + other.label + ' (' + other.id + ')')));
        const form = $('review-decision').elements;
        form.policy.value = 'search'; form.role.value = row.text === row.label ? 'identity' : 'short'; form.note.value = '';
        $('review-samples').replaceChildren(); status('review-preview-status', '정책과 검토 근거를 입력한 뒤 미리보기를 실행하세요.');
        $('review-editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function showLinks(links, heading) {
        const div = node('div'); div.append(node('strong', heading));
        const list = node('ul');
        links.slice(0, 30).forEach(link => { const li = node('li'); const a = node('a', link.kind + ':' + link.id); a.href = link.href; a.target = '_blank'; a.rel = 'noopener'; li.append(a); list.append(li); });
        if (!links.length) list.append(node('li', '연결 없음'));
        if (links.length > 30) list.append(node('li', '외 ' + (links.length - 30) + '개'));
        div.append(list); return div;
    }
    $('review-filter').addEventListener('submit', event => { event.preventDefault(); offset = 0; load(); });
    $('review-prev').addEventListener('click', () => { offset = Math.max(0, offset - 60); load(); });
    $('review-next').addEventListener('click', () => { offset += 60; load(); });
    $('review-decision').addEventListener('input', invalidate);
    $('review-decision').addEventListener('submit', async event => {
        event.preventDefault(); invalidate(); if (!selected) return;
        const form = $('review-decision').elements;
        const body = { ...selected, policy: form.policy.value, role: form.role.value, note: form.note.value };
        const selection = selected;
        status('review-preview-status', '본문에서 연결 변화를 확인하는 중…');
        try {
            const data = await api('/preview', body);
            if (selected !== selection || form.policy.value !== body.policy || form.role.value !== body.role || form.note.value !== body.note) return;
            token = data.token; $('review-save').disabled = false;
            status('review-preview-status', '표현 포함 본문 ' + data.matchedPassages + '개 중 ' + data.sampledPassages + '개 표본. ' + data.coverage);
            $('review-samples').replaceChildren();
            data.samples.forEach(sample => {
                const section = node('article'); section.className = 'review-sample';
                const a = node('a', sample.where + (sample.changed ? ' · 연결 변경' : ' · 연결 동일')); a.href = sample.url; a.target = '_blank'; a.rel = 'noopener';
                const comparison = node('div'); comparison.className = 'review-comparison'; comparison.append(showLinks(sample.before, '현재'), showLinks(sample.after, '변경 후'));
                section.append(a, node('p', sample.excerpt), comparison); $('review-samples').append(section);
            });
        } catch (error) { status('review-preview-status', error.message, true); }
    });
    $('review-save').addEventListener('click', async () => {
        if (!token) return;
        const savedToken = token; invalidate();
        try { await api('/save', { token: savedToken }); status('review-preview-status', '정책을 저장했습니다.'); load(); }
        catch (error) { status('review-preview-status', error.message, true); }
    });
    load();
})();
