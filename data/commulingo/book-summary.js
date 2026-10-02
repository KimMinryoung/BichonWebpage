const summaries = new WeakMap();

function summarizeBooks(catalog) {
    if (summaries.has(catalog)) return summaries.get(catalog);
    const result = (catalog.collections || []).map(collection => {
        const chapters = collection.chapters || [];
        const lessonIds = [];
        chapters.forEach(chapter => {
            (chapter.lessons || []).forEach(lesson => {
                if (lesson && lesson.id && Number(lesson.questionCount) > 0) lessonIds.push(lesson.id);
            });
        });
        const graph = collection.conceptGraph;
        const timeline = collection.decisionTimeline;
        const episodeCount = timeline && Array.isArray(timeline.eras)
            ? timeline.eras.reduce((sum, era) => sum + (Array.isArray(era.episodes) ? era.episodes.length : 0), 0)
            : 0;
        return {
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            description: collection.description,
            format: collection.format,
            category: collection.category,
            chapterCount: chapters.length,
            nodeCount: graph && Array.isArray(graph.nodes) ? graph.nodes.length : 0,
            episodeCount,
            lessonIds,
        };
    }).sort((a, b) => (a.volumeNumber || 0) - (b.volumeNumber || 0));
    summaries.set(catalog, result);
    return result;
}

function groupBooks(books, strings, lang) {
    const definitions = [
        { label: strings.categoryHistory || (lang === 'en' ? 'History' : '역사'), match: b => b.category === 'history' || /^history-/.test(b.id) },
        { label: strings.authorMarx || '카를 마르크스', match: b => /^capital/.test(b.id) || /^marx-/.test(b.id) },
        { label: strings.authorEngels || '프리드리히 엥겔스', match: b => /^engels/.test(b.id) },
        { label: strings.authorLenin || '블라디미르 레닌', match: b => /^lenin/.test(b.id) },
    ];
    const assigned = new Set();
    const groups = definitions.map(def => {
        const items = books.filter(def.match);
        items.forEach(book => assigned.add(book.id));
        return { label: def.label, books: items };
    }).filter(group => group.books.length);
    const rest = books.filter(book => !assigned.has(book.id));
    if (rest.length) groups.push({ label: strings.authorOther || (lang === 'en' ? 'Other' : '그 외'), books: rest });
    return groups;
}

module.exports = { summarizeBooks, groupBooks };
