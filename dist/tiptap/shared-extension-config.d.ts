import { NodeConfig } from "@tiptap/react";
import { ScriptureAttrsResolver } from "./resolve-scripture-match";
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        scriptureInlineExtension: {
            convertScripture: (pos: number, toType: "scripture-inline" | "scripture-card") => ReturnType;
        };
    }
}
export declare const createSharedExtensionConfig: (getAttrs: ScriptureAttrsResolver) => Partial<NodeConfig<any>>;
