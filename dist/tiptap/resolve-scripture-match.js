"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveScriptureMatch = resolveScriptureMatch;
function resolveScriptureMatch({ range, match, state, }, getAttrs) {
    const ref = match[1];
    const matchedText = state.doc.textBetween(range.from, range.to, "\0", "\0");
    if (!matchedText || !matchedText.includes(ref))
        return null;
    const attrs = getAttrs(ref);
    if (!attrs)
        return null;
    return { ref, attrs };
}
