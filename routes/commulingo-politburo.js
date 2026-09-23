const express = require('express');
const { setShortPublicCache, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { loadPolitburo } = require('../data/commulingo/politburo-store');
const { localize } = require('../data/commulingo/localize');

const router = express.Router();

const { rosterFor } = require('../data/commulingo/politburo-presentation');

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const en = lang === 'en';
        const data = loadPolitburo();
        const { eras, congresses } = await rosterFor(data, lang);

        setShortPublicCache(res);
        res.render('public/commulingo-politburo', {
            intro: localize(data.intro, lang),
            sources: localize(data.sources, lang),
            eras,
            congresses,
            pageTitle: en ? 'The Soviet Politburo — CommuLingo' : '소련 정치국 — CommuLingo',
            pageDescription: en
                ? 'Membership of the Politburo and Presidium of the CPSU, 1917–1991, by era and by party congress.'
                : '1917년부터 1991년까지 소련 공산당 정치국·간부회의 구성원을 시기별·당대회 기수별로 정리한 표.',
            pagePath: '/commulingo/politburo',
        });
    } catch (err) {
        console.error('commulingo politburo:', err);
        commuLingoLoadError(res, { message: { ko: '정치국 명부를 불러올 수 없습니다.', en: 'Failed to load the Politburo page.' } });
    }
});

module.exports = router;
