export function CenarioFinancialRow({ label, control, compact = false }) {
  return (
    <>
      <div className="cenario-financial-row-label">{label}</div>
      <div className={`cenario-financial-row-control${compact ? ' cenario-financial-row-control--compact' : ''}`}>
        {control}
      </div>
    </>
  );
}
