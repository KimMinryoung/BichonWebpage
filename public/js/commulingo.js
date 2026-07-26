(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-data');
    if (!raw) return;

    var data = JSON.parse(raw.textContent);
    var lessons = flattenLessons(data);
    var storageKey = 'commulingo-progress-v1';
    var lastKey = 'commulingo-last-v1';
    var progress = loadLocalProgress();
    var lessonDetails = {};
    var active = null;
    var answered = false;
    var returnScrollLesson = null;

    var els = {
        list: document.getElementById('commuLessonList'),
        quiz: document.getElementById('commuQuiz'),
        status: document.getElementById('commuSyncStatus'),
        total: document.getElementById('commuProgressText'),
        back: document.getElementById('commuBackBtn'),
        count: document.getElementById('commuQuestionCount'),
        meter: document.getElementById('commuMeterFill'),
        lessonTitle: document.getElementById('commuLessonTitle'),
        prompt: document.getElementById('commuPrompt'),
        choices: document.getElementById('commuChoices'),
        feedback: document.getElementById('commuFeedback'),
        focus: document.getElementById('commuFocus'),
        intro: document.getElementById('commuIntro'),
        introTitle: document.getElementById('commuIntroTitle'),
        introSummary: document.getElementById('commuIntroSummary'),
        introFocus: document.getElementById('commuIntroFocus'),
        diagram: document.getElementById('commuDiagram'),
        next: document.getElementById('commuNextBtn'),
        nextLesson: document.getElementById('commuNextLessonBtn')
    };

    syncServerProgress().finally(function() {
        renderLessons();
        handleDeepLink();
    });

    els.back.addEventListener('click', function() {
        showLessons(scrollTargetForLesson(active && active.lesson || returnScrollLesson, false));
    });
    if (els.nextLesson) {
        els.nextLesson.addEventListener('click', function() {
            var lesson = els.nextLesson.commuNextLesson;
            if (lesson) startLesson(lesson);
        });
    }
    els.next.addEventListener('click', function() {
        var finishedAction = els.next.getAttribute('data-finished');
        if (finishedAction === '1') {
            var finishedLesson = active && active.lesson || returnScrollLesson;
            els.next.removeAttribute('data-finished');
            showLessons(scrollTargetForLesson(finishedLesson, true));
            return;
        }
        if (!active) return;
        if (active.intro) {
            active.intro = false;
            answered = false;
            renderQuestion();
            return;
        }
        if (!answered) return;
        if (finishedAction === 'retry') {
            var retryLesson = active.lesson;
            els.next.removeAttribute('data-finished');
            startLesson(retryLesson);
            return;
        }
        if (active.index >= lessonQuestionCount(active.lesson) - 1) {
            finishLesson();
            return;
        }
        active.index += 1;
        answered = false;
        renderQuestion();
    });

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    var capitalParts = {
        'capital-vol1': [
            { key: 'v1-p1', start: 1, end: 3, ko: '제1편 상품과 화폐', en: 'Part I: Commodities and Money' },
            { key: 'v1-p2', start: 4, end: 6, ko: '제2편 화폐의 자본으로의 전환', en: 'Part II: The Transformation of Money into Capital' },
            { key: 'v1-p3', start: 7, end: 11, ko: '제3편 절대적 잉여가치의 생산', en: 'Part III: The Production of Absolute Surplus-Value' },
            { key: 'v1-p4', start: 12, end: 15, ko: '제4편 상대적 잉여가치의 생산', en: 'Part IV: Production of Relative Surplus-Value' },
            { key: 'v1-p5', start: 16, end: 18, ko: '제5편 절대적 및 상대적 잉여가치의 생산', en: 'Part V: The Production of Absolute and Relative Surplus-Value' },
            { key: 'v1-p6', start: 19, end: 22, ko: '제6편 임금', en: 'Part VI: Wages' },
            { key: 'v1-p7', start: 23, end: 25, ko: '제7편 자본의 축적과정', en: 'Part VII: The Accumulation of Capital' },
            { key: 'v1-p8', start: 26, end: 33, ko: '제8편 이른바 원시적 축적', en: 'Part VIII: Primitive Accumulation' }
        ],
        'capital-vol2': [
            { key: 'v2-p1', start: 1, end: 6, ko: '제1편 자본의 변태와 그 순환', en: 'Part I: The Metamorphoses of Capital and Their Circuits' },
            { key: 'v2-p2', start: 7, end: 17, ko: '제2편 자본의 회전', en: 'Part II: The Turnover of Capital' },
            { key: 'v2-p3', start: 18, end: 21, ko: '제3편 사회적 총자본의 재생산과 유통', en: 'Part III: The Reproduction and Circulation of the Aggregate Social Capital' }
        ],
        'capital-vol3': [
            { key: 'v3-p1', start: 1, end: 7, ko: '제1편 잉여가치의 이윤으로의 전환과 잉여가치율의 이윤율로의 전환', en: 'Part I: The Conversion of Surplus-Value into Profit and of the Rate of Surplus-Value into the Rate of Profit' },
            { key: 'v3-p2', start: 8, end: 12, ko: '제2편 이윤의 평균이윤으로의 전환', en: 'Part II: Conversion of Profit into Average Profit' },
            { key: 'v3-p3', start: 13, end: 15, ko: '제3편 이윤율 저하 경향의 법칙', en: 'Part III: The Law of the Tendency of the Rate of Profit to Fall' },
            { key: 'v3-p4', start: 16, end: 20, ko: '제4편 상품자본과 화폐자본의 상품거래자본과 화폐거래자본으로의 전환', en: 'Part IV: Conversion of Commodity-Capital and Money-Capital into Commercial Capital and Money-Dealing Capital' },
            { key: 'v3-p5', start: 21, end: 36, ko: '제5편 이윤의 이자와 기업가이득으로의 분할, 이자 낳는 자본', en: 'Part V: Division of Profit into Interest and Profit of Enterprise. Interest-Bearing Capital' },
            { key: 'v3-p6', start: 37, end: 47, ko: '제6편 초과이윤의 지대로의 전환', en: 'Part VI: Transformation of Surplus-Profit into Ground-Rent' },
            { key: 'v3-p7', start: 48, end: 52, ko: '제7편 수입과 그 원천', en: 'Part VII: Revenues and Their Sources' }
        ]
    };

    function flattenLessons(bundle) {
        var out = [];
        (bundle.collections || []).forEach(function(collection) {
            (collection.chapters || []).forEach(function(chapter) {
                (chapter.lessons || []).forEach(function(lesson) {
                    out.push({
                        id: lesson.id,
                        collectionId: collection.id,
                        collectionTitle: text(collection.title),
                        chapterNumber: chapter.chapterNumber,
                        chapterTitle: text(chapter.title),
                        title: text(lesson.title),
                        summary: text(chapter.summary),
                        focus: text(chapter.learningFocus),
                        // Linked by the book route; absent on an older payload,
                        // in which case the renderers escape the plain fields.
                        summaryHtml: text(chapter.summaryHtml),
                        focusHtml: text(chapter.focusHtml),
                        questions: lesson.questions || null,
                        questionCount: lessonQuestionCount(lesson)
                    });
                });
                if (!(chapter.lessons || []).length) {
                    out.push({
                        id: chapter.id + '-locked',
                        collectionId: collection.id,
                        collectionTitle: text(collection.title),
                        chapterNumber: chapter.chapterNumber,
                        chapterTitle: text(chapter.title),
                        title: text(chapter.title),
                        summary: text(chapter.summary),
                        focus: text(chapter.learningFocus),
                        // Linked by the book route; absent on an older payload,
                        // in which case the renderers escape the plain fields.
                        summaryHtml: text(chapter.summaryHtml),
                        focusHtml: text(chapter.focusHtml),
                        questions: null,
                        questionCount: 0,
                        locked: true
                    });
                }
            });
        });
        return out;
    }

    function lessonQuestionCount(lesson) {
        if (!lesson) return 0;
        if (Array.isArray(lesson.questions)) return lesson.questions.length;
        return Number(lesson.questionCount) || 0;
    }

    function lessonDetailUrl(lessonId) {
        var version = data.version ? '?v=' + encodeURIComponent(data.version) : '';
        return '/commulingo/lesson/' + encodeURIComponent(lessonId) + version;
    }

    function loadLessonDetail(lesson) {
        if (lessonDetails[lesson.id]) return Promise.resolve(lessonDetails[lesson.id]);
        if (Array.isArray(lesson.questions) && lessonQuestionCount(lesson) && (lesson.conceptBrief || lesson.conceptMap)) return Promise.resolve(lesson);
        return fetch(lessonDetailUrl(lesson.id), { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('lesson load failed');
                return res.json();
            })
            .then(function(payload) {
                var loaded = payload.lesson || {};
                var merged = Object.assign({}, lesson, {
                    collectionId: loaded.collectionId || lesson.collectionId,
                    collectionTitle: text(loaded.collectionTitle) || lesson.collectionTitle,
                    chapterNumber: loaded.chapterNumber || lesson.chapterNumber,
                    chapterTitle: text(loaded.chapterTitle) || lesson.chapterTitle,
                    title: text(loaded.title) || lesson.title,
                    summary: text(loaded.summary) || lesson.summary,
                    focus: text(loaded.focus) || lesson.focus,
                    summaryHtml: text(loaded.summaryHtml) || lesson.summaryHtml,
                    focusHtml: text(loaded.focusHtml) || lesson.focusHtml,
                    conceptBrief: loaded.conceptBrief || lesson.conceptBrief,
                    conceptMap: loaded.conceptMap || lesson.conceptMap,
                    questions: loaded.questions || [],
                    questionCount: lessonQuestionCount(loaded)
                });
                lessonDetails[lesson.id] = merged;
                Object.assign(lesson, merged);
                return merged;
            });
    }

    function loadLocalProgress() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (err) {
            return {};
        }
    }

    function saveLocalProgress() {
        localStorage.setItem(storageKey, JSON.stringify(progress));
    }

    function saveLast(lesson) {
        if (!lesson) return;
        try {
            localStorage.setItem(lastKey, JSON.stringify({
                lessonId: lesson.id,
                collectionId: lesson.collectionId,
                collectionTitle: lesson.collectionTitle,
                chapterNumber: lesson.chapterNumber,
                chapterTitle: lesson.chapterTitle,
                title: lesson.title,
                updatedAt: new Date().toISOString()
            }));
        } catch (err) {}
    }

    function mergeProgress(items) {
        (items || []).forEach(function(item) {
            progress[item.lessonId] = mergeOne(progress[item.lessonId], {
                completed: item.completed,
                score: item.score,
                totalQuestions: item.totalQuestions,
                updatedAt: item.updatedAt
            });
        });
        saveLocalProgress();
    }

    function syncServerProgress() {
        return fetch('/commulingo/progress', { credentials: 'same-origin' })
            .then(function(res) { return res.ok ? res.json() : { authenticated: false }; })
            .then(function(payload) {
                if (!payload.authenticated) return;
                mergeProgress(payload.progress || []);
                Object.keys(progress).forEach(function(lessonId) {
                    postProgress(lessonId, progress[lessonId], true);
                });
            })
            .catch(function() {});
    }

    function postProgress(lessonId, item, quiet) {
        var tokenMeta = document.querySelector('meta[name="csrf-token"]');
        var token = tokenMeta ? tokenMeta.getAttribute('content') : '';
        if (!token) return Promise.resolve();
        return fetch('/commulingo/progress', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': token
            },
            body: JSON.stringify({
                lessonId: lessonId,
                completed: Boolean(item.completed),
                score: Number(item.score) || 0,
                totalQuestions: Number(item.totalQuestions) || 0
            })
        }).then(function(res) {
            if (res.ok && !quiet && els.status) els.status.textContent = strings.syncSaved || 'Progress saved';
        }).catch(function() {});
    }

    function renderLessons() {
        var playable = lessons.filter(function(lesson) { return !lesson.locked; });
        var completeCount = playable.filter(function(lesson) {
            return progress[lesson.id] && progress[lesson.id].completed;
        }).length;
        els.total.textContent = Math.round((completeCount / (playable.length || 1)) * 100) + '%';
        els.list.innerHTML = '';

        groupLessons().forEach(function(group) {
            groupPartLessons(group.lessons).forEach(function(part) {
                var partNode = document.createElement('section');
                partNode.className = 'commu-part-section';
                partNode.innerHTML = [
                    '<header class="commu-part-header">',
                    '<h3>' + escapeHtml(part.title) + '</h3>',
                    '<p>' + escapeHtml(chapterCountLabel(part.chapters.length)) + '</p>',
                    '</header>',
                    '<div class="commu-volume-grid"></div>'
                ].join('');

                var grid = partNode.querySelector('.commu-volume-grid');
                part.chapters.forEach(function(chapter) {
                    grid.appendChild(createChapterCard(chapter));
                });
                els.list.appendChild(partNode);
            });
        });
    }

    function chapterCountLabel(count) {
        return count + ' ' + (lang === 'en' ? 'Chapters' : '챕터');
    }

    function groupLessons() {
        var groups = [];
        var byCollection = {};
        lessons.forEach(function(lesson) {
            var key = lesson.collectionId || lesson.collectionTitle || '';
            if (!byCollection[key]) {
                byCollection[key] = { id: lesson.collectionId, title: lesson.collectionTitle, lessons: [] };
                groups.push(byCollection[key]);
            }
            byCollection[key].lessons.push(lesson);
        });
        return groups;
    }

    function groupPartLessons(items) {
        var groups = [];
        var byPart = {};
        items.forEach(function(lesson) {
            var part = findPart(lesson);
            var key = part ? part.key : 'chapters';
            if (!byPart[key]) {
                byPart[key] = { title: part ? partTitle(part) : (strings.chapters || 'Chapters'), chapters: [] };
                groups.push(byPart[key]);
            }
            byPart[key].chapters = groupChapterLessons(byPart[key].chapters, lesson);
        });
        return groups;
    }

    function groupChapterLessons(chapters, lesson) {
        var key = [lesson.collectionId, lesson.chapterNumber, lesson.chapterTitle].join(':');
        var chapter = null;
        for (var i = 0; i < chapters.length; i += 1) {
            if (chapters[i].key === key) {
                chapter = chapters[i];
                break;
            }
        }
        if (!chapter) {
            chapter = {
                key: key,
                collectionId: lesson.collectionId,
                collectionTitle: lesson.collectionTitle,
                chapterNumber: lesson.chapterNumber,
                chapterTitle: lesson.chapterTitle,
                summary: lesson.summary,
                focus: lesson.focus,
                summaryHtml: lesson.summaryHtml,
                focusHtml: lesson.focusHtml,
                lessons: []
            };
            chapters.push(chapter);
        }
        chapter.lessons.push(lesson);
        return chapters;
    }

    function findPart(lesson) {
        var definitions = capitalParts[lesson.collectionId] || [];
        var chapter = Number(lesson.chapterNumber) || 0;
        for (var i = 0; i < definitions.length; i += 1) {
            var part = definitions[i];
            if (chapter >= part.start && chapter <= part.end) return part;
        }
        return null;
    }

    function partTitle(part) {
        return lang === 'en' ? part.en : part.ko;
    }

    function chapterScrollKey(lesson) {
        if (!lesson) return '';
        return [
            lesson.collectionId || '',
            lesson.chapterNumber || '',
            lesson.chapterTitle || ''
        ].join('::');
    }

    function scrollTargetForLesson(lesson, advanceAfterAdvanced) {
        if (!lesson) return '';
        if (advanceAfterAdvanced && isAdvancedLesson(lesson)) {
            return nextChapterScrollKey(lesson) || chapterScrollKey(lesson);
        }
        return chapterScrollKey(lesson);
    }

    function nextChapterScrollKey(lesson) {
        var current = Number(lesson && lesson.chapterNumber) || 0;
        var collectionId = lesson && lesson.collectionId;
        var next = null;
        lessons.forEach(function(item) {
            if (item.locked || item.collectionId !== collectionId) return;
            var chapterNumber = Number(item.chapterNumber) || 0;
            if (chapterNumber <= current) return;
            if (!next || chapterNumber < Number(next.chapterNumber)) next = item;
        });
        return chapterScrollKey(next);
    }

    function scrollToChapter(scrollKey) {
        if (!scrollKey) return;
        window.requestAnimationFrame(function() {
            var cards = els.list.querySelectorAll('[data-commu-chapter-key]');
            var target = null;
            for (var i = 0; i < cards.length; i += 1) {
                if (cards[i].getAttribute('data-commu-chapter-key') === scrollKey) {
                    target = cards[i];
                    break;
                }
            }
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function createChapterCard(chapter) {
        var card = document.createElement('article');
        card.className = 'commu-chapter-card';
        card.setAttribute('data-commu-chapter-key', chapterScrollKey(chapter));
        card.innerHTML = [
            '<div class="commu-lesson-title-row">',
            '<h2>' + escapeHtml(chapterTitle(chapter)) + '</h2>',
            '</div>',
            '<p class="commu-lesson-summary">' + (chapter.summaryHtml || escapeHtml(lessonSummary(chapter))) + '</p>',
            chapter.focus ? '<p class="commu-lesson-focus">' + (chapter.focusHtml || escapeHtml(chapter.focus)) + '</p>' : '',
            '<div class="commu-chapter-actions"></div>'
        ].join('');
        var actions = card.querySelector('.commu-chapter-actions');
        chapter.lessons.forEach(function(lesson) {
            actions.appendChild(createLessonAction(lesson));
        });
        return card;
    }

    function createLessonAction(lesson) {
        var item = progress[lesson.id];
        var percent = item && item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'commu-lesson-action ' + lessonLevelClass(lesson) + (item && item.completed ? ' is-completed' : '');
        button.disabled = Boolean(lesson.locked || !lessonQuestionCount(lesson));
        button.innerHTML = [
            '<span class="commu-lesson-action-body">',
            '<span class="commu-lesson-action-top">',
            '<strong>' + escapeHtml(lessonActionTitle(lesson)) + '</strong>',
            '<span>' + lessonQuestionCount(lesson) + ' ' + escapeHtml(strings.questions || 'Questions') + '</span>',
            '</span>',
            '<span class="commu-progress-track"><span style="width:' + percent + '%"></span></span>',
            '<span class="commu-lesson-meta"><span>' + escapeHtml(lessonLabel(lesson, item)) + '</span><span>' + escapeHtml(startLessonLabel(lesson)) + '</span></span>',
            '</span>'
        ].join('');
        button.addEventListener('click', function() { startLesson(lesson); });
        return button;
    }


    function lessonActionTitle(lesson) {
        return lessonLevel(lesson);
    }

    function startLessonLabel(lesson) {
        return isAdvancedLesson(lesson) ? (lang === 'en' ? 'Start advanced' : '심화 학습 시작') : (lang === 'en' ? 'Start basics' : '기본 학습 시작');
    }

    function chapterTitle(lesson) {
        var number = lesson.chapterNumber ? (lang === 'en' ? 'Chapter ' + lesson.chapterNumber + ': ' : lesson.chapterNumber + '장 ') : '';
        return number + lesson.chapterTitle;
    }

    function isAdvancedLesson(lesson) {
        var title = lesson.title || '';
        return (lesson.id || '').indexOf('-advanced') !== -1 || /심화$/.test(title) || /Advanced$/.test(title);
    }

    function lessonLevel(lesson) {
        return isAdvancedLesson(lesson) ? (lang === 'en' ? 'Advanced' : '심화') : (lang === 'en' ? 'Basics' : '기본');
    }

    function lessonLevelClass(lesson) {
        return isAdvancedLesson(lesson) ? 'is-advanced' : 'is-basic';
    }

    function lessonSummary(lesson) {
        return (lesson.summary || '')
            .replace(new RegExp('^' + escapeRegExp(String(lesson.chapterNumber || '')) + '장\\s*[「\"]?' + escapeRegExp(lesson.chapterTitle) + '[」\"]?[:：]\\s*'), '')
            .replace(new RegExp('^Chapter\\s+' + escapeRegExp(String(lesson.chapterNumber || '')) + ':?\\s*' + escapeRegExp(lesson.chapterTitle) + '[:：]\\s*', 'i'), '');
    }

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function introFallback(lesson) {
        var part = findPart(lesson);
        if (!part) return lessonSummary(lesson);
        var title = partTitle(part).replace(/^제\d+편\s*/, '').replace(/^Part\s+[IVX]+:\s*/, '');
        return lang === 'en' ? 'This lesson sits inside ' + title + ', so read the question as one step in that larger argument.' : '이 장은 ' + title + ' 안의 한 단계입니다. 문제를 풀 때 개별 개념이 앞뒤 논의와 어떻게 이어지는지 함께 보세요.';
    }

    function conceptMap(lesson) {
        var dataMap = lesson.conceptMap;
        if (dataMap && Array.isArray(dataMap.ko) && Array.isArray(dataMap.en)) return dataMap;
        return { ko: [], en: [] };
    }

    function conceptBrief(lesson) {
        var brief = lesson.conceptBrief || {};
        var preferred = brief[lang === 'en' ? 'en' : 'ko'] || brief.ko || brief.en;
        return Array.isArray(preferred) ? preferred : [];
    }

    // textHtml / itemsHtml arrive from /commulingo/lesson already escaped and
    // linked to the people and glossary dictionaries. A payload cached before
    // that route linked anything carries only the plain fields, so both paths
    // stay.
    function renderBriefSection(section) {
        var html = '<section class="commu-brief-section">';
        if (section.title) html += '<h3>' + escapeHtml(section.title) + '</h3>';
        if (section.textHtml) html += '<p>' + section.textHtml + '</p>';
        else if (section.text) html += '<p>' + escapeHtml(section.text) + '</p>';
        var items = Array.isArray(section.itemsHtml) && section.itemsHtml.length
            ? section.itemsHtml
            : (Array.isArray(section.items) ? section.items.map(escapeHtml) : []);
        if (items.length) {
            html += '<ul>' + items.map(function(item) {
                return '<li>' + item + '</li>';
            }).join('') + '</ul>';
        }
        return html + '</section>';
    }

    function renderDiagram(lesson) {
        if (!els.diagram) return;
        var sections = conceptBrief(lesson);
        if (sections.length) {
            els.diagram.innerHTML = '<div class="commu-brief">' + sections.map(renderBriefSection).join('') + '</div>';
            return;
        }
        var nodes = conceptMap(lesson)[lang === 'en' ? 'en' : 'ko'];
        els.diagram.innerHTML = nodes.map(function(node) {
            return '<span class="commu-diagram-node"><strong>' + escapeHtml(node.title) + '</strong><small>' + (node.textHtml || escapeHtml(node.text)) + '</small></span>';
        }).join('');
    }

    function lessonLabel(lesson, item) {
        if (lesson.locked) return escapeHtml(strings.locked || 'Coming soon');
        if (item && item.totalQuestions) {
            return escapeHtml((strings.score || 'Score') + ' ' + item.score + ' / ' + item.totalQuestions);
        }
        if (item && item.completed) return escapeHtml(strings.completed || 'Completed');
        if (item) return escapeHtml(strings.continue || 'Continue');
        return escapeHtml(strings.start || 'Start');
    }

    function startLesson(lesson) {
        returnScrollLesson = lesson;
        saveLast(lesson);
        answered = false;
        hideNextLesson();
        els.list.classList.add('is-hidden');
        els.quiz.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        renderLoadingLesson(lesson);
        loadLessonDetail(lesson)
            .then(function(loadedLesson) {
                active = { lesson: loadedLesson, index: 0, score: 0, streak: 0, intro: true };
                renderIntro();
            })
            .catch(function() {
                active = null;
                els.lessonTitle.textContent = chapterTitle(lesson);
                els.prompt.textContent = lang === 'en' ? 'Could not load this lesson. Please try again.' : '문제를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.';
                els.prompt.classList.remove('is-hidden');
                if (els.intro) els.intro.classList.add('is-hidden');
                if (els.focus) els.focus.classList.add('is-hidden');
                els.choices.classList.add('is-hidden');
                els.feedback.className = 'commu-feedback is-hidden';
                els.next.disabled = false;
                els.next.textContent = strings.backToLessons || 'Lessons';
                els.next.setAttribute('data-finished', '1');
            });
    }

    function renderLoadingLesson(lesson) {
        active = null;
        els.count.textContent = '0 / ' + lessonQuestionCount(lesson);
        els.meter.style.width = '0%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(lesson) + '">' + escapeHtml(lessonLevel(lesson)) + '</span>';
        if (els.intro) els.intro.classList.add('is-hidden');
        if (els.focus) els.focus.classList.add('is-hidden');
        els.prompt.textContent = lang === 'en' ? 'Loading questions...' : '문제를 불러오는 중입니다...';
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.add('is-hidden');
        els.feedback.className = 'commu-feedback is-hidden';
        els.next.disabled = true;
        els.next.textContent = strings.next || 'Next';
    }

    function renderIntro() {
        els.count.textContent = '0 / ' + lessonQuestionCount(active.lesson);
        els.meter.style.width = '0%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.intro) els.intro.classList.remove('is-hidden');
        if (els.focus) els.focus.classList.add('is-hidden');
        els.prompt.classList.add('is-hidden');
        els.choices.classList.add('is-hidden');
        els.feedback.className = 'commu-feedback is-hidden';
        if (els.introTitle) els.introTitle.textContent = lang === 'en' ? 'Concept brief before the quiz' : '문제를 풀기 전, 개념 먼저 잡기';
        if (els.introSummary) els.introSummary.innerHTML = active.lesson.summaryHtml || escapeHtml(lessonSummary(active.lesson));
        if (els.introFocus) {
            els.introFocus.innerHTML = active.lesson.focusHtml
                || escapeHtml(active.lesson.focus || introFallback(active.lesson));
        }
        renderDiagram(active.lesson);
        els.next.disabled = false;
        els.next.textContent = lang === 'en' ? 'Start questions' : '문제 풀기';
    }

    function showLessons(scrollTarget) {
        scrollTarget = scrollTarget || scrollTargetForLesson(active && active.lesson || returnScrollLesson, false);
        active = null;
        answered = false;
        hideNextLesson();
        els.quiz.classList.add('is-hidden');
        els.list.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        renderLessons();
        scrollToChapter(scrollTarget);
    }

    function hideNextLesson() {
        if (!els.nextLesson) return;
        els.nextLesson.classList.add('is-hidden');
        els.nextLesson.commuNextLesson = null;
    }

    function showNextLesson(lesson) {
        if (!els.nextLesson || !lesson) return;
        els.nextLesson.commuNextLesson = lesson;
        els.nextLesson.textContent = (strings.nextLesson || (lang === 'en' ? 'Next lesson' : '다음 레슨')) + ' · ' + chapterTitle(lesson) + ' (' + lessonLevel(lesson) + ')';
        els.nextLesson.classList.remove('is-hidden');
    }

    function lessonsInChapter(collectionId, chapterNumber) {
        return lessons.filter(function(item) {
            return !item.locked
                && item.collectionId === collectionId
                && Number(item.chapterNumber) === Number(chapterNumber)
                && lessonQuestionCount(item);
        });
    }

    function nextLessonFor(lesson) {
        if (!lesson) return null;
        if (!isAdvancedLesson(lesson)) {
            var advanced = lessonsInChapter(lesson.collectionId, lesson.chapterNumber).filter(isAdvancedLesson)[0];
            if (advanced && advanced.id !== lesson.id) return advanced;
        }
        var current = Number(lesson.chapterNumber) || 0;
        var next = null;
        lessons.forEach(function(item) {
            if (item.locked || item.collectionId !== lesson.collectionId || !lessonQuestionCount(item)) return;
            var chapterNumber = Number(item.chapterNumber) || 0;
            if (chapterNumber <= current) return;
            if (!next) { next = item; return; }
            var nextChapter = Number(next.chapterNumber) || 0;
            if (chapterNumber < nextChapter) { next = item; return; }
            if (chapterNumber === nextChapter && isAdvancedLesson(next) && !isAdvancedLesson(item)) next = item;
        });
        return next;
    }

    function handleDeepLink() {
        var match = /(?:^|[#&])lesson=([^&]+)/.exec(window.location.hash || '');
        if (!match) return;
        var lessonId = decodeURIComponent(match[1]);
        var target = lessons.filter(function(item) { return item.id === lessonId && !item.locked && lessonQuestionCount(item); })[0];
        if (target) startLesson(target);
    }

    function renderQuestion() {
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        var question = active.lesson.questions[active.index];
        var count = active.index + 1;
        els.count.textContent = count + ' / ' + lessonQuestionCount(active.lesson);
        els.meter.style.width = Math.round((active.index / lessonQuestionCount(active.lesson)) * 100) + '%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.focus) {
            els.focus.textContent = active.lesson.focus || '';
            els.focus.classList.toggle('is-hidden', !active.lesson.focus);
        }
        els.prompt.textContent = text(question.prompt);
        els.feedback.className = 'commu-feedback is-hidden';
        els.feedback.textContent = '';
        els.quiz.classList.remove('has-answer-reward', 'has-perfect-reward');
        els.next.disabled = true;
        els.next.textContent = active.index >= lessonQuestionCount(active.lesson) - 1 ? (strings.finish || 'Finish') : (strings.next || 'Next');
        renderChoices(question);
    }

    function renderChoices(question) {
        els.choices.innerHTML = '';
        var choices = shuffleChoices((question.type === 'true_false'
            ? [lang === 'en' ? 'True' : '참', lang === 'en' ? 'False' : '거짓']
            : text(question.choices)).map(function(choice, index) {
                return { label: choice, originalIndex: index };
            }));
        choices.forEach(function(choice) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'commu-choice';
            button.textContent = choice.label;
            button.setAttribute('data-original-index', String(choice.originalIndex));
            button.addEventListener('click', function() { chooseAnswer(question, choice.originalIndex); });
            els.choices.appendChild(button);
        });
    }

    function shuffleChoices(choices) {
        var shuffled = choices.slice();
        for (var i = shuffled.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    function chooseAnswer(question, index) {
        if (answered) return;
        answered = true;
        var correctIndex = question.type === 'true_false' ? (question.answer === true ? 0 : 1) : Number(question.answer);
        var correct = index === correctIndex;
        if (correct) {
            active.score += 1;
            active.streak += 1;
        } else {
            active.streak = 0;
        }

        Array.prototype.forEach.call(els.choices.children, function(button) {
            var originalIndex = Number(button.getAttribute('data-original-index'));
            button.disabled = true;
            if (originalIndex === correctIndex) button.classList.add('is-correct');
            if (originalIndex === index && !correct) button.classList.add('is-wrong');
        });

        els.feedback.className = 'commu-feedback' + (correct ? '' : ' is-wrong');
        els.feedback.innerHTML = feedbackHtml(question, index, correct);
        if (correct) showAnswerReward();
        els.next.disabled = false;
        els.meter.style.width = Math.round(((active.index + 1) / lessonQuestionCount(active.lesson)) * 100) + '%';
    }

    function feedbackHtml(question, index, correct) {
        var selectedFeedback = choiceFeedback(question, index);
        // The explanation is shown only after the question has been answered,
        // which is why it carries dictionary links where the prompt and the
        // choices do not.
        var explanation = text(question.explanationHtml) || escapeHtml(text(question.explanation));
        var parts = [
            '<strong class="commu-feedback-marker">' + escapeHtml(correct ? strings.correct : strings.incorrect) + '</strong>',
            '<span>' + explanation + '</span>'
        ];
        if (selectedFeedback) {
            parts.push('<span class="commu-choice-feedback">' + escapeHtml(selectedFeedback) + '</span>');
        }
        if (correct && active && active.streak >= 3) {
            parts.push('<span class="commu-streak-badge">' + escapeHtml(streakLabel(active.streak)) + '</span>');
        }
        return parts.join('');
    }

    function choiceFeedback(question, index) {
        var feedback = question && question.choiceFeedback;
        if (!feedback) return '';
        var localized = feedback[lang] || feedback.ko || feedback.en;
        if (!Array.isArray(localized)) return '';
        return localized[index] || '';
    }

    function streakLabel(streak) {
        return lang === 'en' ? streak + ' in a row' : streak + '연속 정답';
    }

    function showAnswerReward() {
        if (!els.quiz) return;
        els.quiz.classList.remove('has-answer-reward');
        void els.quiz.offsetWidth;
        els.quiz.classList.add('has-answer-reward');
    }

    function finishLesson() {
        var item = {
            completed: active.score === lessonQuestionCount(active.lesson),
            score: active.score,
            totalQuestions: lessonQuestionCount(active.lesson),
            updatedAt: new Date().toISOString()
        };
        progress[active.lesson.id] = mergeOne(progress[active.lesson.id], item);
        saveLocalProgress();
        postProgress(active.lesson.id, progress[active.lesson.id], false);
        saveLast(active.lesson);

        els.prompt.textContent = strings.allDone || 'Lesson complete';
        if (els.focus) els.focus.classList.add('is-hidden');
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        els.choices.innerHTML = '';
        var perfect = active.score === lessonQuestionCount(active.lesson);
        els.feedback.className = 'commu-feedback' + (perfect ? ' is-perfect' : '');
        els.feedback.innerHTML = finishFeedbackHtml(perfect);
        els.quiz.classList.toggle('has-perfect-reward', perfect);
        els.next.disabled = false;
        if (!perfect) {
            els.next.textContent = strings.tryAgain || 'Try again';
            els.next.setAttribute('data-finished', 'retry');
        } else {
            els.next.textContent = strings.backToLessons || 'Lessons';
            els.next.setAttribute('data-finished', '1');
        }
        var recommended = nextLessonFor(active.lesson);
        if (recommended) showNextLesson(recommended);
        else hideNextLesson();
        answered = true;
    }

    function finishFeedbackHtml(perfect) {
        var score = (strings.score || 'Score') + ': ' + active.score + ' / ' + lessonQuestionCount(active.lesson);
        if (!perfect) return '<strong class="commu-feedback-marker">' + escapeHtml(score) + '</strong>';
        var label = lang === 'en' ? 'Perfect lesson' : '만점 완료';
        var note = lang === 'en' ? 'The full concept path is clear enough to move on.' : '이 장의 기본 개념 흐름을 안정적으로 잡았습니다.';
        return [
            '<strong class="commu-feedback-marker">' + escapeHtml(label) + '</strong>',
            '<span>' + escapeHtml(score) + '</span>',
            '<span class="commu-choice-feedback">' + escapeHtml(note) + '</span>'
        ].join('');
    }

    function mergeOne(existing, incoming) {
        existing = existing || {};
        return {
            completed: Boolean(existing.completed || incoming.completed),
            score: Math.max(Number(existing.score) || 0, Number(incoming.score) || 0),
            totalQuestions: Math.max(Number(existing.totalQuestions) || 0, Number(incoming.totalQuestions) || 0),
            updatedAt: incoming.updatedAt || existing.updatedAt || new Date().toISOString()
        };
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
