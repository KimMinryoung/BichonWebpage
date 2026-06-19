(function () {
    var API_URL = document.querySelector('meta[name="api-url"]').content;
    var STRINGS = {
        thinking: document.querySelector('meta[name="str-thinking"]').content,
        error: document.querySelector('meta[name="str-error"]').content,
        notSaved: document.querySelector('meta[name="str-not-saved"]').content,
        retry: document.querySelector('meta[name="str-retry"]').content
    };

    var chatBox = document.getElementById('chatBox');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var busy = false;
    var originalTitle = document.title;
    var hiddenDuringRequest = false;
    var streamDied = false;
    var recovering = false;
    var recoveryContext = null; // { message, errorDiv } — set in catch, read by visibilitychange

    // 탭별 고유 세션 ID — 탭을 닫으면 초기화, 새로고침해도 유지
    var sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem('chatSessionId', sessionId);
    }

    // UUID 생성 — crypto.randomUUID()는 secure context(https/localhost)에서만
    // 존재한다. http로 접속하는 개발 인스턴스에서도 동작하도록 폴백을 둔다.
    function randomUuid() {
        if (window.crypto && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // 고유 사용자 ID — localStorage에 영구 저장 (서버 재시작 후에도 유지, 탭 간 공유)
    function getUserId() {
        var stored = localStorage.getItem('cl_user_id');
        if (stored) return stored;
        var uid = randomUuid();
        localStorage.setItem('cl_user_id', uid);
        return uid;
    }
    var userId = getUserId();

    // 선택된 대화 상대(페르소나) — localStorage에 영구 저장. 서버 /personas가
    // 카탈로그를 제공하며, 선택지가 2개 이상일 때만 셀렉터를 노출한다.
    var DEFAULT_PERSONA = 'cyber-lenin';
    var selectedPersona = localStorage.getItem('cl_persona') || DEFAULT_PERSONA;
    var personaSelector = document.getElementById('personaSelector');

    // 관리자 전용 페르소나는 별도의 키 입력 없이, Passkey로 로그인한 관리자 세션을
    // 프론트 프록시가 서버사이드에서 인증해 잠금 해제한다(브라우저에 키 노출 없음).

    async function initPersonas() {
        if (!personaSelector) return;
        try {
            var res = await fetch(API_URL + '/personas');
            if (!res.ok) return;
            var data = await res.json();
            var personas = (data && data.personas) || [];
            if (personas.length < 2) return; // 선택지가 하나면 숨김 유지
            var ids = personas.map(function (p) { return p.id; });
            // 저장된 선택이 더 이상 유효하지 않으면 서버 기본값으로 보정
            if (ids.indexOf(selectedPersona) === -1) {
                selectedPersona = (data.default && ids.indexOf(data.default) !== -1) ? data.default : ids[0];
                localStorage.setItem('cl_persona', selectedPersona);
            }
            personaSelector.innerHTML = '';
            personas.forEach(function (p) {
                var opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.display_name || p.id;
                if (p.description) opt.title = p.description;
                if (p.id === selectedPersona) opt.selected = true;
                personaSelector.appendChild(opt);
            });
            personaSelector.hidden = false;
            personaSelector.addEventListener('change', function () {
                // 응답 처리 중에는 전환 금지 — 선택을 되돌린다.
                if (busy) { personaSelector.value = selectedPersona; return; }
                if (personaSelector.value === selectedPersona) return;
                selectedPersona = personaSelector.value;
                localStorage.setItem('cl_persona', selectedPersona);
                // 페르소나별 히스토리는 분리되므로 새 세션으로 시작한다.
                startNewSession();
            });
        } catch (err) {
            console.error('persona load error:', err);
        }
    }
    initPersonas();

    // Render a connection-drop error in `errDiv` with an inline "다시 보내기" button.
    // Clicking the button re-fires the form submission with the lost message,
    // preserving any draft the user has typed since the failure.
    function showRetryError(errDiv, mainText, retryMessage) {
        errDiv.innerHTML = '';
        errDiv.classList.add('chat-message-error');

        var span = document.createElement('span');
        span.textContent = mainText + ' ';
        errDiv.appendChild(span);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-small chat-retry-btn';
        btn.style.marginLeft = '8px';
        btn.textContent = STRINGS.retry;
        btn.addEventListener('click', function () {
            if (busy) return;
            var draft = chatInput.value;
            chatInput.value = retryMessage;
            // requestSubmit dispatches the submit event synchronously; the handler
            // reads chatInput.value and clears it before awaiting, so we can safely
            // restore the user's draft right after.
            chatForm.requestSubmit();
            if (draft) chatInput.value = draft;
        });
        errDiv.appendChild(btn);
    }

    // Recovery: poll /history after a background connection drop to find the completed answer
    async function tryRecoverFromHistory(msg, errDiv, logDiv) {
        if (recovering) return;
        recovering = true;
        errDiv.textContent = '연결이 끊겼습니다. 답변을 복구하는 중...';

        var delays = [2000, 4000, 8000];
        for (var i = 0; i < delays.length; i++) {
            await new Promise(function (resolve) { setTimeout(resolve, delays[i]); });
            try {
                var res = await fetch(API_URL + '/history?fingerprint=' + encodeURIComponent(userId) + '&limit=10');
                if (!res.ok) continue;
                var data = await res.json();
                var history = data.history || [];
                for (var j = 0; j < history.length; j++) {
                    if (history[j].user_query === msg) {
                        errDiv.remove();
                        if (logDiv) logDiv.remove();
                        appendMessage(history[j].bot_answer, 'chat-message-ai');
                        chatBox.scrollTop = chatBox.scrollHeight;
                        if (document.visibilityState === 'hidden') {
                            document.title = '💬 답변 도착 — ' + originalTitle;
                        }
                        recovering = false;
                        return;
                    }
                }
            } catch (e) { /* network error during poll — try again */ }
        }

        // All attempts failed — the answer was never saved (server died mid-generation
        // before _log_chat ran). Surface that truthfully and offer a one-click resend.
        showRetryError(errDiv, STRINGS.notSaved, msg);
        recovering = false;
    }

    // Page Visibility API: notify via title when answer arrives while hidden; scroll on return
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            if (busy) hiddenDuringRequest = true;
        } else {
            document.title = originalTitle;
            chatBox.scrollTop = chatBox.scrollHeight;
            // If stream died while we were away, try to recover the answer from history
            if (streamDied && hiddenDuringRequest && recoveryContext) {
                tryRecoverFromHistory(recoveryContext.message, recoveryContext.errorDiv, recoveryContext.logDiv);
            }
        }
    });

    var inHistoryMode = false;
    var originalPlaceholder = chatInput.placeholder;

    function formatRelative(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            var diff = (Date.now() - d.getTime()) / 1000;
            if (diff < 60) return '방금';
            if (diff < 3600) return Math.floor(diff / 60) + '분 전';
            if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
            if (diff < 604800) return Math.floor(diff / 86400) + '일 전';
            return d.toLocaleDateString();
        } catch { return ''; }
    }

    function renderSessionTurns(turns) {
        chatBox.innerHTML = '';
        for (var i = 0; i < turns.length; i++) {
            var item = turns[i];
            var userMsg = document.createElement('div');
            userMsg.className = 'chat-message chat-message-user';
            userMsg.textContent = item.user_query;
            chatBox.appendChild(userMsg);
            var aiMsg = document.createElement('div');
            aiMsg.className = 'chat-message chat-message-ai';
            aiMsg.innerHTML = DOMPurify.sanitize(marked.parse(item.bot_answer || ''), {ADD_ATTR: ['target']});
            chatBox.appendChild(aiMsg);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function resumeSession(sid) {
        try {
            var res = await fetch(API_URL + '/history?session_id=' + encodeURIComponent(sid) + '&fingerprint=' + encodeURIComponent(userId) + '&persona=' + encodeURIComponent(selectedPersona) + '&limit=200');
            if (!res.ok) throw new Error('서버 응답 오류');
            var data = await res.json();
            renderSessionTurns(data.history || []);
            sessionId = sid;
            sessionStorage.setItem('chatSessionId', sid);
            exitHistoryMode();
            return true;
        } catch (err) {
            console.error('resume error:', err);
            return false;
        }
    }

    function startNewSession() {
        sessionId = 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem('chatSessionId', sessionId);
        chatBox.innerHTML = '';
        exitHistoryMode();
    }

    async function loadSessions() {
        try {
            var res = await fetch(API_URL + '/sessions?fingerprint=' + encodeURIComponent(userId) + '&persona=' + encodeURIComponent(selectedPersona) + '&limit=50');
            if (!res.ok) throw new Error('서버 응답 오류');
            var data = await res.json();
            var sessions = data.sessions || [];

            chatBox.innerHTML = '';
            var container = document.createElement('div');
            container.id = 'historyContainer';
            container.className = 'session-list';

            var sep = document.createElement('div');
            sep.className = 'chat-history-separator';
            sep.textContent = sessions.length > 0 ? '── 이전 대화 기록 ──' : '── 이전 대화 기록이 없습니다 ──';
            container.appendChild(sep);

            for (var i = 0; i < sessions.length; i++) {
                var s = sessions[i];
                var card = document.createElement('button');
                card.type = 'button';
                card.className = 'session-card';
                card.setAttribute('data-session-id', s.session_id);

                var q = document.createElement('div');
                q.className = 'session-card-query';
                q.textContent = s.first_query || '(빈 대화)';
                card.appendChild(q);

                var meta = document.createElement('div');
                meta.className = 'session-card-meta';
                meta.textContent = formatRelative(s.last_at) + ' · ' + (s.message_count || 0) + '개 메시지';
                card.appendChild(meta);

                card.addEventListener('click', function (sid) {
                    return function () { resumeSession(sid); };
                }(s.session_id));

                container.appendChild(card);
            }

            chatBox.appendChild(container);
            chatBox.scrollTop = 0;
            return true;
        } catch (err) {
            console.error('Sessions load error:', err);
            var errorNote = document.createElement('div');
            errorNote.className = 'chat-message chat-message-log chat-message-error';
            errorNote.style.textAlign = 'center';
            errorNote.textContent = '⚠️ 대화 기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
            chatBox.appendChild(errorNote);
            setTimeout(() => errorNote.remove(), 3000);
            return false;
        }
    }

    function exitHistoryMode() {
        if (!inHistoryMode) return;
        var container = document.getElementById('historyContainer');
        if (container) container.remove();
        setLoading(false);
        chatBox.scrollTop = chatBox.scrollHeight;
        historyBtn.classList.remove('btn-primary');
        historyBtn.textContent = '이전 대화';
        chatInput.placeholder = originalPlaceholder;
        inHistoryMode = false;
    }

    var historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', async function () {
            historyBtn.disabled = true;
            if (!inHistoryMode) {
                setLoading(true);
                var success = await loadSessions();
                if (success) {
                    historyBtn.classList.add('btn-primary');
                    historyBtn.textContent = '닫기';
                    chatInput.placeholder = '세션을 클릭해 이어서 대화하거나 "닫기"를 누르세요';
                    inHistoryMode = true;
                } else {
                    setLoading(false);
                }
            } else {
                exitHistoryMode();
            }
            historyBtn.disabled = false;
        });
    }

    function appendMessage(text, className) {
        var div = document.createElement('div');
        div.className = 'chat-message ' + className;
        if(className === 'chat-message-ai'){
            // AI 답변의 마크다운을 HTML 문자열로 변환
            var dirtyHTML = marked.parse(text);
            // (보안-XSS 방어) 변환된 HTML에서 위험한 스크립트 제거
            var cleanHTML = DOMPurify.sanitize(dirtyHTML, {ADD_ATTR: ['target']});
            div.innerHTML = cleanHTML;
            // --- 답변 내 링크 클릭시 새 탭 열기 로직
            var links = div.querySelectorAll('a'); // div 안의 모든 링크(a 태그) 선택
                links.forEach(function(link) {
                link.setAttribute('target', '_blank');    // 새 탭에서 열기
                link.setAttribute('rel', 'noopener noreferrer'); // 보안 강화 (권장)
            });
        } else {
            // 인간이 입력한 메시지는 텍스트 그대로 출력
            div.textContent = text;
        }
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return div;
    }

    function createToolStatusMessage() {
        var div = document.createElement('div');
        div.className = 'chat-message chat-message-tool';

        var dot = document.createElement('span');
        dot.className = 'chat-tool-dot';
        dot.setAttribute('aria-hidden', 'true');
        div.appendChild(dot);

        var text = document.createElement('span');
        text.className = 'chat-tool-text';
        div.appendChild(text);

        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        return div;
    }

    function setToolStatusText(div, text, done) {
        if (!div) return;
        var label = div.querySelector('.chat-tool-text');
        if (label) label.textContent = text;
        div.classList.toggle('chat-message-tool-done', !!done);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function setLoading(on) {
        busy = on;
        chatSend.disabled = on;
        chatInput.disabled = on;
    }

    chatForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var message = chatInput.value.trim();
        if (!message || busy) return;

        appendMessage(message, 'chat-message-user');
        chatInput.value = '';
        hiddenDuringRequest = false;
        streamDied = false;
        recovering = false;
        recoveryContext = null;
        setLoading(true);

        var logDiv = appendMessage(STRINGS.thinking, 'chat-message-log');
        var aiDiv = null;
        var streamedText = '';
        var renderScheduled = false;
        var toolStatusDiv = null;
        var toolStatusRemoveTimer = null;
        var activeTools = {};

        function clearToolStatus() {
            activeTools = {};
            if (toolStatusRemoveTimer) {
                clearTimeout(toolStatusRemoveTimer);
                toolStatusRemoveTimer = null;
            }
            if (toolStatusDiv) {
                toolStatusDiv.remove();
                toolStatusDiv = null;
            }
        }

        function updateToolStatus(data, done) {
            var key = data.tool_name || data.label || 'tool';
            if (toolStatusRemoveTimer) {
                clearTimeout(toolStatusRemoveTimer);
                toolStatusRemoveTimer = null;
            }
            if (!toolStatusDiv || !toolStatusDiv.parentNode) {
                toolStatusDiv = createToolStatusMessage();
            }

            if (done) {
                delete activeTools[key];
            } else {
                activeTools[key] = data.content || ((data.label || '도구') + ' 사용 중');
            }

            var active = Object.keys(activeTools).map(function (name) {
                return activeTools[name];
            });
            if (active.length > 0) {
                setToolStatusText(toolStatusDiv, active.join(' · '), false);
            } else {
                setToolStatusText(toolStatusDiv, data.content || ((data.label || '도구') + ' 완료'), true);
                toolStatusRemoveTimer = setTimeout(function () {
                    if (Object.keys(activeTools).length === 0 && toolStatusDiv) {
                        toolStatusDiv.remove();
                        toolStatusDiv = null;
                    }
                    toolStatusRemoveTimer = null;
                }, 900);
            }
        }

        function renderAiMarkdown() {
            if (!aiDiv) return;
            var dirty = marked.parse(streamedText);
            var clean = DOMPurify.sanitize(dirty, { ADD_ATTR: ['target'] });
            aiDiv.innerHTML = clean;
            var links = aiDiv.querySelectorAll('a');
            links.forEach(function (link) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }

        function scheduleRender() {
            if (renderScheduled) return;
            renderScheduled = true;
            requestAnimationFrame(function () {
                renderScheduled = false;
                renderAiMarkdown();
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }

        try {
            var res = await fetch(API_URL + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId,
                    fingerprint: userId,
                    persona: selectedPersona,
                }),
            });

            if (!res.ok) throw new Error(res.statusText);

            var reader = res.body.getReader();
            var decoder = new TextDecoder();
            var buffer = '';
            var accumulatedLog = ""; // 로그를 계속 쌓아둘 변수

            while (true) {
                var result = await reader.read();
                if (result.done) break;

                buffer += decoder.decode(result.value, { stream: true });
                var lines = buffer.split('\n');
                buffer = lines.pop();

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line.startsWith('data:')) continue;
                    var jsonStr = line.slice(5).trim();
                    if (!jsonStr) continue;

                    try {
                        var data = JSON.parse(jsonStr);
                        
                        if (data.type === 'log') {
                            if (data.node === 'tool') continue;
                            // 새로운 로그 조각을 기존 로그에 추가
                            accumulatedLog += data.content + "\n\n";
                            if (logDiv && logDiv.parentNode) logDiv.textContent = accumulatedLog;

                            // 스크롤 조절
                            chatBox.scrollTop = chatBox.scrollHeight;
                        } else if (data.type === 'status' || data.type === 'warning') {
                            var prefix = data.type === 'warning' ? '주의: ' : '';
                            accumulatedLog += prefix + data.content + "\n\n";
                            if (logDiv && logDiv.parentNode) {
                                logDiv.textContent = accumulatedLog;
                            } else if (!aiDiv) {
                                logDiv = appendMessage(accumulatedLog, 'chat-message-log');
                            } else {
                                var note = appendMessage(prefix + data.content, 'chat-message-log');
                                if (data.type === 'warning') note.classList.add('chat-message-warning');
                            }
                            chatBox.scrollTop = chatBox.scrollHeight;
                        } else if (data.type === 'tool_start') {
                            updateToolStatus(data, false);
                        } else if (data.type === 'tool_done') {
                            updateToolStatus(data, true);
                        } else if (data.type === 'chunk') {
                            // 첫 조각 도착 시 로그창 제거하고 답변 칸 생성
                            if (!aiDiv) {
                                accumulatedLog = "";
                                if (logDiv) { logDiv.remove(); logDiv = null; }
                                clearToolStatus();
                                aiDiv = document.createElement('div');
                                aiDiv.className = 'chat-message chat-message-ai';
                                chatBox.appendChild(aiDiv);
                            }
                            streamedText += data.content;
                            scheduleRender();
                        } else if (data.type === 'answer') {
                            // 최종 답변 수신 — 스트림 내용과 같으면 그대로, 다르면 대체
                            accumulatedLog = "";
                            if (logDiv) { logDiv.remove(); logDiv = null; }
                            clearToolStatus();
                            if (!aiDiv) {
                                aiDiv = appendMessage(data.content, 'chat-message-ai');
                            } else {
                                streamedText = data.content;
                                renderAiMarkdown();
                                chatBox.scrollTop = chatBox.scrollHeight;
                            }
                            if (document.visibilityState === 'hidden') {
                                document.title = '💬 답변 도착 — ' + originalTitle;
                            }
                            if (data.truncated) {
                                var warn = appendMessage('답변이 모델 출력 한도에서 멈춰 마지막 부분이 미완성일 수 있습니다.', 'chat-message-log');
                                warn.classList.add('chat-message-warning');
                            }
                        } else if (data.type === 'error') {
                            if (logDiv) logDiv.remove();
                            clearToolStatus();
                            var errMsg = appendMessage(data.content, 'chat-message-ai');
                            errMsg.classList.add('chat-message-error');
                            chatBox.scrollTop = chatBox.scrollHeight;
                        }
                    } catch (err) {
                        throw new Error(STRINGS.error);
                    }
                }
            }
        } catch (err) {
            console.error("Chat Error: ", err);
            streamDied = true;
            clearToolStatus();
            var errDiv = (typeof aiDiv !== 'undefined' && aiDiv) ? aiDiv : appendMessage('', 'chat-message-ai');

            if (hiddenDuringRequest) {
                // Stream died while tab was hidden — attempt to recover answer from history.
                // Store context so visibilitychange can trigger recovery if tab is still hidden.
                recoveryContext = { message: message, errorDiv: errDiv, logDiv: logDiv };
                if (document.visibilityState === 'visible') {
                    tryRecoverFromHistory(message, errDiv);
                } else {
                    // Tab still hidden: show placeholder; visibilitychange → visible will start recovery
                    errDiv.textContent = '연결이 끊겼습니다. 탭으로 돌아오면 답변을 복구합니다...';
                }
            } else {
                showRetryError(errDiv, STRINGS.error, message);
            }

            chatBox.scrollTop = chatBox.scrollHeight;
        }

        setLoading(false);
        chatInput.focus();
    });
})();
