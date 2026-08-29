import { EditorState, Transaction } from "@tiptap/pm/state";
import { InputRule } from "@tiptap/react";
import { BibleReference } from "../types";
import { ScriptureAttrsResolver } from "./resolve-scripture-match";
export declare function applyCardInsertion(tr: Transaction, state: EditorState, insertFrom: number, attrs: BibleReference, theName: string): void;
export declare const createScriptureCardInputRule: (theName: string, getAttrs: ScriptureAttrsResolver) => InputRule;
