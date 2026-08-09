// The site's single glyph table.
//
// Glyphs used to live in two places: this set (as data/commulingo/role-icons.js,
// for CommuLingo role and tab icons) and views/partials/menu-icon.ejs (for the
// top nav, home cards and footer). Six were byte-identical under two names:
// quiz/circle-help, people/user, events/flag, terms/book-open, reports/chart,
// docs/landmark. Nothing kept them in step, so on 2026-08-02 a 참고 문헌 icon
// was drawn fresh for the home card while the CommuLingo tab for the same
// destination already had one, and the two disagreed in production.
//
// One table, one glyph per drawing. MENU_ALIASES maps the menu's vocabulary
// onto it so both naming schemes resolve here instead of holding their own copy.
//
// Third-party glyph sources:
// - orbit: Lucide (MIT), https://github.com/lucide-icons/lucide/blob/main/icons/orbit.svg
// - user: Lucide (MIT), https://github.com/lucide-icons/lucide/blob/main/icons/user.svg
// - house: Lucide (MIT), https://github.com/lucide-icons/lucide/blob/main/icons/house.svg
// - corn: Pictogrammers Material Design Icons (Apache-2.0):
// https://github.com/Templarian/MaterialDesign/blob/master/svg/corn.svg
// Everything else is Lucide (MIT) except two custom drawings: `commulingo`,
// a "political school" emblem (open book + filled star), and `posts`, Bichon
// herself, a bob-haired figure matching the site portrait.

const ICON_PATHS = {
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z"/>',
    handshake: '<path d="m11 17 2 2a3 3 0 0 0 4.2 0l3.8-3.8a3 3 0 0 0 0-4.2l-4-4a3 3 0 0 0-4.2 0L12 8"/><path d="m13 7-2-2a3 3 0 0 0-4.2 0L3 8.8a3 3 0 0 0 0 4.2l4 4a3 3 0 0 0 4.2 0l.8-.8"/><path d="m8 12 2 2 4-4"/>',
    // A table with a seat on either side: the 외국 정치가 role, which is about
    // sitting across from the Soviet side. Drawn rather than borrowed because
    // handshake was already the 외무인민위원부 office glyph, and two medals with
    // the same drawing read as the same thing.
    'table-talks': '<path d="M2 13h20"/><path d="M5 13v6M19 13v6"/><path d="M7 13V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M13 13V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/>',
    // Crossed sabres for 반혁명 세력. A shield says defence; what these people
    // have in common is having taken up arms to put a revolution back.
    sabers: '<path d="M3.5 3.5 14 14"/><path d="m14 14 2.5 2.5a2 2 0 1 1-2.8 2.8L11 16.8"/><path d="M20.5 3.5 10 14"/><path d="m10 14-2.5 2.5a2 2 0 1 0 2.8 2.8L13 16.8"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    paintbrush: '<path d="m14 4 6 6"/><path d="m13 5-5.5 5.5 6 6L19 11"/><path d="M7.5 10.5 4 14c-1.7 1.7-2 4.7-2 8 3.3 0 6.3-.3 8-2l3.5-3.5"/><path d="M4.5 15.5c1.5.2 3.8 1.5 4 4"/>',
    factory: '<path d="M2 20h20"/><path d="M4 20V10l5 3V8l5 3V6l6 4v10"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
    atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c-2.5 2.5-8.4.7-13.2-4.1S.4 5.4 2.9 2.9s8.4-.7 13.2 4.1 6.6 10.7 4.1 13.2Z"/><path d="M20.2 3.8c2.5 2.5.7 8.4-4.1 13.2S5.4 23.6 2.9 21.1s-.7-8.4 4.1-13.2 10.7-6.6 13.2-4.1Z"/>',
    wheat: '<path d="M2 22 16 8"/><path d="M8 8c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M10 12c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M6 14c-3 0-5-2-6-5 4 0 6 2 6 5Z"/>',
    corn: '<path fill="currentColor" stroke="none" d="M11 12H8.82c.8.5 1.53 1.07 2.18 1.68V12M7 11c.27-5.12 2.37-9 5-9 2.66 0 4.77 3.94 5 9.12 1.5-.69 3.17-1.12 5-1.12-5.75 2.57-3.75 12-10 12-6 0-4.07-9.43-10-12 1.82 0 3.5.4 5 1m4 0V9H8.24l-.21 2H11m0-3V6H9.05c-.25.6-.45 1.27-.62 2H11m0-3V3.3c-.55.33-1.05.92-1.5 1.7H11m1-2v2h1v1h-1v2h2v1h-2v2h3v1h-3v2h2v1h-1.77c1.19 1.45 1.92 3 2.09 4.23.99-1.67 1.64-4.39 1.68-7.47C15.94 7 14.13 3 12 3Z"/>',
    landmark: '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M12 3 3 8h18l-9-5Z"/><path d="M9 21V10"/><path d="M15 21V10"/>',
    map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h13l-1 5 1 5H4"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
    briefcase: '<path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/><rect x="2" y="7" width="20" height="13" rx="2"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    orbit: '<path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
    coins: '<circle cx="8" cy="8" r="5"/><path d="M18.1 8.6a5 5 0 1 1-6.7 6.7"/><path d="M8 5v6"/><path d="M5 8h6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    crown: '<path d="m2 6 5 12h10l5-12-6 5-4-7-4 7-6-5Z"/><path d="M7 18h10"/>',
    rose: '<path d="M12 22V12"/><path d="M17 8a5 5 0 0 0-10 0c0 3 5 6 5 6s5-3 5-6Z"/><path d="M7 14c-3 0-5 2-5 5 3 0 5-2 5-5Z"/><path d="M17 14c3 0 5 2 5 5-3 0-5-2-5-5Z"/>',
    dove: '<path d="M4 19c5-1 8-4 10-8"/><path d="M3 7c4 0 7 2 9 6 2-4 5-6 9-6-2 5-5 8-9 10-3-2-6-5-9-10Z"/><path d="M14 7l4-4"/>',
    feather: '<path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.5V19h8.5l6.7-6.8Z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
    'book-open': '<path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H2Z"/><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H15a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h7Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'git-branch': '<path d="M8 3h-5v5"/><path d="M16 3h5v5"/><path d="M3 3l7.536 7.536a5 5 0 0 1 1.464 3.534v6.93"/><path d="M18 6.01v-.01"/><path d="M16 8.02v-.01"/><path d="M14 10v.01"/>',
    'circle-help': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.9 1.7-2.9 4"/><path d="M12 17h.01"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    // Opens the crumb bar on every CommuLingo page, standing for the section root.
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',

    // UI chrome glyphs: the dictionary search field and its clear button.
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',

    // Menu-only glyphs: no CommuLingo role uses these.
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    commulingo: '<path fill="currentColor" stroke="none" d="M12 1.2l.75 1.9 2.05.12-1.6 1.3.53 2L12 5.4l-1.73 1.12.53-2-1.6-1.3 2.05-.12Z"/><path d="M12 10.3C10.5 8.9 8.2 8.1 5.4 7.9 4.6 7.85 4 8.5 4 9.3v9c0 .8.6 1.4 1.4 1.5 2.6.2 4.8 1 6.6 2.4 1.8-1.4 4-2.2 6.6-2.4.8-.1 1.4-.7 1.4-1.5v-9c0-.8-.6-1.45-1.4-1.4-2.8.2-5.1 1-6.6 2.4Z"/><path d="M12 10.3V22"/>',
    library: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    game: '<line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5z"/>',
    hub: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    diary: '<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M16 2v20"/>',
    posts: '<path d="M6 14v-4a6 6 0 0 1 12 0v4"/><circle cx="12" cy="11" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/>',
};

// The menu's own vocabulary, pointing at glyphs the table already holds. These
// are the six that used to be duplicated by hand. A new menu entry belongs here
// as an alias whenever the drawing already exists; only a genuinely new drawing
// belongs in ICON_PATHS.
const MENU_ALIASES = {
    quiz: 'circle-help',
    people: 'user',
    events: 'flag',
    terms: 'book-open',
    reports: 'chart',
    docs: 'landmark',
};

function iconPaths(name) {
    return ICON_PATHS[MENU_ALIASES[name] || name] || '';
}

module.exports = { ICON_PATHS, MENU_ALIASES, iconPaths };
