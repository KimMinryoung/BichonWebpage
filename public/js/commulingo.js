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

    function flattenLessons(bundle) {
        var out = [];
        (bundle.collections || []).forEach(function(collection) {
            (collection.chapters || []).forEach(function(chapter) {
                (chapter.lessons || []).forEach(function(lesson) {
                    out.push({
                        id: lesson.id,
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

        lessons.forEach(function(lesson) {
            var item = progress[lesson.id];
            var percent = item && item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0;
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'commu-lesson-card';
            button.disabled = Boolean(lesson.locked || !lesson.questions.length);
            button.innerHTML = [
                '<span class="commulingo-kicker">' + escapeHtml(lesson.collectionTitle) + ' · ' + escapeHtml(chapterLabel(lesson)) + '</span>',
                '<h2>' + escapeHtml(lesson.title) + '</h2>',
                '<p>' + escapeHtml(lesson.summary) + '</p>',
                '<div class="commu-progress-track"><span style="width:' + percent + '%"></span></div>',
                '<div class="commu-lesson-meta"><span>' + lesson.questions.length + ' ' + escapeHtml(strings.questions || 'Questions') + '</span><span>' + lessonLabel(lesson, item) + '</span></div>'
            ].join('');
            button.addEventListener('click', function() { startLesson(lesson); });
            els.list.appendChild(button);
        });
    }

    function chapterLabel(lesson) {
        var number = lesson.chapterNumber ? (lang === 'en' ? 'Chapter ' + lesson.chapterNumber : lesson.chapterNumber + '장') : '';
        return number ? number + ' ' + lesson.chapterTitle : lesson.chapterTitle;
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
        els.lessonTitle.textContent = chapterLabel(active.lesson) + ' · ' + active.lesson.title;
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
        els.lessonTitle.textContent = active.lesson.title;
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
