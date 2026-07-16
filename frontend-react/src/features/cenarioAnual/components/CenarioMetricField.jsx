export function CenarioMetricField({ value, className = '' }) {
  return (
    <div className={`cenario-metric-field ${className}`.trim()}>
      <div className="cenario-metric-value" aria-readonly="true">
        <span className="cenario-metric-value-text">{value}</span>
      </div>
    </div>
  );
}
