const express = require('express');
const { setShortPublicCache, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { loadBody } = require('../data/commulingo/politburo-store');
const { BODIES } = require('../data/commulingo/party-bodies');
const { localize } = require('../data/commulingo/localize');
const { rosterFor } = require('../data/commulingo/politburo-presentation');
const { roleIconSvg } = require('../data/commulingo/role-icons');

// One roster page per Central Committee body (party-bodies.js); mounted at
// /commulingo/politburo, /commulingo/secretariat and /commulingo/orgburo.
function bodyRouter(bodyId) {
    const body = BODIES[bodyId];
    const router = express.Router();
    router.get('/', async (req, res, next) => {
        try {
            const lang = res.locals.lang;
            const data = loadBody(bodyId);
            if (!data) return next();
            const { eras, congresses, timeline } = await rosterFor(data, lang, bodyId);
            const title = localize(body.title, lang);

            setShortPublicCache(res);
            res.render('public/commulingo-politburo', {
                body: {
                    id: bodyId,
                    title,
                    range: body.range,
                    officeId: body.officeId,
                    buckets: { full: localize(body.buckets.full, lang), candidates: localize(body.buckets.candidates, lang) },
                    counts: { full: localize(body.counts.full, lang), candidates: localize(body.counts.candidates, lang) },
                    spans: { full: localize(body.spans.full, lang), cand: localize(body.spans.cand, lang) },
                },
                intro: localize(data.intro, lang),
                sources: localize(data.sources, lang),
                congressesIntro: data.congressesIntro ? localize(data.congressesIntro, lang) : '',
                eras,
                congresses,
                timeline,
                roleIconSvg,
                pageTitle: `${title} — ${lang === 'en' ? 'CommuLingo' : '공산링고'}`,
                pageDescription: localize(body.description, lang),
                pagePath: body.path,
            });
        } catch (err) {
            console.error(`commulingo ${bodyId}:`, err);
            commuLingoLoadError(res, { message: { ko: `${localize(body.title, 'ko')} 명부를 불러올 수 없습니다.`, en: `Failed to load the ${localize(body.title, 'en')} page.` } });
        }
    });
    return router;
}

module.exports = { bodyRouter };
