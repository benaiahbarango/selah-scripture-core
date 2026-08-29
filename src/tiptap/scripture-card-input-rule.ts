import { EditorState, Selection, Transaction } from "@tiptap/pm/state";
import { InputRule } from "@tiptap/react";

import { buildInputRuleRegex } from "../regex";
import { BibleReference } from "../types";
import {
  resolveScriptureMatch,
  ScriptureAttrsResolver,
} from "./resolve-scripture-match";

export function applyCardInsertion(
  tr: Transaction,
  state: EditorState,
  insertFrom: number,
  attrs: BibleReference,
  theName: string,
) {
  const $from = state.doc.resolve(insertFrom);
  const currentNode = $from.node();
  const isCurrentParagraphEmpty = currentNode.textContent.trim() === "";

  const insertPos = $from.after();

  tr.insert(
    insertPos,
    state.schema.nodes[theName].create({
      ...attrs,
      displayType: "card",
    }),
  );

  const nodeAfter = tr.doc.nodeAt(insertPos + 1);
  const needsTrailingParagraph =
    !nodeAfter || nodeAfter.type !== state.schema.nodes.paragraph;

  if (needsTrailingParagraph) {
    tr.insert(insertPos + 1, state.schema.nodes.paragraph.create());
  }

  if (isCurrentParagraphEmpty) {
    const beforePos = $from.before();
    tr.delete(beforePos, beforePos + currentNode.nodeSize);
  }

  const resolvedCursor = tr.doc.resolve(
    Math.min(insertPos + 2, tr.doc.content.size),
  );
  tr.setSelection(Selection.near(resolvedCursor));
}

export const createScriptureCardInputRule = (
  theName: string,
  getAttrs: ScriptureAttrsResolver,
) => {
  return new InputRule({
    find: buildInputRuleRegex(),
    handler: ({ range, match, chain, state }) => {
      const result = resolveScriptureMatch({ range, match, state }, getAttrs);
      if (!result) return;

      const { attrs } = result;
      if (!attrs) return;

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
