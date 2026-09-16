import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import { formatHistoricoDate, historicoRowColor } from '../historicoPacienteUtils.js';

export function HistoricoPacienteInlineRow({ item, draft, selected, onSelect, onChange, onKeyDown, onDoubleClick }) {
  const id = item?.id ?? draft?.id ?? 'draft';
  const value = draft || item;
  return <tr key={id} className={selected ? 'is-selected is-editing' : ''} style={{ backgroundColor: historicoRowColor(value.cor) }} onClick={() => onSelect(value)} onDoubleClick={onDoubleClick}>
    <td><DatePicker autoFocus value={value.data ? dayjs(value.data) : null} format="DD/MM/YYYY" onChange={(date) => onChange('data', date ? date.format('YYYY-MM-DD') : '')} onKeyDown={onKeyDown} /></td>
    <td>{value.prestador_apelido || value.prestador_nome || ''}</td>
    <td><Input value={value.regiao || ''} onChange={(event) => onChange('regiao', event.target.value)} onKeyDown={onKeyDown} /></td>
    <td><Input value={value.descricao || ''} onChange={(event) => onChange('descricao', event.target.value)} onKeyDown={onKeyDown} /></td>
  </tr>;
}
