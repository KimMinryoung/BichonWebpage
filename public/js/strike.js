(function () {
    'use strict';
    const g = window.StrikeGame, el = id => document.getElementById(id);
    const saveKey = 'strike-game-v6-save';
    const legacyKeys = ['strike-game-v5-save', 'strike-game-v4-save', 'strike-game-v3-save', 'strike-game-v2-save'];
    let state, saved, selected = 0, moving = false, timer, sheetView = 'review', picked = null, unsaved = false;
    function node(tag, text, className) {
        const n = document.createElement(tag); if (text !== undefined && text !== '') n.textContent = text; if (className) n.className = className; return n;
    }
    function button(text, fn, className) { const b = node('button', text, className); b.type = 'button'; b.addEventListener('click', fn); return b; }
    const signed = (v, unit = '') => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v) + unit;
    // Once saving fails, every later announcement keeps saying so.
    function announce(text) {
        const box = el('strikeAnnouncement');
        box.textContent = (text + (unsaved ? ' 이 브라우저에는 저장되지 않습니다. 현재 게임은 계속할 수 있습니다.' : '')).trim();
        box.toggleAttribute('data-unsaved', unsaved);
    }
    function save() {
        try { localStorage.setItem(saveKey, JSON.stringify(state)); }
        catch (_) { unsaved = true; announce(''); }
    }
    function load() {
        el('strikeSaveNote').textContent = '한 판 15–20분 · 로그인 없이 · 이 브라우저에 자동 저장';
        try {
            saved = g.restore(localStorage.getItem(saveKey));
            if (!saved && legacyKeys.some(k => localStorage.getItem(k))) el('strikeSaveNote').textContent = '게임이 새 규칙으로 바뀌어 이전 판은 이어할 수 없습니다. 새 게임으로 시작해 주세요.';
        } catch (_) { el('strikeSaveNote').textContent = '저장을 사용할 수 없습니다. 이 화면에서 끝까지 플레이할 수 있습니다.'; }
        el('strikeContinue').hidden = !saved || saved.phase === 'done';
        if (saved && saved.phase !== 'done') {
            el('strikeContinue').textContent = `${saved.day}일차 이어하기`;
            el('strikeSaveNote').textContent = '이어하기는 저장된 게임을 계속합니다. 새 게임 시작은 기존 진행을 지우고 1일차부터 시작합니다.';
        }
    }
    const previous = () => state.history[state.history.length - 2] || g.start(state.mode, state.seed, state.scenario);
    function meters() {
        const startResolve = state.mode === 'hard' ? 115 : 100;
        const stats = [
            ['fund', '생활 기금', String(state.fund), Math.min(100, state.fund), `하루 지원 ${17 + (state.mode === 'hard' ? 3 : 0)}`],
            ['unity', '파업 참여율', state.unity + '%', state.unity, '65%부터 교섭 카드'],
            ['opinion', '여론', String(state.opinion), state.opinion, '60부터 교섭 카드']
        ].map(([id, title, value, width, caption]) => {
            const n = node('div', '', 'strike-meter'); n.dataset.meter = id;
            const bar = node('div', '', 'strike-meter-track'); const fill = node('i'); fill.style.width = width + '%'; bar.append(fill);
            n.append(node('span', title), node('strong', value), bar, node('small', caption)); return n;
        });
        const boss = node('div', '', 'strike-boss'); boss.dataset.meter = 'resolve';
        const head = node('div', '', 'strike-boss-head');
        head.append(node('span', '한빛자동차 경영진 · 사측 버티기'), node('strong', `${state.resolve} / ${startResolve}`));
        const bar = node('div', '', 'strike-boss-track'); const fill = node('i'); fill.style.width = Math.min(100, state.resolve / startResolve * 100) + '%';
        // The point below which management asks for an extra session once.
        const at = g.callThreshold / startResolve * 100 + '%', mark = node('b'); mark.style.left = at; bar.append(fill, mark);
        const scale = node('div', '', 'strike-boss-scale'); scale.dataset.used = String(state.extraUsed);
        const tick = node('span', `${g.callThreshold} · ${state.extraUsed ? '요청 교섭 열림' : '아래로 내리면 사측이 교섭 요청'}`); tick.style.left = at; scale.append(tick);
        boss.append(head, bar, scale, node('small', '생산을 멈추고 사측의 수를 막으면 깎입니다. 낮을수록 교섭 저항이 약해집니다.'));
        el('strikeStats').replaceChildren(...stats, boss);
    }
    function calendar() {
        el('strikeDay').replaceChildren(node('strong', `${state.day}일차`), node('span', ` / 12 · ${g.scenarios[state.scenario].title} · ${state.mode === 'hard' ? '어려움' : '기본'}`));
        el('strikeCalendar').replaceChildren(...Array.from({ length: 12 }, (_, i) => {
            const day = i + 1, d = node('li', String(day), day === state.day ? 'current' : day < state.day ? 'past' : '');
            const session = g.sessions.includes(day) || state.history.some(r => r.day === day && r.extra);
            if (session) { d.classList.add('session'); d.title = '교섭'; }
            d.setAttribute('aria-label', `${day}일${session ? ', 교섭' : ''}${day === state.day ? ', 오늘' : ''}`);
            if (day === state.day) d.setAttribute('aria-current', 'step');
            return d;
        }));
    }
    function dealLine(d) {
        return [d.wage ? `임금 +${d.wage}%` : null, d.hours ? `주 ${40 - d.hours}시간` : null, !d.intensity ? '강도 유지' : null, d.suit ? '손배 철회' : null].filter(Boolean).join(' · ');
    }
    function objectives() {
        const tentative = Object.values(state.won).some(Boolean) && state.phase !== 'done';
        el('strikeObjectives').replaceChildren(
            ...g.objectives(state).map(o => { const n = node('span', (o.met ? '✓ ' : '○ ') + o.text, 'strike-goal'); n.dataset.met = String(o.met); return n; }),
            ...(tentative ? [node('span', '잠정 합의: ' + dealLine(g.dealOf(state.won)), 'strike-tentative')] : [])
        );
    }
    // The morning's threats with a live check of whether the current placement holds them.
    function threatPanel() {
        const box = el('strikeThreat'), fx = g.effects(state);
        box.hidden = state.phase === 'done';
        if (box.hidden) return;
        const last = state.history[state.history.length - 1];
        const review = state.phase === 'review' || moving;
        const kicker = node('p', review ? '사측 통보 · 결과' : '사측 통보 · 오늘의 수', 'strike-threat-kicker');
        if (state.phase === 'planning' && !g.threats(state).length) {
            const title = node('h2', '사측은 아직 지켜보고 있습니다'); title.id = 'strikeThreatTitle'; title.tabIndex = -1;
            box.replaceChildren(kicker, title, node('p', '첫날은 배치를 익히는 날입니다. 내일 아침부터 사측이 수를 드러내면, 이 자리에서 막아 내는 조건과 지금 배치로 막을 수 있는지를 확인하세요.'));
            box.dataset.state = 'calm'; return;
        }
        const items = review ? (last ? last.moves : []) : g.intel(state).map(t => ({ ...t, checks: t.options.map(move => ({ move, check: g.counter(state, move, fx) })) }));
        const hiddenTitle = m => g.jobs[m.target].title + ' 쪽 미확인 수';
        const title = node('h2', items.map(m => m.hidden && !review ? hiddenTitle(m) : g.moves[m.move].title).join(' + ') || '조용한 하루'); title.id = 'strikeThreatTitle'; title.tabIndex = -1;
        const list = node('ul', '', 'strike-threat-list');
        items.forEach(m => {
            const info = g.moves[m.move], li = node('li');
            // A half-hidden move: only the target is known, so every possible move is checked.
            if (m.hidden && !review) {
                li.append(node('strong', hiddenTitle(m)), node('p', `사측이 ${g.jobs[m.target].title} 쪽에서 움직입니다. ${m.options.map(k => g.moves[k].title).join(' 또는 ')} 중 하나입니다. 둘 다 막을 수 있게 배치하세요.`));
                m.checks.forEach(({ move, check }) => {
                    const unit = move === 'scabs' ? v => v.toFixed(1) : v => String(v);
                    const status = node('p', '', 'strike-threat-status'); status.dataset.ok = String(check.ok);
                    status.append(node('span', `${g.moves[move].title}일 때: ${g.moves[move].counter}`), node('b', `${check.ok ? '✓ 막을 수 있음' : '✗ 부족'} (${unit(check.have)}/${unit(check.need)})`));
                    li.append(status);
                });
                list.append(li); return;
            }
            if (items.length > 1) li.append(node('strong', info.title));
            li.append(node('p', review && !moving ? (m.ok ? info.win : info.lose) : info.text));
            const status = node('p', '', 'strike-threat-status');
            if (review) {
                status.textContent = moving ? '결과를 기다리는 중…' : m.ok ? '✓ 막아냄' : '✗ 뚫림';
                status.dataset.ok = moving ? '' : String(m.ok);
            } else {
                const unit = m.move === 'scabs' ? v => v.toFixed(1) : v => String(v), check = m.checks[0].check;
                status.dataset.ok = String(check.ok);
                status.append(node('span', '막는 조건: ' + info.counter), node('b', check.ok ? `✓ 막을 수 있음 (${unit(check.have)}/${unit(check.need)})` : `✗ 부족 (${unit(check.have)}/${unit(check.need)})`));
            }
            li.append(status); list.append(li);
        });
        box.dataset.state = review ? 'review' : items.every(m => m.checks.every(c => c.check.ok)) ? 'held' : 'open';
        box.replaceChildren(kicker, title, list);
    }
    function forecast() {
        const box = el('strikeForecast');
        if (state.phase !== 'planning' || moving) { box.replaceChildren(); return; }
        const r = g.forecast(state), blind = g.intel(state).some(t => t.hidden);
        const items = [
            ['기금', signed(r.fund - state.fund)], ['참여율', signed(r.unity - state.unity, '%p')], ['여론', signed(r.opinion - state.opinion)], ['생산', r.production + '%'], ['사측 버티기', signed(r.resolve - state.resolve)]
        ];
        const warn = [];
        if (r.missing) warn.push(`생활 지원 ${r.missing} 부족`);
        if (r.exhausted) warn.push(`과로 ${r.exhausted}명`);
        if (r.collapsed.length) warn.push(`쓰러짐 ${r.collapsed.length}명`);
        const list = node('dl', '', 'strike-forecast-list');
        items.forEach(([k, v]) => { const d = node('div'); d.append(node('dt', k), node('dd', v)); list.append(d); });
        box.replaceChildren(node('p', blind ? '이 배치의 예상 · 미확인 수 결과 제외' : '이 배치의 예상', 'strike-forecast-title'), list, ...(warn.length ? [node('p', '⚠ ' + warn.join(' · '), 'strike-forecast-warn')] : []));
    }
    function crews() {
        el('strikeCrews').replaceChildren(...state.crews.map(c => {
            const b = button('', () => { selected = c.id; render(); el('strikeCrews').querySelector('[data-crew="' + c.id + '"]').focus({ preventScroll: true }); }, 'strike-crew');
            b.disabled = moving || state.phase !== 'planning'; b.dataset.crew = c.id; b.setAttribute('aria-pressed', String(selected === c.id));
            const face = node('span', '', 'strike-avatar'); face.dataset.color = c.id;
            face.dataset.fatigue = c.injured ? 'injured' : c.fatigue >= 75 ? 'exhausted' : c.fatigue >= 45 ? 'tired' : 'fresh';
            face.append(window.StrikeScene.portrait(c));
            const copy = node('span', '', 'strike-crew-copy');
            const name = node('strong', c.name); name.append(node('em', g.roster[c.id].label));
            copy.append(name, node('small', c.injured ? `부상 · ${c.injured}일 휴식` : g.jobs[c.job].title));
            const skills = node('span', '', 'strike-skills');
            g.skills.forEach(job => {
                const lv = g.level(c, job), sk = node('span', g.jobs[job].short); sk.dataset.active = String(c.job === job);
                const dots = node('i'); for (let k = 0; k < 3; k++) dots.append(node('b', '', k < lv ? 'on' : ''));
                sk.append(dots); skills.append(sk);
            });
            copy.append(skills);
            const energy = node('span', '', 'strike-energy'); const bar = node('i'); bar.style.width = c.fatigue + '%'; bar.dataset.level = c.fatigue >= 75 ? 'high' : c.fatigue >= 45 ? 'mid' : 'low';
            energy.append(node('span', '피로 ' + c.fatigue), node('span', '', 'strike-energy-track'));
            energy.lastChild.append(bar);
            b.append(face, copy, energy);
            b.setAttribute('aria-label', `${c.name}, ${g.roster[c.id].label}, ${c.injured ? '부상 ' + c.injured + '일 휴식' : g.jobs[c.job].title}, 피로 ${c.fatigue}, 숙련 ${g.skills.map(j => g.jobs[j].short + ' ' + g.level(c, j)).join(' ')}`);
            return b;
        }));
        const c = state.crews[selected];
        el('strikeCrewNote').replaceChildren(node('strong', `${c.name} · ${g.roster[c.id].label}`), document.createTextNode(' ' + g.roster[c.id].note));
    }
    function history() {
        el('strikeLog').replaceChildren(...state.history.slice().reverse().map(r => {
            const row = node('tr'); const day = node('th', r.day + '일'); day.scope = 'row';
            row.append(day, node('td', r.moves.length ? r.moves.map(m => g.moves[m.move].badge + (m.ok ? ' ✓' : ' ✗')).join(', ') : '—'));
            [r.production + '%', String(r.fund), r.unity + '%', String(r.opinion), String(r.resolve)].forEach(v => row.append(node('td', v)));
            return row;
        }));
    }
    // ---- Evening sheet: the day's report, then the bargaining table on session days.
    function metricTile(title, value, change, unit, good) {
        const card = node('div', '', 'strike-day-metric');
        const delta = node('span', signed(change, unit), 'strike-metric-change');
        delta.dataset.trend = change === 0 ? 'steady' : good(change) ? 'improved' : 'declined';
        card.append(node('span', title, 'strike-metric-title'), node('strong', value), delta);
        return card;
    }
    function reviewView(body) {
        const r = state.history[state.history.length - 1], p = previous();
        const title = node('h2', `${r.day}일차 저녁`); title.id = 'strikeSheetTitle'; title.tabIndex = -1;
        body.append(node('p', state.phase === 'done' ? '파업이 끝났습니다' : '저녁의 파업위원회', 'games-kicker'), title);
        if (r.moves.length) {
            const outcomes = node('ul', '', 'strike-outcomes');
            r.moves.forEach(m => {
                const li = node('li'); li.dataset.ok = String(m.ok);
                li.append(node('b', m.ok ? '막아냄' : '뚫림', 'strike-outcome-stamp'), node('strong', g.moves[m.move].title), node('span', m.ok ? g.moves[m.move].win : g.moves[m.move].lose));
                outcomes.append(li);
            });
            body.append(outcomes);
        }
        const grid = node('div', '', 'strike-day-metrics');
        grid.append(
            metricTile('생산', r.production + '%', r.production - p.production, '%p', v => v < 0),
            metricTile('생활 기금', String(r.fund), r.fund - p.fund, '', v => v > 0),
            metricTile('파업 참여율', r.unity + '%', r.unity - p.unity, '%p', v => v > 0),
            metricTile('여론', String(r.opinion), r.opinion - p.opinion, '', v => v > 0),
            metricTile('사측 버티기', String(r.resolve), r.resolve - p.resolve, '', v => v < 0)
        );
        body.append(grid);
        const news = [];
        news.push(`연대 모금 +${r.income} · 생활 지원 −${Math.min(r.cost, p.fund + r.income)}${r.seized ? ` · 가압류 −${r.seized}` : ''}`);
        if (r.missing) news.push(`생활 지원이 ${r.missing} 모자라 참여율이 ${r.shortagePenalty}%p 떨어졌습니다. 부족이 이어질수록 더 크게 떨어집니다.`);
        r.levelUps.forEach(u => news.push(`★ ${state.crews[u.id].name}의 ${g.jobs[u.job].short} 숙련이 ${u.level}이 되었습니다.${u.job === 'organize' && u.level === 3 ? ' 교섭에서 대표 발언 카드를 냅니다.' : ''}`));
        r.injured.forEach(id => news.push(`✚ ${state.crews[id].name}이(가) 구사대에 다쳐 이틀 동안 쉽니다.`));
        r.collapsed.forEach(id => news.push(`✚ ${state.crews[id].name}이(가) 과로로 쓰러져 하루 쉽니다.`));
        if (r.exhausted) news.push(`피로 75 이상인 동료 ${r.exhausted}명 때문에 참여율이 ${r.exhausted * 3}%p 더 떨어졌습니다.`);
        if (r.drift > 2) news.push(`참여율이 높아 복귀 압박이 커졌습니다 (−${r.drift}%p).`);
        if (state.unity < 20 && state.phase !== 'done') news.push('참여율이 20% 아래입니다. 내일도 회복하지 못하면 파업이 무너집니다.');
        const list = node('ul', '', 'strike-news'); news.forEach(t => list.append(node('li', t))); body.append(list);
        const actions = node('div', '', 'strike-sheet-actions');
        if (state.phase === 'done') actions.append(button('결과 보기', closeSheet, 'strike-primary'));
        else if (state.table) {
            if (state.table.extra) body.append(node('p', '사측 버티기가 30 아래로 떨어지자 사측이 먼저 교섭을 요청했습니다.', 'strike-sheet-note'));
            actions.append(button(state.table.result ? '교섭 결과 보기 →' : '교섭 테이블로 →', () => { sheetView = 'table'; openSheet(); }, 'strike-primary'));
        } else actions.append(button(`${state.day + 1}일차 아침으로 →`, nextDay, 'strike-primary'));
        body.append(actions);
    }
    function placeCard(id, demand) {
        state = g.place(state, id, demand); picked = null; save(); openSheet(true);
    }
    function tableView(body) {
        const t = state.table, pv = g.preview(state), tactic = g.tactics[t.tactic];
        const done = Boolean(t.result);
        const title = node('h2', `${t.day}일차 교섭`); title.id = 'strikeSheetTitle'; title.tabIndex = -1;
        const factor = Math.round((.25 + Math.min(150, t.resolve) / 100) * 100);
        body.append(node('p', t.extra ? '사측이 요청한 교섭' : t.day === 12 ? '마지막 교섭 · 결과가 최종 합의가 됩니다' : '정기 교섭', 'games-kicker'), title,
            node('p', `사측 버티기 ${t.resolve} → 요구 저항 ${factor}%`, 'strike-table-resolve'));
        const tac = node('div', '', 'strike-tactic'); tac.append(node('strong', '사측의 전술 · ' + tactic.title), node('span', tactic.text)); body.append(tac);
        const rows = node('div', '', 'strike-demands-table');
        Object.entries(g.demands).forEach(([key, d]) => {
            const r = pv[key], row = node(done ? 'div' : 'button', '', 'strike-demand-row'); row.dataset.demand = key;
            if (!done) {
                row.type = 'button';
                row.disabled = r.from >= d.tiers.length;
                row.addEventListener('click', () => { if (picked !== null) placeCard(picked, key); });
                row.setAttribute('aria-label', `${d.title}. 현재 ${r.points}점. ${picked !== null ? '선택한 카드를 여기에 냅니다.' : '카드를 먼저 고르세요.'}`);
            }
            const head = node('span', '', 'strike-demand-head'); head.append(node('strong', d.title));
            const gained = done ? t.result[key] : r.to - r.from;
            head.append(node('span', done ? (gained ? `+${gained}단계 따냄` : '') : r.points ? `${r.points}점${gained ? ` → ${gained}단계 확보` : ''}` : '', 'strike-demand-points'));
            const tiers = node('span', '', 'strike-tiers');
            d.tiers.forEach((tier, i) => {
                const chip = node('span', tier.label, 'strike-tier');
                const won = done ? i < state.won[key] : i < r.from;
                const fresh = done ? i >= state.won[key] - t.result[key] && i < state.won[key] : i >= r.from && i < r.to;
                chip.dataset.state = won && !(done && fresh) ? 'won' : fresh ? 'fresh' : 'open';
                if (!done && i >= r.from) chip.append(node('small', `저항 ${g.resistance(state, key, i)}`));
                tiers.append(chip);
            });
            row.append(head, tiers);
            const placed = t.hand.filter(c => t.placed[c.id] === key);
            if (placed.length) {
                const chips = node('span', '', 'strike-placed');
                placed.forEach(c => chips.append(node('span', `${g.cardKinds[c.kind].title} ${g.cardValue(t, c, key)}`, 'strike-placed-card')));
                row.append(chips);
            }
            rows.append(row);
        });
        body.append(rows);
        if (!done) {
            const handBox = node('div', '', 'strike-hand');
            handBox.append(node('p', t.hand.length ? '현장의 힘 · 카드를 고른 뒤 요구를 누르세요. 놓은 카드를 다시 누르면 거둡니다.' : '오늘은 내밀 카드가 없습니다. 참여율·여론·멈춘 생산을 끌어올려 다음 교섭을 준비하세요.', 'strike-hand-title'));
            const cards = node('div', '', 'strike-cards');
            t.hand.forEach(c => {
                const kind = g.cardKinds[c.kind], where = t.placed[c.id];
                const b = button('', () => {
                    if (where) placeCard(c.id, null);
                    else { picked = picked === c.id ? null : c.id; openSheet(true); }
                }, 'strike-card');
                b.dataset.kind = c.kind; b.setAttribute('aria-pressed', String(picked === c.id));
                if (where) b.dataset.placed = where;
                const name = c.kind === 'voice' ? `${kind.title} · ${state.crews[c.crew].name}` : kind.title;
                b.append(node('strong', String(g.cardValue(t, c, null)), 'strike-card-value'), node('span', name, 'strike-card-name'), node('small', where ? `→ ${g.demands[where].title}` : kind.text));
                b.setAttribute('aria-label', `${name}, 기본 ${g.cardValue(t, c, null)}점. ${kind.text}.${where ? ' ' + g.demands[where].title + '에 냄. 누르면 거둡니다.' : ''}`);
                cards.append(b);
            });
            handBox.append(cards); body.append(handBox);
            const spend = g.spending(t);
            if (spend) handBox.append(node('p', `투쟁 기금 사용 −${spend} · 남는 기금 ${state.fund - spend}`, 'strike-hand-spend'));
            const actions = node('div', '', 'strike-sheet-actions');
            actions.append(button(state.day === 12 ? '마지막 제안 내놓기' : '이 카드로 제안하기', propose, 'strike-primary'));
            body.append(actions);
        } else {
            const summary = (Object.values(state.won).some(Boolean) ? '잠정 합의: ' + dealLine(g.dealOf(state.won)) : '아직 따낸 요구가 없습니다.') + (t.spent ? ` · 투쟁 기금 −${t.spent}` : '');
            body.append(node('p', summary, 'strike-sheet-note'));
            const wouldWin = Object.values(state.won).some(Boolean) && g.won(g.settle(state));
            const nextSession = g.sessions.find(d => d > state.day);
            const actions = node('div', '', 'strike-sheet-actions');
            const settle = button('이 합의로 타결하기 · 파업 종료', settleDeal, wouldWin ? 'strike-primary' : '');
            settle.disabled = !Object.values(state.won).some(Boolean);
            actions.append(settle, button('파업 이어가기 →', nextDay, wouldWin ? '' : 'strike-primary'));
            body.append(actions, node('p', (wouldWin ? '시나리오 목표를 모두 담은 합의안입니다. ' : '아직 목표를 다 담지 못했습니다. ') + `파업을 이어가면 다음 교섭은 ${nextSession}일 저녁입니다. 버티는 동안 사측의 수가 더 거세집니다.`, 'games-note'));
        }
    }
    function openSheet(keepFocus) {
        const sheet = el('strikeSheet'), body = el('strikeSheetBody');
        const scroll = body.scrollTop;
        body.replaceChildren();
        if (sheetView === 'table' && state.table) tableView(body); else reviewView(body);
        if (!sheet.open) { if (sheet.showModal) sheet.showModal(); else sheet.setAttribute('open', ''); }
        if (keepFocus) {
            body.scrollTop = scroll;
            const target = picked !== null ? body.querySelector('.strike-card[aria-pressed="true"]') : null;
            (target || body.querySelector('.strike-cards .strike-card') || el('strikeSheetTitle')).focus({ preventScroll: true });
        } else el('strikeSheetTitle').focus();
    }
    function closeSheet() {
        const sheet = el('strikeSheet');
        if (sheet.open) { if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); }
        render();
        (state.phase === 'done' ? el('strikeResultTitle') : el('strikeAdvance')).focus();
    }
    function propose() {
        state = g.propose(state); save(); picked = null;
        if (state.phase === 'done') { announce('마지막 교섭이 끝났습니다.'); closeSheet(); return; }
        announce('사측이 제안에 답했습니다.');
        openSheet();
    }
    function settleDeal() { state = g.settle(state); save(); closeSheet(); }
    function nextDay() {
        state = g.next(state); save(); sheetView = 'review'; picked = null;
        const sheet = el('strikeSheet'); if (sheet.open) { if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); }
        render(); el('strikeThreatTitle') ? el('strikeThreatTitle').focus() : el('strikeAdvance').focus();
        announce(`${state.day}일차 아침입니다. ${g.threats(state).map(m => g.moves[m].title).join(', ') || ''}`);
    }
    function result() {
        const box = el('strikeResult'); box.hidden = state.phase !== 'done';
        if (box.hidden) return;
        const grade = g.grade(state);
        const stars = node('p', '★'.repeat(grade.stars) + '☆'.repeat(3 - grade.stars), 'strike-stars'); stars.setAttribute('aria-label', `별 ${grade.stars}개`);
        const title = node('h2', grade.title); title.id = 'strikeResultTitle'; title.tabIndex = -1;
        const text = state.deal ? (state.outcome === 'final' ? '12일 마지막 교섭 결과로 합의했습니다: ' : '타결했습니다: ') + dealLine(state.deal) + (state.deal.intensity ? ' · 라인 속도 15% 인상' : '')
            : state.outcome === 'collapse' ? '참여율이 이틀 연속 20% 아래로 떨어져 파업이 무너졌습니다. 잠정 합의도 사측이 거둬들였습니다.' : '12일 동안 따낸 요구 없이 파업을 마쳤습니다.';
        const goals = node('ul', '', 'strike-result-goals');
        g.objectives(state).forEach(o => { const li = node('li', (o.met && state.deal ? '✓ ' : '✗ ') + o.text); li.dataset.met = String(o.met && Boolean(state.deal)); goals.append(li); });
        g.bonuses.forEach(b => { const met = b.met(state) && g.won(state); const li = node('li', (met ? '★ ' : '☆ ') + b.text, 'is-bonus'); li.dataset.met = String(met); goals.append(li); });
        const held = state.history.reduce((n, r) => n + r.moves.filter(m => m.ok).length, 0), total = state.history.reduce((n, r) => n + r.moves.length, 0);
        const stats = node('p', `${state.day}일 파업 · 사측의 수 ${total}번 중 ${held}번 막아냄 · 생활 지원 부족 ${state.history.filter(r => r.missing).length}일 · 마지막 참여율 ${state.unity}% · 사측 버티기 ${state.resolve}`, 'strike-result-stats');
        const actions = node('div', '', 'strike-sheet-actions');
        actions.append(button('같은 조건으로 다시 도전', () => { enter(g.start(state.mode, state.seed, state.scenario)); save(); }, 'strike-primary'), button('다른 시나리오 선택 →', () => { el('strikePlay').hidden = true; el('strikeSetup').hidden = false; load(); el('strikeStart').focus(); }));
        box.replaceChildren(node('p', '우리가 함께 만든 결과', 'games-kicker'), stars, title, node('p', text, 'strike-result-text'), goals, stats, actions);
    }
    function render() {
        const done = state.phase === 'done', review = state.phase === 'review';
        el('strikeGuide').hidden = state.day !== 1 || state.phase !== 'planning';
        calendar(); meters(); objectives(); threatPanel(); forecast(); crews(); history(); result();
        window.StrikeScene.render(el('strikeScene'), state, selected, moving, assign, select);
        el('strikeSceneLabel').textContent = done ? '파업이 끝난 현장' : moving ? '현장에서 보내는 하루…' : review ? '하루가 끝난 현장' : '배치를 준비하는 아침';
        el('strikeAdvance').hidden = done || moving;
        el('strikeAdvance').textContent = review ? (state.table && !state.table.result ? '교섭 테이블 열기' : '저녁 결산 다시 보기') : '하루 보내기 →';
        el('strikeSkip').hidden = !moving;
        el('strikeCommand').hidden = done;
    }
    function select(id) { selected = id; render(); }
    function assign(job) {
        if (state.crews[selected].injured) { announce(`${state.crews[selected].name}은(는) 다쳐서 쉬어야 합니다.`); return; }
        state = g.assign(state, selected, job); save();
        announce(`${state.crews[selected].name}을(를) ${g.jobs[job].title}에 배치했습니다.`); render();
    }
    function finishAnimation() {
        clearTimeout(timer); moving = false; render();
        announce(`${state.history[state.history.length - 1].day}일차 결과가 나왔습니다.`);
        sheetView = 'review'; openSheet();
    }
    function enter(s) {
        state = s; selected = state.crews.findIndex(c => !c.injured); picked = null; sheetView = 'review';
        el('strikeSetup').hidden = true; el('strikePlay').hidden = false; render();
        if (state.phase === 'review') openSheet(); else (el('strikeThreatTitle') || el('strikeAdvance')).focus();
    }
    function setupScenario() {
        const config = g.scenarios[el('strikeScenario').value];
        el('strikeScenarioDescription').textContent = config.description + ` 시작 기금 ${config.fund[el('strikeMode').value === 'hard' ? 1 : 0]} · 참여율 ${config.unity}%.` + (el('strikeMode').value === 'hard' ? ' 어려움: 생활비와 사측 버티기가 높고, 5일부터 하루 두 수를 둡니다.' : '');
    }
    el('strikeScenario').addEventListener('change', setupScenario);
    el('strikeMode').addEventListener('change', setupScenario);
    el('strikeGuideDismiss').addEventListener('click', () => { el('strikeGuide').open = false; });
    el('strikeStart').addEventListener('click', () => {
        if (saved && saved.phase !== 'done' && !window.confirm('진행 중인 파업을 새 게임으로 바꿀까요?')) return;
        enter(g.start(el('strikeMode').value, Math.floor(Math.random() * 4294967296), el('strikeScenario').value)); save();
    });
    el('strikeContinue').addEventListener('click', () => { if (saved) enter(saved); });
    el('strikeAdvance').addEventListener('click', () => {
        if (moving) return;
        if (state.phase === 'review') { sheetView = state.table && !state.table.result ? 'table' : 'review'; openSheet(); return; }
        if (state.phase !== 'planning') return;
        state = g.advance(state).state; save();
        moving = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; render();
        if (moving) { el('strikeSkip').focus(); timer = setTimeout(finishAnimation, 2200); } else finishAnimation();
    });
    el('strikeSkip').addEventListener('click', finishAnimation);
    el('strikeSheet').addEventListener('close', () => { if (!moving) render(); });
    setupScenario();
    load();
    if (new URLSearchParams(location.search).get('resume') === '1' && saved && saved.phase !== 'done') enter(saved);
})();
