"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEnterRegex = exports.buildInputRuleRegex = exports.SCRIPTURE_START_BOUNDARY = exports.SCRIPTURE_TRIGGER = exports.SCRIPTURE_REGEX = void 0;
// Whitespace is tolerated around the colon and the range dash, so loosely
// typed references ("Mat 4 : 5", "Ex 4: 5", "Rom 8 - 10") still convert.
exports.SCRIPTURE_REGEX = /((?:\d\s?)?[A-Za-z]+\.?\s\d+\s*:\s*(?:\d+(?:\s*-\s*\d+)?|\*))/;
exports.SCRIPTURE_TRIGGER = "[ .;]";
exports.SCRIPTURE_START_BOUNDARY = "(?:^|[\\s;.])";
const buildInputRuleRegex = () => new RegExp(`${exports.SCRIPTURE_START_BOUNDARY}${exports.SCRIPTURE_REGEX.source}${exports.SCRIPTURE_TRIGGER}$`);
exports.buildInputRuleRegex = buildInputRuleRegex;
const buildEnterRegex = () => new RegExp(`${exports.SCRIPTURE_REGEX.source}$`);
exports.buildEnterRegex = buildEnterRegex;
