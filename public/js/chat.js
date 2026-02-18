(function () {
    var chatBox = document.getElementById('chatBox');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var busy = false;

    // 탭별 고유 세션 ID — 탭을 닫으면 초기화, 새로고침해도 유지
    var sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem('chatSessionId', sessionId);
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
        setLoading(true);

        var logDiv = appendMessage(STRINGS.thinking, 'chat-message-log');
        var aiDiv = null;

        try {
            var res = await fetch(API_URL + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, session_id: sessionId })
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
            errDiv.textContent = STRINGS.error;
            errDiv.classList.add('chat-message-error');
            
            // 에러 발생 시 최하단으로 스크롤
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        setLoading(false);
        chatInput.focus();
    });
})();
