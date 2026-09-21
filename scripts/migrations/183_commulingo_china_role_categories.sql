-- 183: role categories for the Chinese party-state, and the back-links from
-- the older China events to the batch of 2026-09-21.
--
-- The role medal knew the Soviet state by institution (16 offices: party
-- leadership, state security, foreign affairs, ideology, planning...) but
-- everyone outside it by camp: a Chinese Communist was 비소련 혁명가 or
-- 사회주의권 지도자 whatever they did. So Kang Sheng, who ran the party's
-- security and intelligence for thirty years, wore the same medal as a
-- Nanchang rifleman, and Chiang Kai-shek sat under 외국 정치가 beside the
-- ambassadors who negotiated with Moscow. The China shelf (migration 182)
-- made that gap visible; these categories close it the way the offices do for
-- the Soviet side. They are office-less categories, not offices, because the
-- office timelines are Soviet institutions with membership rows.
--
-- 반체제 인사 is generic: the Soviet dissidents keep their era offices for now,
-- but the slot exists for them too.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_role_categories (id, sort_order, icon, label_ko, label_en) VALUES
    ('ccp-leadership',            12, 'flag',      '중공 당 지도부',    'CCP party leadership'),
    ('prc-government',            13, 'briefcase', '국무원·정부',        'PRC government'),
    ('ccp-security',              14, 'eye',       '중공 보안·정보',    'CCP security and intelligence'),
    ('ccp-ideology-propaganda',   15, 'megaphone', '중공 이념·선전',    'CCP ideology and propaganda'),
    ('prc-economy-planning',      16, 'chart',     '중국 경제·계획',    'PRC economy and planning'),
    ('prc-foreign-affairs',       17, 'handshake', '중국 외교',          'PRC foreign affairs'),
    ('qing-kuomintang-warlords',  18, 'landmark',  '청·국민당·군벌',    'Qing, Kuomintang and warlords'),
    ('dissident',                 19, 'rose',      '반체제 인사',        'Dissident')
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

-- One category per person: the function they are known for. The marshals
-- keep 군 지휘관; Sun Yat-sen stays a revolutionary; the writers, Hu Shih and
-- Wu Han keep their craft categories.
CREATE TEMP TABLE _china_roles (id text PRIMARY KEY, category_id text NOT NULL);
INSERT INTO _china_roles (id, category_id) VALUES
    ('mao-zedong', 'ccp-leadership'), ('liu-shaoqi', 'ccp-leadership'), ('deng-xiaoping', 'ccp-leadership'),
    ('chen-duxiu', 'ccp-leadership'), ('li-dazhao', 'ccp-leadership'), ('qu-qiubai', 'ccp-leadership'),
    ('wang-ming', 'ccp-leadership'), ('bo-gu-qin-bangxian', 'ccp-leadership'), ('zhang-wentian', 'ccp-leadership'),
    ('ren-bishi', 'ccp-leadership'), ('li-lisan', 'ccp-leadership'), ('zhang-guotao', 'ccp-leadership'),
    ('hua-guofeng', 'ccp-leadership'), ('hu-yaobang', 'ccp-leadership'), ('zhao-ziyang', 'ccp-leadership'),
    ('jiang-zemin', 'ccp-leadership'), ('peng-zhen', 'ccp-leadership'), ('rao-shushi', 'ccp-leadership'),
    ('wang-hongwen', 'ccp-leadership'),
    ('zhou-enlai', 'prc-government'), ('li-peng', 'prc-government'), ('wan-li', 'prc-government'),
    ('song-qingling', 'prc-government'), ('xi-zhongxun', 'prc-government'), ('chen-yonggui', 'prc-government'),
    ('kang-sheng', 'ccp-security'), ('luo-ruiqing', 'ccp-security'), ('wang-dongxing', 'ccp-security'),
    ('chen-boda', 'ccp-ideology-propaganda'), ('yao-wenyuan', 'ccp-ideology-propaganda'),
    ('deng-tuo', 'ccp-ideology-propaganda'), ('jiang-qing', 'ccp-ideology-propaganda'),
    ('zhang-chunqiao', 'ccp-ideology-propaganda'),
    ('chen-yun', 'prc-economy-planning'), ('li-xiannian', 'prc-economy-planning'),
    ('bo-yibo', 'prc-economy-planning'), ('gao-gang', 'prc-economy-planning'),
    ('chen-yi', 'prc-foreign-affairs'),
    ('yuan-shikai', 'qing-kuomintang-warlords'), ('zhang-zuolin', 'qing-kuomintang-warlords'),
    ('wang-jingwei', 'qing-kuomintang-warlords'), ('chiang-kai-shek', 'qing-kuomintang-warlords'),
    ('song-ziwen', 'qing-kuomintang-warlords'), ('tsiang-tingfu', 'qing-kuomintang-warlords'),
    ('zhang-xueliang', 'qing-kuomintang-warlords'), ('puyi', 'qing-kuomintang-warlords'),
    ('wei-jingsheng', 'dissident'), ('fang-lizhi', 'dissident');

UPDATE commulingo_person_roles r
   SET category_id = c.category_id, office_id = NULL, icon = '', label_ko = '', label_en = '', updated_at = NOW()
  FROM _china_roles c
 WHERE r.person_id = c.id AND r.category_id IS DISTINCT FROM c.category_id;

DROP TABLE _china_roles;

-- The batch of 2026-09-21 linked its new events to the older ones one way;
-- the older pages now list them too. `related` is a plain list of ids.
UPDATE commulingo_history_events SET relations = jsonb_build_object('related', jsonb_build_array(
        'sino-japanese-war-1937-1945', 'chinese-civil-war-1945-1949', 'prc-consolidation-1949-1956')),
    updated_at = NOW()
 WHERE id = 'chinese-revolution-1949' AND NOT (relations ? 'related');
UPDATE commulingo_history_events SET relations = jsonb_build_object('related', jsonb_build_array('prc-consolidation-1949-1956')),
    updated_at = NOW()
 WHERE id = 'korean-war' AND NOT (relations ? 'related');
UPDATE commulingo_history_events SET relations = jsonb_build_object('related', jsonb_build_array(
        'great-leap-forward', 'cultural-revolution', 'tiananmen-1989')),
    updated_at = NOW()
 WHERE id = 'sino-soviet-split' AND NOT (relations ? 'related');

COMMIT;
