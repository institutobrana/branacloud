import { BranaCard } from '../../../components/BranaCard.jsx';

export function AdminModuleShell({ title, subtitle, toolbar, children, className = '' }) {
  return (
    <div className={`brana-admin-module ${className}`.trim()}>
      <BranaCard bordered={false} className="admin-module-card">
        <div className="admin-module-band-copy" aria-label={title ? `Conteúdo de ${title}` : undefined}>
          {subtitle ? <div className="admin-module-subtitle">{subtitle}</div> : null}
          {toolbar ? <div className="admin-module-toolbar">{toolbar}</div> : null}
        </div>
        <div className="admin-module-content">{children}</div>
      </BranaCard>
    </div>
  );
}
