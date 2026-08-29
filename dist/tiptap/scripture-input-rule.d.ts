import { InputRule } from "@tiptap/react";
import { ScriptureAttrsResolver } from "./resolve-scripture-match";
export declare const createScriptureInputRule: (theName: string, getAttrs: ScriptureAttrsResolver) => InputRule;
