const { detectScripts } = require('./native-script');

function collapseSpaces(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
}

// Patronymic PATCHes are field-wise merges. Historically either
// `patronymic` or `cyrillicPatronymic` caused the whole DB row to be replaced,
// silently blanking the omitted half. Preserve every omitted language/native
// field and clear only values explicitly sent as null/empty strings.
function mergePatronymicPatch(payload, before = {}) {
    const current = {
        ko: collapseSpaces(before.ko),
        en: collapseSpaces(before.en),
        native: collapseSpaces(before.native),
    };
    const patronymicTouched = hasOwn(payload, 'patronymic');
    const nativeTouched = hasOwn(payload, 'cyrillicPatronymic');
    if (!patronymicTouched && !nativeTouched) {
        return { ...current, touched: false, invalid: '' };
    }

    let ko = current.ko;
    let en = current.en;
    if (patronymicTouched) {
        const node = payload.patronymic;
        if (node === null) {
            ko = '';
            en = '';
        } else if (!node || typeof node !== 'object' || Array.isArray(node)) {
            return {
                ...current,
                touched: true,
                invalid: 'patronymic must be an object { ko, en } or null',
            };
        } else {
            if (hasOwn(node, 'ko')) ko = collapseSpaces(node.ko);
            if (hasOwn(node, 'en')) en = collapseSpaces(node.en);
        }
    }
    const native = nativeTouched
        ? collapseSpaces(payload.cyrillicPatronymic)
        : current.native;
    return { ko, en, native, touched: true, invalid: '' };
}

function containsComponent(fullName, component) {
    const full = ` ${collapseSpaces(fullName).toLocaleLowerCase()} `;
    const part = collapseSpaces(component).toLocaleLowerCase();
    return !!part && full.includes(` ${part} `);
}

// Returns a human-readable API error or null. Native-script patronymics are
// required for names whose own displayed name is Cyrillic. Latin/Georgian/etc.
// native names may intentionally omit a Russian-style patronymic even when the
// localized Korean/English display keeps it.
function patronymicProblem(state, nativeName) {
    if (state.invalid) return state.invalid;
    if (!!state.ko !== !!state.en) {
        return 'patronymic.ko and patronymic.en must be supplied together';
    }
    if (state.native && (!state.ko || !state.en)) {
        return 'cyrillicPatronymic requires both patronymic.ko and patronymic.en';
    }
    const nativeIsCyrillic = detectScripts(nativeName).includes('cyrillic');
    if (nativeIsCyrillic && state.ko && !state.native) {
        return 'a Cyrillic native name with a patronymic requires cyrillicPatronymic';
    }
    if (state.native && containsComponent(nativeName, state.native)) {
        return 'cyrillic/nativeName already embeds cyrillicPatronymic; keep the patronymic only in its separate field';
    }
    return null;
}

// `origin` used to be populated from birthplace country. The card means the
// person's national/ethnic background, so expose the explicit name while
// retaining `origin` as a backwards-compatible payload alias.
function nationalOriginInput(payload) {
    const hasLegacy = hasOwn(payload, 'origin');
    const hasExplicit = hasOwn(payload, 'nationalOrigin');
    if (!hasLegacy && !hasExplicit) return { touched: false, value: undefined, invalid: '' };
    if (hasLegacy && hasExplicit) {
        const legacyCode = payload.origin && payload.origin.code;
        const explicitCode = payload.nationalOrigin && payload.nationalOrigin.code;
        if ((legacyCode || '') !== (explicitCode || '')) {
            return {
                touched: true,
                value: undefined,
                invalid: 'origin and nationalOrigin disagree; send nationalOrigin only',
            };
        }
    }
    return {
        touched: true,
        value: hasExplicit ? payload.nationalOrigin : payload.origin,
        invalid: '',
    };
}

module.exports = {
    mergePatronymicPatch,
    patronymicProblem,
    nationalOriginInput,
};
