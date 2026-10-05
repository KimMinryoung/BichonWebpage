// Stage registry. research and draft are one author session (the editor);
// review and discover are sessions of their own. All three run in the leninbot
// worker; judge, validate and submit run here.
const { editor, review, discover } = require('./agent');
const { judge, validate, submit } = require('./local');

module.exports = { discover, research: editor, draft: editor, review, judge, validate, submit };
