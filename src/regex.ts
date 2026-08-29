export const SCRIPTURE_REGEX =
  /((?:\d\s?)?[A-Za-z]+\.?\s\d+:(?:\d+(?:-\d+)?|\*))/;

export const SCRIPTURE_TRIGGER = "[ .;]";

export const SCRIPTURE_START_BOUNDARY = "(?:^|[\\s;.])";

export const buildInputRuleRegex = () =>
  new RegExp(
    `${SCRIPTURE_START_BOUNDARY}${SCRIPTURE_REGEX.source}${SCRIPTURE_TRIGGER}$`,
  );

export const buildEnterRegex = () => new RegExp(`${SCRIPTURE_REGEX.source}$`);
