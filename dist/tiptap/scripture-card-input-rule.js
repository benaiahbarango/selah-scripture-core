"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScriptureCardInputRule = void 0;
exports.applyCardInsertion = applyCardInsertion;
const state_1 = require("@tiptap/pm/state");
const react_1 = require("@tiptap/react");
const regex_1 = require("../regex");
const resolve_scripture_match_1 = require("./resolve-scripture-match");
function applyCardInsertion(tr, state, insertFrom, attrs, theName) {
    const $from = state.doc.resolve(insertFrom);
    const currentNode = $from.node();
    const isCurrentParagraphEmpty = currentNode.textContent.trim() === "";
    const insertPos = $from.after();
    tr.insert(insertPos, state.schema.nodes[theName].create({
        ...attrs,
        displayType: "card",
    }));
    const nodeAfter = tr.doc.nodeAt(insertPos + 1);
    const needsTrailingParagraph = !nodeAfter || nodeAfter.type !== state.schema.nodes.paragraph;
    if (needsTrailingParagraph) {
        tr.insert(insertPos + 1, state.schema.nodes.paragraph.create());
    }
    if (isCurrentParagraphEmpty) {
        const beforePos = $from.before();
        tr.delete(beforePos, beforePos + currentNode.nodeSize);
    }
    const resolvedCursor = tr.doc.resolve(Math.min(insertPos + 2, tr.doc.content.size));
    tr.setSelection(state_1.Selection.near(resolvedCursor));
}
const createScriptureCardInputRule = (theName, getAttrs) => {
    return new react_1.InputRule({
        find: (0, regex_1.buildInputRuleRegex)(),
        handler: ({ range, match, chain, state }) => {
            const result = (0, resolve_scripture_match_1.resolveScriptureMatch)({ range, match, state }, getAttrs);
            if (!result)
                return;
            const { attrs } = result;
            if (!attrs)
                return;
            chain()
                .deleteRange({ from: range.from, to: range.to })
                .command(({ tr, state }) => {
                applyCardInsertion(tr, state, range.from, attrs, theName);
                return true;
            })
                .run();
        },
    });
};
exports.createScriptureCardInputRule = createScriptureCardInputRule;
