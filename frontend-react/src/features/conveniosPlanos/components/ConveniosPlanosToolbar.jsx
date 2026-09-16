const actions = ['Novo Convênio', 'Altera', 'Elimina', 'Calendário de faturamento', 'Novo plano', 'Altera plano', 'Elimina plano'];
export function ConveniosPlanosToolbar({ onNewConvenio, onEditConvenio, onDeleteConvenio, onCalendar, onNewPlano, onEditPlano, onDeletePlano, hasSelection, hasPlanSelection }) {
  return <div className="servicos-protetico-toolbar-row convenios-planos-toolbar" role="toolbar" aria-label="Ações de convênios e planos">
    <div className="materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions">
      {actions.slice(0, 4).map((label) => <button key={label} type="button" className="auxiliary-shell-button" disabled={label === 'Altera' || label === 'Elimina' || label === 'Calendário de faturamento' ? !hasSelection : false} onClick={label === 'Novo Convênio' ? onNewConvenio : label === 'Altera' ? onEditConvenio : label === 'Elimina' ? onDeleteConvenio : label === 'Calendário de faturamento' ? onCalendar : undefined} title={label === 'Novo Convênio' || hasSelection ? undefined : 'Selecione um convênio'}>{label}</button>)}
      <span className="convenios-planos-toolbar-divider" role="separator" aria-hidden="true" />
      {actions.slice(4).map((label) => <button key={label} type="button" className="auxiliary-shell-button" disabled={label === 'Novo plano' ? !hasSelection : label === 'Altera plano' || label === 'Elimina plano' ? !hasPlanSelection : true} onClick={label === 'Novo plano' ? onNewPlano : label === 'Altera plano' ? onEditPlano : label === 'Elimina plano' ? onDeletePlano : undefined} title={(label === 'Novo plano' && hasSelection) || ((label === 'Altera plano' || label === 'Elimina plano') && hasPlanSelection) ? undefined : 'Disponível em etapa posterior'}>{label}</button>)}
    </div>
  </div>;
}
