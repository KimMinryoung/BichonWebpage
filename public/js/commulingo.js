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
        var id = lesson.collectionId + ':' + lesson.chapterNumber;
        var maps = {
            'capital-vol1:1': {
                ko: [
                    { title: '사용가치', text: '사람에게 쓸모가 있는 면. 외투는 몸을 따뜻하게 해 준다.' },
                    { title: '가치', text: '시장에서 다른 상품과 비교되는 사회적 노동의 면. 개인의 고생이 아니라 사회적으로 필요한 노동시간이 기준이다.' },
                    { title: '헷갈리지 말 것', text: '쓸모가 크다고 곧 가치가 큰 것은 아니다. 두 면을 구분해야 상품 분석이 시작된다.' }
                ],
                en: [
                    { title: 'Use-value', text: 'The useful side of a thing: a coat keeps someone warm.' },
                    { title: 'Value', text: 'The social labour side that makes commodities comparable in exchange.' },
                    { title: 'Do not confuse them', text: 'Greater usefulness does not automatically mean greater value.' }
                ]
            },
            'capital-vol1:2': {
                ko: [
                    { title: '상품', text: '스스로 시장에 가지 않는다. 상품은 소유자를 통해 교환된다.' },
                    { title: '상품소유자', text: '서로를 소유자로 인정해야 교환이 가능하다.' },
                    { title: '교환관계', text: '물건의 이동처럼 보이지만, 실제로는 사람들 사이의 사회적 관계가 작동한다.' }
                ],
                en: [
                    { title: 'Commodity', text: 'It does not go to market by itself; it is exchanged through its owner.' },
                    { title: 'Owner', text: 'Exchange requires owners to recognize one another.' },
                    { title: 'Exchange relation', text: 'Behind the movement of things is a social relation among people.' }
                ]
            },
            'capital-vol1:3': {
                ko: [
                    { title: '가치척도', text: '화폐는 상품가치를 가격으로 표현하게 해 준다.' },
                    { title: '유통수단', text: '상품이 팔리고 사는 과정을 매개한다.' },
                    { title: '지급수단·축장', text: '거래가 시간차를 가질 때 빚과 결제, 보유의 형태로 작동한다.' }
                ],
                en: [
                    { title: 'Measure of value', text: 'Money lets commodity value appear as price.' },
                    { title: 'Means of circulation', text: 'Money mediates buying and selling.' },
                    { title: 'Payment and hoard', text: 'When transactions are separated in time, money appears in debts, settlement, and holding.' }
                ]
            },
            'capital-vol1:10': {
                ko: [
                    { title: '필요노동', text: '노동자가 자기 노동력의 가치를 재생산하는 시간.' },
                    { title: '잉여노동', text: '그 뒤에도 계속 일해 자본가에게 잉여가치를 만드는 시간.' },
                    { title: '노동일 투쟁', text: '노동일의 길이는 자연적으로 정해지지 않고 계급투쟁과 법적 제한 속에서 정해진다.' }
                ],
                en: [
                    { title: 'Necessary labour', text: 'Time in which workers reproduce the value of their labour-power.' },
                    { title: 'Surplus labour', text: 'Additional time that creates surplus-value for capital.' },
                    { title: 'Struggle over the day', text: 'The length of the working day is set through conflict and law, not by nature.' }
                ]
            },
            'capital-vol1:16': {
                ko: [
                    { title: '절대적 잉여가치', text: '노동일을 늘려 잉여노동시간을 키운다.' },
                    { title: '상대적 잉여가치', text: '생산성을 높여 필요노동시간을 줄이고 같은 노동일 안의 잉여노동을 늘린다.' },
                    { title: '공통점', text: '방식은 다르지만 둘 다 노동일 안에서 자본의 몫을 키우는 방법이다.' }
                ],
                en: [
                    { title: 'Absolute surplus-value', text: 'Lengthens the working day to expand surplus labour.' },
                    { title: 'Relative surplus-value', text: 'Raises productivity to reduce necessary labour within the same working day.' },
                    { title: 'Common point', text: 'Both increase capital’s share of the working day.' }
                ]
            },
            'capital-vol2:7': {
                ko: [
                    { title: '생산시간', text: '자본이 생산과정에 묶여 있는 시간.' },
                    { title: '유통시간', text: '판매와 구매를 기다리며 생산 밖에 머무는 시간.' },
                    { title: '회전시간', text: '두 시간을 합친 전체 순환 시간. 빨리 돌수록 같은 자본이 더 자주 쓰인다.' }
                ],
                en: [
                    { title: 'Production time', text: 'Time capital is tied up in production.' },
                    { title: 'Circulation time', text: 'Time spent waiting for sale and purchase outside production.' },
                    { title: 'Turnover time', text: 'The total of both; faster turnover lets the same capital function more often.' }
                ]
            },
            'capital-vol2:20': {
                ko: [
                    { title: '부문 I', text: '생산수단을 만드는 부문.' },
                    { title: '부문 II', text: '소비재를 만드는 부문.' },
                    { title: '단순재생산', text: '사회가 같은 규모로 반복되려면 두 부문의 교환 비율이 맞아야 한다.' }
                ],
                en: [
                    { title: 'Department I', text: 'Produces means of production.' },
                    { title: 'Department II', text: 'Produces means of consumption.' },
                    { title: 'Simple reproduction', text: 'For society to repeat at the same scale, exchange between the two departments must balance.' }
                ]
            },
            'capital-vol3:13': {
                ko: [
                    { title: '불변자본 증가', text: '기계와 설비 비중이 커진다.' },
                    { title: '가변자본의 역할', text: '새 가치를 만드는 것은 노동력이다.' },
                    { title: '이윤율 저하 경향', text: '총자본에 견줘 잉여가치 원천의 비중이 줄어드는 압력으로 이해한다.' }
                ],
                en: [
                    { title: 'More constant capital', text: 'Machinery and equipment take a larger share.' },
                    { title: 'Role of variable capital', text: 'Labour-power is the source of new value.' },
                    { title: 'Falling profit-rate tendency', text: 'The source of surplus-value becomes smaller relative to total capital.' }
                ]
            },
            'capital-vol3:24': {
                ko: [
                    { title: "M-M'", text: '돈이 더 많은 돈으로 곧장 불어나는 것처럼 보인다.' },
                    { title: '빠진 고리', text: '중간의 생산과 노동 착취가 형태상 사라진다.' },
                    { title: '물신화', text: '사회적 관계가 돈 자체의 힘처럼 보이는 착시가 생긴다.' }
                ],
                en: [
                    { title: "M-M'", text: 'Money seems to become more money directly.' },
                    { title: 'Missing link', text: 'Production and exploitation disappear from the form.' },
                    { title: 'Fetishism', text: 'A social relation appears as a power of money itself.' }
                ]
            }
        };
        return maps[id] || fallbackConceptMap(lesson);
    }

    function fallbackConceptMap(lesson) {
        return {
            ko: [
                { title: '핵심 개념', text: chapterTitle(lesson) },
                { title: '무엇을 설명하나', text: lessonSummary(lesson) },
                { title: '문제에서 볼 것', text: lesson.focus || introFallback(lesson) }
            ],
            en: [
                { title: 'Core concept', text: chapterTitle(lesson) },
                { title: 'What it explains', text: lessonSummary(lesson) },
                { title: 'What to watch for', text: lesson.focus || introFallback(lesson) }
            ]
        };
    }

    function renderDiagram(lesson) {
        if (!els.diagram) return;
        var nodes = conceptMap(lesson)[lang === 'en' ? 'en' : 'ko'];
        els.diagram.innerHTML = nodes.map(function(node) {
            return '<span class="commu-diagram-node"><strong>' + escapeHtml(node.title) + '</strong><small>' + escapeHtml(node.text) + '</small></span>';
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
