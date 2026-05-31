(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-data');
    if (!raw) return;

    var data = JSON.parse(raw.textContent);
    var lessons = flattenLessons(data);
    var storageKey = 'commulingo-progress-v1';
    var expandedKey = 'commulingo-expanded-collection-v1';
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
        focus: document.getElementById('commuFocus'),
        intro: document.getElementById('commuIntro'),
        introTitle: document.getElementById('commuIntroTitle'),
        introSummary: document.getElementById('commuIntroSummary'),
        introFocus: document.getElementById('commuIntroFocus'),
        diagram: document.getElementById('commuDiagram'),
        next: document.getElementById('commuNextBtn')
    };

    syncServerProgress().finally(renderLessons);

    els.back.addEventListener('click', showLessons);
    els.next.addEventListener('click', function() {
        if (!active) return;
        if (active.intro) {
            active.intro = false;
            answered = false;
            renderQuestion();
            return;
        }
        if (!answered) return;
        var finishedAction = els.next.getAttribute('data-finished');
        if (finishedAction === 'retry') {
            var retryLesson = active.lesson;
            els.next.removeAttribute('data-finished');
            startLesson(retryLesson);
            return;
        }
        if (finishedAction === '1') {
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
                        focus: text(chapter.learningFocus),
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
                        focus: text(chapter.learningFocus),
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

    function loadExpandedCollection() {
        try {
            return localStorage.getItem(expandedKey) || '';
        } catch (err) {
            return '';
        }
    }

    function saveExpandedCollection(collectionId) {
        try {
            if (collectionId) localStorage.setItem(expandedKey, collectionId);
            else localStorage.removeItem(expandedKey);
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

        var expandedCollection = loadExpandedCollection();
        groupLessons().forEach(function(group) {
            var expanded = expandedCollection === group.id;
            var section = document.createElement('section');
            section.className = 'commu-volume-section' + (expanded ? ' is-expanded' : ' is-collapsed');
            section.innerHTML = [
                '<header class="commu-volume-header">',
                '<button type="button" class="commu-volume-toggle" aria-expanded="' + (expanded ? 'true' : 'false') + '">',
                '<span><strong>' + escapeHtml(group.title) + '</strong><small>' + escapeHtml(chapterCountLabel(countChapters(group.lessons))) + '</small></span>',
                '<span class="commu-volume-toggle-icon" aria-hidden="true">' + (expanded ? '−' : '+') + '</span>',
                '</button>',
                '</header>',
                '<div class="commu-volume-body' + (expanded ? '' : ' is-hidden') + '"></div>'
            ].join('');

            section.querySelector('.commu-volume-toggle').addEventListener('click', function() {
                saveExpandedCollection(expanded ? '' : group.id);
                renderLessons();
            });

            var body = section.querySelector('.commu-volume-body');
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
                body.appendChild(partNode);
            });
            els.list.appendChild(section);
        });
    }

    function countChapters(items) {
        var seen = {};
        (items || []).forEach(function(lesson) {
            seen[[lesson.collectionId, lesson.chapterNumber, lesson.chapterTitle].join(':')] = true;
        });
        return Object.keys(seen).length;
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

    function createChapterCard(chapter) {
        var card = document.createElement('article');
        card.className = 'commu-chapter-card';
        card.innerHTML = [
            '<div class="commu-lesson-title-row">',
            '<h2>' + escapeHtml(chapterTitle(chapter)) + '</h2>',
            '</div>',
            '<p class="commu-lesson-summary">' + escapeHtml(lessonSummary(chapter)) + '</p>',
            chapter.focus ? '<p class="commu-lesson-focus">' + escapeHtml(chapter.focus) + '</p>' : '',
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
        button.disabled = Boolean(lesson.locked || !lesson.questions.length);
        button.innerHTML = [
            '<span class="commu-lesson-action-body">',
            '<span class="commu-lesson-action-top">',
            '<strong>' + escapeHtml(lessonActionTitle(lesson)) + '</strong>',
            '<span>' + lesson.questions.length + ' ' + escapeHtml(strings.questions || 'Questions') + '</span>',
            '</span>',
            '<span class="commu-progress-track"><span style="width:' + percent + '%"></span></span>',
            '<span class="commu-lesson-meta"><span>' + escapeHtml(lessonLabel(lesson, item)) + '</span><span>' + escapeHtml(startLessonLabel(lesson)) + '</span></span>',
            '</span>'
        ].join('');
        button.addEventListener('click', function() { startLesson(lesson); });
        return button;
    }

    function lessonActionTitle(lesson) {
        return lessonLevel(lesson) + (lang === 'en' ? ' progress' : ' 학습진도');
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
        var part = findPart(lesson);
        var key = part ? part.key : '';
        var maps = {
            'v1-p1': { ko: ['상품의 두 얼굴', '가치형태와 화폐', '자본 분석의 출발점'], en: ['Two sides of the commodity', 'Value-form and money', 'Starting point for capital'] },
            'v1-p2': { ko: ['화폐 순환', '노동력 상품', '잉여가치의 조건'], en: ['Money circulation', 'Labour-power as commodity', 'Condition for surplus-value'] },
            'v1-p3': { ko: ['노동일', '절대적 잉여가치', '착취의 시간 구조'], en: ['Working day', 'Absolute surplus-value', 'Time-structure of exploitation'] },
            'v1-p4': { ko: ['협업과 분업', '기계와 생산성', '상대적 잉여가치'], en: ['Cooperation and division of labour', 'Machinery and productivity', 'Relative surplus-value'] },
            'v1-p7': { ko: ['잉여가치', '축적', '계급관계 재생산'], en: ['Surplus-value', 'Accumulation', 'Reproduction of class relations'] },
            'v1-p8': { ko: ['생산자 분리', '폭력과 법', '임금노동의 형성'], en: ['Separation of producers', 'Violence and law', 'Formation of wage-labour'] },
            'v2-p1': { ko: ['화폐자본', '생산자본', '상품자본'], en: ['Money-capital', 'Productive capital', 'Commodity-capital'] },
            'v2-p2': { ko: ['회전시간', '선대자본', '잉여가치 연간율'], en: ['Turnover time', 'Advanced capital', 'Annual rate of surplus-value'] },
            'v2-p3': { ko: ['부문 I/II', '사회적 총자본', '재생산 조건'], en: ['Departments I/II', 'Total social capital', 'Conditions of reproduction'] },
            'v3-p1': { ko: ['잉여가치', '이윤 형태', '이윤율'], en: ['Surplus-value', 'Profit form', 'Rate of profit'] },
            'v3-p2': { ko: ['개별 이윤율', '평균이윤', '생산가격'], en: ['Individual profit rates', 'Average profit', 'Prices of production'] },
            'v3-p3': { ko: ['자본구성 상승', '이윤율 저하 경향', '반작용 요인'], en: ['Rising composition of capital', 'Tendency of profit rate to fall', 'Counteracting factors'] },
            'v3-p4': { ko: ['상업자본', '유통비용', '이윤 분할'], en: ['Commercial capital', 'Circulation costs', 'Division of profit'] },
            'v3-p5': { ko: ['이자 낳는 자본', '신용과 지급연쇄', '자본관계의 물신화'], en: ['Interest-bearing capital', 'Credit and payment chains', 'Fetishism of capital relation'] },
            'v3-p6': { ko: ['생산조건 차이', '초과이윤', '지대'], en: ['Differences in production conditions', 'Surplus-profit', 'Rent'] },
            'v3-p7': { ko: ['임금·이윤·지대', '수입의 원천이라는 착시', '계급관계'], en: ['Wages, profit, rent', 'Illusion of income sources', 'Class relations'] }
        };
        return maps[key] || { ko: [lesson.collectionTitle, chapterTitle(lesson), lessonLevel(lesson)], en: [lesson.collectionTitle, chapterTitle(lesson), lessonLevel(lesson)] };
    }

    function renderDiagram(lesson) {
        if (!els.diagram) return;
        var nodes = conceptMap(lesson)[lang === 'en' ? 'en' : 'ko'];
        els.diagram.innerHTML = nodes.map(function(node, index) {
            return '<span class="commu-diagram-node">' + escapeHtml(node) + '</span>' + (index < nodes.length - 1 ? '<span class="commu-diagram-arrow" aria-hidden="true">→</span>' : '');
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
        saveExpandedCollection(lesson.collectionId || '');
        active = { lesson: lesson, index: 0, score: 0, intro: true };
        answered = false;
        els.list.classList.add('is-hidden');
        els.quiz.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        renderIntro();
    }

    function renderIntro() {
        els.count.textContent = '0 / ' + active.lesson.questions.length;
        els.meter.style.width = '0%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.intro) els.intro.classList.remove('is-hidden');
        if (els.focus) els.focus.classList.add('is-hidden');
        els.prompt.classList.add('is-hidden');
        els.choices.classList.add('is-hidden');
        els.feedback.className = 'commu-feedback is-hidden';
        if (els.introTitle) els.introTitle.textContent = lang === 'en' ? 'Concept brief before the quiz' : '문제를 풀기 전, 개념 먼저 잡기';
        if (els.introSummary) els.introSummary.textContent = lessonSummary(active.lesson);
        if (els.introFocus) els.introFocus.textContent = active.lesson.focus || introFallback(active.lesson);
        renderDiagram(active.lesson);
        els.next.disabled = false;
        els.next.textContent = lang === 'en' ? 'Start questions' : '문제 풀기';
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
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        var question = active.lesson.questions[active.index];
        var count = active.index + 1;
        els.count.textContent = count + ' / ' + active.lesson.questions.length;
        els.meter.style.width = Math.round((active.index / active.lesson.questions.length) * 100) + '%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.focus) {
            els.focus.textContent = active.lesson.focus || '';
            els.focus.classList.toggle('is-hidden', !active.lesson.focus);
        }
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
            completed: active.score === active.lesson.questions.length,
            score: active.score,
            totalQuestions: active.lesson.questions.length,
            updatedAt: new Date().toISOString()
        };
        progress[active.lesson.id] = mergeOne(progress[active.lesson.id], item);
        saveLocalProgress();
        postProgress(active.lesson.id, progress[active.lesson.id], false);

        els.prompt.textContent = strings.allDone || 'Lesson complete';
        if (els.focus) els.focus.classList.add('is-hidden');
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span><span class="commu-level-badge ' + lessonLevelClass(active.lesson) + '">' + escapeHtml(lessonLevel(active.lesson)) + '</span>';
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        els.choices.innerHTML = '';
        els.feedback.className = 'commu-feedback';
        els.feedback.textContent = (strings.score || 'Score') + ': ' + active.score + ' / ' + active.lesson.questions.length;
        els.next.disabled = false;
        if (active.score < active.lesson.questions.length) {
            els.next.textContent = strings.tryAgain || 'Try again';
            els.next.setAttribute('data-finished', 'retry');
        } else {
            els.next.textContent = strings.backToLessons || 'Lessons';
            els.next.setAttribute('data-finished', '1');
        }
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
