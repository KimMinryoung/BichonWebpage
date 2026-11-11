/* Optional progress enhancement. The catalog's links work without JavaScript.
   A game's engine (strike ~25 KB, civil war ~330 KB) is fetched only when this
   browser holds a save for it, so a first visit loads none of them. */
(function () {
    'use strict';
    const STRIKE_SAVE = 'strike-game-v6-save';
    const WAR_SAVE = 'civil-war-v1-save'; // WarScenarios['civil-war'].ui.save
    const tag = document.currentScript;
    function show(id, text) {
        const el = document.getElementById(id); el.textContent = text; el.hidden = false;
    }
    function stored(key) {
        try { return localStorage.getItem(key); } catch (_) { return null; }
    }
    // In order, each after the one before (the war files depend on each other).
    function load(urls, done) {
        if (!urls.length) { done(); return; }
        const script = document.createElement('script');
        script.src = urls[0];
        script.onload = () => load(urls.slice(1), done);
        document.head.appendChild(script);
    }
    function guarded(fn) {
        return () => { try { fn(); } catch (_) { /* An unreadable save leaves the ordinary play links. */ } };
    }

    const strikeSave = stored(STRIKE_SAVE);
    if (strikeSave) load([tag.dataset.strike], guarded(() => {
        const game = window.StrikeGame;
        const saved = game.restore(strikeSave);
        if (saved && saved.phase !== 'done') {
            show('gamesStrikeResume', `${saved.day}일차 이어하기 →`);
            show('gamesStrikeProgress', game.scenarios[saved.scenario].title + ' · 이 브라우저에 저장됨');
        }
    }));

    const warSave = stored(WAR_SAVE);
    if (warSave) load(tag.dataset.war.split(' '), guarded(() => {
        const civilWar = window.WarScenarios['civil-war'];
        const war = window.WarEngine.create(civilWar).restore(warSave);
        if (war && war.phase !== 'done') {
            const turn = civilWar.turns[war.turn];
            const days = window.WarEngine.create(civilWar).calendar(war);
            show('gamesCivilWarResume', `${days.indexOf(war.turn) + 1}/${days.length} 시기 이어하기 →`);
            show('gamesCivilWarProgress', `${turn.date} ${turn.title} · 이 브라우저에 저장됨`);
        }
    }));

    guarded(() => {
        const progress = JSON.parse(stored('nonogram-progress-v2') || '{}');
        if (progress && typeof progress === 'object' && !Array.isArray(progress)) {
            const entries = Object.values(progress).filter(p => p && Array.isArray(p.cells));
            const completed = entries.filter(p => p.completed === true).length;
            if (entries.length) show('gamesNonogramProgress', `${completed}개 완료 · ${entries.length - completed}개 진행 중`);
        }
    })();
})();
