#!/usr/bin/env node
// The CommuLingo course content rules over the whole bundle. In
// `scripts/test` it runs over the frozen course seed (no DB); run it by hand
// (or MCP audit_run) to check the live courses from the data-document
// snapshot, e.g. after changing a rule.
//
//   node scripts/validate-commulingo.js                 # normal run
//   node scripts/validate-commulingo.js --no-baseline   # true state, ignore tolerated entries
//   node scripts/validate-commulingo.js --init-baseline # one-time: record today's failures of baseline-eligible rules
//   node scripts/validate-commulingo.js --prune-baseline # drop baseline entries that now pass (never adds)
//   node scripts/validate-commulingo.js --extend-baseline <rule> # record today's failures of ONE newly added rule
//
// Rules live in scripts/lib/commulingo-checks.js and are shared with the
// Capital rewrite harness. Rules the corpus does not yet satisfy everywhere
// (length ratio, concept-brief shape, template prompts, ...) are tolerated for
// the (rule, label) pairs recorded in scripts/commulingo-quality-baseline.json;
// an entry that starts passing is reported as stale (prune it with
// --prune-baseline against the live courses) so the baseline can only shrink,
// and any new failure outside it blocks.
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../data/commulingo');
const checks = require('./lib/commulingo-checks');
const BASELINE_PATH = path.join(__dirname, 'commulingo-quality-baseline.json');
const args = new Set(process.argv.slice(2));
const noBaseline = args.has('--no-baseline');
const initBaseline = args.has('--init-baseline');
const pruneBaseline = args.has('--prune-baseline');
const extendIndex = process.argv.indexOf('--extend-baseline');
const extendRule = extendIndex === -1 ? null : process.argv[extendIndex + 1];
const seedOnly = process.env.COMMULINGO_COURSES_SEED === '1';
if (seedOnly && (initBaseline || pruneBaseline || extendRule)) {
  console.error('the baseline is edited against the live courses, not the seed (unset COMMULINGO_COURSES_SEED)');
  process.exit(2);
}


const { courseIssues } = require('../data/commulingo/course-validation');

// The content rules over every course together (courses are database
// documents since 2026-11-01; each write passes the same rules in
// data/commulingo/course-validation.js, so this run mostly matters when a
// rule changes). npm test runs it over the frozen course seed.
const data = loadCommuLingoBundle().bundle;
const out = { issues: courseIssues(data.collections || []) };
let totalQuestions = 0;
let totalLessons = 0;
(data.collections || []).forEach(function(collection) {
  (collection.chapters || []).forEach(function(chapter) {
    (chapter.lessons || []).forEach(function(lesson) {
      totalLessons += 1;
      totalQuestions += (lesson.questions || []).length;
    });
  });
});

// --- baseline ---------------------------------------------------------------

function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
}
function writeBaseline(baseline) {
  const tolerated = {};
  Object.keys(baseline.tolerated).sort().forEach(function(rule) {
    tolerated[rule] = Array.from(new Set(baseline.tolerated[rule])).sort();
  });
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ createdAt: baseline.createdAt, updatedAt: new Date().toISOString().slice(0, 10), tolerated }, null, 2) + '\n');
}
function failingByRule(issues) {
  const map = {};
  issues.forEach(function(issue) {
    if (!checks.BASELINE_RULES.has(issue.rule)) return;
    (map[issue.rule] = map[issue.rule] || new Set()).add(issue.label);
  });
  return map;
}

if (initBaseline) {
  if (fs.existsSync(BASELINE_PATH)) { console.error('baseline already exists: ' + BASELINE_PATH); process.exit(2); }
  const failing = failingByRule(out.issues);
  const tolerated = {};
  Object.keys(failing).forEach(function(rule) { tolerated[rule] = Array.from(failing[rule]); });
  writeBaseline({ createdAt: new Date().toISOString().slice(0, 10), tolerated });
  console.log('baseline written: ' + JSON.stringify(Object.fromEntries(Object.keys(tolerated).map(function(rule) { return [rule, tolerated[rule].length]; }))));
}

if (extendRule) {
  const current = readBaseline();
  if (!current) { console.error('no baseline to extend'); process.exit(2); }
  if (!checks.BASELINE_RULES.has(extendRule)) { console.error(extendRule + ' is not a baseline-eligible rule'); process.exit(2); }
  if (current.tolerated[extendRule]) { console.error(extendRule + ' is already in the baseline; it can only shrink'); process.exit(2); }
  const failing = failingByRule(out.issues)[extendRule];
  current.tolerated[extendRule] = failing ? Array.from(failing) : [];
  writeBaseline(current);
  console.log('baseline extended: ' + extendRule + ' ' + current.tolerated[extendRule].length);
}

const baseline = noBaseline ? null : readBaseline();
const toleratedCounts = {};
const errors = [];
const stale = [];
if (baseline) {
  const failing = failingByRule(out.issues);
  Object.keys(baseline.tolerated).forEach(function(rule) {
    baseline.tolerated[rule].forEach(function(label) {
      if (!failing[rule] || !failing[rule].has(label)) stale.push(rule + ' ' + label);
    });
  });
  if (pruneBaseline && stale.length) {
    Object.keys(baseline.tolerated).forEach(function(rule) {
      baseline.tolerated[rule] = baseline.tolerated[rule].filter(function(label) { return failing[rule] && failing[rule].has(label); });
      if (!baseline.tolerated[rule].length) delete baseline.tolerated[rule];
    });
    writeBaseline(baseline);
    console.log('baseline pruned: ' + stale.length + ' entr' + (stale.length === 1 ? 'y' : 'ies') + ' removed');
    stale.length = 0;
  }
}
out.issues.forEach(function(issue) {
  const list = baseline && baseline.tolerated[issue.rule];
  if (list && list.indexOf(issue.label) !== -1) {
    toleratedCounts[issue.rule] = (toleratedCounts[issue.rule] || 0) + 1;
    return;
  }
  errors.push('[' + issue.rule + '] ' + issue.message);
});
// A stale entry is only a warning: a database edit can fix a tolerated failure
// without a commit, and the seed lacks most of the tolerated questions.
if (stale.length && !seedOnly) console.error('[baseline] ' + stale.length + ' stale entr' + (stale.length === 1 ? 'y' : 'ies') + ' (now pass; run --prune-baseline)');

if (errors.length) {
  console.error('Commulingo validation failed with ' + errors.length + ' issue(s):');
  errors.slice(0, 80).forEach(function(error) { console.error('- ' + error); });
  if (errors.length > 80) console.error('... ' + (errors.length - 80) + ' more');
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  collections: (data.collections || []).length,
  lessons: totalLessons,
  questions: totalQuestions,
  tolerated: toleratedCounts,
}));
