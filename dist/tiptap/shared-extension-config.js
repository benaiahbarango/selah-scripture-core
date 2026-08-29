"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSharedExtensionConfig = void 0;
const format_reference_1 = require("../format-reference");
const scripture_enter_handler_1 = require("./scripture-enter-handler");
const createSharedExtensionConfig = (getAttrs) => ({
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
                if (this.name === "scripture-inline" && prefersCard)
                    return false;
                if (this.name === "scripture-card" && !prefersCard)
                    return false;
                return (0, scripture_enter_handler_1.handleScriptureEnter)(this.editor, this.name, getAttrs);
            },
            Backspace: () => {
                const { state } = this.editor;
                const { selection } = state;
                const { $anchor } = selection;
                const isEmptyFirstParagraph = $anchor.parent.type.name === "paragraph" &&
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
            convertScripture: (pos, toType) => ({ tr, state, dispatch }) => {
                if (pos < 0 || pos > state.doc.content.size)
                    return false;
                const node = state.doc.nodeAt(pos);
                if (!node)
                    return false;
                const targetType = state.schema.nodes[toType];
                if (!targetType)
                    return false;
                if (dispatch) {
                    const newNode = targetType.create(node.attrs);
                    if (toType === "scripture-card") {
                        const $pos = state.doc.resolve(pos);
                        const parent = $pos.parent;
                        const parentStart = pos - $pos.parentOffset - 1;
                        const parentEnd = parentStart + parent.nodeSize;
                        const beforeContent = [];
                        const afterContent = [];
                        let found = false;
                        parent.forEach((child) => {
                            if (child === node) {
                                found = true;
                                return;
                            }
                            if (!found)
                                beforeContent.push(child);
                            else
                                afterContent.push(child);
                        });
                        const replacement = [];
                        if (beforeContent.length > 0) {
                            replacement.push(state.schema.nodes.paragraph.create(null, beforeContent));
                        }
                        replacement.push(newNode);
                        if (afterContent.length > 0) {
                            replacement.push(state.schema.nodes.paragraph.create(null, afterContent));
                        }
                        tr.replaceWith(parentStart, parentEnd, replacement);
                    }
                    else {
                        tr.replaceWith(pos, pos + node.nodeSize, newNode);
                    }
                    dispatch(tr);
                }
                return true;
            },
        };
    },
    renderText({ node }) {
        return `${(0, format_reference_1.formatReference)(node.attrs)}`;
    },
});
exports.createSharedExtensionConfig = createSharedExtensionConfig;
