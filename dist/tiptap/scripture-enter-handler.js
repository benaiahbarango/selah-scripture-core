"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScriptureEnter = handleScriptureEnter;
const regex_1 = require("../regex");
const scripture_card_input_rule_1 = require("./scripture-card-input-rule");
function handleScriptureEnter(editor, theName, getAttrs) {
    const { state } = editor;
    const { $from } = state.selection;
    const textBefore = $from.parent.textBetween(0, $from.parentOffset, "\0", "\0");
    const match = textBefore.match((0, regex_1.buildEnterRegex)());
    if (!match)
        return false;
    const ref = match[1];
    const attrs = getAttrs(ref);
    if (!attrs)
        return false;
    const start = $from.start() + textBefore.lastIndexOf(ref);
    const end = start + ref.length;
    if (theName === "scripture-inline") {
        editor
            .chain()
            .focus()
            .insertContentAt({ from: start, to: end }, { type: theName, attrs })
            .splitBlock()
            .run();
        return true;
    }
    editor
        .chain()
        .focus()
        .deleteRange({ from: start, to: end })
        .command(({ tr, state }) => {
        (0, scripture_card_input_rule_1.applyCardInsertion)(tr, state, start, attrs, theName);
        return true;
    })
        .run();
    return true;
}
