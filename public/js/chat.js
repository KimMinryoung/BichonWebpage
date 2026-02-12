(function () {
    var chatBox = document.getElementById('chatBox');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var busy = false;

    function appendMessage(text, className) {
        var div = document.createElement('div');
        div.className = 'chat-message ' + className;
        div.textContent = text;
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
                body: JSON.stringify({ message: message })
            });

            if (!res.ok) throw new Error(res.statusText);

            var reader = res.body.getReader();
            var decoder = new TextDecoder();
            var buffer = '';

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
                            logDiv.textContent = data.content;
                            chatBox.scrollTop = chatBox.scrollHeight;
                        } else if (data.type === 'answer') {
                            logDiv.remove();
                            aiDiv = appendMessage(data.content, 'chat-message-ai');
                        }
                    } catch (_) {}
                }
            }
        } catch (err) {
            logDiv.remove();
            var errDiv = aiDiv || appendMessage('', 'chat-message-ai');
            errDiv.textContent = STRINGS.error;
            errDiv.classList.add('chat-message-error');
        }

        setLoading(false);
        chatInput.focus();
    });
})();
