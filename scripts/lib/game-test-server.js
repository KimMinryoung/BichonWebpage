const path = require('node:path');
const express = require('express');
const strings = require('../../config/strings');
const seo = require('../../utils/seo');
const { iconPaths } = require('../../data/icons');
const { stripEnglishPrefix } = require('../../middleware/language');

async function createGameTestServer() {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));
    app.use(stripEnglishPrefix);
    app.use((req, res, next) => { req.cookies = {}; req.session = {}; next(); });
    app.use((req, res, next) => {
        const lang = req.urlLanguage === 'en' ? 'en' : 'ko';
        Object.assign(res.locals, { lang, strings: strings[lang], siteOrigin: 'https://cyber-lenin.com',
            languageUrl: seo.languagePath, languageSwitchUrl: seo.languageSwitchPath,
            jsonLdScript: seo.jsonLdScript, iconPaths, assetVersion: 'test', currentUser: null,
            isAuthenticated: false, urlLanguage: lang, pagePath: req.path });
        const send = res.send.bind(res);
        res.send = body => send(lang === 'en' && typeof body === 'string' ? seo.localizeHtmlLinks(body, 'en') : body);
        next();
    });
    app.use(require('../../routes/redirects'));
    app.use(express.static(path.join(__dirname, '../../public')));
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    const origin = 'http://127.0.0.1:' + server.address().port;
    return { server, origin };
}
module.exports = { createGameTestServer };
