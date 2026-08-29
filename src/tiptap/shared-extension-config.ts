import { Node } from "@tiptap/pm/model";
import { CommandProps, NodeConfig } from "@tiptap/react";

import { formatReference } from "../format-reference";
import { BibleReference } from "../types";
import { handleScriptureEnter } from "./scripture-enter-handler";
import { ScriptureAttrsResolver } from "./resolve-scripture-match";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    scriptureInlineExtension: {
      convertScripture: (
        pos: number,
        toType: "scripture-inline" | "scripture-card",
      ) => ReturnType;
    };
  }
}

// Authored against NodeConfig so the callbacks stay fully typed, but returned
// as `any`: consuming apps spread this into `Node.create`, and a strict
// NodeConfig return would tie its method `this`-types to the Tiptap version
// this package was built against, colliding with the app's own Tiptap copy.
// Apps declare the `convertScripture` command augmentation themselves (see
// each app's scripture-commands.d.ts).
export const createSharedExtensionConfig = (
  getAttrs: ScriptureAttrsResolver,
): any => {
  const config: Partial<NodeConfig<any>> = {
  addAttributes() {
    return {
      book: {
        default: null,
        parseHTML: (element) => element.getAttribute("book"),
      },
      chapter: {
        default: null,
        parseHTML: (element) => element.getAttribute("chapter"),
      },
      startVerse: {
        default: null,
        parseHTML: (element) => element.getAttribute("startVerse"),
      },
      endVerse: {
        default: null,
        parseHTML: (element) => element.getAttribute("endVerse"),
      },
      isRange: {
        default: false,
        parseHTML: (element) => element.getAttribute("isRange") === "true",
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const prefersCard = this.options.userPrefersCardScripture;

        if (this.name === "scripture-inline" && prefersCard) return false;
        if (this.name === "scripture-card" && !prefersCard) return false;

        return handleScriptureEnter(this.editor, this.name, getAttrs);
      },
      Backspace: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $anchor } = selection;

        const isEmptyFirstParagraph =
          $anchor.parent.type.name === "paragraph" &&
          $anchor.parent.textContent === "" &&
          $anchor.pos === 1;

        if (isEmptyFirstParagraph) {
          this.editor.commands.deleteNode("paragraph");
          return true;
        }

        return false;
      },
    };
  },

  addCommands() {
    return {
      convertScripture:
        (pos: number, toType: "scripture-inline" | "scripture-card") =>
        ({ tr, state, dispatch }: CommandProps) => {
          if (pos < 0 || pos > state.doc.content.size) return false;

          const node = state.doc.nodeAt(pos);
          if (!node) return false;

          const targetType = state.schema.nodes[toType];
          if (!targetType) return false;

          if (dispatch) {
            const newNode = targetType.create(node.attrs);

            if (toType === "scripture-card") {
              const $pos = state.doc.resolve(pos);
              const parent = $pos.parent;
              const parentStart = pos - $pos.parentOffset - 1;
              const parentEnd = parentStart + parent.nodeSize;

              const beforeContent: Node[] = [];
              const afterContent: Node[] = [];
              let found = false;

              parent.forEach((child: Node) => {
                if (child === node) {
                  found = true;
                  return;
                }
                if (!found) beforeContent.push(child);
                else afterContent.push(child);
              });

              const replacement: Node[] = [];

              if (beforeContent.length > 0) {
                replacement.push(
                  state.schema.nodes.paragraph.create(null, beforeContent),
                );
              }

              replacement.push(newNode);

              if (afterContent.length > 0) {
                replacement.push(
                  state.schema.nodes.paragraph.create(null, afterContent),
                );
              }

              tr.replaceWith(parentStart, parentEnd, replacement);
            } else {
              tr.replaceWith(pos, pos + node.nodeSize, newNode);
            }

            dispatch(tr);
          }

          return true;
        },
    };
  },
    renderText({ node }) {
      return `${formatReference(node.attrs as BibleReference)}`;
    },
  };

  return config;
};
