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
    var quizHistory = false;
    // Per-question history and the review schedule built on it, shared with
    // the hub through public/js/commulingo-schedule.js.
    var Schedule = window.CommuLingoSchedule || null;
    var answers = Schedule ? Schedule.load() : {};
    // Unsent answer keys, each mapped to the generation of its latest change:
    // an upload's success clears only the keys not changed again meanwhile.
    var dirtyAnswers = {};
    var answerGeneration = 0;
    var answerSyncTimer = null;
    var answerSyncInFlight = false;
    var answerRetryDelay = 0;

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
        passage: document.getElementById('commuPassage'),
        intro: document.getElementById('commuIntro'),
        introTitle: document.getElementById('commuIntroTitle'),
        introSummary: document.getElementById('commuIntroSummary'),
        introFocus: document.getElementById('commuIntroFocus'),
        diagram: document.getElementById('commuDiagram'),
        next: document.getElementById('commuNextBtn'),
        nextLesson: document.getElementById('commuNextLessonBtn'),
        review: document.getElementById('commuReviewBtn'),
        reviewNote: document.getElementById('commuReviewNote'),
        guide: document.getElementById('faction-guide'),
        chapterDictionaries: document.querySelectorAll('.commu-chapter-dictionary')
    };

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
        if (!answered) {
            // A workshop activity is checked with this button, then left with it.
            if (pendingCheck) pendingCheck();
            return;
        }
        if (finishedAction === 'retry') {
            els.next.removeAttribute('data-finished');
            startRetry(active.lesson, active.missed, active.firstScore);
            return;
        }
        if (active.pos >= roundLength() - 1) {
            finishLesson();
            return;
        }
        active.pos += 1;
        answered = false;
        renderQuestion();
    });
    if (els.review) {
        els.review.addEventListener('click', function() { startReview(); });
    }

    // Keys 1-4 pick a choice immediately. Enter (or Space away from a button)
    // advances only after that choice has been answered.
    // Ignored while typing anywhere else on the page.
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        var target = event.target;
        var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable)) return;
        if (!active || els.quiz.classList.contains('is-hidden')) return;
        if (/^[1-4]$/.test(event.key) && !answered && !active.intro && !els.choices.classList.contains('is-hidden') && !els.choices.classList.contains('is-activity')) {
            var button = els.choices.children[Number(event.key) - 1];
            if (button && !button.disabled) {
                event.preventDefault();
                button.click();
            }
            return;
        }
        if ((event.key === 'Enter' || event.key === ' ') && !els.next.disabled) {
            if (tag === 'button' || tag === 'a') return;
            event.preventDefault();
            els.next.click();
        }
    });

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function fill(template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, function(_, key) {
            return typeof values[key] === 'undefined' ? '' : String(values[key]);
        });
    }

    // A round is either a lesson (all questions, or the missed ones on a
    // retry) or a review of due questions drawn from several lessons.
    function roundLength() {
        if (!active) return 0;
        return active.mode === 'review' ? active.items.length : active.order.length;
    }

    function currentQuestion() {
        if (active.mode === 'review') return active.items[active.pos].question;
        return active.lesson.questions[active.order[active.pos]];
    }

    function currentLesson() {
        return active.mode === 'review' ? active.items[active.pos].lesson : active.lesson;
    }

    function lessonById(lessonId) {
        return lessons.filter(function(item) { return item.id === lessonId; })[0] || null;
    }

    function bookLessonIds() {
        return lessons.filter(function(item) { return !item.locked && lessonQuestionCount(item); }).map(function(item) { return item.id; });
    }

    function recordAnswer(lesson, question, correct) {
        if (!Schedule || !lesson || !question || !question.id) return;
        var key = Schedule.key(lesson.id, question.id);
        answers[key] = Schedule.record(answers[key], correct, Date.now());
        Schedule.save(answers);
        queueAnswerSync([key]);
    }

    function queueAnswerSync(keys) {
        keys.forEach(function(key) { dirtyAnswers[key] = ++answerGeneration; });
        scheduleAnswerSync(1500);
    }

    function scheduleAnswerSync(delay) {
        if (answerSyncTimer) clearTimeout(answerSyncTimer);
        answerSyncTimer = setTimeout(flushAnswerSync, delay);
    }

    // One upload at a time, up to 200 records each. A failed upload retries
    // with a growing delay (5 s to 5 min); 401/403 means the account is gone,
    // so the records wait in this browser for the next sign-in instead.
    function flushAnswerSync() {
        answerSyncTimer = null;
        if (answerSyncInFlight) return;
        var tokenMeta = document.querySelector('meta[name="csrf-token"]');
        var token = tokenMeta ? tokenMeta.getAttribute('content') : '';
        var keys = Object.keys(dirtyAnswers);
        if (!token || !keys.length || !Schedule) return;
        var sent = keys.slice(0, 200).map(function(key) { return { key: key, generation: dirtyAnswers[key] }; });
        var batch = sent.map(function(item) {
            var key = item.key;
            var ref = Schedule.splitKey(key);
            var entry = answers[key] || {};
            return {
                lessonId: ref.lessonId,
                questionId: ref.questionId,
                right: entry.right,
                wrong: entry.wrong,
                streak: entry.streak,
                lastCorrect: entry.lastCorrect,
                lastAt: entry.lastAt,
                due: entry.due
            };
        });
        answerSyncInFlight = true;
        fetch('/commulingo/progress/answers', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'x-csrf-token': token },
            body: JSON.stringify({ answers: batch })
        }).then(function(res) {
            answerSyncInFlight = false;
            if (res.status === 401 || res.status === 403) return;
            if (!res.ok) throw new Error('answer sync failed');
            sent.forEach(function(item) {
                if (dirtyAnswers[item.key] === item.generation) delete dirtyAnswers[item.key];
            });
            answerRetryDelay = 0;
            if (Object.keys(dirtyAnswers).length) scheduleAnswerSync(1500);
        }).catch(function() {
            answerSyncInFlight = false;
            answerRetryDelay = Math.min(Math.max(answerRetryDelay * 2, 5000), 300000);
            scheduleAnswerSync(answerRetryDelay);
        });
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
                        format: collection.format,
                        chapterId: chapter.id,
                        chapterNumber: chapter.chapterNumber,
                        chapterTitle: text(chapter.title),
                        partNumber: chapter.partNumber,
                        partTitle: text(chapter.partTitle),
                        title: text(lesson.title),
                        summary: text(chapter.summary),
                        focus: text(chapter.learningFocus),
                        minutes: chapter.minutes || 0,
                        readings: chapterReadings(chapter),
                        // Linked by the book route; absent on an older payload,
                        // in which case the renderers escape the plain fields.
                        summaryHtml: text(chapter.summaryHtml),
                        focusHtml: text(chapter.focusHtml),
                        questions: lesson.questions || null,
                        questionCount: lessonQuestionCount(lesson),
                        // A chapter with one lesson has no 기본/심화 choice to label.
                        soleLevel: chapter.lessons.length === 1
                    });
                });
                if (!(chapter.lessons || []).length) {
                    out.push({
                        id: chapter.id + '-locked',
                        collectionId: collection.id,
                        collectionTitle: text(collection.title),
                        chapterId: chapter.id,
                        chapterNumber: chapter.chapterNumber,
                        chapterTitle: text(chapter.title),
                        partNumber: chapter.partNumber,
                        partTitle: text(chapter.partTitle),
                        title: text(chapter.title),
                        summary: text(chapter.summary),
                        focus: text(chapter.learningFocus),
                        minutes: chapter.minutes || 0,
                        readings: chapterReadings(chapter),
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
                    diagram: loaded.diagram || lesson.diagram,
                    format: loaded.format || lesson.format,
                    takeaway: loaded.takeaway || lesson.takeaway,
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
            var parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (err) {
            return {};
        }
    }

    // Blocked or full storage must not stop a lesson from finishing; the
    // progress then lives in this page (and the account, when signed in).
    function saveLocalProgress() {
        try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (err) {}
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
        var changed = false;
        (items || []).forEach(function(item) {
            var merged = mergeOne(progress[item.lessonId], {
                completed: item.completed,
                score: item.score,
                totalQuestions: item.totalQuestions,
                updatedAt: item.updatedAt
            });
            if (JSON.stringify(merged) !== JSON.stringify(progress[item.lessonId])) changed = true;
            progress[item.lessonId] = merged;
        });
        if (changed) saveLocalProgress();
        return changed;
    }

    function syncServerProgress() {
        return fetch('/commulingo/progress', { credentials: 'same-origin' })
            .then(function(res) { return res.ok ? res.json() : null; })
            .then(function(payload) {
                if (!payload) return false;
                // Another account signed in and its predecessor's records were
                // just removed from storage; forget them here too.
                var dropped = Schedule && Schedule.settleOwner ? Schedule.settleOwner(payload) : false;
                if (dropped) {
                    progress = {};
                    answers = {};
                    dirtyAnswers = {};
                }
                if (!payload.authenticated) return dropped;
                var changed = mergeProgress(payload.progress || []) || dropped;
                Object.keys(progress).forEach(function(lessonId) {
                    postProgress(lessonId, progress[lessonId], true);
                });
                if (Schedule) {
                    var remote = payload.answers || {};
                    var merged = Schedule.merge(answers, remote);
                    // Whatever this browser knows and the account does not
                    // (or knows more recently) goes up in one batch.
                    var push = Object.keys(answers).filter(function(key) {
                        return !remote[key] || Date.parse(answers[key].lastAt || 0) > Date.parse(remote[key].lastAt || 0);
                    });
                    answers = merged.map;
                    if (merged.changed) { Schedule.save(answers); changed = true; }
                    if (push.length) queueAnswerSync(push);
                }
                return changed;
            })
            .catch(function() { return false; });
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
        renderReviewButton();

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

    function renderReviewButton() {
        if (!els.review || !Schedule) return;
        var ids = bookLessonIds();
        var due = Schedule.dueList(answers, ids, Date.now());
        if (due.length) {
            els.review.textContent = (strings.reviewButton || 'Review') + ' · ' + due.length;
            els.review.classList.remove('is-hidden');
            if (els.reviewNote) els.reviewNote.textContent = fill(strings.reviewDueCount || '{count} due', { count: due.length });
            return;
        }
        els.review.classList.add('is-hidden');
        if (!els.reviewNote) return;
        var next = Schedule.nextDue(answers, ids);
        if (next) {
            var date = new Date(next);
            var label = lang === 'en' ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
            els.reviewNote.textContent = fill(strings.reviewNextDue || 'Next review: {date}', { date: label });
        } else {
            els.reviewNote.textContent = '';
        }
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
                minutes: lesson.minutes,
                readings: lesson.readings,
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
        if (lesson.partNumber && lesson.partTitle) {
            return {
                key: lesson.collectionId + '-p' + lesson.partNumber,
                title: lesson.partTitle
            };
        }
        var definitions = capitalParts[lesson.collectionId] || [];
        var chapter = Number(lesson.chapterNumber) || 0;
        for (var i = 0; i < definitions.length; i += 1) {
            var part = definitions[i];
            if (chapter >= part.start && chapter <= part.end) return part;
        }
        return null;
    }

    function partTitle(part) {
        if (part.title) return part.title;
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

    function setBookContextHidden(hidden) {
        if (els.guide) els.guide.classList.toggle('is-hidden', hidden);
    }

    function scrollToQuiz() {
        window.requestAnimationFrame(function() {
            els.quiz.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
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
        // Title and length, the chapter's point in one line, then the texts it
        // reads. A chapter that lists its readings drops the summary, which
        // only names the same texts in prose; the lesson intro still shows it.
        var readings = chapter.readings || [];
        card.innerHTML = [
            '<div class="commu-lesson-title-row">',
            '<h2>' + escapeHtml(chapterTitle(chapter)) + '</h2>',
            chapter.minutes ? '<span class="commu-chapter-minutes">' + escapeHtml(fill(lang === 'en' ? '{n} min' : '약 {n}분', { n: chapter.minutes })) + '</span>' : '',
            '</div>',
            chapter.focus ? '<p class="commu-lesson-focus">' + (chapter.focusHtml || escapeHtml(chapter.focus)) + '</p>' : '',
            readings.length ? '' : '<p class="commu-lesson-summary">' + (chapter.summaryHtml || escapeHtml(lessonSummary(chapter))) + '</p>',
            readings.length ? '<ul class="commu-chapter-readings">' + readings.map(readingChip).join('') + '</ul>' : '',
            '<div class="commu-chapter-actions"></div>'
        ].join('');
        var actions = card.querySelector('.commu-chapter-actions');
        chapter.lessons.forEach(function(lesson) {
            actions.appendChild(createLessonAction(lesson));
        });
        return card;
    }

    // chapter.readings: [{ author?, title, year, endYear?, doc?, anchor?, url?, genealogy? }], localized fields.
    function chapterReadings(chapter) {
        return (chapter.readings || []).map(function(reading) {
            var year = reading.year ? String(reading.year) : '';
            if (year && reading.endYear) year += '–' + reading.endYear;
            var href = reading.doc ? '/commulingo/docs/' + encodeURIComponent(reading.doc) + (reading.anchor ? '#' + encodeURIComponent(reading.anchor) : '')
                : reading.genealogy ? '/commulingo/genealogy/' + encodeURIComponent(reading.genealogy)
                : (reading.url || '');
            return { author: text(reading.author), title: text(reading.title), year: year, href: href, external: !reading.doc && !reading.genealogy && !!reading.url };
        }).filter(function(reading) { return reading.title; });
    }

    // A reading whose full text is in the site library links to it, and one
    // the library does not host links to its original elsewhere (url) in a new
    // tab (the course data names both; nothing is matched here).
    function readingChip(reading) {
        var inner = (reading.author ? '<span class="commu-reading-author">' + escapeHtml(reading.author) + '</span>' : '')
            + '<span class="commu-reading-title">' + escapeHtml(reading.title) + '</span>'
            + (reading.year ? '<span class="commu-reading-year">' + escapeHtml(reading.year) + '</span>' : '');
        if (reading.external) {
            return '<li class="is-external"><a href="' + escapeHtml(reading.href) + '" target="_blank" rel="noopener noreferrer">'
                + linkWhereTag(reading.href) + inner
                + '<span class="commu-reading-external" aria-hidden="true">↗</span></a></li>';
        }
        return reading.href
            ? '<li class="is-library"><a href="' + escapeHtml(reading.href) + '">' + linkWhereTag(reading.href) + inner + '</a></li>'
            : '<li>' + inner + '</li>';
    }

    // Where a text link leads, said before its title: a site page (the
    // CommuLingo library or a genealogy chart) or another site, named by its
    // host, so the two read apart at a glance and not only by the ↗.
    function isSiteHref(href) {
        return /^\/(?!\/)/.test(String(href || ''));
    }

    function linkHost(href) {
        try { return new URL(href).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
    }

    function linkWhereTag(href) {
        if (isSiteHref(href)) {
            return '<span class="commu-link-where is-library">' + escapeHtml(lang === 'en' ? 'CommuLingo' : '공산링고') + '</span>';
        }
        var host = linkHost(href);
        return '<span class="commu-link-where is-external">' + escapeHtml(host || (lang === 'en' ? 'external' : '외부')) + '</span>';
    }

    // The source link under a passage: a site document opens as part of the
    // library, another site with its host and ↗.
    function sourceLinkHtml(href, label, suffix) {
        var site = isSiteHref(href);
        return '<a class="commu-source-link ' + (site ? 'is-library' : 'is-external') + '" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">'
            + linkWhereTag(href) + '<span class="commu-source-link-label">' + escapeHtml(label) + (site ? suffix : '') + '</span>'
            + (site ? '' : '<span class="commu-reading-external" aria-hidden="true">↗</span>') + '</a>';
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
            lesson.soleLevel
                ? '<strong>' + lessonQuestionCount(lesson) + ' ' + escapeHtml(strings.questions || 'Questions') + '</strong>'
                : '<strong>' + escapeHtml(lessonActionTitle(lesson)) + '</strong><span>' + lessonQuestionCount(lesson) + ' ' + escapeHtml(strings.questions || 'Questions') + '</span>',
            '</span>',
            '<span class="commu-progress-track"><span style="width:' + percent + '%"></span></span>',
            '<span class="commu-lesson-meta"><span>' + escapeHtml(lessonLabel(lesson, item)) + '</span>' + (lesson.soleLevel ? '' : '<span>' + escapeHtml(startLessonLabel(lesson)) + '</span>') + '</span>',
            '</span>'
        ].join('');
        button.addEventListener('click', function() { startLesson(lesson); });
        return button;
    }


    // The 기본/심화 badge, or nothing for a chapter's only lesson; a suffix
    // (재도전) still shows on its own.
    function levelBadge(lesson, suffix) {
        var parts = [];
        if (!lesson.soleLevel) parts.push(lessonLevel(lesson));
        if (suffix) parts.push(suffix);
        if (!parts.length) return '';
        return '<span class="commu-level-badge ' + (lesson.soleLevel ? 'is-plain' : lessonLevelClass(lesson)) + '">' + escapeHtml(parts.join(' · ')) + '</span>';
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
        if (section.table) html += renderBriefTable(section.table);
        return html + '</section>';
    }

    // A brief table scrolls sideways inside its own box on a narrow screen;
    // the first cell of each row is the row's heading.
    function renderBriefTable(table) {
        var columns = Array.isArray(table.columns) ? table.columns : [];
        var rows = Array.isArray(table.rowsHtml) && table.rowsHtml.length
            ? table.rowsHtml
            : (Array.isArray(table.rows) ? table.rows.map(function(row) { return (row || []).map(escapeHtml); }) : []);
        if (!columns.length || !rows.length) return '';
        return '<div class="commu-brief-table"><table><thead><tr>'
            + columns.map(function(column) { return '<th scope="col">' + escapeHtml(column) + '</th>'; }).join('')
            + '</tr></thead><tbody>'
            + rows.map(function(row) {
                return '<tr>' + row.map(function(cell, index) {
                    return index === 0 ? '<th scope="row">' + cell + '</th>' : '<td>' + cell + '</td>';
                }).join('') + '</tr>';
            }).join('')
            + '</tbody></table></div>';
    }

    function lessonDiagram(lesson) {
        var diagram = lesson.diagram;
        if (!diagram || !diagram.kind) return null;
        var data = diagram[lang === 'en' ? 'en' : 'ko'] || diagram.ko || diagram.en;
        if (!data) return null;
        return { kind: diagram.kind, data: data };
    }

    function renderFlowDiagram(data) {
        var html = '<figure class="commu-flow">';
        if (data.title) html += '<figcaption>' + escapeHtml(data.title) + '</figcaption>';
        html += '<div class="commu-flow-track">' + (data.steps || []).map(function(step) {
            var card = '<span class="commu-flow-step"><strong>' + escapeHtml(step.label) + '</strong>';
            if (step.noteHtml) card += '<small>' + step.noteHtml + '</small>';
            else if (step.note) card += '<small>' + escapeHtml(step.note) + '</small>';
            return card + '</span>';
        }).join('<span class="commu-flow-arrow" aria-hidden="true"></span>') + '</div>';
        return html + '</figure>';
    }

    function renderContrastSide(side) {
        if (!side) return '';
        var rows = Array.isArray(side.rowsHtml) && side.rowsHtml.length
            ? side.rowsHtml
            : (Array.isArray(side.rows) ? side.rows.map(escapeHtml) : []);
        return '<div class="commu-contrast-side"><strong>' + escapeHtml(side.heading) + '</strong><ul>'
            + rows.map(function(row) { return '<li>' + row + '</li>'; }).join('')
            + '</ul></div>';
    }

    function renderContrastDiagram(data) {
        var html = '<figure class="commu-contrast">';
        if (data.title) html += '<figcaption>' + escapeHtml(data.title) + '</figcaption>';
        html += '<div class="commu-contrast-grid">' + renderContrastSide(data.left) + renderContrastSide(data.right) + '</div>';
        return html + '</figure>';
    }

    function renderDiagram(lesson) {
        if (!els.diagram) return;
        var html = '';
        var diagram = lessonDiagram(lesson);
        if (diagram && diagram.kind === 'flow') html += renderFlowDiagram(diagram.data);
        else if (diagram && diagram.kind === 'contrast') html += renderContrastDiagram(diagram.data);
        var sections = conceptBrief(lesson);
        if (sections.length) {
            els.diagram.innerHTML = html + '<div class="commu-brief">' + sections.map(renderBriefSection).join('') + '</div>';
            return;
        }
        if (html) {
            els.diagram.innerHTML = html;
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
        setBookContextHidden(true);
        els.list.classList.add('is-hidden');
        els.quiz.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        enterQuizHistory('#lesson=' + encodeURIComponent(lesson.id));
        renderLoadingLesson(lesson);
        scrollToQuiz();
        loadLessonDetail(lesson)
            .then(function(loadedLesson) {
                active = {
                    mode: 'lesson',
                    lesson: loadedLesson,
                    order: loadedLesson.questions.map(function(_, index) { return index; }),
                    pos: 0,
                    score: 0,
                    streak: 0,
                    // A reading lesson opens on its first passage: the text is
                    // the introduction, so there is no concept brief to pass.
                    intro: !skipsIntro(loadedLesson),
                    missed: [],
                    firstScore: null
                };
                if (window.CommuLingoMeasurement) window.CommuLingoMeasurement.begin('lesson', lesson.id, data.version, 'lesson');
                if (active.intro) renderIntro();
                else renderQuestion();
            })
            .catch(function() {
                active = null;
                els.lessonTitle.textContent = chapterTitle(lesson);
                setPlainPrompt(lang === 'en' ? 'Could not load this lesson. Please try again.' : '문제를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.');
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
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(lesson)) + '</span>' + levelBadge(lesson);
        if (els.intro) els.intro.classList.add('is-hidden');
        if (els.focus) els.focus.classList.add('is-hidden');
        hidePassage();
        setPlainPrompt(lang === 'en' ? 'Loading questions...' : '문제를 불러오는 중입니다...');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.add('is-hidden');
        els.feedback.className = 'commu-feedback is-hidden';
        els.next.disabled = true;
        els.next.textContent = strings.next || 'Next';
    }

    function renderIntro() {
        els.count.textContent = '0 / ' + lessonQuestionCount(active.lesson);
        els.meter.style.width = '0%';
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span>' + levelBadge(active.lesson);
        if (els.intro) els.intro.classList.remove('is-hidden');
        if (els.focus) els.focus.classList.add('is-hidden');
        hidePassage();
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
        Array.prototype.forEach.call(els.chapterDictionaries, function(node) {
            node.classList.toggle('is-hidden', node.getAttribute('data-chapter-id') !== active.lesson.chapterId);
        });
        els.next.disabled = false;
        els.next.textContent = lang === 'en' ? 'Start questions' : '문제 풀기';
    }

    // An open lesson or review owns one history entry, so the browser's back
    // button returns to the chapter list instead of leaving the book page.
    // Moving on to the next lesson replaces that entry rather than stacking.
    function enterQuizHistory(hash) {
        if (!window.history || !history.pushState) return;
        var url = window.location.pathname + window.location.search + hash;
        if (quizHistory) history.replaceState({ commuQuiz: true }, '', url);
        else history.pushState({ commuQuiz: true }, '', url);
        quizHistory = true;
    }

    function showLessons(scrollTarget, fromHistory) {
        if (quizHistory) {
            quizHistory = false;
            // The popstate this causes finds the quiz already closed.
            if (!fromHistory) history.back();
        }
        scrollTarget = scrollTarget || scrollTargetForLesson(active && active.lesson || returnScrollLesson, false);
        active = null;
        answered = false;
        hideNextLesson();
        els.quiz.classList.add('is-hidden');
        setBookContextHidden(false);
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
        els.nextLesson.textContent = (strings.nextLesson || (lang === 'en' ? 'Next lesson' : '다음 학습')) + ' · ' + chapterTitle(lesson) + (lesson.soleLevel ? '' : ' (' + lessonLevel(lesson) + ')');
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

    function handleDeepLink(fromHistory) {
        var match = /(?:^|[#&])lesson=([^&]+)/.exec(window.location.hash || '');
        if (!match) return;
        var lessonId = decodeURIComponent(match[1]);
        // Opened from a shared link: put the bare book page beneath the
        // lesson so back lands on the chapter list. Going forward again
        // reuses the lesson entry that is already there.
        if (fromHistory) quizHistory = true;
        else if (window.history && history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
        var target = lessons.filter(function(item) { return item.id === lessonId && !item.locked && lessonQuestionCount(item); })[0];
        if (target) startLesson(target);
    }

    function renderQuestion() {
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        var question = currentQuestion();
        var lesson = currentLesson();
        var total = roundLength();
        els.count.textContent = (active.pos + 1) + ' / ' + total;
        els.meter.style.width = Math.round((active.pos / total) * 100) + '%';
        var badge = active.mode === 'review'
            ? '<span class="commu-level-badge is-review">' + escapeHtml(strings.reviewTitle || 'Review') + '</span>'
            : levelBadge(lesson, active.mode === 'retry' ? (strings.tryAgain || 'Retry') : '');
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(lesson)) + '</span>' + badge;
        renderPassage(lesson, question);
        // The learning focus states the chapter's conclusion, which is often
        // the answer: it belongs to the concept brief, not above a question.
        if (els.focus) els.focus.classList.add('is-hidden');
        setQuestionPrompt(text(question.prompt));
        els.feedback.className = 'commu-feedback is-hidden';
        els.feedback.textContent = '';
        els.quiz.classList.remove('has-answer-reward', 'has-perfect-reward');
        els.next.disabled = true;
        els.next.textContent = nextLabel();
        pendingCheck = null;
        if (isActivity(question)) renderActivity(question);
        else renderChoices(question);
    }

    function nextLabel() {
        return active.pos >= roundLength() - 1 ? (strings.finish || 'Finish') : (strings.next || 'Next');
    }

    function setPlainPrompt(value) {
        els.prompt.classList.remove('is-long');
        els.prompt.textContent = value;
    }

    // A prompt of several sentences is a setup followed by the question: the
    // setup is shown in regular weight and the last sentence carries the
    // weight. Long prompts drop a size (commulingo.css h2.is-long).
    function setQuestionPrompt(value) {
        var limit = lang === 'en' ? 150 : 70;
        els.prompt.classList.toggle('is-long', value.length > limit);
        var parts = /^([\s\S]*[.!?…]["'”’」』)]?)\s+(\S[\s\S]*)$/.exec(value);
        var minAsk = lang === 'en' ? 20 : 8;
        if (!parts || parts[1].length < 20 || parts[2].length < minAsk) {
            els.prompt.textContent = value;
            return;
        }
        els.prompt.innerHTML = '<span class="commu-prompt-lead">' + escapeHtml(parts[1]) + '</span>'
            + '<span class="commu-prompt-ask">' + escapeHtml(parts[2]) + '</span>';
    }

    // Short choices in an even count sit in two columns; sentences stack.
    function pairChoices(labels) {
        var limit = lang === 'en' ? 44 : 22;
        return labels.length % 2 === 0 && labels.every(function(label) { return String(label).length <= limit; });
    }

    function renderChoices(question) {
        els.choices.innerHTML = '';
        els.choices.classList.remove('is-activity');
        var choices = shuffleChoices(text(question.choices).map(function(choice, index) {
            return { label: choice, originalIndex: index };
        }));
        els.choices.classList.toggle('is-paired', pairChoices(choices.map(function(choice) { return choice.label; })));
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

    // ---------------------------------------------------- workshop activities
    // order, sort and cloze (format 'workshop'): the learner arranges
    // something and then checks it with the action button; the whole
    // arrangement must be right. The markup reuses the drill's order list.
    var pendingCheck = null;

    function isActivity(question) {
        return Boolean(question) && (question.type === 'order' || question.type === 'sort' || question.type === 'cloze');
    }

    function renderActivity(question) {
        els.choices.classList.remove('is-paired');
        els.choices.classList.add('is-activity');
        els.choices.innerHTML = '';
        els.next.textContent = lang === 'en' ? 'Check' : '확인';
        if (question.type === 'order') renderOrder(question);
        else if (question.type === 'sort') renderSort(question);
        else renderCloze(question);
    }

    function activityHint(value) {
        var hint = document.createElement('p');
        hint.className = 'commu-drill-order-hint';
        hint.textContent = value;
        els.choices.appendChild(hint);
    }

    function settleActivity(question, correct) {
        pendingCheck = null;
        settleAnswer(question, correct, null);
        els.next.textContent = nextLabel();
    }

    function activityButton(className, label) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.textContent = label;
        return button;
    }

    function renderOrder(question) {
        var labels = text(question.items) || [];
        var notes = (question.itemNotes && text(question.itemNotes)) || [];
        var items = labels.map(function(label, index) { return { label: label, key: index }; });
        var inOrder = function(list) { return list.every(function(item, index) { return item.key === index; }); };
        var display = shuffleChoices(items);
        for (var guard = 0; display.length > 1 && inOrder(display) && guard < 10; guard += 1) display = shuffleChoices(items);
        var graded = false;
        activityHint(lang === 'en' ? 'Move the items into order, then check.' : '▲▼로 순서를 맞춘 뒤 확인을 누르세요.');
        var list = document.createElement('ol');
        list.className = 'commu-drill-order';
        els.choices.appendChild(list);

        function move(index, delta) {
            var other = display[index + delta];
            display[index + delta] = display[index];
            display[index] = other;
            draw();
            // Keep the keyboard on the item that moved.
            var row = list.children[index + delta];
            var buttons = row ? row.querySelectorAll('button:not(:disabled)') : [];
            var again = buttons.length === 2 ? buttons[delta < 0 ? 0 : 1] : buttons[0];
            if (again) again.focus();
        }

        function draw() {
            list.innerHTML = '';
            display.forEach(function(item, index) {
                var li = document.createElement('li');
                li.className = 'commu-drill-order-item' + (graded ? (item.key === index ? ' is-correct' : ' is-wrong') : '');
                var label = document.createElement('span');
                label.className = 'commu-drill-order-label';
                label.textContent = item.label;
                li.appendChild(label);
                // Once checked, an item in its place shows its note (a date).
                if (graded && item.key === index && notes[item.key]) {
                    var reveal = document.createElement('span');
                    reveal.className = 'commu-drill-order-reveal';
                    reveal.textContent = notes[item.key];
                    li.appendChild(reveal);
                }
                if (!graded) {
                    var controls = document.createElement('span');
                    controls.className = 'commu-drill-order-controls';
                    [[-1, '▲', strings.drillMoveUp || (lang === 'en' ? 'Move up' : '위로')], [1, '▼', strings.drillMoveDown || (lang === 'en' ? 'Move down' : '아래로')]].forEach(function(spec) {
                        var button = activityButton('commu-drill-order-move', spec[1]);
                        button.setAttribute('aria-label', spec[2] + ': ' + item.label);
                        button.disabled = index + spec[0] < 0 || index + spec[0] >= display.length;
                        button.addEventListener('click', function() { move(index, spec[0]); });
                        controls.appendChild(button);
                    });
                    li.appendChild(controls);
                }
                list.appendChild(li);
            });
        }

        pendingCheck = function() {
            graded = true;
            var correct = inOrder(display);
            draw();
            if (!correct) {
                var answer = document.createElement('div');
                answer.className = 'commu-activity-answer';
                answer.innerHTML = '<span class="commu-source-label">' + escapeHtml(lang === 'en' ? 'The order' : '올바른 순서') + '</span><ol>'
                    + labels.map(function(label, index) {
                        return '<li>' + escapeHtml(label) + (notes[index] ? '<small>' + escapeHtml(notes[index]) + '</small>' : '') + '</li>';
                    }).join('') + '</ol>';
                els.choices.appendChild(answer);
            }
            settleActivity(question, correct);
        };
        draw();
        els.next.disabled = false;
    }

    function renderSort(question) {
        var groups = text(question.groups) || [];
        var items = shuffleChoices((question.items || []).map(function(item, index) {
            return { id: index, label: text(item), group: item.group, placed: -1 };
        }));
        var selected = null;
        var graded = false;
        activityHint(lang === 'en' ? 'Pick an item, then the group it belongs to.' : '항목을 누른 다음 들어갈 묶음을 누르세요.');
        var pool = document.createElement('div');
        pool.className = 'commu-sort-pool';
        var board = document.createElement('div');
        board.className = 'commu-sort-groups';
        els.choices.appendChild(pool);
        els.choices.appendChild(board);

        function itemButton(item) {
            var button = activityButton('commu-sort-item', item.label);
            if (graded) {
                button.disabled = true;
                var right = item.placed === item.group;
                button.classList.add(right ? 'is-correct' : 'is-wrong');
                if (!right) {
                    var fix = document.createElement('small');
                    fix.textContent = '→ ' + groups[item.group];
                    button.appendChild(fix);
                }
                return button;
            }
            if (selected === item.id) button.classList.add('is-selected');
            button.setAttribute('aria-pressed', selected === item.id ? 'true' : 'false');
            button.addEventListener('click', function() {
                // A placed item comes back out, already picked up.
                if (item.placed !== -1) { item.placed = -1; selected = item.id; }
                else selected = selected === item.id ? null : item.id;
                draw();
            });
            return button;
        }

        function draw() {
            pool.innerHTML = '';
            board.innerHTML = '';
            var waiting = items.filter(function(item) { return item.placed === -1; });
            waiting.forEach(function(item) { pool.appendChild(itemButton(item)); });
            pool.classList.toggle('is-hidden', !waiting.length);
            groups.forEach(function(name, groupIndex) {
                var box = document.createElement('div');
                box.className = 'commu-sort-group';
                var target = activityButton('commu-sort-target', name);
                target.disabled = graded || selected === null;
                target.addEventListener('click', function() {
                    if (selected === null) return;
                    items.forEach(function(item) { if (item.id === selected) item.placed = groupIndex; });
                    selected = null;
                    draw();
                    var nextItem = pool.querySelector('button');
                    if (nextItem) nextItem.focus();
                });
                box.appendChild(target);
                items.filter(function(item) { return item.placed === groupIndex; }).forEach(function(item) { box.appendChild(itemButton(item)); });
                board.appendChild(box);
            });
            if (!graded) els.next.disabled = waiting.length > 0;
        }

        pendingCheck = function() {
            graded = true;
            selected = null;
            draw();
            settleActivity(question, items.every(function(item) { return item.placed === item.group; }));
        };
        draw();
    }

    function renderCloze(question) {
        var pieces = text(question.text).split(/\[\[([^\[\]]+)\]\]/);
        var answers = pieces.filter(function(_, index) { return index % 2 === 1; }).map(function(word) { return word.trim(); });
        var bank = shuffleChoices(answers.concat(text(question.distractors) || []).map(function(word) { return { word: word, blank: -1 }; }));
        var target = 0;
        var graded = false;
        activityHint(lang === 'en' ? 'Fill each blank with a word from the list.' : '아래 낱말을 눌러 빈칸을 채우세요.');
        var passage = document.createElement('blockquote');
        passage.className = 'commu-passage-text commu-cloze';
        var words = document.createElement('div');
        words.className = 'commu-cloze-bank';
        els.choices.appendChild(passage);
        els.choices.appendChild(words);

        function wordIn(blank) {
            for (var i = 0; i < bank.length; i += 1) if (bank[i].blank === blank) return bank[i];
            return null;
        }

        function firstEmpty() {
            for (var i = 0; i < answers.length; i += 1) if (!wordIn(i)) return i;
            return -1;
        }

        function draw() {
            passage.innerHTML = '';
            var paragraph = document.createElement('p');
            pieces.forEach(function(piece, index) {
                if (index % 2 === 0) {
                    piece.split(' … ').forEach(function(part, partIndex) {
                        if (partIndex) {
                            var gap = document.createElement('span');
                            gap.className = 'commu-source-gap';
                            gap.textContent = ' … ';
                            paragraph.appendChild(gap);
                        }
                        paragraph.appendChild(document.createTextNode(part));
                    });
                    return;
                }
                var blank = (index - 1) / 2;
                var filled = wordIn(blank);
                var button = activityButton('commu-cloze-blank', filled ? filled.word : String(blank + 1));
                button.setAttribute('aria-label', (lang === 'en' ? 'Blank ' : '빈칸 ') + (blank + 1) + (filled ? ': ' + filled.word : ''));
                if (filled) button.classList.add('is-filled');
                if (graded) {
                    button.disabled = true;
                    var right = Boolean(filled) && filled.word === answers[blank];
                    button.classList.add(right ? 'is-correct' : 'is-wrong');
                    if (!right) {
                        var fix = document.createElement('small');
                        fix.textContent = '→ ' + answers[blank];
                        button.appendChild(fix);
                    }
                } else {
                    if (!filled && target === blank) button.classList.add('is-selected');
                    button.addEventListener('click', function() {
                        if (filled) filled.blank = -1;
                        target = blank;
                        draw();
                    });
                }
                paragraph.appendChild(button);
            });
            passage.appendChild(paragraph);
            words.innerHTML = '';
            bank.forEach(function(entry) {
                var button = activityButton('commu-cloze-word', entry.word);
                button.disabled = graded || entry.blank !== -1;
                button.addEventListener('click', function() {
                    var blank = target !== -1 && !wordIn(target) ? target : firstEmpty();
                    if (blank === -1) return;
                    entry.blank = blank;
                    target = firstEmpty();
                    draw();
                });
                words.appendChild(button);
            });
            if (!graded) els.next.disabled = firstEmpty() !== -1;
        }

        pendingCheck = function() {
            graded = true;
            draw();
            settleActivity(question, answers.every(function(answer, blank) {
                var filled = wordIn(blank);
                return Boolean(filled) && filled.word === answer;
            }));
        };
        draw();
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
        var correctIndex = Number(question.answer);
        var correct = index === correctIndex;
        Array.prototype.forEach.call(els.choices.children, function(button) {
            var originalIndex = Number(button.getAttribute('data-original-index'));
            button.disabled = true;
            if (originalIndex === correctIndex) button.classList.add('is-correct');
            if (originalIndex === index && !correct) button.classList.add('is-wrong');
        });
        settleAnswer(question, correct, index);
    }

    // What every kind of question does once it is answered: score, schedule,
    // measure, explain, and open the way on. `index` is the chosen choice of a
    // multiple-choice question (null for an activity).
    function settleAnswer(question, correct, index) {
        answered = true;
        if (correct) {
            active.score += 1;
            active.streak += 1;
        } else {
            active.streak = 0;
            if (active.mode === 'review') active.missed.push(active.pos);
            else active.missed.push(active.order[active.pos]);
        }
        recordAnswer(currentLesson(), question, correct);
        if (window.CommuLingoMeasurement) window.CommuLingoMeasurement.answer(correct);

        els.feedback.className = 'commu-feedback' + (correct ? '' : ' is-wrong');
        els.feedback.innerHTML = feedbackHtml(question, index, correct);
        if (correct) showAnswerReward();
        els.next.disabled = false;
        els.meter.style.width = Math.round(((active.pos + 1) / roundLength()) * 100) + '%';
    }

    function feedbackHtml(question, index, correct) {
        var selectedFeedback = choiceFeedback(question, index);
        // The explanation is shown only after the question has been answered,
        // which is why it carries dictionary links where the prompt and the
        // choices do not.
        var explanation = text(question.explanationHtml) || escapeHtml(text(question.explanation));
        // The note on the chosen answer comes first: it is the reply to what
        // the learner just did; the general explanation follows.
        var parts = ['<strong class="commu-feedback-marker">' + escapeHtml(correct ? strings.correct : strings.incorrect) + '</strong>'];
        if (selectedFeedback) {
            parts.push('<span class="commu-choice-feedback">' + escapeHtml(selectedFeedback) + '</span>');
        }
        parts.push('<span>' + explanation + '</span>');
        if (correct && active && active.streak >= 3) {
            parts.push('<span class="commu-streak-badge">' + escapeHtml(streakLabel(active.streak)) + '</span>');
        }
        // The passage was already shown above the question.
        var source = passageFirst(currentLesson(), question) ? '' : sourceHtml(question);
        if (source) parts.push(source);
        return parts.join('');
    }

    function isReadingLesson(lesson) {
        return Boolean(lesson && lesson.format === 'guided-reading');
    }

    function isWorkshopLesson(lesson) {
        return Boolean(lesson && lesson.format === 'workshop');
    }

    // A reading lesson opens on its first passage and a workshop on its first
    // activity: neither has a concept brief to pass.
    function skipsIntro(lesson) {
        return isReadingLesson(lesson) || isWorkshopLesson(lesson);
    }

    // A reading lesson puts every passage above its question; in other
    // courses a question opts in with source.showFirst, when reading the
    // passage is part of solving it.
    function passageFirst(lesson, question) {
        var source = question && question.source;
        if (!source || source.kind === 'reference' || !text(source.quote)) return false;
        return isReadingLesson(lesson) || source.showFirst === true;
    }

    function hidePassage() {
        if (!els.passage) return;
        els.passage.classList.add('is-hidden');
        els.passage.innerHTML = '';
        els.quiz.classList.remove('is-reading');
    }

    // Reading lessons (and questions with source.showFirst) put the passage
    // first: one or two paragraphs of the text, the sentence placing it, then
    // the question about it. The link opens the full text at that section in
    // a new tab.
    function renderPassage(lesson, question) {
        if (!els.passage) return;
        var source = question && question.source;
        var quote = passageFirst(lesson, question) && text(source.quote);
        var context = text(question.context);
        if (!quote) {
            // A workshop activity may carry only the line that sets its scene.
            if (context && isWorkshopLesson(lesson)) {
                els.passage.innerHTML = '<p class="commu-passage-context">' + escapeHtml(context) + '</p>';
                els.passage.classList.remove('is-hidden');
                els.quiz.classList.remove('is-reading');
            } else hidePassage();
            return;
        }
        var label = text(source.label);
        var pieces = quote.split(' … ').map(escapeHtml).join(' <span class="commu-source-gap">…</span> ');
        els.passage.innerHTML = (context ? '<p class="commu-passage-context">' + escapeHtml(context) + '</p>' : '')
            + '<blockquote class="commu-passage-text"><p>' + pieces + '</p>'
            + (source.href && label ? sourceLinkHtml(source.href, label, lang === 'en' ? ' →' : ' 전문에서 보기 →') : '')
            + '</blockquote>';
        els.passage.classList.remove('is-hidden');
        els.quiz.classList.add('is-reading');
    }

    // The passage of the original text the question was drawn from, shown
    // under the feedback so the fragment the quiz cut out is put back into
    // the argument. Only courses whose text is on the site carry `source`.
    function sourceHtml(question) {
        var source = question && question.source;
        if (!source) return '';
        // A reference, or a cloze whose passage was the exercise itself.
        if (source.kind === 'reference' || !source.quote) {
            var referenceLabel = text(source.label);
            if (!referenceLabel || !/^(https:\/\/|\/commulingo\/docs\/)/.test(source.href || '')) return '';
            return '<div class="commu-source"><span class="commu-source-label">'
                + escapeHtml(lang === 'en' ? 'Evidence and sources' : '근거 자료') + '</span>'
                + sourceLinkHtml(source.href, referenceLabel, ' →') + '</div>';
        }
        if (!source.quote) return '';
        var quote = text(source.quote);
        if (!quote) return '';
        var pieces = quote.split(' … ').map(escapeHtml).join(' <span class="commu-source-gap">…</span> ');
        var label = text(source.label);
        return '<blockquote class="commu-source">' +
            '<span class="commu-source-label">' + escapeHtml(lang === 'en' ? 'From the text' : '원전에서') + '</span>' +
            '<p>' + pieces + '</p>' +
            (source.href && label ? sourceLinkHtml(source.href, label, lang === 'en' ? ' →' : ' 전문 읽기 →') : '') +
            '</blockquote>';
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
        if (active.mode === 'review') { finishReview(); return; }
        if (window.CommuLingoMeasurement) window.CommuLingoMeasurement.complete();
        if (active.mode === 'lesson') active.firstScore = active.score;
        var total = lessonQuestionCount(active.lesson);
        var perfect = active.mode === 'retry' ? active.missed.length === 0 : active.score === total;
        var firstScore = active.mode === 'retry' ? active.firstScore : active.score;
        // Retrying the missed questions to all correct still completes the
        // lesson, but the score stays the first attempt's.
        var item = {
            completed: perfect,
            score: firstScore,
            totalQuestions: total,
            updatedAt: new Date().toISOString()
        };
        progress[active.lesson.id] = mergeOne(progress[active.lesson.id], item);
        saveLocalProgress();
        postProgress(active.lesson.id, progress[active.lesson.id], false);
        saveLast(active.lesson);

        setPlainPrompt(strings.allDone || 'Lesson complete');
        if (els.focus) els.focus.classList.add('is-hidden');
        hidePassage();
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(chapterTitle(active.lesson)) + '</span>' + levelBadge(active.lesson);
        if (els.intro) els.intro.classList.add('is-hidden');
        els.prompt.classList.remove('is-hidden');
        els.choices.classList.remove('is-hidden');
        els.choices.innerHTML = '';
        els.feedback.className = 'commu-feedback' + (perfect ? ' is-perfect' : '');
        els.feedback.innerHTML = finishFeedbackHtml(perfect, firstScore, total) + takeawayHtml(active.lesson);
        els.quiz.classList.toggle('has-perfect-reward', perfect);
        els.next.disabled = false;
        if (!perfect) {
            // Only the missed questions come back, not the whole lesson.
            els.next.textContent = (strings.retryMissed || strings.tryAgain || 'Retry') + ' · ' + active.missed.length;
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

    // The missed questions again, in their original order, until every one of
    // them has been answered correctly; only then does the lesson count as
    // completed. The first-pass score is kept for the closing note.
    function startRetry(lesson, missed, firstScore) {
        if (window.CommuLingoMeasurement) window.CommuLingoMeasurement.begin('lesson', lesson.id, data.version, 'retry');
        active = {
            mode: 'retry',
            lesson: lesson,
            order: missed.slice(),
            pos: 0,
            score: 0,
            streak: 0,
            intro: false,
            missed: [],
            firstScore: typeof firstScore === 'number' ? firstScore : 0
        };
        answered = false;
        hideNextLesson();
        els.quiz.classList.remove('has-perfect-reward');
        renderQuestion();
    }

    // Due questions of this book, drawn from several lessons, shuffled.
    function startReview() {
        if (window.CommuLingoMeasurement) window.CommuLingoMeasurement.stop();
        if (!Schedule) return;
        var due = Schedule.dueList(answers, bookLessonIds(), Date.now()).slice(0, 20);
        if (!due.length) { renderReviewButton(); return; }
        var byLesson = {};
        due.forEach(function(ref) { (byLesson[ref.lessonId] = byLesson[ref.lessonId] || []).push(ref.questionId); });
        var lessonIds = Object.keys(byLesson);
        returnScrollLesson = lessonById(lessonIds[0]);
        hideNextLesson();
        setBookContextHidden(true);
        els.list.classList.add('is-hidden');
        els.quiz.classList.remove('is-hidden');
        els.next.removeAttribute('data-finished');
        enterQuizHistory('#review');
        renderLoadingLesson(lessonById(lessonIds[0]) || lessons[0]);
        scrollToQuiz();
        Promise.all(lessonIds.map(function(id) {
            var lesson = lessonById(id);
            return lesson ? loadLessonDetail(lesson).catch(function() { return null; }) : Promise.resolve(null);
        })).then(function(loaded) {
            var items = [];
            loaded.forEach(function(lesson, i) {
                if (!lesson || !Array.isArray(lesson.questions)) return;
                byLesson[lessonIds[i]].forEach(function(qid) {
                    var question = lesson.questions.filter(function(q) { return q.id === qid; })[0];
                    if (question) items.push({ lesson: lesson, question: question });
                });
            });
            items = shuffleChoices(items);
            if (!items.length) { showLessons(); return; }
            active = { mode: 'review', items: items, pos: 0, score: 0, streak: 0, intro: false, missed: [], firstScore: null, lesson: items[0].lesson };
            answered = false;
            renderQuestion();
        });
    }

    function finishReview() {
        var total = roundLength();
        var perfect = active.score === total;
        setPlainPrompt(strings.reviewDone || 'Review complete');
        if (els.focus) els.focus.classList.add('is-hidden');
        hidePassage();
        els.lessonTitle.innerHTML = '<span>' + escapeHtml(strings.reviewTitle || 'Review') + '</span>';
        els.choices.innerHTML = '';
        els.feedback.className = 'commu-feedback' + (perfect ? ' is-perfect' : '');
        els.feedback.innerHTML = [
            '<strong class="commu-feedback-marker">' + escapeHtml((strings.score || 'Score') + ': ' + active.score + ' / ' + total) + '</strong>',
            '<span>' + escapeHtml(fill(perfect ? (strings.reviewResultPerfect || '') : (strings.reviewResult || ''), { score: active.score, total: total })) + '</span>'
        ].join('');
        els.quiz.classList.toggle('has-perfect-reward', perfect);
        els.next.disabled = false;
        els.next.textContent = strings.backToLessons || 'Lessons';
        els.next.setAttribute('data-finished', '1');
        hideNextLesson();
        answered = true;
    }

    // The distinction a workshop chapter was about, shown when it is over.
    function takeawayHtml(lesson) {
        var takeaway = lesson && text(lesson.takeaway);
        if (!takeaway) return '';
        return '<div class="commu-source"><span class="commu-source-label">'
            + escapeHtml(lang === 'en' ? 'What this chapter told apart' : '이번 편에서 구별한 것') + '</span>'
            + '<p>' + escapeHtml(takeaway) + '</p></div>';
    }

    function finishFeedbackHtml(perfect, firstScore, total) {
        var retried = active.mode === 'retry';
        var score = (strings.score || 'Score') + ': ' + (retried ? firstScore : active.score) + ' / ' + total;
        if (!perfect) {
            var left = active.missed.length;
            var again = retried ? fill(strings.retryAgainNote || '', { left: left }) : '';
            return '<strong class="commu-feedback-marker">' + escapeHtml(score) + '</strong>'
                + (again ? '<span class="commu-choice-feedback">' + escapeHtml(again) + '</span>' : '');
        }
        var label = lang === 'en' ? 'Perfect lesson' : '만점 완료';
        var note = retried
            ? fill(strings.retryNote || '', { first: firstScore, now: total, total: total })
            : (lang === 'en' ? 'The full concept path is clear enough to move on.' : '이 장의 기본 개념 흐름을 안정적으로 잡았습니다.');
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

    // Paint immediately from the embedded lesson data and local progress;
    // the server progress sync only triggers a repaint when it changes something.
    renderLessons();
    handleDeepLink();
    window.addEventListener('popstate', function() {
        var quizOpen = !els.quiz.classList.contains('is-hidden');
        var lessonHash = /(?:^|[#&])(lesson=|review)/.test(window.location.hash || '');
        if (quizOpen && !lessonHash) showLessons(null, true);
        else if (!quizOpen && lessonHash) handleDeepLink(true);
    });
    syncServerProgress().then(function(changed) {
        if (changed) renderLessons();
    });
})();
