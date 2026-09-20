const {createHash} = require('node:crypto');

// Python patches.canonical uses ASCII, sorted-key JSON. Public patch numbers
// are integers (years/sort order); no provider scores participate in identity.
function canonical(value) {
    if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
    if (value && typeof value==='object') return `{${Object.keys(value).sort().map(key => `${canonical(key)}:${canonical(value[key])}`).join(',')}}`;
    const encoded = JSON.stringify(value);
    if (encoded === undefined || (typeof value==='number' && !Number.isFinite(value))) throw new Error('invalid patch value');
    return encoded.replace(/[\u007f-\uffff]/g, ch => `\\u${ch.charCodeAt(0).toString(16).padStart(4,'0')}`);
}
function patchHash(request) {
    const bound = Object.fromEntries(['target','action','id','fields','sources'].map(key => [key,request[key]]));
    return createHash('sha256').update(canonical(bound)).digest('hex');
}
module.exports = {canonical, patchHash};
