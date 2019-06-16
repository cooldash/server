

export default function getMatch(regExp, string, match = 1) {
  const m = string.match(regExp);
  return m && m[match];
}
