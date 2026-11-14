// JSON Pointer (RFC 6901) reads and small patches for the data documents, so
// one activity-catalog entry can be read or changed without sending the
// whole document back and forth.
const { badRequest } = require('./common');

function tokens(pointer) {
    if (pointer === '') return [];
    if (typeof pointer !== 'string' || !pointer.startsWith('/')) throw badRequest(`pointer must be "" or start with /: ${pointer}`);
    return pointer.slice(1).split('/').map(token => token.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function step(node, token, pointer) {
    if (Array.isArray(node)) {
        if (!/^(0|[1-9][0-9]*)$/.test(token) || Number(token) >= node.length) throw badRequest(`no index ${token} at ${pointer}`);
        return node[Number(token)];
    }
    if (!node || typeof node !== 'object' || !Object.hasOwn(node, token)) throw badRequest(`no key "${token}" at ${pointer}`);
    return node[token];
}

function getPointer(doc, pointer) {
    return tokens(pointer).reduce((node, token) => step(node, token, pointer), doc);
}

// patches: [{ op: set|remove, path, value? }]; set on an array index replaces
// it and "-" appends. Applied in order to a copy; the input is not touched.
function applyPatches(doc, patches) {
    const out = JSON.parse(JSON.stringify(doc));
    for (const [i, patch] of patches.entries()) {
        if (!patch || !['set', 'remove'].includes(patch.op)) throw badRequest(`patches[${i}].op must be set or remove`);
        const path = tokens(patch.path);
        if (!path.length) throw badRequest(`patches[${i}] cannot replace the whole document; send content instead`);
        const last = path.pop();
        const parent = path.reduce((node, token) => step(node, token, patch.path), out);
        if (Array.isArray(parent)) {
            const index = last === '-' ? parent.length : Number(last);
            if (!/^(0|[1-9][0-9]*|-)$/.test(last) || index > parent.length || (patch.op === 'remove' && index >= parent.length)) {
                throw badRequest(`patches[${i}]: bad index ${last} at ${patch.path}`);
            }
            if (patch.op === 'remove') parent.splice(index, 1);
            else parent[index] = patch.value;
        } else if (parent && typeof parent === 'object') {
            if (patch.op === 'remove') {
                if (!Object.hasOwn(parent, last)) throw badRequest(`patches[${i}]: no key "${last}" at ${patch.path}`);
                delete parent[last];
            } else parent[last] = patch.value;
        } else throw badRequest(`patches[${i}]: ${patch.path} has no container`);
        if (patch.op === 'set' && patch.value === undefined) throw badRequest(`patches[${i}].value is required`);
    }
    return out;
}

const escapeToken = token => String(token).replace(/~/g, '~0').replace(/\//g, '~1');

// Paths that differ between two versions of a document. An array whose length
// changed is reported once as resized (its indexes moved); otherwise arrays
// and objects are compared member by member down to the differing leaf.
function changedPaths(a, b, base = '') {
    if (JSON.stringify(a) === JSON.stringify(b)) return [];
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return [{ path: base, resized: true }];
        return a.flatMap((item, i) => changedPaths(item, b[i], `${base}/${i}`));
    }
    const isObject = v => v && typeof v === 'object' && !Array.isArray(v);
    if (isObject(a) && isObject(b)) {
        return [...new Set([...Object.keys(a), ...Object.keys(b)])]
            .flatMap(k => changedPaths(a[k], b[k], `${base}/${escapeToken(k)}`));
    }
    return [{ path: base }];
}

const within = (inner, outer) => inner === outer || inner.startsWith(outer + '/') || outer === '';

// A patch built on an older revision may be applied to the current one when
// no other write since touched its path: neither the same path, nor a parent
// or child of it. A resized array only conflicts with patches that address
// one of its indexes ("-" appends stay safe).
function patchConflicts(patches, changes) {
    const conflicts = [];
    for (const patch of patches) {
        const hit = changes.find(change => {
            if (change.resized && within(patch.path, change.path) && patch.path !== change.path) {
                const next = patch.path.slice(change.path.length + 1).split('/')[0];
                return next !== '-';
            }
            return within(patch.path, change.path) || within(change.path, patch.path);
        });
        if (hit) conflicts.push({ patch: patch.path, changed: hit.path });
    }
    return conflicts;
}

module.exports = { getPointer, applyPatches, changedPaths, patchConflicts };
