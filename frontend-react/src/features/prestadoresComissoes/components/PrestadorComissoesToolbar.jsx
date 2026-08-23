import { Select } from 'antd';
import { ALL_FILTER } from '../prestadorComissoesApi.js';

export function PrestadorComissoesToolbar({ filters, convenios, prestadores, onNew, onEdit, onDelete, selectedId, deleting = false, onFiltersChange }) {
  const convenioOptions = [{ value: ALL_FILTER, label: '<<Todos>>' }, ...convenios.map((item) => ({ value: Number(item.row_id || item.id), label: item.nome }))];
  const prestadorOptions = [
    { value: ALL_FILTER, label: '<<Todos>>' },
    ...prestadores.map((item) => ({
      value: item.is_system_prestador ? 0 : Number(item.row_id || item.id),
      label: item.is_system_prestador ? 'Clínica' : (item.apelido || item.nome),
      inactive: item.inativo === true || item.ativo === false,
    })),
  ];
  return (
    <>
      <div className="prestador-com-toolbar" role="toolbar" aria-label="Ações de fatores de comissão">
        <button type="button" className="auxiliary-shell-button primary" onClick={onNew}>Novo fator de comissão...</button>
        <button type="button" className="auxiliary-shell-button" disabled={!selectedId} onClick={onEdit}>Altera...</button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!selectedId || deleting} onClick={onDelete}>Elimina</button>
      </div>
      <div className="prestador-com-filters">
        <label><span>Convênio</span><Select value={filters.convenioRowId} options={convenioOptions} onChange={(value) => onFiltersChange({ convenioRowId: value })} /></label>
        <label><span>Prestador</span><Select value={filters.prestadorRowId} options={prestadorOptions} optionRender={(option) => <span style={option.data?.inactive ? { color: '#c62828' } : undefined}>{option.label}</span>} onChange={(value) => onFiltersChange({ prestadorRowId: value })} /></label>
      </div>
    </>
  );
}
