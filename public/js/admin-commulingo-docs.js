// Admin reference-library editor (views/admin/commulingo-docs.ejs): document
// list, link pickers, metadata editor, and fragment upload against
// /commulingo/admin/api/docs. Was an inline <script> block.

(function () {
    'use strict';
    var EN = document.documentElement.lang === 'en';
    var API = '/commulingo/admin/api/docs';
    var t = function (ko, en) { return EN ? en : ko; };

    var docs = [];
    var options = { people: [], terms: [], events: [] };
    var optionLabel = {};   // kind -> datalist label -> option
    var optionById = {};    // kind -> id -> option (the dictionary's own headword)
    var editing = null;     // current doc object being edited
    // A document links dictionary entries by id and nothing else; every name
    // on this screen is the dictionary's, read from the link options.
    var links = { people: [], terms: [], events: [] };

    // Manifest entries written before ids-only still carry { id, name }.
    var refId = function (ref) { return typeof ref === 'string' ? ref : (ref && ref.id) || ''; };
    var refLabel = function (kind, id) {
        var opt = (optionById[kind] || {})[id];
        if (!opt) return id;
        return (EN ? opt.name.en || opt.name.ko : opt.name.ko || opt.name.en) || id;
    };

    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var status = function (el, msg, isError) {
        el.textContent = msg || '';
        el.classList.toggle('cdocs-error', !!isError);
    };

    function api(path, opts) {
        return fetch(API + (path || ''), opts).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (body) {
                if (!res.ok) throw new Error(body.error || ('HTTP ' + res.status));
                return body;
            });
        });
    }

    // ---- documents list ----
    function loadDocs() {
        return api('').then(function (body) {
            docs = body.docs || [];
            renderDocs();
        }).catch(function (err) { status($('docsStatus'), err.message, true); });
    }

    function linkSummary(doc) {
        var parts = [];
        ['people', 'terms', 'events'].forEach(function (kind) {
            (doc[kind] || []).forEach(function (ref) {
                parts.push(refLabel(kind, refId(ref)));
            });
        });
        return parts.length ? parts.join(' · ') : t('연결 없음', 'no links');
    }

    function renderDocs() {
        var host = $('docsList');
        if (!docs.length) {
            host.innerHTML = '<p class="cdocs-hint">' + t('등록된 문서가 없습니다.', 'No documents yet.') + '</p>';
            return;
        }
        host.innerHTML = docs.map(function (doc) {
            var title = (doc.title && (EN ? doc.title.en || doc.title.ko : doc.title.ko)) || doc.id;
            var kind = (doc.kind && (EN ? doc.kind.en : doc.kind.ko)) || '';
            return '<div class="cdocs-item" data-id="' + esc(doc.id) + '">'
                + '<div class="cdocs-item-main"><strong>' + esc(title) + '</strong>'
                + '<span class="cdocs-item-meta">' + esc(doc.id) + (kind ? ' · ' + esc(kind) : '') + ' · ' + esc(doc.addedAt || '') + '</span>'
                + '<span class="cdocs-item-meta">' + esc(linkSummary(doc)) + '</span></div>'
                + '<div class="cdocs-item-actions">'
                + '<a class="btn btn-small" target="_blank" rel="noopener" href="/commulingo/docs/' + esc(doc.id) + '">' + t('보기', 'View') + '</a>'
                + '<button type="button" class="btn btn-small" data-edit="' + esc(doc.id) + '">' + t('편집', 'Edit') + '</button>'
                + '<button type="button" class="btn btn-small btn-danger" data-delete="' + esc(doc.id) + '">' + t('삭제', 'Delete') + '</button>'
                + '</div></div>';
        }).join('');
    }

    $('docsList').addEventListener('click', function (e) {
        var editId = e.target.getAttribute && e.target.getAttribute('data-edit');
        var deleteId = e.target.getAttribute && e.target.getAttribute('data-delete');
        if (editId) openEditor(editId);
        if (deleteId && confirm(t('정말 삭제할까요? fragment 파일도 함께 삭제됩니다: ', 'Really delete? The fragment file is removed too: ') + deleteId)) {
            api('/' + encodeURIComponent(deleteId), { method: 'DELETE' }).then(function () {
                if (editing && editing.id === deleteId) closeEditor();
                status($('docsStatus'), t('삭제됨: ', 'Deleted: ') + deleteId);
                loadDocs();
            }).catch(function (err) { status($('docsStatus'), err.message, true); });
        }
    });

    // ---- link pickers ----
    function loadOptions() {
        return api('-link-options').then(function (body) {
            ['people', 'terms', 'events'].forEach(function (kind) {
                options[kind] = body[kind] || [];
                optionLabel[kind] = {};
                optionById[kind] = {};
                var list = document.getElementById('options-' + kind);
                list.innerHTML = options[kind].map(function (opt) {
                    var label = (opt.name.ko || opt.name.en) + (opt.name.en && opt.name.ko !== opt.name.en ? ' / ' + opt.name.en : '') + ' [' + opt.id + ']';
                    optionLabel[kind][label] = opt;
                    optionById[kind][opt.id] = opt;
                    return '<option value="' + esc(label) + '"></option>';
                }).join('');
            });
            // The list and any open chips were drawn from ids alone if this
            // arrived second; redraw now that the names are here.
            renderDocs();
            ['people', 'terms', 'events'].forEach(renderChips);
        }).catch(function (err) { status($('docsStatus'), t('링크 옵션 로드 실패: ', 'Failed to load link options: ') + err.message, true); });
    }

    function renderChips(kind) {
        var host = document.querySelector('[data-chips="' + kind + '"]');
        host.innerHTML = links[kind].map(function (id, i) {
            return '<span class="cdocs-chip">' + esc(refLabel(kind, id)) + ' <small>' + esc(id) + '</small>'
                + '<button type="button" data-unlink="' + kind + ':' + i + '" aria-label="remove">✕</button></span>';
        }).join('');
    }

    document.querySelectorAll('[data-picker]').forEach(function (input) {
        var kind = input.getAttribute('data-picker');
        input.addEventListener('change', function () {
            var opt = optionLabel[kind][input.value];
            if (!opt) return;
            if (links[kind].indexOf(opt.id) === -1) {
                links[kind].push(opt.id);
                renderChips(kind);
            }
            input.value = '';
        });
    });

    document.querySelector('.cdocs-editor').addEventListener('click', function (e) {
        var spec = e.target.getAttribute && e.target.getAttribute('data-unlink');
        if (!spec) return;
        var kind = spec.split(':')[0];
        links[kind].splice(Number(spec.split(':')[1]), 1);
        renderChips(kind);
    });

    // ---- editor ----
    function openEditor(docId) {
        var doc = docs.find(function (d) { return d.id === docId; });
        if (!doc) return;
        editing = doc;
        var form = $('editorForm');
        $('editorDocId').textContent = doc.id;
        form.titleKo.value = (doc.title && doc.title.ko) || '';
        form.titleEn.value = (doc.title && doc.title.en) || '';
        form.kindKo.value = (doc.kind && doc.kind.ko) || '';
        form.kindEn.value = (doc.kind && doc.kind.en) || '';
        form.descKo.value = (doc.description && doc.description.ko) || '';
        form.descEn.value = (doc.description && doc.description.en) || '';
        form.source.value = doc.source || '';
        form.docLang.value = doc.docLang || 'ko';
        form.tocExclude.value = (doc.tocExclude || []).join('\n');
        ['people', 'terms', 'events'].forEach(function (kind) {
            links[kind] = (doc[kind] || []).map(refId).filter(Boolean);
            renderChips(kind);
        });
        status($('editorStatus'), '');
        $('editorBox').hidden = false;
        $('editorBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeEditor() {
        editing = null;
        $('editorBox').hidden = true;
    }
    $('closeEditorBtn').addEventListener('click', closeEditor);

    $('editorForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!editing) return;
        var form = $('editorForm');
        var patch = {
            title: { ko: form.titleKo.value, en: form.titleEn.value },
            description: { ko: form.descKo.value, en: form.descEn.value },
            kind: { ko: form.kindKo.value, en: form.kindEn.value },
            source: form.source.value,
            docLang: form.docLang.value,
            tocExclude: form.tocExclude.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
            people: links.people,
            terms: links.terms,
            events: links.events,
        };
        status($('editorStatus'), '…');
        api('/' + encodeURIComponent(editing.id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
        }).then(function () {
            status($('editorStatus'), t('저장됨', 'Saved'));
            loadDocs();
        }).catch(function (err) { status($('editorStatus'), err.message, true); });
    });

    // ---- upload ----
    function readUploadFile() {
        var file = $('uploadFile').files[0];
        if (!file) throw new Error(t('.html 파일을 선택하세요.', 'Choose an .html file.'));
        var id = $('uploadId').value.trim();
        if (!/^[a-z0-9-]+$/.test(id)) throw new Error(t('슬러그는 소문자·숫자·하이픈만 가능합니다.', 'Slug must be lowercase letters, digits, hyphens.'));
        return file.text().then(function (html) { return { id: id, html: html }; });
    }

    function showUploadResult(body) {
        $('uploadResult').hidden = false;
        $('uploadWarnings').innerHTML = (body.warnings || []).map(function (w) {
            return '<p class="cdocs-warning">⚠ ' + esc(w) + '</p>';
        }).join('') || '<p class="cdocs-hint">' + t('경고 없음', 'No warnings') + '</p>';
        var toc = body.toc || [];
        var parts = toc.filter(function (x) { return x.level === 1; }).length;
        $('uploadToc').innerHTML = '<p class="cdocs-hint">' + t('목차: ', 'TOC: ') + parts + t('부 ', ' part(s), ')
            + toc.filter(function (x) { return x.level === 2; }).length + t('장', ' chapter(s)') + '</p>'
            + '<ul class="cdocs-toc">' + toc.map(function (x) {
                return '<li class="cdocs-toc-l' + x.level + '">' + esc(x.text) + '</li>';
            }).join('') + '</ul>';
    }

    function upload(dryRun) {
        status($('uploadStatus'), '…');
        $('uploadResult').hidden = true;
        Promise.resolve().then(readUploadFile).then(function (payload) {
            var existing = docs.some(function (d) { return d.id === payload.id; });
            if (existing && !dryRun && !confirm(t('이미 존재하는 문서입니다. 덮어쓸까요? ', 'Document exists. Overwrite? ') + payload.id)) {
                throw new Error(t('취소됨', 'Cancelled'));
            }
            var query = '?id=' + encodeURIComponent(payload.id) + (dryRun ? '&dryRun=1' : existing ? '&force=1' : '');
            return api(query, { method: 'POST', headers: { 'Content-Type': 'text/html' }, body: payload.html });
        }).then(function (body) {
            showUploadResult(body);
            if (body.entry && !dryRun) {
                status($('uploadStatus'), t('업로드 완료: ', 'Uploaded: ') + body.entry.id + ' → ' + t('아래에서 메타데이터를 채우세요.', 'fill in the metadata below.'));
                loadDocs().then(function () { openEditor(body.entry.id); });
            } else {
                status($('uploadStatus'), t('미리보기 (아직 저장 안 됨)', 'Preview (nothing written yet)'));
            }
        }).catch(function (err) { status($('uploadStatus'), err.message, true); });
    }

    $('previewBtn').addEventListener('click', function () { upload(true); });
    $('uploadBtn').addEventListener('click', function () { upload(false); });
    $('uploadFile').addEventListener('change', function () {
        var file = $('uploadFile').files[0];
        if (file && !$('uploadId').value) {
            $('uploadId').value = file.name.replace(/\.html?$/i, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
        }
    });

    loadDocs();
    loadOptions();
})();
