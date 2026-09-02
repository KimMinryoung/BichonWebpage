document.addEventListener('DOMContentLoaded', function() {
    var currentOffset = 0;

    function getLimit() {
        return parseInt(document.getElementById('limitSelect').value, 10);
    }

    function getRouteFilter() {
        return document.getElementById('routeFilter').value;
    }

    // Attribute-safe (quotes escaped), the same body as every other page's copy.
    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDate(iso) {
        var d = new Date(iso);
        return d.toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    }

    async function fetchLogs(offset) {
        var limit = getLimit();
        var container = document.getElementById('logsContainer');
        container.innerHTML = '<div class="loading-spinner">불러오는 중...</div>';

        try {
            var res = await fetch('/admin/api/logs?limit=' + limit + '&offset=' + offset);
            if (!res.ok) throw new Error('API error: ' + res.status);
            var data = await res.json();
            renderLogs(data.logs, offset, limit);
        } catch (err) {
            container.innerHTML = '<div class="empty-state">로그를 불러올 수 없습니다: ' + escapeHtml(err.message) + '</div>';
            document.getElementById('pagination').innerHTML = '';
        }
    }

    function renderLogs(logs, offset, limit) {
        var container = document.getElementById('logsContainer');
        var routeFilter = getRouteFilter();

        var filtered = logs;
        if (routeFilter !== 'all') {
            filtered = logs.filter(function(l) { return l.route === routeFilter; });
        }

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">로그가 없습니다.</div>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        var html = '';
        filtered.forEach(function(log, i) {
            var routeClass = log.route === 'casual' ? 'route-casual' : 'route-vectorstore';
            var routeLabel = log.route === 'casual' ? '일상대화' : '진지한 대화';
            var answerId = 'answer-' + log.id + '-' + i;

            html += '<div class="log-card">';
            html += '<div class="log-card-header">';
            html += '<span>#' + log.id + ' &mdash; ' + formatDate(log.created_at) + '</span>';
            html += '<span class="route-badge ' + routeClass + '">' + routeLabel + '</span>';
            html += '</div>';

            html += '<div class="log-label">질문</div>';
            html += '<div class="log-query">' + escapeHtml(log.user_query) + '</div>';

            html += '<div class="log-label">답변</div>';
            html += '<button class="log-answer-toggle" data-answer-toggle="' + answerId + '" aria-expanded="false">답변 열기</button>';
            html += '<div class="log-answer" id="' + answerId + '">' + escapeHtml(log.bot_answer) + '</div>';

            html += '<div class="log-meta">';
            html += '<span>이용 문헌: ' + (log.documents_count || 0) + '개</span>';
            html += '<span>웹 검색: ' + (log.web_search_used ? '함' : '하지 않음') + '</span>';
            html += '</div>';

            if (log.strategy || (log.processing_logs && log.processing_logs.length > 0)) {
                var detailId = 'detail-' + i;
                html += '<button class="log-details-toggle" data-toggle="' + detailId + '">생각 과정</button>';
                html += '<div class="log-details" id="' + detailId + '">';
                var procLogs = log.processing_logs;
                if (typeof procLogs === 'string') {
                    try { procLogs = JSON.parse(procLogs); } catch(e) { procLogs = [procLogs]; }
                }
                if (procLogs && procLogs.length > 0) {
                    html += '<div class="log-label" style="margin-top:8px">Processing Logs</div>';
                    html += '<pre>' + escapeHtml(procLogs.join('\n')) + '</pre>';
                }
                html += '</div>';
            }

            html += '</div>';
        });

        container.innerHTML = html;

        // Pagination
        var pag = document.getElementById('pagination');
        var pagHtml = '';
        if (offset > 0) {
            pagHtml += '<button class="btn btn-small" data-page="' + Math.max(0, offset - limit) + '">&#9664; Prev</button>';
        }
        if (logs.length === limit) {
            pagHtml += '<button class="btn btn-small" data-page="' + (offset + limit) + '">Next &#9654;</button>';
        }
        pag.innerHTML = pagHtml;
    }

    // Event delegation for dynamically created buttons
    document.addEventListener('click', function(e) {
        var answerId = e.target.getAttribute('data-answer-toggle');
        if (answerId) {
            var answer = document.getElementById(answerId);
            if (!answer) return;
            var isOpen = answer.classList.toggle('open');
            e.target.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            e.target.textContent = isOpen ? '답변 닫기' : '답변 열기';
            return;
        }

        var toggleId = e.target.getAttribute('data-toggle');
        if (toggleId) {
            document.getElementById(toggleId).classList.toggle('open');
            return;
        }
        var pageOffset = e.target.getAttribute('data-page');
        if (pageOffset !== null) {
            currentOffset = parseInt(pageOffset, 10);
            fetchLogs(currentOffset);
        }
    });

    document.getElementById('refreshBtn').addEventListener('click', function() {
        currentOffset = 0;
        fetchLogs(0);
    });

    document.getElementById('routeFilter').addEventListener('change', function() {
        fetchLogs(currentOffset);
    });

    document.getElementById('limitSelect').addEventListener('change', function() {
        currentOffset = 0;
        fetchLogs(0);
    });

    // Initial load
    fetchLogs(0);
});
