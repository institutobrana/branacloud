export function hasUsablePatient(patient) {
  return Number(patient?.id ?? patient?.patientId ?? patient?.nro_pac ?? 0) > 0;
}

export async function resolveRecipeAssistantPatient(patientInUse, requestPatientSelection) {
  if (hasUsablePatient(patientInUse)) return patientInUse;
  if (typeof requestPatientSelection !== 'function') return null;
  const selected = await requestPatientSelection();
  return hasUsablePatient(selected) ? selected : null;
}

export function getPatientDisplayName(patient) {
  return String(patient?.nome_completo ?? patient?.nomeCompleto ?? patient?.nome_paciente ?? patient?.name ?? patient?.nome ?? '').trim();
}
