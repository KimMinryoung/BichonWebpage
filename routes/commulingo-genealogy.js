const express = require('express');
const errorPage = require('../utils/error-page');
const { listGenealogyCharts, getGenealogyChart } = require('../data/commulingo/genealogy-store');
const { renderGenealogySvg } = require('../data/commulingo/genealogy-svg');

const router = express.Router();

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

router.get('/', (req, res) => {
    try {
        const lang = res.locals.lang;
        const charts = listGenealogyCharts().map(chart => ({
            id: chart.id,
            title: localize(chart.title, lang),
            description: localize(chart.description, lang),
            period: `${chart.timeStart}–${chart.timeEnd}`,
        }));
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-genealogies', {
            charts,
            pageTitle: lang === 'en' ? 'Genealogy Charts — CommuLingo' : '계보도 — CommuLingo',
            pageDescription: lang === 'en'
                ? 'Diagrams of how currents, doctrines and factions split and merged.'
                : '사상과 이론, 분파가 갈라지고 합쳐진 흐름을 도표로 보는 계보도.',
            pagePath: '/commulingo/genealogy',
        });
    } catch (err) {
        console.error('commulingo genealogy index:', err);
        res.status(500).send('Failed to load genealogy charts');
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
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
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
            pageTitle: `${localize(chart.title, lang)} — CommuLingo`,
            pageDescription: localize(chart.description, lang),
            pagePath: `/commulingo/genealogy/${chart.id}`,
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
