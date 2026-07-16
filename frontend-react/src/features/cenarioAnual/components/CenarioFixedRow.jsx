export function CenarioFixedRow({ label, control, isSeparator = false, className = '' }) {
  if (isSeparator) {
    return <div className={`cenario-fixed-divider ${className}`.trim()} aria-hidden="true" />;
  }

  return (
    <div className={`cenario-fixed-row ${className}`.trim()}>
      <div className="cenario-fixed-label">{label}</div>
      <div className="cenario-fixed-control">{control}</div>
    </div>
  );
}
