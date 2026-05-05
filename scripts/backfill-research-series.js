#!/usr/bin/env node
// Backfill research_documents series metadata from an explicit, reviewed list.

require('dotenv').config();
const db = require('../config/database');

const SERIES = [
    {
        slug: 'anti-communism',
        title: '한국 반공 이데올로기의 구조와 작동',
        episodes: [
            ['20260504_anti_communism_01_formation', 1],
            ['20260504_anti_communism_02_national_security_law', 2],
            ['20260504_anti_communism_03_daily_reproduction', 3],
            ['20260505_anti_communism_04_resistance_and_cracks', 4],
            ['20260505_anti_communism_05_present_and_future', 5],
        ],
    },
    {
        slug: 'ecosocialism',
        title: '생태사회주의: 기후위기의 계급정치경제학',
        episodes: [
            ['ecosocialism-01', 1],
            ['ecosocialism-02', 2],
            ['ecosocialism-03', 3],
            ['ecosocialism-04', 4],
            ['ecosocialism-05', 5],
        ],
    },
    {
        slug: 'korean-housing-political-economy',
        title: '한국 주거·부동산 정치경제학',
        episodes: [
            ['20260502_rent-theory-korean-land-system', 1],
            ['20260502_jeonse-financialization-household-debt', 2],
        ],
    },
    {
        slug: 'class-and-identity',
        title: '계급과 정체성',
        episodes: [
            ['class-and-identity-01', 1],
            ['class-and-identity-02', 2],
            ['class-and-identity-03', 3],
            ['class-and-identity-04', 4],
            ['class-and-identity-05', 5],
        ],
    },
    {
        slug: 'alt-economy',
        title: '대안 경제 건설',
        episodes: [
            ['alt-economy-01', 1],
            ['alt-economy-02', 2],
            ['alt-economy-03', 3],
            ['alt-economy-04', 4],
            ['alt-economy-05', 5],
        ],
    },
    {
        slug: 'chaebol-democracy',
        title: '한국 재벌체제와 민주주의',
        episodes: [
            ['chaebol-democracy-01', 1],
            ['chaebol-democracy-02', 2],
            ['chaebol-democracy-03', 3],
            ['chaebol-democracy-04', 4],
            ['chaebol-democracy-05', 5],
        ],
    },
    {
        slug: 'labor-history',
        title: '한국 노동운동의 역사와 현재',
        episodes: [
            ['labor-history-01', 1],
            ['labor-history-02', 2],
            ['labor-history-03', 3],
            ['labor-history-04', 4],
            ['labor-history-05', 5],
        ],
    },
    {
        slug: 'platform-capitalism',
        title: '플랫폼 자본주의',
        episodes: [
            ['platform-capitalism-01', 1],
            ['platform-capitalism-02', 2],
            ['platform-capitalism-03', 3],
            ['platform-capitalism-04', 4],
            ['platform-capitalism-05', 5],
        ],
    },
    {
        slug: 'trump-global-right',
        title: '트럼프 2기와 글로벌 우파의 부상',
        episodes: [
            ['trump-global-right-01', 1],
            ['trump-global-right-02', 2],
            ['trump-global-right-03', 3],
            ['trump-global-right-04', 4],
            ['trump-global-right-05', 5],
        ],
    },
    {
        slug: 'marxist-state-theory',
        title: '마르크스 국가론 입문',
        episodes: [
            ['marxist-state-theory-01', 1],
            ['marxist-state-theory-02', 2],
            ['marxist-state-theory-03', 3],
            ['marxist-state-theory-04', 4],
            ['marxist-state-theory-05', 5],
        ],
    },
    {
        slug: 'lee-govt-critique',
        title: '이재명 정부 10개월: 진보 관점 중간 평가',
        episodes: [
            ['lee-govt-critique-01-overview', 1],
            ['lee-govt-critique-02-labor', 2],
            ['lee-govt-critique-03-diplomacy', 3],
            ['lee-govt-critique-04-economy', 4],
            ['lee-govt-critique-05-prospect', 5],
        ],
    },
    {
        slug: 'imperialism-reconfig-2026',
        title: '제국주의 재편 2026',
        episodes: [
            ['20260418_imperialism-reconfig-2026-01-intro', 1],
            ['20260418_imperialism-reconfig-2026-02-monopoly', 2],
            ['20260418_imperialism-reconfig-2026-03-finance', 3],
            ['20260419_imperialism-reconfig-2026-04-tariff', 4],
            ['imperialism-reconfig-2026-05-china', 5],
            ['imperialism-reconfig-2026-06-global-south', 6],
            ['imperialism-reconfig-2026-07-korea', 7],
        ],
    },
];

async function main() {
    const rows = SERIES.flatMap(series => (
        series.episodes.map(([slug, order]) => ({
            slug,
            order,
            seriesSlug: series.slug,
            seriesTitle: series.title,
        }))
    ));

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query(
            `UPDATE research_documents
                SET series_slug = NULL,
                    series_title = NULL,
                    series_title_en = NULL,
                    series_order = NULL
              WHERE status = 'public'`
        );
        for (const row of rows) {
            await client.query(
                `UPDATE research_documents
                    SET series_slug = $1,
                        series_title = $2,
                        series_order = $3
                  WHERE status = 'public'
                    AND slug = $4`,
                [row.seriesSlug, row.seriesTitle, row.order, row.slug]
            );
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
        await db.end();
    }

    console.log(`Backfilled ${rows.length} explicit research series entries across ${SERIES.length} series.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
