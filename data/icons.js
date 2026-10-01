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
// - hammer-sickle: Pictogrammers Material Design Icons (Apache-2.0):
// https://github.com/Templarian/MaterialDesign/blob/master/svg/hammer-sickle.svg
// - swords: Lucide (MIT), https://github.com/lucide-icons/lucide/blob/main/icons/swords.svg
// - scroll-text: Lucide (MIT), https://github.com/lucide-icons/lucide/blob/main/icons/scroll-text.svg
// - town-hall, circle-a (MDI alpha-a-circle-outline): Pictogrammers Material
// Design Icons (Apache-2.0), https://github.com/Templarian/MaterialDesign/blob/master/svg/
// - stamp, users, gavel, hand-fist, glasses, sprout, chess-king, castle,
// newspaper, unlink, vote, mic-off, map-pinned, rose: Lucide (MIT),
// https://github.com/lucide-icons/lucide/blob/main/icons/
// Everything else is Lucide (MIT) except four custom drawings: `fasces` and
// `phrygian-cap` (see their entries), `commulingo`, a "political school"
// emblem (open book + filled star), and `posts`, Bichon herself, a bob-haired
// figure matching the site portrait.

const ICON_PATHS = {
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z"/>',
    'hammer-sickle': '<path fill="currentColor" stroke="none" d="M22 20.59L20.59 22L17.45 18.86C16.89 19.23 16.3 19.56 15.66 19.78C14 20.36 12.2 20.4 10.53 19.88C9.5 19.58 8.56 19.05 7.75 18.37L4.56 21.56C4 22.15 3.03 22.15 2.44 21.56C1.86 21 1.86 20 2.44 19.44L5.82 16.06L8.47 15.54C9.19 16.45 10.19 17.13 11.28 17.5C12.44 17.85 13.72 17.84 14.87 17.46C15.16 17.37 15.44 17.26 15.7 17.12L7.6 9L5.83 10.78L3 7.95L7.95 3L12.19 4.41L9 7.6L17.31 15.89C17.5 15.71 17.65 15.53 17.8 15.33C19.3 13.36 19.42 10.42 18.09 8C16.78 5.57 14.5 3.55 12 2C13.41 2.5 14.76 3.17 16 4.04C17.24 4.91 18.43 5.93 19.33 7.25C20.23 8.54 20.87 10.12 21 11.79C21.1 13.47 20.66 15.23 19.7 16.65C19.5 17 19.24 17.28 19 17.56L22 20.59Z"/>',
    handshake: '<path d="m11 17 2 2a3 3 0 0 0 4.2 0l3.8-3.8a3 3 0 0 0 0-4.2l-4-4a3 3 0 0 0-4.2 0L12 8"/><path d="m13 7-2-2a3 3 0 0 0-4.2 0L3 8.8a3 3 0 0 0 0 4.2l4 4a3 3 0 0 0 4.2 0l.8-.8"/><path d="m8 12 2 2 4-4"/>',
    // A treaty scroll for 외국 정치가. handshake was unavailable (it is the
    // 외무인민위원부 office glyph) and the hand-drawn negotiating table read as
    // a bench at 20px. Lucide's own `podium` is a winner's rostrum, `earth`
    // collides with globe/Comintern, and `gavel` says courtroom.
    'scroll-text': '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    // Crossed swords for 반혁명 세력. A shield says defence; what these people
    // have in common is having taken up arms to put a revolution back. Taken
    // from Lucide rather than drawn here: the hand-drawn pair read as an X with
    // two loops at 20px, which is the size the medal is actually shown at.
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    paintbrush: '<path d="m14 4 6 6"/><path d="m13 5-5.5 5.5 6 6L19 11"/><path d="M7.5 10.5 4 14c-1.7 1.7-2 4.7-2 8 3.3 0 6.3-.3 8-2l3.5-3.5"/><path d="M4.5 15.5c1.5.2 3.8 1.5 4 4"/>',
    factory: '<path d="M2 20h20"/><path d="M4 20V10l5 3V8l5 3V6l6 4v10"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
    atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c-2.5 2.5-8.4.7-13.2-4.1S.4 5.4 2.9 2.9s8.4-.7 13.2 4.1 6.6 10.7 4.1 13.2Z"/><path d="M20.2 3.8c2.5 2.5.7 8.4-4.1 13.2S5.4 23.6 2.9 21.1s-.7-8.4 4.1-13.2 10.7-6.6 13.2-4.1Z"/>',
    wheat: '<path d="M2 22 16 8"/><path d="M8 8c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M10 12c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M6 14c-3 0-5-2-6-5 4 0 6 2 6 5Z"/>',
    corn: '<path fill="currentColor" stroke="none" d="M11 12H8.82c.8.5 1.53 1.07 2.18 1.68V12M7 11c.27-5.12 2.37-9 5-9 2.66 0 4.77 3.94 5 9.12 1.5-.69 3.17-1.12 5-1.12-5.75 2.57-3.75 12-10 12-6 0-4.07-9.43-10-12 1.82 0 3.5.4 5 1m4 0V9H8.24l-.21 2H11m0-3V6H9.05c-.25.6-.45 1.27-.62 2H11m0-3V3.3c-.55.33-1.05.92-1.5 1.7H11m1-2v2h1v1h-1v2h2v1h-2v2h3v1h-3v2h2v1h-1.77c1.19 1.45 1.92 3 2.09 4.23.99-1.67 1.64-4.39 1.68-7.47C15.94 7 14.13 3 12 3Z"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    candle: '<path d="M12 2c-2 2.4-2.8 3.8-2.8 5a2.8 2.8 0 0 0 5.6 0c0-1.2-.8-2.6-2.8-5Z"/><path d="M12 9.8v1.2"/><path d="M7.5 11h9v8.5h-9Z"/><path d="M13.5 11v2.5"/><path d="M4.5 21h15"/>',
    landmark: '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M12 3 3 8h18l-9-5Z"/><path d="M9 21V10"/><path d="M15 21V10"/>',
    map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h13l-1 5 1 5H4"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
    briefcase: '<path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/><rect x="2" y="7" width="20" height="13" rx="2"/>',
    orbit: '<path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
    coins: '<circle cx="8" cy="8" r="5"/><path d="M18.1 8.6a5 5 0 1 1-6.7 6.7"/><path d="M8 5v6"/><path d="M5 8h6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    crown: '<path d="m2 6 5 12h10l5-12-6 5-4-7-4 7-6-5Z"/><path d="M7 18h10"/>',
    rose: '<path d="M17 10h-1a4 4 0 1 1 4-4v.534"/><path d="M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31"/><path d="M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2"/><path d="M9.77 12C4 15 2 22 2 22"/><circle cx="17" cy="8" r="2"/>',
    dove: '<path d="M4 19c5-1 8-4 10-8"/><path d="M3 7c4 0 7 2 9 6 2-4 5-6 9-6-2 5-5 8-9 10-3-2-6-5-9-10Z"/><path d="M14 7l4-4"/>',
    feather: '<path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.5V19h8.5l6.7-6.8Z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
    'book-open': '<path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H2Z"/><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H15a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h7Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'git-branch': '<path d="M8 3h-5v5"/><path d="M16 3h5v5"/><path d="M3 3l7.536 7.536a5 5 0 0 1 1.464 3.534v6.93"/><path d="M18 6.01v-.01"/><path d="M16 8.02v-.01"/><path d="M14 10v.01"/>',
    'circle-help': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.9 1.7-2.9 4"/><path d="M12 17h.01"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    // Function and political-position glyphs (2026-10-01). Each function and
    // each position collection on the people index has a glyph of its own.
    stamp: '<path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/><path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z"/><path d="M5 22h14"/>',
    'town-hall': '<path fill="currentColor" stroke="none" d="M21 10H17V8L12.5 6.2V4H15V2H11.5V6.2L7 8V10H3C2.45 10 2 10.45 2 11V22H10V17H14V22H22V11C22 10.45 21.55 10 21 10M8 20H4V17H8V20M8 15H4V12H8V15M12 8C12.55 8 13 8.45 13 9S12.55 10 12 10 11 9.55 11 9 11.45 8 12 8M14 15H10V12H14V15M20 20H16V17H20V20M20 15H16V12H20V15Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    gavel: '<path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381"/><path d="m16 16 6-6"/><path d="m21.5 10.5-8-8"/><path d="m8 8 6-6"/><path d="m8.5 7.5 8 8"/>',
    'circle-a': '<path fill="currentColor" stroke="none" d="M11,7H13A2,2 0 0,1 15,9V17H13V13H11V17H9V9A2,2 0 0,1 11,7M11,9V11H13V9H11M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>',
    'hand-fist': '<path d="M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0"/><path d="M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5"/><path d="M9 5A2 2 0 1 0 5 5V10"/><path d="M9 7V4A2 2 0 1 1 13 4V7.268"/>',
    glasses: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
    sprout: '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
    'chess-king': '<path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="m6.7 18-1-1C4.35 15.682 3 14.09 3 12a5 5 0 0 1 4.95-5c1.584 0 2.7.455 4.05 1.818C13.35 7.455 14.466 7 16.05 7A5 5 0 0 1 21 12c0 2.082-1.359 3.673-2.7 5l-1 1"/><path d="M10 4h4"/><path d="M12 2v6.818"/>',
    castle: '<path d="M10 5V3"/><path d="M14 5V3"/><path d="M15 21v-3a3 3 0 0 0-6 0v3"/><path d="M18 3v8"/><path d="M18 5H6"/><path d="M22 11H2"/><path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9"/><path d="M6 3v8"/>',
    newspaper: '<path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/>',
    unlink: '<path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/>',
    vote: '<path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/>',
    'mic-off': '<path d="M12 19v3"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M16.95 16.95A7 7 0 0 1 5 12v-2"/><path d="M18.89 13.23A7 7 0 0 0 19 12v-2"/><path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>',
    // Fasces for 파시스트·나치: the bundle of rods and axe the movement is named
    // after. Neither Lucide nor MDI (nor any Iconify set) has one, so it is drawn
    // here on Lucide's grid with a filled blade, which reads as an axe at 20px.
    fasces: '<path d="M15 2v20"/><path d="M11.5 8v14"/><path d="M18.5 8v14"/><path d="M10 12.5h10"/><path d="M10 18.5h10"/><path fill="currentColor" d="M15 3.5 7 2.5c-3 2-3 6 0 8l8-1.5Z"/>',
    'map-pinned': '<path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 01-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0112 0"/><path d="M4.474 15h-.197a1 1 0 00-.969.753l-1.097 4.35a1.5 1.5 0 001.444 1.898L20.344 22a1.5 1.5 0 001.446-1.897l-1.098-4.35a1 1 0 00-.969-.753h-.197"/><circle cx="12" cy="8" r="2"/>',
    // Phrygian cap (bonnet rouge) for 자코뱅·프랑스 혁명 급진파. Lucide and MDI
    // have none and Game Icons' version, cockade and all, collapses at 20px.
    'phrygian-cap': '<rect x="4" y="17" width="16" height="4" rx="1"/><path d="M6 17c0-5 1-8 3-9.5C6.5 6.5 4 7 3 9.5c2.5-6 7.5-8 11.5-6.5 3.8 1.4 5.5 5 5.5 9V17"/><circle cx="14.5" cy="12" r="2"/>',
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
