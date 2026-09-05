#!/usr/bin/env node
// The blocking structural gate for CommuLingo course content. Runs in
// `scripts/test` (so `npm test` and `scripts/deploy` fail on it), no DB.
//
//   node scripts/validate-commulingo.js                 # normal run
//   node scripts/validate-commulingo.js --no-baseline   # true state, ignore tolerated entries
//   node scripts/validate-commulingo.js --init-baseline # one-time: record today's failures of baseline-eligible rules
//   node scripts/validate-commulingo.js --prune-baseline # drop baseline entries that now pass (never adds)
//
// Rules live in scripts/lib/commulingo-checks.js and are shared with the
// Capital rewrite harness. Rules the corpus does not yet satisfy everywhere
// (length ratio, concept-brief shape, template prompts, ...) are tolerated for
// the (rule, label) pairs recorded in scripts/commulingo-quality-baseline.json;
// an entry that starts passing is reported as stale so the baseline can only
// shrink, and any new failure outside it blocks.
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../data/commulingo');
const checks = require('./lib/commulingo-checks');

const BASELINE_PATH = path.join(__dirname, 'commulingo-quality-baseline.json');
const args = new Set(process.argv.slice(2));
const noBaseline = args.has('--no-baseline');
const initBaseline = args.has('--init-baseline');
const pruneBaseline = args.has('--prune-baseline');

// Per-collection counts guard against a chapter or lesson silently dropping
// out of the file; the totals are their sum. Adding a chapter means editing
// this map on purpose, together with PUBLIC_CHAPTER_LIMITS in shards.js.
const expected = {
  'capital-vol1': { chapters: 33, questions: 330, lessons: 66 },
  'capital-vol2': { chapters: 21, questions: 210, lessons: 42 },
  'capital-vol3': { chapters: 52, questions: 520, lessons: 104 },
  'lenin-imperialism': { chapters: 10, questions: 100, lessons: 20 },
  'lenin-state-revolution': { chapters: 6, questions: 60, lessons: 12 },
  'marx-wage-labour-capital': { chapters: 6, questions: 60, lessons: 12 },
  'marx-wages-and-programme': { chapters: 8, questions: 80, lessons: 16 },
};
const expectedSpecial = {
  'engels-origin-family': { format: 'concept-graph', nodes: 8, stages: 24 },
  'history-russian-revolution': { format: 'decision-history', eras: 4, episodes: 14 },
  'history-soviet-union': { format: 'decision-history', eras: 4, episodes: 15 },
};
const requiredParts = { 'capital-vol1': 8, 'capital-vol2': 3, 'capital-vol3': 7, 'marx-wages-and-programme': 2 };

const out = checks.createCollector();
const data = loadCommuLingoBundle().bundle;
const collections = new Map((data.collections || []).map(function(collection) { return [collection.id, collection]; }));

function checkSpecialCollection(collectionId, spec) {
  const collection = collections.get(collectionId);
  if (!collection) { out.add('shape', collectionId, 'missing collection ' + collectionId); return; }
  if (collection.format !== spec.format) out.add('shape', collectionId, collectionId + ' format ' + collection.format + ' != ' + spec.format);
  if ((collection.chapters || []).length) out.add('shape', collectionId, collectionId + ' special collection must not have quiz chapters');
  checks.allLocalizedText(out, collection.title, collectionId + '.title');
  checks.allLocalizedText(out, collection.description, collectionId + '.description');

  if (spec.format === 'concept-graph') {
    const graph = collection.conceptGraph;
    if (!graph || typeof graph !== 'object') { out.add('shape', collectionId, collectionId + '.conceptGraph is missing'); return; }
    checks.allLocalizedText(out, graph.question, collectionId + '.conceptGraph.question');
    checks.allLocalizedText(out, graph.thesis, collectionId + '.conceptGraph.thesis');
    const nodes = graph.nodes || [];
    if (nodes.length !== spec.nodes) out.add('shape', collectionId, collectionId + ' node count ' + nodes.length + ' != ' + spec.nodes);
    checks.checkLocalizedItems(out, nodes, collectionId + '.conceptGraph.nodes', ['label', 'summary']);
    const seenNodeIds = new Set();
    let stageCount = 0;
    nodes.forEach(function(node, nodeIndex) {
      if (!node || !String(node.id || '').trim()) out.add('shape', collectionId, collectionId + '.conceptGraph.nodes[' + nodeIndex + '].id is empty');
      else if (seenNodeIds.has(node.id)) out.add('shape', collectionId, collectionId + ' duplicate concept node id ' + node.id);
      else seenNodeIds.add(node.id);
      const stages = (node && node.stages) || [];
      stageCount += stages.length;
      checks.checkLocalizedItems(out, stages, collectionId + '.conceptGraph.nodes[' + nodeIndex + '].stages', ['label', 'text']);
    });
    if (stageCount !== spec.stages) out.add('shape', collectionId, collectionId + ' stage count ' + stageCount + ' != ' + spec.stages);
    return;
  }

  const timeline = collection.decisionTimeline;
  if (!timeline || typeof timeline !== 'object') { out.add('shape', collectionId, collectionId + '.decisionTimeline is missing'); return; }
  checks.allLocalizedText(out, timeline.question, collectionId + '.decisionTimeline.question');
  checks.allLocalizedText(out, timeline.thesis, collectionId + '.decisionTimeline.thesis');
  checks.checkLocalizedItems(out, timeline.stances, collectionId + '.decisionTimeline.stances', ['label', 'desc']);
  const eras = timeline.eras || [];
  if (eras.length !== spec.eras) out.add('shape', collectionId, collectionId + ' era count ' + eras.length + ' != ' + spec.eras);
  checks.checkLocalizedItems(out, eras, collectionId + '.decisionTimeline.eras', ['range', 'title', 'intro']);
  const seenEpisodeIds = new Set();
  let episodeCount = 0;
  eras.forEach(function(era, eraIndex) {
    const episodes = (era && era.episodes) || [];
    episodeCount += episodes.length;
    checks.checkLocalizedItems(out, episodes, collectionId + '.decisionTimeline.eras[' + eraIndex + '].episodes', ['date', 'title', 'role', 'briefing', 'question', 'outcome', 'ripple', 'insight']);
    episodes.forEach(function(episode, episodeIndex) {
      const eLabel = collectionId + '.decisionTimeline.eras[' + eraIndex + '].episodes[' + episodeIndex + ']';
      if (!episode || !String(episode.id || '').trim()) out.add('shape', collectionId, eLabel + '.id is empty');
      else if (seenEpisodeIds.has(episode.id)) out.add('shape', collectionId, collectionId + ' duplicate episode id ' + episode.id);
      else seenEpisodeIds.add(episode.id);
      checks.checkLocalizedItems(out, episode && episode.options, eLabel + '.options', ['label', 'note']);
    });
  });
  if (episodeCount !== spec.episodes) out.add('shape', collectionId, collectionId + ' episode count ' + episodeCount + ' != ' + spec.episodes);
}

let totalQuestions = 0;
let totalLessons = 0;
const quizCollections = [];

Object.keys(expected).forEach(function(collectionId) {
  const spec = expected[collectionId];
  const collection = collections.get(collectionId);
  if (!collection) { out.add('shape', collectionId, 'missing collection ' + collectionId); return; }
  quizCollections.push(collection);
  const chapters = collection.chapters || [];
  if (chapters.length !== spec.chapters) out.add('shape', collectionId, collectionId + ' chapter count ' + chapters.length + ' != ' + spec.chapters);
  checks.allLocalizedText(out, collection.title, collectionId + '.title');
  checks.allLocalizedText(out, collection.description, collectionId + '.description');

  const seenChapters = new Set();
  const partNumbers = new Set();
  let collectionQuestions = 0;
  let collectionLessons = 0;
  chapters.forEach(function(chapter) {
    if (seenChapters.has(chapter.id)) out.add('shape', chapter.id, 'duplicate chapter id ' + chapter.id);
    seenChapters.add(chapter.id);
    if (chapter.partNumber) partNumbers.add(chapter.partNumber);
    (chapter.lessons || []).forEach(function(lesson) {
      collectionLessons += 1;
      collectionQuestions += (lesson.questions || []).length;
    });
  });
  totalLessons += collectionLessons;
  totalQuestions += collectionQuestions;
  if (collectionQuestions !== spec.questions) out.add('shape', collectionId, collectionId + ' question count ' + collectionQuestions + ' != ' + spec.questions);
  if (collectionLessons !== spec.lessons) out.add('shape', collectionId, collectionId + ' lesson count ' + collectionLessons + ' != ' + spec.lessons);
  if (partNumbers.size && partNumbers.size !== requiredParts[collectionId]) out.add('shape', collectionId, collectionId + ' part count ' + partNumbers.size + ' != ' + requiredParts[collectionId]);
});

checks.checkChapters(out, quizCollections);
Object.keys(expectedSpecial).forEach(function(collectionId) { checkSpecialCollection(collectionId, expectedSpecial[collectionId]); });
(data.collections || []).forEach(function(collection) {
  if (!expected[collection.id] && !expectedSpecial[collection.id]) out.add('shape', collection.id, 'unexpected collection ' + collection.id);
});
const expectedQuestions = Object.values(expected).reduce(function(sum, spec) { return sum + spec.questions; }, 0);
const expectedLessons = Object.values(expected).reduce(function(sum, spec) { return sum + spec.lessons; }, 0);
if (totalQuestions !== expectedQuestions) out.add('shape', 'bundle', 'total question count ' + totalQuestions + ' != ' + expectedQuestions);
if (totalLessons !== expectedLessons) out.add('shape', 'bundle', 'total lesson count ' + totalLessons + ' != ' + expectedLessons);

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
stale.forEach(function(entry) { errors.push('[baseline] stale entry (now passes; run --prune-baseline): ' + entry); });

if (errors.length) {
  console.error('Commulingo validation failed with ' + errors.length + ' issue(s):');
  errors.slice(0, 80).forEach(function(error) { console.error('- ' + error); });
  if (errors.length > 80) console.error('... ' + (errors.length - 80) + ' more');
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  collections: Object.keys(expected).length + Object.keys(expectedSpecial).length,
  lessons: totalLessons,
  questions: totalQuestions,
  tolerated: toleratedCounts,
}));
