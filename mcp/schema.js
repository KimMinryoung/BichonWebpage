// The small JSON Schema subset the MCP tools declare: an object of string,
// integer and boolean properties (optionally enum / min / max / maxLength),
// plus opaque object/array payloads the editorial services validate themselves.
// Unknown properties are rejected so a typo never silently means "no filter".

function str(description, extra = {}) {
    return { type: 'string', description, maxLength: 200, ...extra };
}

function int(description, minimum, maximum, extra = {}) {
    return { type: 'integer', description, minimum, maximum, ...extra };
}

function bool(description) {
    return { type: 'boolean', description };
}

function obj(description) {
    return { type: 'object', description };
}

function arr(description, maxItems = 200) {
    return { type: 'array', description, maxItems };
}

function object(properties, required = []) {
    return { type: 'object', properties, required, additionalProperties: false };
}

function invalid(message) {
    const err = new Error(message);
    err.code = 'invalid_arguments';
    return err;
}

function validateArguments(schema, args) {
    if (args === undefined || args === null) args = {};
    if (typeof args !== 'object' || Array.isArray(args)) throw invalid('arguments must be an object');
    for (const key of Object.keys(args)) {
        if (!Object.hasOwn(schema.properties, key)) throw invalid(`unknown argument: ${key}`);
    }
    for (const key of schema.required || []) {
        if (args[key] === undefined) throw invalid(`missing argument: ${key}`);
    }
    const out = {};
    for (const [key, spec] of Object.entries(schema.properties)) {
        const value = args[key] === undefined ? spec.default : args[key];
        if (value === undefined) continue;
        if (spec.type === 'string') {
            if (typeof value !== 'string') throw invalid(`${key} must be a string`);
            if (value.length > (spec.maxLength || 200)) throw invalid(`${key} is too long`);
        } else if (spec.type === 'integer') {
            if (!Number.isInteger(value)) throw invalid(`${key} must be an integer`);
            if (value < spec.minimum || value > spec.maximum) throw invalid(`${key} must be ${spec.minimum}–${spec.maximum}`);
        } else if (spec.type === 'boolean') {
            if (typeof value !== 'boolean') throw invalid(`${key} must be a boolean`);
        } else if (spec.type === 'object') {
            if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(`${key} must be an object`);
        } else if (spec.type === 'array') {
            if (!Array.isArray(value)) throw invalid(`${key} must be an array`);
            if (value.length > spec.maxItems) throw invalid(`${key} has more than ${spec.maxItems} items`);
        }
        if (spec.enum && !spec.enum.includes(value)) throw invalid(`${key} must be one of ${spec.enum.join(', ')}`);
        out[key] = value;
    }
    return out;
}

module.exports = { str, int, bool, obj, arr, object, validateArguments };
