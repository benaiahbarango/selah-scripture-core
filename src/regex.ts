// Whitespace is tolerated around the colon and the range dash, so loosely
// typed references ("Mat 4 : 5", "Ex 4: 5", "Rom 8 - 10") still convert.
export const SCRIPTURE_REGEX =
  /((?:\d\s?)?[A-Za-z]+\.?\s\d+\s*:\s*(?:\d+(?:\s*-\s*\d+)?|\*))/;

export const SCRIPTURE_TRIGGER = "[ .;]";

export const SCRIPTURE_START_BOUNDARY = "(?:^|[\\s;.])";

export const buildInputRuleRegex = () =>
  new RegExp(
    `${SCRIPTURE_START_BOUNDARY}${SCRIPTURE_REGEX.source}${SCRIPTURE_TRIGGER}$`,
  );

export const buildEnterRegex = () => new RegExp(`${SCRIPTURE_REGEX.source}$`);
