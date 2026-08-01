// The five CommuLingo dictionaries in the order they appear on screen. Two
// components render this list — the switcher tabs across the top of every
// dictionary index, and the icon-only jumps in the crumb bar's right-hand slot
// on the detail pages — so it lives in one place rather than in both.
function dictTabs(en) {
    return [
        { key: 'people', href: '/commulingo/people', icon: 'user',
          label: en ? 'People' : '인물 사전', short: en ? 'People' : '인물' },
        { key: 'events', href: '/commulingo/events', icon: 'flag',
          label: en ? 'Historical events' : '역사 사건', short: en ? 'Events' : '사건' },
        { key: 'terms', href: '/commulingo/terms', icon: 'book-open',
          label: en ? 'Glossary' : '용어 사전', short: en ? 'Terms' : '용어' },
        { key: 'genealogy', href: '/commulingo/genealogy', icon: 'git-branch',
          label: en ? 'Genealogy' : '계보도', short: en ? 'Charts' : '계보' },
        { key: 'docs', href: '/commulingo/docs', icon: 'landmark',
          label: en ? 'References' : '참고 문헌', short: en ? 'Refs' : '문헌' },
    ];
}

module.exports = { dictTabs };
