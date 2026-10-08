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
// - stamp, users, hand-fist, glasses, sprout, chess-king, castle,
// bell, unlink, vote, mic-off, map-pinned, rose: Lucide (MIT),
// https://github.com/lucide-icons/lucide/blob/main/icons/
// Everything else is Lucide (MIT) except `hammer-sickle-brush` and `yugoslav-torches`
// (public-domain emblems, see their entries) and custom drawings: `fasces`,
// `hemicycle`, `council-table` and
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
    // Communist-current collections (2026-10-08): Lucide sun (Maoism, 'the East
    // is red') and infinity (Trotskyism, permanent revolution).
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    // The Workers' Party of Korea symbol (hammer, sickle and writing brush),
    // public domain: https://commons.wikimedia.org/wiki/File:Workers%27_Party_of_Korea_symbol.svg
    // (Juche collection, 2026-10-08).
    'hammer-sickle-brush': '<g fill=\"currentColor\" stroke=\"none\" transform=\"translate(0.721 0) scale(0.60452)\"><g transform=\"translate(-86.396 -128.65)\"><g transform=\"matrix(.91015 0 0 .91015 27.005 27.493)\" ><rect x=\"84.738\" y=\"123.36\" width=\"4.3964\" height=\"31.399\" /><rect transform=\"matrix(.71064 .70355 -.71064 .70355 0 0)\" x=\"159.6\" y=\"21.673\" width=\"4.341\" height=\"31.404\" /><rect transform=\"matrix(.71064 -.70355 .71064 .70355 0 0)\" x=\"-41.608\" y=\"136.58\" width=\"4.445\" height=\"38.751\" /><path d=\"m69.265 133.61 11.006-10.921-1.5045-1.7639-4.5618-0.10823-8.9505 8.922z\" /><path d=\"m98.018 127.54s1.5825 1.1703 2.5398-0.11954c2.5905-3.4903-7.2616-7.5012-7.9729-7.7952 0 0 10.192-0.13742 12.888 4.9955 2.1098 4.0172-0.27245 6.966-4.6065 5.7808-0.92083-0.25183-2.8485-2.8615-2.8485-2.8615z\" /><path d=\"m85.133 123.64c0.56648 1.0244 1.1489 1.5234 1.8154 1.5482 0.6664-0.0249 1.2489-0.52379 1.8154-1.5482 3.2578-5.8915-1.8154-12.497-1.8154-12.497s-5.0731 6.606-1.8154 12.497z\" /></g></g><metadata><rdf:RDF><cc:Work rdf:about=\"\"><dc:date>2026-06-26</dc:date><dc:creator><cc:Agent><dc:title>David Bj\u00f6rkman</dc:title></cc:Agent></dc:creator></cc:Work></rdf:RDF></metadata></g>',
    // The flame and torch heads of the Yugoslav federal emblem (1963-1992),
    // public domain: https://commons.wikimedia.org/wiki/File:Emblem_of_Yugoslavia_(1963%E2%80%931992).svg
    // (Titoism collection, 2026-10-08).
    'yugoslav-torches': '<g fill="currentColor" stroke="none" transform="translate(-10.777 -14.331) scale(0.22857)"><path d="m 87.5931,74.1703 c -11.7122,-0.3175 -17.974,6.7203 -17.9917,15.875 -5.4328,6.1031 -3.7605,7.8959 -5.715,12.8588 -1.8183,4.617 -11.9921,13.3646 -7.62,24.9237 6.0776,16.0678 27.4946,25.0817 44.6617,25.7175 15.604,0.5779 32.5669,-9.4419 41.0633,-22.5425 5.7847,-8.9194 -0.0379,-21.7238 -4.1407,-26.5913 -5.9623,-7.0736 -6.7135,-8.2633 -7.8713,-12.6199 -1.079,-4.06 2.1911,-14.6358 -12.118,-20.4788 2.4296,3.7746 3.462,7.5495 2.6459,11.3242 -2.9281,-2.6811 -5.8561,-5.3623 -8.7842,-8.0434 1.5416,2.8651 2.2339,7.0467 0.9525,14.2875 -3.2555,-2.3289 -4.4349,-5.8906 -3.175,-10.9008 -4.2546,1.4377 -4.9767,4.9687 -5.3975,8.6783 -1.6689,-1.0086 -2.228,-6.0484 -0.3462,-11.2546 2.1366,-5.9112 -3.0033,-11.5917 -6.533,-12.6637 1.5601,1.7891 2.3572,7.5917 -1.7991,12.5942 -3.5412,4.2622 -4.8866,9.7939 -3.0692,16.9333 -3.5454,-0.8115 -4.7626,-7.814 -3.175,-13.5467 -4.7624,1.9403 -6.8263,3.9864 -7.9375,9.9484 -2.8575,-7.3202 1.4816,-12.5766 6.35,-14.4992 z"/><path d="m 138.657,153.077 -0.881,-0.965 -1.64,0.37 -0.662,-0.741 0.821,-1.693 -1.297,-1.826 -3.034,-0.426 -1.492,0.355 -2.459,-3.236 8.652,-7.091 2.733,3.157 -0.643,3.961 1.138,2.566 1.323,-0.635 0.899,0.714 -0.643,2.008 0.934,1.035 1.35,-0.423 0.846,0.767 -0.595,1.849 0.648,0.665 -2.781,3.973 -1.664,-1.962 -1.455,0.37 -0.926,-0.847 z"/><path d="m 122.748,163.383 0.423,-1.217 0.821,-0.37 -0.715,-1.667 -1.402,-0.053 -0.741,-0.9 1.232,-1.666 -1.576,-2.329 -3.568,-0.66 -1.465,-3.849 9.981,-4.513 1.81,3.451 -1.44,4.724 0.371,1.852 1.508,-0.158 0.608,0.899 -0.979,1.985 0.556,1.111 1.376,-0.185 0.582,0.926 -0.915,1.58 2.132,4.823 -5.318,-0.715 -1.006,-2.593 -1.455,0.291 z"/><path d="m 105.338,162.219 1.006,-0.079 -1.164,-3.493 -2.987,-1.367 -0.321,-3.951 11.06,-1.429 0.631,4.041 -2.198,2.416 -0.894,3.333 1.535,0.264 0.317,1.244 -1.281,1.112 -5.889,0.264 -0.582,-1.297 z"/><path d="m 93.4056,161.796 1.6933,0.74 -0.1322,0.979 -0.8202,1.013 -5.3446,0.178 0.1587,-1.217 -1.4023,-0.476 -0.0529,-1.297 1.561,-0.502 -0.3538,-3.455 -2.6329,-2.045 0.632,-4.264 11.1389,1.323 -0.3676,4.136 -3.3101,1.685 z"/><path d="m 73.7618,166.505 -5.2255,1.1248 1.7462,-4.1276 0.0265,-0.0397 v -0.0794 l 0.6085,-1.4817 -1.0583,-1.1377 0.2249,-0.6879 1.733,-0.291 0.7276,-1.7199 -1.1774,-1.0318 0.463,-1.0187 1.6537,0.1323 0.3372,-2.3148 -0.8734,-3.0785 -0.596,-0.9876 1.9533,-3.7101 9.8813,4.6007 -1.3627,3.7257 -3.3998,0.5605 -2.0373,2.9369 1.3758,1.1113 -0.3704,1.2435 h -1.7727 l -0.6879,1.5611 1.1377,0.7937 -0.1323,1.3759 -1.2965,0.1322 -0.926,0.344 z"/><path d="m 55.0276,151.411 0.5292,-1.085 1.7198,0.37 1.1377,-1.349 -1.0054,-1.243 0.6879,-1.191 1.6404,0.609 0.9942,-1.959 0.117,-2.592 -0.7753,-1.856 2.7953,-3.207 8.6957,6.968 -2.4606,3.304 -2.32,-0.372 -2.2208,0.757 -1.3595,1.602 0.8732,1.244 -0.3705,1.005 -1.1377,0.08 -0.7408,-0.371 -1.0583,1.455 0.926,1.006 -0.3704,1.164 -1.2171,0.106 -0.8202,-0.45 -1.5878,2.176 -2.9808,-3.631 0.85,-1.1 0.279,-0.382 z"/></g>',
    // Custom: a council table with six delegates (left/council communism).
    'council-table': '<circle cx="12" cy="12" r="4.5"/><circle cx="12.00" cy="3.70" r="1.9"/><circle cx="19.19" cy="7.85" r="1.9"/><circle cx="19.19" cy="16.15" r="1.9"/><circle cx="12.00" cy="20.30" r="1.9"/><circle cx="4.81" cy="16.15" r="1.9"/><circle cx="4.81" cy="7.85" r="1.9"/>',
    // Parliament hemicycle: the parliamentary road of Eurocommunism.
    hemicycle: '<circle cx="3.5" cy="17" r="1.3"/><circle cx="5" cy="11.5" r="1.3"/><circle cx="8.8" cy="7.3" r="1.3"/><circle cx="14" cy="5.8" r="1.3"/><circle cx="19.2" cy="7.6" r="1.3"/><circle cx="22" cy="12" r="1"/><circle cx="8" cy="17" r="1.1"/><circle cx="9.3" cy="13" r="1.1"/><circle cx="13" cy="10.6" r="1.1"/><circle cx="16.8" cy="12" r="1.1"/><path d="M2 21h20"/>',
    infinity: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
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
    'circle-a': '<path fill="currentColor" stroke="none" d="M11,7H13A2,2 0 0,1 15,9V17H13V13H11V17H9V9A2,2 0 0,1 11,7M11,9V11H13V9H11M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>',
    'hand-fist': '<path d="M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0"/><path d="M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5"/><path d="M9 5A2 2 0 1 0 5 5V10"/><path d="M9 7V4A2 2 0 1 1 13 4V7.268"/>',
    glasses: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
    sprout: '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
    'chess-king': '<path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="m6.7 18-1-1C4.35 15.682 3 14.09 3 12a5 5 0 0 1 4.95-5c1.584 0 2.7.455 4.05 1.818C13.35 7.455 14.466 7 16.05 7A5 5 0 0 1 21 12c0 2.082-1.359 3.673-2.7 5l-1 1"/><path d="M10 4h4"/><path d="M12 2v6.818"/>',
    castle: '<path d="M10 5V3"/><path d="M14 5V3"/><path d="M15 21v-3a3 3 0 0 0-6 0v3"/><path d="M18 3v8"/><path d="M18 5H6"/><path d="M22 11H2"/><path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9"/><path d="M6 3v8"/>',
    // 혁명적 민주주의자: Herzen and Ogarev's Kolokol, "The Bell". (newspaper
    // would duplicate library, which is the same drawing.)
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
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
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',

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
