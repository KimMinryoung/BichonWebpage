const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { listGenealogyCharts, getGenealogyChart, GENEALOGY_GROUPS } = require('../data/commulingo/genealogy-store');
const { renderGenealogySvg } = require('../data/commulingo/genealogy-svg');
const { localize } = require('../data/commulingo/localize');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const lang = res.locals.lang;
        const labels = res.locals.strings.commuLingoViews.genealogies.groups;
        // Grouped by topic, each group in order of its start year. The list
        // is short enough to set out whole, so it is not paged. A chart whose
        // group is missing or unknown (the chart test rejects both) still
        // shows, in a last group without a heading.
        const groups = GENEALOGY_GROUPS.map(id => ({ id, label: labels[id], charts: [] }));
        const rest = { id: 'other', label: '', charts: [] };
        listGenealogyCharts()
            .slice()
            .sort((a, b) => a.timeStart - b.timeStart || a.timeEnd - b.timeEnd)
            .forEach(chart => (groups.find(group => group.id === chart.group) || rest).charts.push({
                id: chart.id,
                title: localize(chart.title, lang),
                description: localize(chart.description, lang),
                period: `${chart.timeStart}–${chart.timeEnd}`,
            }));
        setShortPublicCache(res);
        res.render('public/commulingo-genealogies', {
            groups: groups.concat(rest).filter(group => group.charts.length),
            pageTitle: lang === 'en' ? 'Genealogy Charts — CommuLingo' : '계보도 — 공산링고',
            pageDescription: lang === 'en'
                ? 'Diagrams of how currents, doctrines and factions split and merged.'
                : '사상과 이론, 분파가 갈라지고 합쳐진 흐름을 도표로 보는 계보도.',
            pagePath: '/commulingo/genealogy',
        });
    } catch (err) {
        console.error('commulingo genealogy index:', err);
        commuLingoLoadError(res, { message: { ko: '계보도를 불러올 수 없습니다.', en: 'Failed to load genealogy charts.' } });
    }
});

router.get('/:chartId', (req, res) => {
    try {
        const lang = res.locals.lang;
        const chart = getGenealogyChart(String(req.params.chartId || '').trim());
        if (!chart) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Chart not found.' : '계보도를 찾을 수 없습니다.',
            backHref: '/commulingo/genealogy', backLabel: lang === 'en' ? 'Genealogy Charts' : '계보도',
        });
        const rendered = renderGenealogySvg(chart, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-genealogy', {
            chart: {
                id: chart.id,
                title: localize(chart.title, lang),
                description: localize(chart.description, lang),
                // The legend explains the dashed node only when the chart has one.
                hasUnlinkedNodes: chart.nodes.some(node => !node || !node.ref || !node.ref.id),
            },
            svg: rendered.svg,
            svgWidth: rendered.width,
            columns: rendered.columns,
            // Read by public/js/commulingo-genealogy.js for the node panel.
            panelData: { nodes: rendered.nodes, edges: rendered.edges },
            pageTitle: `${localize(chart.title, lang)} — ${res.locals.strings.commuLingo.name}`,
            pageDescription: localize(chart.description, lang),
            pagePath: `/commulingo/genealogy/${chart.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'Genealogy Charts' : '계보도', href: '/commulingo/genealogy' },
                { name: localize(chart.title, lang), href: `/commulingo/genealogy/${chart.id}` },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo genealogy detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load chart.' : '계보도를 불러올 수 없습니다.',
            backHref: '/commulingo/genealogy',
            backLabel: res.locals.lang === 'en' ? 'Genealogy Charts' : '계보도',
        });
    }
});

module.exports = router;
