// Regional/context role categories retired in favour of activities
// (function × affiliation). Their /commulingo/roles/<id> URLs stay as short
// pointer pages to the filters that now answer the same question, and the list
// is fixed here so it survives the removal of commulingo_person_roles.
// Links: [kind, id] with kind 'function' or 'affiliation' from activity-catalog.json.
module.exports = {
    'non-soviet-revolutionary': {
        label: { ko: '소련 밖의 혁명가들', en: 'Revolutionaries beyond the Soviet Union' },
        note: { ko: '소련 밖의 혁명가들은 이제 실제 활동과 소속 조직으로 찾습니다.', en: 'Revolutionaries outside the Soviet Union are now found by their actual activity and organization.' },
        links: [['function', 'organizing'], ['function', 'political-leadership'], ['affiliation', 'party-german-communist'], ['affiliation', 'party-italian-communist'], ['affiliation', 'russian-sr'], ['affiliation', 'russian-mensheviks'], ['affiliation', 'russian-narodnaya-volya'], ['affiliation', 'spanish-republic'], ['affiliation', 'party-us-communist'], ['affiliation', 'french-revolution']],
    },
    'foreign-statesman': {
        label: { ko: '외국 정치가', en: 'Foreign statesmen' },
        note: { ko: '외국 정치가는 이제 활동(정부·외교·군사)과 그 활동을 한 국가로 찾습니다.', en: 'Foreign statesmen are now found by activity (government, diplomacy, military) and the state they served.' },
        links: [['function', 'government'], ['function', 'diplomacy'], ['function', 'military'], ['affiliation', 'state-usa'], ['affiliation', 'state-uk'], ['affiliation', 'state-france'], ['affiliation', 'state-germany'], ['affiliation', 'state-japan']],
    },
    'socialist-bloc-leader': {
        label: { ko: '사회주의권 지도자', en: 'Socialist-bloc leaders' },
        note: { ko: '사회주의권 지도자는 이제 정치·당 지도 활동과 각 사회주의 국가로 찾습니다.', en: 'Socialist-bloc leaders are now found by political leadership and each socialist state.' },
        links: [['function', 'political-leadership'], ['affiliation', 'state-czechoslovakia'], ['affiliation', 'state-poland'], ['affiliation', 'state-east-germany'], ['affiliation', 'state-romania'], ['affiliation', 'state-hungary'], ['affiliation', 'state-bulgaria'], ['affiliation', 'state-yugoslavia'], ['affiliation', 'state-vietnam'], ['affiliation', 'state-north-korea'], ['affiliation', 'state-south-yemen'], ['affiliation', 'state-afghanistan']],
    },
    'qing-kuomintang-warlords': {
        label: { ko: '청·국민당·군벌', en: 'Qing, Kuomintang and warlords' },
        note: { ko: '청 왕조·국민당·군벌 인물은 이제 각 소속으로 찾습니다.', en: 'People of the Qing, the Kuomintang and the warlords are now found by each affiliation.' },
        links: [['affiliation', 'china-qing'], ['affiliation', 'china-kmt'], ['affiliation', 'china-beiyang']],
    },
};
