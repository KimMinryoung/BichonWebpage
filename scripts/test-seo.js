const assert = require('assert');
const path = require('path');
const ejs = require('ejs');
const strings = require('../config/strings');
const seo = require('../utils/seo');
const { inferLanguage, resolvePublicLanguage } = require('../utils/language');

async function renderHead(lang, pagePath = '/', extra = {}) {
    return ejs.renderFile(path.join(__dirname, '..', 'views', 'partials', 'head.ejs'), {
        strings: strings[lang],
        lang,
        pagePath,
        pageTitle: pagePath === '/' ? 'ignored home route title' : '문서 제목',
        pageDescription: strings[lang].siteDescription,
        siteOrigin: 'https://cyber-lenin.com',
        urlLanguage: lang,
        languageUrl: seo.languagePath,
        languageSwitchUrl: seo.languageSwitchPath,
        jsonLdScript: seo.jsonLdScript,
        assetVersion: 'test',
        ...extra,
    });
}

async function main() {
    assert.strictEqual(resolvePublicLanguage({ cookies: {} }), 'ko');
    assert.strictEqual(resolvePublicLanguage({ cookies: { lang: 'en' } }), 'en');
    assert.strictEqual(inferLanguage({ headers: { 'accept-language': 'en-US,en;q=0.9' } }), 'en');

    const koHead = await renderHead('ko');
    assert.ok(koHead.includes('<title>Cyber-Lenin — 정세 분석·정치경제·AI 주권 연구</title>'));
    assert.ok(koHead.includes('국제 정세, 정치경제, 기술 민주주의, AI 주권'));
    assert.ok(koHead.includes('<link rel="canonical" href="https://cyber-lenin.com/">'));
    assert.ok(koHead.includes('hreflang="en" href="https://cyber-lenin.com/en/"'));

    const enHead = await renderHead('en');
    assert.ok(enHead.includes('Geopolitics, Political Economy &amp; AI Sovereignty'));
    assert.ok(enHead.includes('<link rel="canonical" href="https://cyber-lenin.com/en/">'));
    assert.ok(enHead.includes('hreflang="ko" href="https://cyber-lenin.com/"'));

    const untranslatedEnHead = await renderHead('en', '/ai-diary/437', { hasEnglishVersion: false });
    assert.ok(untranslatedEnHead.includes('<link rel="canonical" href="https://cyber-lenin.com/ai-diary/437">'));
    assert.ok(untranslatedEnHead.includes('<meta name="robots" content="noindex, follow">'));
    assert.ok(!untranslatedEnHead.includes('hreflang="en"'));

    assert.strictEqual(seo.languagePath('/', 'en'), '/en/');
    assert.strictEqual(seo.languagePath('/reports?page=2', 'en'), '/en/reports?page=2');
    assert.strictEqual(seo.languagePath('/reports?page=2', 'ko'), '/reports?page=2');
    assert.strictEqual(seo.languageSwitchPath('/reports?page=2', 'ko'), '/reports?page=2&lang=ko');
    assert.strictEqual(seo.languageSwitchPath('/reports?page=2', 'en'), '/en/reports?page=2&lang=en');
    const localizedLinks = seo.localizeHtmlLinks(
        '<a href="/reports">Reports</a><link href="/css/style.css"><a href="/auth/login">Login</a>',
        'en');
    assert.ok(localizedLinks.includes('href="/en/reports"'));
    assert.ok(localizedLinks.includes('href="/css/style.css"'));
    assert.ok(localizedLinks.includes('href="/auth/login"'));

    const headers = {};
    seo.setMarkdownSeoHeaders({ setHeader: (name, value) => { headers[name] = value; } }, '/reports');
    assert.strictEqual(headers['X-Robots-Tag'], 'noindex, follow');
    assert.strictEqual(headers.Link, '<https://cyber-lenin.com/reports>; rel="canonical"');

    const article = seo.pageJsonLd({
        type: 'Article',
        title: '테스트 보고서',
        description: '설명',
        path: '/reports/research/test',
        datePublished: '2026-08-14T01:02:03Z',
        dateModified: '2026-08-15T04:05:06Z',
        authorUrl: 'https://cyber-lenin.com/',
        lang: 'en',
    });
    assert.strictEqual(article.datePublished, '2026-08-14T01:02:03.000Z');
    assert.strictEqual(article.dateModified, '2026-08-15T04:05:06.000Z');
    assert.strictEqual(article.author.url, 'https://cyber-lenin.com/');
    assert.ok(article.publisher.logo.url.endsWith('/apple-touch-icon.png'));
    assert.strictEqual(article.publisher['@id'], 'https://cyber-lenin.com/#organization');
    assert.strictEqual(article.inLanguage, 'en');
    assert.strictEqual(article.url, 'https://cyber-lenin.com/en/reports/research/test');

    const organization = seo.organizationJsonLd();
    const website = seo.websiteJsonLd({ description: '설명', lang: 'en' });
    const breadcrumb = seo.breadcrumbJsonLd([
        { name: 'Home', href: '/' },
        { name: 'Reports', href: '/reports' },
        { name: 'Test', href: '/reports/research/test' },
    ], 'en');
    const graph = seo.graphJsonLd(organization, website, article, breadcrumb);
    assert.strictEqual(organization['@id'], 'https://cyber-lenin.com/#organization');
    assert.strictEqual(website.url, 'https://cyber-lenin.com/en/');
    assert.strictEqual(website.publisher['@id'], organization['@id']);
    assert.strictEqual(breadcrumb.itemListElement[2].item, 'https://cyber-lenin.com/en/reports/research/test');
    assert.deepStrictEqual(graph['@graph'].map(node => node['@type']), [
        'Organization', 'WebSite', 'Article', 'BreadcrumbList',
    ]);
    assert.ok(graph['@graph'].every(node => !node['@context']));

    console.log('seo smoke ok');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
