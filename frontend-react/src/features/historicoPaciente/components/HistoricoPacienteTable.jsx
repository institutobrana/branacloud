import { formatHistoricoDate, historicoRowColor } from '../historicoPacienteUtils.js';
import { HistoricoPacienteInlineRow } from './HistoricoPacienteInlineRow.jsx';

export function formatDate(value) {
  return formatHistoricoDate(value);
}

export function rowColor(value) {
  return historicoRowColor(value);
}

export function HistoricoPacienteTable({ items, selectedId, onSelect, sortOrder, onToggleSort, editingId, draft, onChange, onKeyDown, onDoubleClick }) {
  return (
    <div className="historico-paciente-table-wrap">
      <table className="historico-paciente-table">
        <thead>
          <tr>
            <th scope="col"><button type="button" onClick={onToggleSort}>Data <span aria-label={sortOrder === 'asc' ? 'ordenação crescente' : 'ordenação decrescente'}>{sortOrder === 'asc' ? '▲' : '▼'}</span></button></th>
            <th scope="col">Cirurgião</th>
            <th scope="col">Região</th>
            <th scope="col">Descrição do procedimento</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && !draft ? <tr className="historico-paciente-empty-row"><td colSpan="4">Nenhum registro de histórico.</td></tr> : items.map((item) => {
            const id = item.id ?? item.row_id;
            if (editingId === id) return <HistoricoPacienteInlineRow key={id} item={item} draft={draft} selected={selectedId === id} onSelect={onSelect} onChange={onChange} onKeyDown={onKeyDown} onDoubleClick={onDoubleClick} />;
            return (
              <tr key={id} className={selectedId === id ? 'is-selected' : ''} style={{ backgroundColor: rowColor(item.cor) }} onClick={() => onSelect(item)} onDoubleClick={() => onDoubleClick(item)}>
                <td>{formatDate(item.data)}</td>
                <td>{item.prestador_apelido || item.prestador_nome || ''}</td>
                <td>{item.regiao || ''}</td>
                <td title={item.descricao || ''}>{item.descricao || ''}</td>
              </tr>
            );
          })}
          {draft && !editingId ? <HistoricoPacienteInlineRow draft={draft} selected onSelect={onSelect} onChange={onChange} onKeyDown={onKeyDown} onDoubleClick={onDoubleClick} /> : null}
        </tbody>
      </table>
    </div>
  );
}
