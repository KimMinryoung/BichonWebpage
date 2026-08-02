// CommuLingo role/tab glyphs. The drawings live in the site's one glyph table
// (data/icons.js) so the menus and this section cannot drift apart; what stays
// here is the CommuLingo-specific wrapper and the role-to-hub link.
const { ICON_PATHS: roleIconPaths } = require('../icons');

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
