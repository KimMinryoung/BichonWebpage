(function () {
    var chatBox = document.getElementById('chatBox');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var busy = false;
    var originalTitle = document.title;
    var hiddenDuringRequest = false;

    // 탭별 고유 세션 ID — 탭을 닫으면 초기화, 새로고침해도 유지
    var sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem('chatSessionId', sessionId);
    }

    // 고유 사용자 ID — localStorage에 영구 저장 (서버 재시작 후에도 유지, 탭 간 공유)
    function getUserId() {
        var stored = localStorage.getItem('cl_user_id');
        if (stored) return stored;
        var uid = crypto.randomUUID();
        localStorage.setItem('cl_user_id', uid);
        return uid;
    }
    var userId = getUserId();

    // Page Visibility API: notify via title when answer arrives while hidden; scroll on return
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            if (busy) hiddenDuringRequest = true;
        } else {
            document.title = originalTitle;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    var inHistoryMode = false;
    var originalPlaceholder = chatInput.placeholder;

    async function loadHistory() {
        try {
            var res = await fetch(API_URL + '/history?fingerprint=' + encodeURIComponent(userId) + '&limit=50');
            if (!res.ok) return;
            var data = await res.json();

            // Wrap all history in one container so it can be removed cleanly
            var container = document.createElement('div');
            container.id = 'historyContainer';

            var sep = document.createElement('div');
            sep.className = 'chat-history-separator';
            sep.textContent = data.history.length > 0 ? '── 이전 대화 기록 ──' : '── 이전 대화 기록이 없습니다 ──';
            container.appendChild(sep);

            for (var i = 0; i < data.history.length; i++) {
                var item = data.history[i];
                var userMsg = document.createElement('div');
                userMsg.className = 'chat-message chat-message-user';
                userMsg.textContent = item.user_query;
                container.appendChild(userMsg);

                var aiMsg = document.createElement('div');
                aiMsg.className = 'chat-message chat-message-ai';
                aiMsg.innerHTML = DOMPurify.sanitize(marked.parse(item.bot_answer), {ADD_ATTR: ['target']});
                container.appendChild(aiMsg);
            }

            chatBox.insertBefore(container, chatBox.firstChild);
            chatBox.scrollTop = 0;
        } catch (err) {
            console.error('History load error:', err);
        }
    }

    var historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', async function () {
            historyBtn.disabled = true;

            if (!inHistoryMode) {
                // → History mode: disable input, load history, rename button
                setLoading(true);
                await loadHistory();
                historyBtn.classList.add('btn-primary');
                historyBtn.textContent = '채팅 재개';
                chatInput.placeholder = "'채팅 재개'를 클릭하면 대화 모드로 돌아갑니다";
                inHistoryMode = true;
            } else {
                // → Chat mode: remove history container, enable input, scroll to bottom
                var container = document.getElementById('historyContainer');
                if (container) container.remove();
                setLoading(false);
                chatBox.scrollTop = chatBox.scrollHeight;
                historyBtn.classList.remove('btn-primary');
                historyBtn.textContent = '이전 대화';
                chatInput.placeholder = originalPlaceholder;
                inHistoryMode = false;
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
        setLoading(true);

        var logDiv = appendMessage(STRINGS.thinking, 'chat-message-log');
        var aiDiv = null;

        try {
            var res = await fetch(API_URL + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId,
                    fingerprint: userId,
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
                            // 새로운 로그 조각을 기존 로그에 추가
                            accumulatedLog += data.content +"\n";
                            logDiv.textContent = accumulatedLog;

                            // 스크롤 조절
                            chatBox.scrollTop = chatBox.scrollHeight;
                        } else if (data.type === 'answer') {
                            // 답변이 오면 로그 변수 초기화 및 로그창 제거
                            accumulatedLog = "";
                            if (logDiv) logDiv.remove();

                            aiDiv = appendMessage(data.content, 'chat-message-ai');
                            if (document.visibilityState === 'hidden') {
                                document.title = '💬 답변 도착 — ' + originalTitle;
                            }
                        } else if (data.type === 'error') {
                            if (logDiv) logDiv.remove();
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
            var errDiv = (typeof aiDiv !== 'undefined' && aiDiv) ? aiDiv : appendMessage('', 'chat-message-ai');
            errDiv.textContent = hiddenDuringRequest
                ? STRINGS.error + ' 다른 탭에 있는 동안 연결이 끊겼을 수 있습니다. "이전 대화" 버튼으로 답변을 확인해 보세요.'
                : STRINGS.error;
            errDiv.classList.add('chat-message-error');

            // 에러 발생 시 최하단으로 스크롤
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        setLoading(false);
        chatInput.focus();
    });
})();
