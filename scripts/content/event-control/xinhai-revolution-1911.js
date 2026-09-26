// Provinces for and against the Qing in the Xinhai Revolution, for the
// event map's control layer.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/xinhai-revolution-1911.json (needs
// NE_ADMIN1, see there). Drawn by hand from the dates on which each province
// declared independence; no map is traced. Modern Natural Earth provinces
// stand in for the Qing ones: Sichuan is Sichuan with Chongqing, Jiangsu
// includes Shanghai, Guangdong includes Hainan, Zhili (Hebei, Beijing and
// Tianjin) stayed Qing. A declaration seldom meant control of the whole
// province, and the Qing retook Hankou (1 November) and Hanyang
// (27 November) across the river from Wuchang; the map ignores both.
//
// How a phase is built: the Qing is the remainder (blue); the revolutionary
// provinces are laid over it, and Outer Mongolia from December 1911.
//
// Coordinates are [lat, lng].

const CHN = provinces => ({ provinces, country: 'CHN' });

const HUBEI = ['Hubei'];
const OCT_22 = ['Hunan', 'Shaanxi'];
const OCT_END = ['Jiangxi', 'Shanxi', 'Yunnan'];
// 3–9 November: Shanghai, Guizhou, Zhejiang, Jiangsu (Suzhou; Nanjing held
// out under Zhang Xun), Guangxi, Anhui, Fujian, Guangdong. Shandong's
// declaration (13 November) was withdrawn on 24 November.
const NOV = ['Shanghai', 'Guizhou', 'Zhejiang', 'Jiangsu', 'Guangxi', 'Anhui', 'Fujian', 'Guangdong', 'Hainan'];
// Late November: Chongqing (22nd) and Chengdu (27th).
const SICHUAN = ['Sichuan', 'Chongqing'];
const NANJING = { circle: [32.06, 118.78, 0.6] };
// The Ili rising of January 1912 (Yining), roughly the Ili valley.
const ILI = [[44.9, 80.2], [44.6, 83.0], [43.8, 84.2], [43.0, 84.0], [42.9, 81.5], [43.3, 80.2]];

const REVOLUTION_1911_11 = [CHN([...HUBEI, ...OCT_22, ...OCT_END, ...NOV])];

module.exports = {
    eventId: 'xinhai-revolution-1911',
    region: ['CHN', 'MNG'],
    // Urga (Ulaanbaatar), so Outer Mongolia's declaration shows.
    focus: [[47.9, 106.9]],
    base: 'qing',
    precedence: ['mongolia', 'revolution'],
    sides: [
        { id: 'qing', label: { ko: '청 조정', en: 'The Qing court' }, tone: 'blue' },
        { id: 'revolution', label: { ko: '혁명군·독립을 선언한 성 (1912년부터 중화민국)', en: 'Revolutionaries and provinces declaring independence (from 1912 the Republic)' }, tone: 'red' },
        { id: 'mongolia', label: { ko: '외몽골 (보그드 칸국)', en: 'Outer Mongolia (Bogd Khanate)' }, tone: 'purple' },
    ],
    note: {
        ko: '경계는 근사치입니다. 각 성이 독립을 선언한 날짜를 바탕으로 현대 성 경계(쓰촨은 충칭 포함, 직례는 허베이·베이징·톈진, 광둥은 하이난 포함)로 칠했습니다. 독립 선언이 성 전체의 장악을 뜻하지는 않았고, 청군이 되찾은 한커우·한양 같은 곳은 생략했습니다. 산둥은 11월 13일 독립을 선언했다가 24일 철회했습니다. 티베트는 1912년 청군을 몰아냈지만 지도에 따로 표시하지 않았습니다.',
        en: 'Boundaries are approximate: provinces are painted from the dates they declared independence, using modern provincial borders (Sichuan with Chongqing, Zhili as Hebei, Beijing and Tianjin, Guangdong with Hainan). A declaration did not mean control of the whole province, and places the Qing retook, such as Hankou and Hanyang, are left out. Shandong declared on 13 November and withdrew on the 24th. Tibet expelled the Qing garrison in 1912 but is not shown separately.',
    },
    sources: [],
    phases: [
        { date: '1905.08', label: { ko: '청 제국', en: 'The Qing Empire' } },
        { date: '1911.10', label: { ko: '10월 10일 우창 봉기: 후베이 군정부', en: '10 October, the Wuchang Uprising: the Hubei military government' },
            revolution: [CHN(HUBEI)] },
        { date: '1911.10.22', label: { ko: '후난·산시(陝西) 독립', en: 'Hunan and Shaanxi declare independence' },
            revolution: [CHN([...HUBEI, ...OCT_22])] },
        { date: '1911.10.31', label: { ko: '장시·산시(山西)·윈난 독립', en: 'Jiangxi, Shanxi and Yunnan declare independence' },
            revolution: [CHN([...HUBEI, ...OCT_22, ...OCT_END])] },
        { date: '1911.11.09', label: { ko: '상하이·저장·장쑤·안후이·구이저우·광시·푸젠·광둥 독립 (난징은 청군이 고수)', en: 'Shanghai, Zhejiang, Jiangsu, Anhui, Guizhou, Guangxi, Fujian and Guangdong declare (Nanjing holds out for the Qing)' },
            revolution: [{ area: REVOLUTION_1911_11[0], minus: [NANJING] }] },
        { date: '1911.12.02', label: { ko: '쓰촨 독립, 난징 함락, 외몽골 독립 선언', en: 'Sichuan declares, Nanjing falls, Outer Mongolia declares independence' },
            revolution: [...REVOLUTION_1911_11, CHN(SICHUAN)], mongolia: [{ units: ['MNG'] }] },
        { date: '1912.01.01', label: { ko: '난징 임시정부 수립, 이리 봉기', en: 'The provisional government at Nanjing; the Ili rising' },
            revolution: [...REVOLUTION_1911_11, CHN(SICHUAN), ILI], mongolia: [{ units: ['MNG'] }] },
        { date: '1912.02.12', label: { ko: '선통제 퇴위: 중화민국', en: 'The emperor abdicates: the Republic of China' },
            revolution: [{ units: ['CHN'] }], mongolia: [{ units: ['MNG'] }] },
    ],
};
