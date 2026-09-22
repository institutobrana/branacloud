export function PacientesAlphabet({ options, activeValue, onChange, ariaLabel = 'Filtro alfabético de pacientes', entityLabel = 'pacientes' }) {
  return (
    <div className="pacientes-alphabet" role="toolbar" aria-label={ariaLabel}>
      {(options || []).map((option) => {
        const value = Number(option?.id ?? 0) || 0;
        const label = String(option?.label || '*');
        const active = value === Number(activeValue || 0);
        return (
          <button
            key={`${value}-${label}`}
            type="button"
            className={`pacientes-alphabet-button${active ? ' is-active' : ''}`}
            aria-pressed={active}
            aria-label={value === 0 ? `Todos os ${entityLabel}` : `${entityLabel} com ${label}`}
            onClick={() => onChange?.(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
