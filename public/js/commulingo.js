(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-data');
    if (!raw) return;

    var data = JSON.parse(raw.textContent);
    var lessons = flattenLessons(data);
    var storageKey = 'commulingo-progress-v1';
    var progress = loadLocalProgress();
    var active = null;
    var answered = false;

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
        next: document.getElementById('commuNextBtn')
    };

    syncServerProgress().finally(renderLessons);

    els.back.addEventListener('click', showLessons);
    els.next.addEventListener('click', function() {
        if (!active || !answered) return;
        if (els.next.getAttribute('data-finished') === '1') {
            els.next.removeAttribute('data-finished');
            showLessons();
            return;
        }
        if (active.index >= active.lesson.questions.length - 1) {
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
                        questions: lesson.questions || []
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
                        questions: [],
                        locked: true
                    });
                }
            });
        });
        return out;
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
            var section = document.createElement('section');
            section.className = 'commu-volume-section';
            section.innerHTML = [
                '<header class="commu-volume-header">',
                '<h2>' + escapeHtml(group.title) + '</h2>',
                '<p>' + group.lessons.length + ' ' + escapeHtml(strings.lessons || 'Lessons') + '</p>',
                '</header>',
                '<div class="commu-volume-body"></div>'
            ].join('');

            var body = section.querySelector('.commu-volume-body');
            groupPartLessons(group.lessons).forEach(function(part) {
                var partNode = document.createElement('section');
                partNode.className = 'commu-part-section';
                partNode.innerHTML = [
                    '<header class="commu-part-header">',
                    '<h3>' + escapeHtml(part.title) + '</h3>',
                    '<p>' + part.lessons.length + ' ' + escapeHtml(strings.lessons || 'Lessons') + '</p>',
                    '</header>',
                    '<div class="commu-volume-grid"></div>'
                ].join('');

                var grid = partNode.querySelector('.commu-volume-grid');
                part.lessons.forEach(function(lesson) {
                    grid.appendChild(createLessonCard(lesson));
                });
                body.appendChild(partNode);
            });
            els.list.appendChild(section);
        });
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
                byPart[key] = { title: part ? partTitle(part) : (strings.chapters || 'Chapters'), lessons: [] };
                groups.push(byPart[key]);
            }
            byPart[key].lessons.push(lesson);
        });
        return groups;
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

    function createLessonCard(lesson) {
        var item = progress[lesson.id];
        var percent = item && item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'commu-lesson-card';
        button.disabled = Boolean(lesson.locked || !lesson.questions.length);
        button.innerHTML = [
            '<div class="commu-lesson-title-row">',
            '<h2>' + escapeHtml(chapterTitle(lesson)) + '</h2>',
            '<span class="commu-level-badge ' + lessonLevelClass(lesson) + '">' + escapeHtml(lessonLevel(lesson)) + '</span>',
            '</div>',
            '<p class="commu-lesson-summary">' + escapeHtml(lessonSummary(lesson)) + '</p>',
            '<div class="commu-progress-track"><span style="width:' + percent + '%"></span></div>',
            '<div class="commu-lesson-meta"><span>' + lesson.questions.length + ' ' + escapeHtml(strings.questions || 'Questions') + '</span><span>' + lessonLabel(lesson, item) + '</span></div>'
        ].join('');
        button.addEventListener('click', function() { startLesson(lesson); });
        return button;
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

    function lessonLabel(lesson, item) {
        if (lesson.locked) return escapeHtml(strings.locked || 'Coming soon');
        if (item && item.completed) return escapeHtml(strings.completed || 'Completed');
        if (item) return escapeHtml(strings.continue || 'Continue');
        return escapeHtml(strings.start || 'Start');
    }

    function startLesson(lesson) {
        active = { lesson: lesson, index: 0, score: 0 };
        answered = false;
        els.list.classList.add('is-hidden');
        els.quiz.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        renderQuestion();
    }

    function showLessons() {
        active = null;
        answered = false;
        els.quiz.classList.add('is-hidden');
        els.list.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        renderLessons();
    }

    function renderQuestion() {
        var question = active.lesson.questions[active.index];
        var count = active.index + 1;
        els.count.textContent = count + ' / ' + active.lesson.questions.length;
        els.meter.style.width = Math.round((active.index / active.lesson.questions.length) * 100) + '%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        els.prompt.textContent = text(question.prompt);
        els.feedback.className = 'commu-feedback is-hidden';
        els.feedback.textContent = '';
        els.next.disabled = true;
        els.next.textContent = active.index >= active.lesson.questions.length - 1 ? (strings.finish || 'Finish') : (strings.next || 'Next');
        renderChoices(question);
    }

    function renderChoices(question) {
        els.choices.innerHTML = '';
        var choices = question.type === 'true_false'
            ? [lang === 'en' ? 'True' : '참', lang === 'en' ? 'False' : '거짓']
            : text(question.choices);
        choices.forEach(function(choice, index) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'commu-choice';
            button.textContent = choice;
            button.addEventListener('click', function() { chooseAnswer(question, index); });
            els.choices.appendChild(button);
        });
    }

    function chooseAnswer(question, index) {
        if (answered) return;
        answered = true;
        var correctIndex = question.type === 'true_false' ? (question.answer === true ? 0 : 1) : Number(question.answer);
        var correct = index === correctIndex;
        if (correct) active.score += 1;

        Array.prototype.forEach.call(els.choices.children, function(button, i) {
            button.disabled = true;
            if (i === correctIndex) button.classList.add('is-correct');
            if (i === index && !correct) button.classList.add('is-wrong');
        });

        els.feedback.className = 'commu-feedback' + (correct ? '' : ' is-wrong');
        els.feedback.textContent = (correct ? strings.correct : strings.incorrect) + ' ' + text(question.explanation);
        els.next.disabled = false;
        els.meter.style.width = Math.round(((active.index + 1) / active.lesson.questions.length) * 100) + '%';
    }

    function finishLesson() {
        var item = {
            completed: true,
            score: active.score,
            totalQuestions: active.lesson.questions.length,
            updatedAt: new Date().toISOString()
        };
        progress[active.lesson.id] = mergeOne(progress[active.lesson.id], item);
        saveLocalProgress();
        postProgress(active.lesson.id, progress[active.lesson.id], false);

        els.prompt.textContent = strings.allDone || 'Lesson complete';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        els.choices.innerHTML = '';
        els.feedback.className = 'commu-feedback';
        els.feedback.textContent = (strings.score || 'Score') + ': ' + active.score + ' / ' + active.lesson.questions.length;
        els.next.disabled = false;
        els.next.textContent = strings.backToLessons || 'Lessons';
        els.next.setAttribute('data-finished', '1');
        answered = true;
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
