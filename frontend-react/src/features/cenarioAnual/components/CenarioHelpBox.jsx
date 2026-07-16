import { Typography } from 'antd';

export function CenarioHelpBox({ title, children, className = '' }) {
  return (
    <div className={`cenario-help-box ${className}`.trim()}>
      {title ? <Typography.Title level={5} className="cenario-help-box-title">{title}</Typography.Title> : null}
      <div className="cenario-help-box-body">{children}</div>
    </div>
  );
}
