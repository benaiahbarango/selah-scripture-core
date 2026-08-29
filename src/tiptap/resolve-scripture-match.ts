import { EditorState } from "@tiptap/pm/state";

import { BibleReference } from "../types";

export type ScriptureAttrsResolver = (ref: string) => BibleReference | null;

export function resolveScriptureMatch(
  {
    range,
    match,
    state,
  }: {
    range: { from: number; to: number };
    match: RegExpMatchArray;
    state: EditorState;
  },
  getAttrs: ScriptureAttrsResolver,
) {
  const ref = match[1];

  const matchedText = state.doc.textBetween(range.from, range.to, "\0", "\0");
  if (!matchedText || !matchedText.includes(ref)) return null;

  const attrs = getAttrs(ref);
  if (!attrs) return null;

  return { ref, attrs };
}
