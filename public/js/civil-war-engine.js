/* global module, require */
/* 「붉은 전선 1918–1920」 run by the shared war engine (war/engine.js) on its
   scenario (civil-war-data.js). This name stays until every page and test
   uses the engine directly. */
(function (root) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = require('./war/engine.js').create(require('./civil-war-data.js'));
    else root.CivilWarGame = root.WarEngine.create(root.CivilWarData);
})(typeof window !== 'undefined' ? window : globalThis);
