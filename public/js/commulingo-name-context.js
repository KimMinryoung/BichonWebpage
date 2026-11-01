/* global module, require */
// One person-context policy, used by the server and the decision-book client.
(function (root, factory) {
    // On the server the name patterns use the trie matcher (the same matches
    // as the RegExp, much faster); the browser keeps the RegExp.
    if (typeof module === 'object' && module.exports) module.exports = factory(require('../../data/commulingo/literal-pattern').createLiteralPattern);
    else root.CommuLingoNameContext = factory(null);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (createLiteralPattern) {
    'use strict';
    const word = /[\p{L}\p{M}\p{N}]/u;
    const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const normalize = value => value.normalize('NFC').toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
    // A following word is not part of a name. Korean has no word boundary, so
    // what may follow a name is spelled out: particles, the copula's endings
    // (예조프였고, 롬이었으나, 호네커뿐이었다) and a few reviewed derivational
    // suffixes (기·식·파·계·군·적). Anything else is the rest of a longer word —
    // 판푸성, 미하일 롬니체아누, 체르니셰프스키, 고리키호 — and is withheld rather
    // than guessed to be a particle.
    const PARTICLES = '(?:으로부터|으로서|으로써|에게서|한테서|이라고|이라는|이라며|이라도|이라면|이라서|이어서|이었|였다|이다|입니다|이었다|이란|라는|라고|라며|라도|라면|라서|란|이며|이고|에게|한테|에서|부터|까지|처럼|보다|조차|마저|으로|하고|이라|이든|든지|의|은|는|인|이|가|을|를|와|과|도|만|에|로|나|랑|며|든|요|다|서|께'
        + '|이야말로|야말로|이나마|나마|로부터|로서|로써|에게로|께서|이랑|만큼|밖에|마다|대로|뿐|들|인데|인지|인가)';
    // The copula after a name: 이/였/이었 + an ending. Bare one-syllable
    // endings that would also end other names (니, 고, 자, 야) need the 이/였 in
    // front, so 마르티니 is not 마르티 + 니.
    const COPULA = '(?:(?:이었|였|이)(?:다고|다는|다며|다면|다가|더라도|던|다|고|며|으며|지만|으나|나|는데|면|으면|므로|으므로|으니|어서|어도|기도|기에|기|음|을|자|야|여|요|에요|라고|라는|라며|라도|라면|라서|라|란|습니다)|지만)';
    const particle = new RegExp('^' + PARTICLES + '+$');
    const tailGrammar = new RegExp('^(?:기|식|파|계|군|적)?' + PARTICLES + '*(?:' + COPULA + PARTICLES + '*)?$');
    function koreanTail(tail) {
        return /^[가-힣]+$/.test(tail) && tailGrammar.test(tail);
    }
    // Every check reads a few words around a match; a bounded window keeps a
    // long report from being copied once per name.
    const after = (text, end) => text.slice(end, end + 80);
    const before = (text, start) => text.slice(Math.max(0, start - 80), start);
    function boundary(text, start, end, en) {
        if (start && word.test(text[start - 1])) return false;
        const tail = (after(text, end).match(/^[\p{L}\p{M}\p{N}]+/u) || [''])[0];
        if (!tail) return true;
        if (en) return false;
        // A footnote number set against the name (레닌<sup>1</sup>).
        return /^\d+$/.test(tail) || koreanTail(tail);
    }
    // Words that, right after a one-word name, make the phrase a place, an
    // institution or an award named after the person: 돈스코이 수도원, 프룬제
    // 아카데미, 메드베데프 숲, Frunze Academy, Hoover Dam, Lenin Prize.
    const NAMED_AFTER = /^(?:\s*(?:숲|광장|거리|대로|구역|공장|광산|수도원|화장터|사관학교|공군사관학교|아카데미|군사아카데미|연구소|대학|학교|앙상블|설계국|재단|훈장|메달|평화상|문학상|크라이|변경지방|지방|운하|공원|극장|박물관|도서관|조선소|제철소|발전소|대성당|성당|방어선|근위연대|(?:주|섬|항|상|연대|사단)(?=[와과의에로는은이가을를,.·)」』]|\s|$))|\s+(?:Forest|Square|Street|District|Factory|Works|Mine|Monastery|Academy|Institute|University|School|Ensemble|Bureau|Foundation|Order|Prize|Krai|Oblast|Province|Region|Prospekt|Prospect|Avenue|Boulevard|Embankment|Island|Canal|Dam|Field|Park|Palace|Cathedral|Bridge|Museum|Library|Theatre|Theater|Station|Plant|Shipyard|Mausoleum|Institution|College|Guards|Regiment|Division|Medal)\b)/u;
    function namedAfter(text, end) {
        return NAMED_AFTER.test(after(text, end));
    }
    // Capitalised words that may stand next to an English surname without being
    // a name: titles, nationalities, months and days, sentence openers, and
    // the person's own acts and governments (Brusilov Offensive, Marshall Plan,
    // Kennedy Administration).
    const NOT_NAME = new Set(`Premier Minister General Generals Marshal Marshals Admiral Commissar Secretary President
        Chairman Prosecutor-General Procurator Ambassador Colonel Captain Major Lieutenant Ataman Comrade Comrades Professor
        Dr Dr. Commander Commanders Chief Deputy Director Academician Academicians Atamans Army Navy Party Soviet Soviets
        American British French German Russian Chinese Polish Italian Japanese Spanish Hungarian Czech Yugoslav Cuban
        January February March April May June July August September October November December
        Monday Tuesday Wednesday Thursday Friday Saturday Sunday
        The A An And But Then When After Before While As In On At By For From With Without Under Only Even Later Meanwhile
        Yet So Thus Both Neither Either Although Though Because Since Until If Unlike Like Among Between Also
        Plan Plans Pact Offensive Doctrine Note Notes Memorandum Amendment Accord Accords Agreement Treaty Report Affair
        Telegram Theses Declaration Reform Reforms Purge Era Years Government Cabinet Administration Regime Group Commission
        Committee Jr Sr`.split(/\s+/));
    function ownWord(data, ids, value) {
        const clean = normalize(value);
        // Kantarō in prose, Kantaro on the card.
        const plain = clean.normalize('NFD').replace(/\p{M}/gu, '');
        return (ids || []).some(id => {
            const own = data && data.own && data.own[id];
            const has = word => (own.has ? own.has(word) : own.includes(word));
            return Boolean(own && (has(clean) || has(plain)));
        });
    }
    function knownName(data, value) {
        return Boolean(data && ((data.shortWords && data.shortWords.has(normalize(value)))
            || (data.shorts && data.shorts[value]) || (data.guarded && data.guarded[value])));
    }
    // Whether a match can be a mention of the person at all, before anyone
    // decides which person: not glued into a longer word on either side, not
    // the first half of a place or institution named after them, and in
    // English not a one-word name followed by another capitalised name (Clay
    // Blair, Mikk Titma, Lenin Prize) unless that word is the person's own.
    // Every person pass applies it, whatever kind of expression matched.
    function standsAlone(text, start, end, data, ids) {
        const en = Boolean(data && data.en);
        if (!boundary(text, start, end, en)) return false;
        if (/\s/.test(text.slice(start, end))) return true;
        if (namedAfter(text, end)) return false;
        // post-Stalin Moscow: the name is half of an adjective there.
        if (en && !/(?:^|[^\p{L}])(?:post|pre|anti|pro)-$/iu.test(before(text, start))) {
            const next = ((after(text, end).match(/^\s+(\p{Lu}[\p{L}\p{M}'’.\-]*)/u) || [])[1] || '')
                .replace(/['’]s$/u, '').replace(/['’.\-]+$/u, '');
            if (next && !NOT_NAME.has(next) && !ownWord(data, ids, next)) return false;
            // Caroline Kennedy-Pipe: a double surname, unless the other half
            // is someone the dictionary knows (Molotov-Ribbentrop).
            const joined = (after(text, end).match(/^-(\p{Lu}[\p{L}\p{M}'’]*)/u) || [])[1];
            if (joined && !knownName(data, joined) && !ownWord(data, ids, joined)) return false;
        }
        return true;
    }
    // A surname directly followed by another name is being used as a given name
    // (그레고리 지노비예프, 울리히 폰 브록도르프, 앨리슨 K. 토머스): the person meant
    // is someone else, so the bare family name must not link — unless the next
    // word is one of that person's own names (총대주교 티혼).
    const nameParticles = new Set(['폰', '판', '반', '드', '데', '디', '델', '알', '엘', '벤', '이븐', '르', 'von', 'van', 'de', 'di', 'del', 'al', 'el', 'ben', 'ibn', 'le']);
    function followedByName(text, end, data, ids) {
        // Quotes end the word: '코바치 이슈트반'이라는 still reads 이슈트반 + 이라는.
        const next = (after(text, end).match(/^\s+([\p{L}\p{M}][\p{L}\p{M}.\-]*)/u) || [])[1];
        if (!next) return false;
        if (/^[A-ZА-Я]\.$/u.test(next)) return true;
        const clean = normalize(next);
        if (nameParticles.has(clean)) return true;
        const forms = [clean];
        if (!data.en) for (let i = 1; i < clean.length; i++) if (particle.test(clean.slice(i))) forms.push(clean.slice(0, i));
        if (forms.some(form => ids.some(id => data.own[id] && data.own[id].has(form)))) return false;
        return forms.some(form => form.length >= 2 && (data.given.has(form) || data.shortWords.has(form)));
    }
    function namePattern(tokens) {
        if (!tokens.length) return null;
        return (createLiteralPattern && createLiteralPattern(tokens, { escape, unicode: true }))
            || new RegExp(tokens.map(escape).join('|'), 'gu');
    }
    function compile(data) {
        if (!data) return null;
        const names = data.names || {};
        const shorts = data.shorts || {};
        const guarded = data.guarded || {};
        const fullTokens = Object.keys(names).sort((a, b) => b.length - a.length);
        const shortTokens = Object.keys(shorts).sort((a, b) => b.length - a.length);
        // Representative one-word names (guarded) are read for the given name
        // in front of them like surnames are, so 에드워드 케네디 is not JFK.
        const scanTokens = [...new Set(shortTokens.concat(Object.keys(guarded)))].sort((a, b) => b.length - a.length);
        return {
            ...data,
            guarded,
            given: new Set(data.given || []),
            shortWords: new Set(shortTokens.map(normalize)),
            own: Object.fromEntries(Object.entries(data.own || {}).map(([id, values]) => [id, new Set(values)])),
            fullPattern: namePattern(fullTokens),
            shortPattern: namePattern(scanTokens),
        };
    }
    function analyze(text, data) {
        const targets = new Map();
        const protectedNames = [];
        const evidence = [];
        const add = (alias, id) => {
            if (!targets.has(alias)) targets.set(alias, new Set());
            targets.get(alias).add(id);
        };
        if (!data) return { targets, protectedNames, evidence };
        if (data.fullPattern) {
            data.fullPattern.lastIndex = 0;
            for (const m of text.matchAll(data.fullPattern)) {
                if (!boundary(text, m.index, m.index + m[0].length, data.en)) continue;
                const ids = data.names[m[0]];
                protectedNames.push({ start: m.index, end: m.index + m[0].length, ids });
                evidence.push({ start: m.index, end: m.index + m[0].length, ids });
                for (const id of ids) for (const alias of data.byPerson[id] || []) add(alias, id);
            }
        }
        if (data.shortPattern) {
            data.shortPattern.lastIndex = 0;
            for (const m of text.matchAll(data.shortPattern)) {
                const start = m.index, end = start + m[0].length;
                if (!boundary(text, start, end, data.en)) continue;
                if (protectedNames.some(span => start >= span.start && end <= span.end)) continue;
                const preceding = before(text, start);
                // Every initial in front counts, not just the last: A. S. Popov
                // is not Blagoy Simeonov Popov although S fits his patronymic.
                const run = (preceding.match(/(?:^|[^\p{L}\p{M}])((?:[A-ZА-Я]\.\s*)+)$/u) || ['', ''])[1];
                const previous = run ? '' : (preceding.match(/([\p{L}\p{M}][\p{L}\p{M}.'’\-]*)\s+$/u) || [])[1];
                if (!run && !previous) continue;
                const first = previous && normalize(previous);
                if (!run && !data.given.has(first)) continue;
                const letters = run ? [...run.matchAll(/[A-ZА-Я](?=\.)/gu)].map(letter => normalize(letter[0])) : [];
                const spanStart = run ? start - run.length : start - previous.length - (preceding.match(/\s+$/) || [''])[0].length;
                const candidates = ownersOf(data, m[0]);
                const surname = Boolean(data.shorts[m[0]]);
                const compatible = candidates.filter(id => run
                    ? letters.every(letter => (data.initials?.[id] || []).includes(letter))
                    : data.own[id] && data.own[id].has(first));
                if (compatible.length) {
                    if (surname) for (const id of compatible) add(m[0], id);
                    const span = { start: spanStart, end, ids: compatible };
                    protectedNames.push(span);
                    evidence.push(span);
                }
                else {
                    if (surname) add(m[0], null);
                    protectedNames.push({ start: spanStart, end, ids: [] });
                }
            }
        }
        return { targets, protectedNames, evidence };
    }
    // Everyone a one-word name may stand for: the people whose surname it is
    // and the representative it links to by itself (guarded).
    function ownersOf(data, alias) {
        if (!data) return [];
        const shorts = data.shorts[alias];
        const guarded = data.guarded && data.guarded[alias];
        if (!guarded) return shorts || [];
        if (!shorts) return guarded;
        return shorts.concat(guarded.filter(id => !shorts.includes(id)));
    }
    function resolve(alias, entryId, start, text, data, context, policy) {
        const end = start + alias.length;
        const owners = ownersOf(data, alias);
        if (!standsAlone(text, start, end, data, entryId ? [entryId].concat(owners) : owners)) return null;
        // A recognized whole name, including a registered but unlinked alias,
        // cannot be split up and rebound to a different person.
        const containing = context.protectedNames.find(span => start >= span.start && end <= span.end);
        if (containing) {
            if (containing.ids.length !== 1) return null;
            const id = containing.ids[0];
            if (id === entryId || owners.includes(id)) return id;
            return null;
        }
        const isShort = Boolean(data && data.shorts[alias]);
        if (!isShort) {
            // A representative one-word name (스탈린, 케네디 → JFK) is never
            // handed to someone else here, but a name right after it still
            // makes it someone else's given name.
            if (data && data.guarded && data.guarded[alias] && followedByName(text, end, data, owners)) return null;
            return policy === 'context' && !context.protectedNames.some(span => span.ids.includes(entryId)) ? null : entryId;
        }
        if (followedByName(text, end, data, owners)) return null;
        const targets = context.targets.get(alias);
        if (targets && targets.size) {
            if (targets.size !== 1) return null;
            const id = [...targets][0];
            // Later evidence may veto a wrong existing link, but cannot assign
            // an earlier ambiguous surname to a newly introduced person.
            if (!entryId && !(context.evidence || []).some(span => span.end <= start && span.ids.includes(id))) return null;
            return id && owners.includes(id) ? id : null;
        }
        return policy === 'context' ? null : entryId;
    }
    return { compile, analyze, resolve, boundary, koreanTail, standsAlone, namedAfter, NAMED_AFTER, followedByName, normalize };
});
