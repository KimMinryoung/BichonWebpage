(function() {
    var state = {
        offset: 0,
        limit: 50,
        search: '',
        total: 0,
        users: [],
        selectedId: null
    };
    var text = window.ADMIN_USERS_TEXT || {};
    var csrfToken = window.ADMIN_CSRF_TOKEN || '';

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function formatDate(value) {
        if (!value) return text.never || '-';
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function setStatus(message, type) {
        var el = $('usersStatus');
        el.textContent = message || '';
        el.className = 'users-status' + (message ? ' show ' + (type || '') : '');
    }

    function userById(id) {
        return state.users.find(function(user) { return Number(user.id) === Number(id); });
    }

    async function apiFetch(url, options) {
        var opts = options || {};
        var headers = Object.assign({}, opts.headers || {});
        if (opts.method && opts.method !== 'GET') {
            headers['x-csrf-token'] = csrfToken;
        }
        var response = await fetch(url, Object.assign({}, opts, { headers: headers }));
        var data = await response.json().catch(function() { return {}; });
        if (!response.ok) {
            throw new Error(data.detail || data.error || ('HTTP ' + response.status));
        }
        return data;
    }

    async function fetchUsers() {
        $('usersList').innerHTML = '<div class="loading-spinner">' + escapeHtml(text.loading || 'Loading...') + '</div>';
        var params = new URLSearchParams({
            limit: String(state.limit),
            offset: String(state.offset)
        });
        if (state.search) params.set('search', state.search);
        try {
            var data = await apiFetch('/admin/api/users?' + params.toString());
            state.users = data.users || [];
            state.total = data.total || 0;
            renderUsers();
            renderPagination();
            if (state.selectedId) {
                var stillVisible = userById(state.selectedId);
                if (stillVisible) fetchUserDetail(state.selectedId);
            }
        } catch (err) {
            $('usersList').innerHTML = '<div class="empty-state">' + escapeHtml(err.message) + '</div>';
            $('usersPagination').innerHTML = '';
        }
    }

    function renderUsers() {
        var container = $('usersList');
        if (!state.users.length) {
            container.innerHTML = '<div class="empty-state">' + escapeHtml(text.empty || 'No users') + '</div>';
            return;
        }
        container.innerHTML = state.users.map(function(user) {
            var selected = Number(user.id) === Number(state.selectedId) ? ' selected' : '';
            var badges = '';
            if (user.is_admin) badges += '<span class="user-badge admin">' + escapeHtml(text.adminBadge || 'Admin') + '</span>';
            if (user.has_password) badges += '<span class="user-badge">' + escapeHtml(text.password || 'Password') + '</span>';
            return [
                '<button class="user-row' + selected + '" data-user-id="' + user.id + '">',
                    '<span class="user-main">',
                        '<span class="user-name">#' + user.id + ' ' + escapeHtml(user.username) + '</span>',
                        '<span class="user-meta">' + escapeHtml(text.created || 'Created') + ': ' + formatDate(user.created_at) + '</span>',
                    '</span>',
                    '<span class="user-counts">',
                        '<span>' + Number(user.fingerprint_count || 0) + ' fp</span>',
                        '<span>' + Number(user.passkey_count || 0) + ' keys</span>',
                        '<span>' + Number(user.chat_log_count || 0) + ' chats</span>',
                    '</span>',
                    '<span class="user-badges">' + badges + '</span>',
                '</button>'
            ].join('');
        }).join('');
    }

    function renderPagination() {
        var html = '';
        if (state.offset > 0) {
            html += '<button class="btn btn-small" data-page-offset="' + Math.max(0, state.offset - state.limit) + '">&#9664; Prev</button>';
        }
        if (state.offset + state.limit < state.total) {
            html += '<button class="btn btn-small" data-page-offset="' + (state.offset + state.limit) + '">Next &#9654;</button>';
        }
        if (state.total) {
            html += '<span class="users-page-count">' + (state.offset + 1) + '-' + Math.min(state.offset + state.limit, state.total) + ' / ' + state.total + '</span>';
        }
        $('usersPagination').innerHTML = html;
    }

    async function fetchUserDetail(userId) {
        state.selectedId = Number(userId);
        renderUsers();
        $('userDetail').innerHTML = '<div class="loading-spinner">' + escapeHtml(text.loading || 'Loading...') + '</div>';
        try {
            var data = await apiFetch('/admin/api/users/' + encodeURIComponent(userId));
            renderDetail(data);
        } catch (err) {
            $('userDetail').innerHTML = '<div class="empty-state">' + escapeHtml(err.message) + '</div>';
        }
    }

    function renderDetail(data) {
        var user = data.user;
        var summary = data.chat_summary || {};
        var fingerprints = data.fingerprints || [];
        var passkeys = data.passkeys || [];
        var adminActions = user.is_admin ? '<div class="user-warning">Admin accounts cannot be merged or deleted here.</div>' : [
            '<div class="detail-actions">',
                '<button class="btn btn-small" data-action="rename">' + escapeHtml(text.rename || 'Rename') + '</button>',
                '<button class="btn btn-small" data-action="merge">' + escapeHtml(text.merge || 'Merge') + '</button>',
                '<button class="btn btn-small btn-danger" data-action="delete">' + escapeHtml(text.delete || 'Delete') + '</button>',
            '</div>'
        ].join('');

        $('userDetail').innerHTML = [
            '<div class="detail-header">',
                '<div>',
                    '<h2>#' + user.id + ' ' + escapeHtml(user.username) + '</h2>',
                    '<div class="detail-subtitle">' + escapeHtml(text.created || 'Created') + ': ' + formatDate(user.created_at) + '</div>',
                '</div>',
                adminActions,
            '</div>',
            '<div class="detail-stats">',
                stat(text.lastLogin || 'Last login', formatDate(user.last_login_at)),
                stat(text.fingerprints || 'Fingerprints', fingerprints.length),
                stat(text.passkeys || 'Passkeys', passkeys.length),
                stat(text.chatLogs || 'Chat logs', Number(summary.chat_log_count || 0)),
                stat(text.lastChat || 'Last chat', formatDate(summary.last_chat_at)),
            '</div>',
            '<div id="detailForm"></div>',
            '<h3>' + escapeHtml(text.fingerprints || 'Fingerprints') + '</h3>',
            renderFingerprints(fingerprints),
            '<h3>' + escapeHtml(text.passkeys || 'Passkeys') + '</h3>',
            renderPasskeys(passkeys),
        ].join('');
    }

    function stat(label, value) {
        return '<div class="detail-stat"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
    }

    function renderFingerprints(rows) {
        if (!rows.length) return '<div class="empty-state compact">' + escapeHtml(text.noFingerprints || 'No fingerprints') + '</div>';
        return '<div class="detail-table">' + rows.map(function(row) {
            return [
                '<div class="detail-table-row">',
                    '<code>' + escapeHtml(row.fingerprint) + '</code>',
                    '<span>' + Number(row.chat_log_count || 0) + ' chats</span>',
                    '<span>' + formatDate(row.bound_at) + '</span>',
                '</div>'
            ].join('');
        }).join('') + '</div>';
    }

    function renderPasskeys(rows) {
        if (!rows.length) return '<div class="empty-state compact">' + escapeHtml(text.noPasskeys || 'No passkeys') + '</div>';
        return '<div class="detail-table">' + rows.map(function(row) {
            return [
                '<div class="detail-table-row">',
                    '<span>' + escapeHtml(row.device_name || '(unnamed)') + '</span>',
                    '<span>' + formatDate(row.created_at) + '</span>',
                    '<span>' + formatDate(row.last_used_at) + '</span>',
                '</div>'
            ].join('');
        }).join('') + '</div>';
    }

    function renderRenameForm() {
        var user = userById(state.selectedId);
        if (!user) return;
        $('detailForm').innerHTML = [
            '<form class="inline-admin-form" data-form="rename">',
                '<input name="username" value="' + escapeAttr(user.username) + '" maxlength="30">',
                '<button class="btn btn-small" type="submit">' + escapeHtml(text.save || 'Save') + '</button>',
                '<button class="btn btn-small" type="button" data-action="cancel-form">' + escapeHtml(text.cancel || 'Cancel') + '</button>',
            '</form>'
        ].join('');
    }

    function renderMergeForm() {
        var source = userById(state.selectedId);
        if (!source) return;
        $('detailForm').innerHTML = [
            '<form class="inline-admin-form" data-form="merge">',
                '<label>' + escapeHtml(text.source || 'Source') + '<input value="#' + source.id + ' ' + escapeAttr(source.username) + '" disabled></label>',
                '<label>' + escapeHtml(text.target || 'Target user ID') + '<input name="targetUserId" inputmode="numeric" pattern="[0-9]+" required></label>',
                '<button class="btn btn-small" type="submit">' + escapeHtml(text.merge || 'Merge') + '</button>',
                '<button class="btn btn-small" type="button" data-action="cancel-form">' + escapeHtml(text.cancel || 'Cancel') + '</button>',
            '</form>'
        ].join('');
    }

    function renderDeleteForm() {
        var user = userById(state.selectedId);
        if (!user) return;
        $('detailForm').innerHTML = [
            '<form class="inline-admin-form danger" data-form="delete">',
                '<div class="form-note">' + escapeHtml(text.confirmDelete || 'Type the username to delete this account.') + '</div>',
                '<input name="confirmUsername" placeholder="' + escapeAttr(user.username) + '" autocomplete="off" required>',
                '<button class="btn btn-small btn-danger" type="submit">' + escapeHtml(text.delete || 'Delete') + '</button>',
                '<button class="btn btn-small" type="button" data-action="cancel-form">' + escapeHtml(text.cancel || 'Cancel') + '</button>',
            '</form>'
        ].join('');
    }

    async function submitDetailForm(form) {
        var kind = form.getAttribute('data-form');
        if (!state.selectedId) return;
        try {
            if (kind === 'rename') {
                var username = form.elements.username.value.trim();
                await apiFetch('/admin/api/users/' + state.selectedId, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username })
                });
            } else if (kind === 'merge') {
                var targetUserId = parseInt(form.elements.targetUserId.value, 10);
                await apiFetch('/admin/api/users/' + state.selectedId + '/merge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUserId: targetUserId })
                });
                state.selectedId = targetUserId;
            } else if (kind === 'delete') {
                var confirmUsername = form.elements.confirmUsername.value.trim();
                await apiFetch('/admin/api/users/' + state.selectedId, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ confirmUsername: confirmUsername })
                });
                state.selectedId = null;
                $('userDetail').innerHTML = '<div class="user-detail-empty">' + escapeHtml(text.selectHint || '') + '</div>';
            }
            setStatus('OK', 'success');
            await fetchUsers();
        } catch (err) {
            setStatus(err.message, 'error');
        }
    }

    document.addEventListener('click', function(event) {
        var row = event.target.closest('[data-user-id]');
        if (row) {
            fetchUserDetail(row.getAttribute('data-user-id'));
            return;
        }
        var page = event.target.getAttribute('data-page-offset');
        if (page !== null) {
            state.offset = parseInt(page, 10);
            fetchUsers();
            return;
        }
        var action = event.target.getAttribute('data-action');
        if (action === 'rename') renderRenameForm();
        if (action === 'merge') renderMergeForm();
        if (action === 'delete') renderDeleteForm();
        if (action === 'cancel-form') $('detailForm').innerHTML = '';
    });

    document.addEventListener('submit', function(event) {
        var form = event.target.closest('[data-form]');
        if (!form) return;
        event.preventDefault();
        submitDetailForm(form);
    });

    $('refreshUsers').addEventListener('click', function() {
        state.offset = 0;
        fetchUsers();
    });

    $('userLimit').addEventListener('change', function() {
        state.limit = parseInt(this.value, 10);
        state.offset = 0;
        fetchUsers();
    });

    var searchTimer = null;
    $('userSearch').addEventListener('input', function() {
        clearTimeout(searchTimer);
        var value = this.value.trim();
        searchTimer = setTimeout(function() {
            state.search = value;
            state.offset = 0;
            fetchUsers();
        }, 250);
    });

    fetchUsers();
})();
