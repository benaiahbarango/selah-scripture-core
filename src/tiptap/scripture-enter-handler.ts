import { Editor } from "@tiptap/core";

import { buildEnterRegex } from "../regex";
import { applyCardInsertion } from "./scripture-card-input-rule";
import { ScriptureAttrsResolver } from "./resolve-scripture-match";

export function handleScriptureEnter(
  editor: Editor,
  theName: string,
  getAttrs: ScriptureAttrsResolver,
) {
  const { state } = editor;
  const { $from } = state.selection;

  const textBefore = $from.parent.textBetween(0, $from.parentOffset, "\0", "\0");

  const match = textBefore.match(buildEnterRegex());
  if (!match) return false;

  const ref = match[1];
  const attrs = getAttrs(ref);
  if (!attrs) return false;

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
      applyCardInsertion(tr, state, start, attrs, theName);
      return true;
    })
    .run();

  return true;
}
