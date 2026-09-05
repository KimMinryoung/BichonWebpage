// Keep ambiguous spellings in the pattern as non-linking tokens. Deleting
// them would let a shorter alias inside the spelling claim the mention.
function registerAlias(byAlias, tokens, alias, entry) {
    if (Object.hasOwn(byAlias, alias)) {
        const previous = byAlias[alias];
        if (previous && (previous.id !== entry.id || previous.kind !== entry.kind)) byAlias[alias] = null;
        return;
    }
    byAlias[alias] = entry;
    tokens.push(alias);
}

module.exports = { registerAlias };
