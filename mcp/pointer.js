// JSON Pointer (RFC 6901) reads and small patches for the data documents, so
// one activity-catalog entry can be read or changed without sending the
// whole document back and forth.
function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

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

module.exports = { getPointer, applyPatches };
