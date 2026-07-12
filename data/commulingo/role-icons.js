const roleIconPaths = {
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z"/>',
    handshake: '<path d="m11 17 2 2a3 3 0 0 0 4.2 0l3.8-3.8a3 3 0 0 0 0-4.2l-4-4a3 3 0 0 0-4.2 0L12 8"/><path d="m13 7-2-2a3 3 0 0 0-4.2 0L3 8.8a3 3 0 0 0 0 4.2l4 4a3 3 0 0 0 4.2 0l.8-.8"/><path d="m8 12 2 2 4-4"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    paintbrush: '<path d="m14 4 6 6"/><path d="m13 5-5.5 5.5 6 6L19 11"/><path d="M7.5 10.5 4 14c-1.7 1.7-2 4.7-2 8 3.3 0 6.3-.3 8-2l3.5-3.5"/><path d="M4.5 15.5c1.5.2 3.8 1.5 4 4"/>',
    factory: '<path d="M2 20h20"/><path d="M4 20V10l5 3V8l5 3V6l6 4v10"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
    atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c-2.5 2.5-8.4.7-13.2-4.1S.4 5.4 2.9 2.9s8.4-.7 13.2 4.1 6.6 10.7 4.1 13.2Z"/><path d="M20.2 3.8c2.5 2.5.7 8.4-4.1 13.2S5.4 23.6 2.9 21.1s-.7-8.4 4.1-13.2 10.7-6.6 13.2-4.1Z"/>',
    wheat: '<path d="M2 22 16 8"/><path d="M8 8c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M10 12c0-3 2-5 5-6 0 4-2 6-5 6Z"/><path d="M6 14c-3 0-5-2-6-5 4 0 6 2 6 5Z"/>',
    landmark: '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M12 3 3 8h18l-9-5Z"/><path d="M9 21V10"/><path d="M15 21V10"/>',
    map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h13l-1 5 1 5H4"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
    briefcase: '<path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/><rect x="2" y="7" width="20" height="13" rx="2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    crown: '<path d="m2 6 5 12h10l5-12-6 5-4-7-4 7-6-5Z"/><path d="M7 18h10"/>',
    rose: '<path d="M12 22V12"/><path d="M17 8a5 5 0 0 0-10 0c0 3 5 6 5 6s5-3 5-6Z"/><path d="M7 14c-3 0-5 2-5 5 3 0 5-2 5-5Z"/><path d="M17 14c3 0 5 2 5 5-3 0-5-2-5-5Z"/>',
    dove: '<path d="M4 19c5-1 8-4 10-8"/><path d="M3 7c4 0 7 2 9 6 2-4 5-6 9-6-2 5-5 8-9 10-3-2-6-5-9-10Z"/><path d="M14 7l4-4"/>',
    feather: '<path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.5V19h8.5l6.7-6.8Z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'git-branch': '<path d="M19 5H9a4 4 0 0 0-4 4v10"/><path d="m9 9-4 4 4 4"/><path d="M11 15h8"/><circle cx="19" cy="5" r="1.75"/><circle cx="19" cy="15" r="1.75"/>',
    'circle-help': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.9 1.7-2.9 4"/><path d="M12 17h.01"/>',
};

function roleIconSvg(icon) {
    const paths = roleIconPaths[icon] || roleIconPaths['circle-help'];
    return `<svg class="commu-role-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function roleHubHref(role) {
    if (!role) return '';
    if (role.officeId) return `/commulingo/offices/${role.officeId}`;
    if (role.categoryId) return `/commulingo/roles/${role.categoryId}`;
    return '';
}

module.exports = {
    roleIconPaths,
    roleIconSvg,
    roleHubHref,
};
