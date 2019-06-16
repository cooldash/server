class AssertionError extends Error {};

export default function assert(expr, message) {
  if(!Boolean(expr)) {
    throw new AssertionError(message || 'unknown assertion error');
  }
}
