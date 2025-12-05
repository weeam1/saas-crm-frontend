function normalizeNumber(number) {
  if (/^(sips?|tel):/i.test(number)) {
    return number;
  } else if (/@/i.test(number)) {
    return number;
  } else if (
    number.startsWith("app-") ||
    number.startsWith("queue-") ||
    number.startsWith("conference-")
  ) {
    return number;
  } else {
    return number.replace(/[()\-. ]*/g, "");
  }
}

function randomId(prefix) {
  const id = [...Array(16)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

  if (prefix) {
    return `${prefix}-${id}`;
  } else {
    return id;
  }
}

export { normalizeNumber, randomId };
