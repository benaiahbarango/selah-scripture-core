import { EditorState } from "@tiptap/pm/state";
import { BibleReference } from "../types";
export type ScriptureAttrsResolver = (ref: string) => BibleReference | null;
export declare function resolveScriptureMatch({ range, match, state, }: {
    range: {
        from: number;
        to: number;
    };
    match: RegExpMatchArray;
    state: EditorState;
}, getAttrs: ScriptureAttrsResolver): {
    ref: string;
    attrs: BibleReference;
} | null;
