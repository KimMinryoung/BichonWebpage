/* global module, require */
/* The tactical battle now lives in war/battle.js; this name stays until
   every page and test loads that file directly. */
(function (root) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = require('./war/battle.js');
    else root.CivilWarBattle = root.WarBattle;
})(typeof window !== 'undefined' ? window : globalThis);
