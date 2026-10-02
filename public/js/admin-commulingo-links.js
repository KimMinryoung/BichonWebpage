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
    const KIND_LABEL = { term: '용어', event: '사건', doc: '문헌' };
    const LANG_LABEL = { ko: '한국어 본문', en: '영어 본문' };
    function entryHref(entry, lang) {
        const route = { term: 'terms', event: 'events', doc: 'docs' }[entry.kind];
        return (lang === 'en' ? '/en' : '') + '/commulingo/' + route + '/' + encodeURIComponent(entry.id);
    }
    function stateText(entry) { return policies[entry.policy] + (entry.reviewed ? ' · 검토됨' : ' · 미검토'); }
    function entryLink(entry, lang, text) {
        const a = node('a', text); a.href = entryHref(entry, lang); a.target = '_blank'; a.rel = 'noopener';
        return a;
    }
    // The server lists an entry's expressions next to each other: one card
    // per entry, so spelling variants of one name share a card.
    function groupRows(rows) {
        const groups = [];
        rows.forEach(row => {
            const last = groups[groups.length - 1];
            if (last && last.key === row.kind + ':' + row.id) last.rows.push(row);
            else groups.push({ key: row.kind + ':' + row.id, rows: [row] });
        });
        return groups;
    }
    function expressionLine(row) {
        const item = node('li'); item.className = 'review-expression';
        const head = node('div'); head.className = 'review-expression-head';
        const lang = node('span', LANG_LABEL[row.lang]); lang.className = 'ui-badge';
        const state = node('span', '현재 ' + stateText(row)); state.className = 'ui-badge' + (row.reviewed ? '' : ' review-pending');
        const button = node('button', '검토'); button.className = 'btn btn-small'; button.type = 'button';
        button.addEventListener('click', () => edit(row));
        head.append(node('strong', '「' + row.text + '」'), lang, state, button);
        item.append(head);
        row.risks.forEach(text => { const p = node('p', '⚠ ' + text); p.className = 'review-risk'; item.append(p); });
        row.collisions.forEach(other => {
            const p = node('p', '⚠ 같은 표현을 쓰는 다른 항목: '); p.className = 'review-risk';
            p.append(entryLink(other, row.lang, KIND_LABEL[other.kind] + ' · ' + other.label), ' (' + stateText(other) + '). 자동 연결은 한 항목만 가능합니다.');
            item.append(p);
        });
        return item;
    }
    function renderGroup(group) {
        const first = group.rows.find(row => row.lang === 'ko') || group.rows[0];
        const card = node('article'); card.className = 'ui-card review-group';
        const head = node('h2'); head.className = 'review-group-head';
        head.append(node('span', KIND_LABEL[first.kind]), ' ', entryLink(first, first.lang, first.label));
        card.append(head);
        if (first.about && (first.about.period || first.about.summary)) {
            const about = node('p', [first.about.period, first.about.summary].filter(Boolean).join(' · '));
            about.className = 'review-about'; card.append(about);
        }
        card.append(node('p', '본문에서 아래 표현을 보면 이 항목으로 연결할지 정합니다.'));
        const list = node('ul'); list.className = 'review-expressions';
        group.rows.forEach(row => list.append(expressionLine(row)));
        card.append(list);
        return card;
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
            $('review-list').replaceChildren(...groupRows(data.rows).map(renderGroup));
            status('review-status', '해당 표현 ' + total + '개 · 전체 미검토 ' + data.pending + '개 · ' + (total ? offset + 1 : 0) + '–' + Math.min(offset + 60, total));
            $('review-prev').disabled = offset === 0; $('review-next').disabled = offset + 60 >= total;
        } catch (error) { status('review-status', error.message, true); }
    }
    function invalidate() { token = null; $('review-save').disabled = true; }
    function edit(row) {
        selected = row; invalidate(); $('review-editor').hidden = false;
        $('review-heading').textContent = '「' + row.text + '」 · ' + LANG_LABEL[row.lang];
        const target = entryLink(row, row.lang, KIND_LABEL[row.kind] + ' · ' + row.label);
        $('review-target').replaceChildren('연결 대상: ', target, ' (현재 ' + stateText(row) + ')');
        $('review-about').textContent = row.about ? [row.about.period, row.about.summary].filter(Boolean).join(' · ') : '';
        $('review-warnings').replaceChildren();
        row.risks.forEach(text => $('review-warnings').append(node('li', text)));
        row.collisions.forEach(other => {
            const li = node('li', '같은 표현을 쓰는 다른 항목: ');
            li.append(entryLink(other, row.lang, KIND_LABEL[other.kind] + ' · ' + other.label), ' (' + stateText(other) + ')'); $('review-warnings').append(li);
        });
        const form = $('review-decision').elements;
        form.policy.value = 'search'; form.role.value = row.text === row.label ? 'identity' : 'short'; form.note.value = '';
        $('review-samples').replaceChildren(); status('review-preview-status', '정책과 검토 근거를 입력한 뒤 미리보기를 실행하세요.');
        $('review-editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function showLinks(links, heading) {
        const div = node('div'); div.append(node('strong', heading));
        const list = node('ul');
        links.slice(0, 30).forEach(link => { const li = node('li'); const a = node('a', (KIND_LABEL[link.kind] || link.kind) + ' · ' + link.id); a.href = link.href; a.target = '_blank'; a.rel = 'noopener'; li.append(a); list.append(li); });
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
