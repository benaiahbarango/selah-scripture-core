import { InputRule } from "@tiptap/react";

import { buildInputRuleRegex } from "../regex";
import {
  resolveScriptureMatch,
  ScriptureAttrsResolver,
} from "./resolve-scripture-match";

export const createScriptureInputRule = (
  theName: string,
  getAttrs: ScriptureAttrsResolver,
) => {
  return new InputRule({
    find: buildInputRuleRegex(),
    handler: ({ range, match, chain, state }) => {
      const result = resolveScriptureMatch({ range, match, state }, getAttrs);
      if (!result) return;

      const { ref, attrs } = result;

      const triggerChar = match[0].slice(-1);
      const startPos = range.from + match[0].indexOf(ref);

      if (startPos < 0 || startPos > range.to) return;

      chain()
        .insertContentAt(
          { from: startPos, to: range.to },
          {
            type: theName,
            attrs,
          },
        )
        .insertContent(triggerChar)
        .command(({ tr, state }) => {
          tr.setStoredMarks(state.doc.resolve(state.selection.to - 1).marks());
          return true;
        })
        .run();
    },
  });
};
