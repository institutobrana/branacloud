export function createRequestSequenceGate() {
  let current = 0;

  return {
    next() {
      current += 1;
      return current;
    },
    isCurrent(value) {
      return Number(value || 0) === current;
    },
    bump() {
      current += 1;
      return current;
    },
    getCurrent() {
      return current;
    },
  };
}
