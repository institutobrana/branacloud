function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function mergeSystemOptionsPreservingUnknowns(base = {}, changes = {}) {
  if (!isPlainObject(base) || !isPlainObject(changes)) return changes;
  const result = { ...base };
  Object.entries(changes).forEach(([key, value]) => {
    result[key] = isPlainObject(value) && isPlainObject(base[key])
      ? mergeSystemOptionsPreservingUnknowns(base[key], value)
      : value;
  });
  return result;
}

/** Pure payload builder; intentionally not connected to PATCH yet. */
export function buildSystemOptionsPayload(rawConfig = {}, editedChanges = {}) {
  return mergeSystemOptionsPreservingUnknowns(rawConfig, editedChanges);
}
