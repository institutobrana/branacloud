export function isGravaDisabled({ saving, isNew, dirty }) {
  return Boolean(saving || (!isNew && !dirty));
}
