import { CenarioHelpBox } from './CenarioHelpBox.jsx';

export function CenarioFinancialSection({ children, helpText, className = '', variant = '' }) {
  return (
    <section className={`cenario-financial-section ${variant ? `cenario-financial-section--${variant}` : ''} ${className}`.trim()}>
      <div className="cenario-financial-fields">{children}</div>
      <CenarioHelpBox className="cenario-help-box--compact cenario-help-box--financial cenario-financial-help">
        {helpText}
      </CenarioHelpBox>
    </section>
  );
}
