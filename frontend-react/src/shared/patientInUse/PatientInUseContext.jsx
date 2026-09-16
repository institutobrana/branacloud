import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'brana.fichaClinica.pacienteEmUso';
const PatientInUseContext = createContext(null);

function readStoredPatient() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function persistPatient(patient) {
  if (typeof window === 'undefined') return;
  try {
    if (patient) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // A sessão continua válida em memória mesmo quando o storage não está disponível.
  }
}

export function PatientInUseProvider({ children }) {
  const [patient, setPatientState] = useState(readStoredPatient);
  const setPatient = (nextPatient) => {
    setPatientState(nextPatient || null);
    persistPatient(nextPatient || null);
  };
  const value = useMemo(() => ({ patient, setPatient, clearPatient: () => setPatient(null) }), [patient]);
  return <PatientInUseContext.Provider value={value}>{children}</PatientInUseContext.Provider>;
}

export function usePatientInUse() {
  const value = useContext(PatientInUseContext);
  if (!value) throw new Error('usePatientInUse deve ser usado dentro de PatientInUseProvider.');
  return value;
}

export { STORAGE_KEY as PATIENT_IN_USE_STORAGE_KEY };
