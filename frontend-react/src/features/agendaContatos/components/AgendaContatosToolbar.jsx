export function AgendaContatosToolbar({ types, tipo, busca, selectedId, onTipoChange, onBuscaChange }) {
  const pending = (label) => { window.dispatchEvent(new CustomEvent('brana-agenda-contatos-pending', { detail: { action: label } })); };
  return (
    <div className="agenda-contatos-toolbar" role="toolbar" aria-label="Ações da Agenda de contatos">
      <div className="agenda-contatos-toolbar-actions">
        <button type="button" className="auxiliary-shell-button" onClick={() => pending('novo')}>Novo contato</button>
        <button type="button" className="auxiliary-shell-button" disabled={!selectedId} onClick={() => pending('altera')}>Altera</button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!selectedId} onClick={() => pending('elimina')}>Elimina</button>
        <button type="button" className="auxiliary-shell-button" disabled onClick={() => pending('imprime')}>Imprime</button>
        <button type="button" className="auxiliary-shell-button" disabled onClick={() => pending('relatorio')}>Relatório</button>
      </div>
      <span className="agenda-contatos-toolbar-divider" aria-hidden="true" />
      <div className="agenda-contatos-toolbar-filters">
        <label htmlFor="agenda-contatos-tipo-filtro">Filtro:
          <select id="agenda-contatos-tipo-filtro" value={tipo} onChange={(event) => { onTipoChange(event.target.value); window.dispatchEvent(new CustomEvent('brana-agenda-contatos-toolbar-filter', { detail: { field: 'tipo', value: event.target.value } })); }}>
            <option value="">&lt;&lt;Todos&gt;&gt;</option>
            {types.map((item) => <option key={item.id ?? item.descricao} value={item.descricao || ''}>{item.descricao || ''}</option>)}
          </select>
        </label>
        <label htmlFor="agenda-contatos-busca">Nome ou iniciais:
          <input id="agenda-contatos-busca" type="text" value={busca} onChange={(event) => { onBuscaChange(event.target.value); window.dispatchEvent(new CustomEvent('brana-agenda-contatos-toolbar-filter', { detail: { field: 'busca', value: event.target.value } })); }} />
        </label>
      </div>
    </div>
  );
}
