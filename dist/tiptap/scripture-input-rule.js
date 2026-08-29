"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScriptureInputRule = void 0;
const react_1 = require("@tiptap/react");
const regex_1 = require("../regex");
const resolve_scripture_match_1 = require("./resolve-scripture-match");
const createScriptureInputRule = (theName, getAttrs) => {
    return new react_1.InputRule({
        find: (0, regex_1.buildInputRuleRegex)(),
        handler: ({ range, match, chain, state }) => {
            const result = (0, resolve_scripture_match_1.resolveScriptureMatch)({ range, match, state }, getAttrs);
            if (!result)
                return;
            const { ref, attrs } = result;
            const triggerChar = match[0].slice(-1);
            const startPos = range.from + match[0].indexOf(ref);
            if (startPos < 0 || startPos > range.to)
                return;
            chain()
                .insertContentAt({ from: startPos, to: range.to }, {
                type: theName,
                attrs,
            })
                .insertContent(triggerChar)
                .command(({ tr, state }) => {
                tr.setStoredMarks(state.doc.resolve(state.selection.to - 1).marks());
                return true;
            })
                .run();
        },
    });
};
exports.createScriptureInputRule = createScriptureInputRule;
