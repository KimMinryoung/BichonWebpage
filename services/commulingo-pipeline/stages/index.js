// Stage registry. research and draft are one author session (the editor),
// review is independent; both run in the leninbot worker. A stage missing here
// (discover) is deferred by the engine as not yet ported.
const { editor, review } = require('./agent');
const { judge, validate, submit } = require('./local');

module.exports = { research: editor, draft: editor, review, judge, validate, submit };
