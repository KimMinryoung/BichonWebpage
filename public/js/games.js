/* Optional progress enhancement. The catalog's links work without JavaScript. */
(function () {
    'use strict';
    function show(id, text) {
        const el = document.getElementById(id); el.textContent = text; el.hidden = false;
    }
    try {
        const game = window.StrikeGame;
        const saved = game.restore(localStorage.getItem('strike-game-v6-save'));
        if (saved && saved.phase !== 'done') {
            show('gamesStrikeResume', `${saved.day}일차 이어하기 →`);
            show('gamesStrikeProgress', game.scenarios[saved.scenario].title + ' · 이 브라우저에 저장됨');
        }
        const war = window.CivilWarGame.restore(localStorage.getItem('civil-war-v1-save'));
        if (war && war.phase !== 'done') {
            const turn = window.CivilWarGame.DATA.turns[war.turn];
            show('gamesCivilWarResume', `${war.turn + 1}/8 시기 이어하기 →`);
            show('gamesCivilWarProgress', `${turn.date} ${turn.title} · 이 브라우저에 저장됨`);
        }
        const progress = JSON.parse(localStorage.getItem('nonogram-progress-v2') || '{}');
        if (progress && typeof progress === 'object' && !Array.isArray(progress)) {
            const entries = Object.values(progress).filter(p => p && Array.isArray(p.cells));
            const completed = entries.filter(p => p.completed === true).length;
            if (entries.length) show('gamesNonogramProgress', `${completed}개 완료 · ${entries.length - completed}개 진행 중`);
        }
    } catch (_) { /* Invalid or unavailable storage leaves ordinary play links. */ }
})();
