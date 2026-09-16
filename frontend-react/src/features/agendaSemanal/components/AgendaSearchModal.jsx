import { Button, Checkbox, Input, Modal, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { fetchAgendaSearchEvents } from '../api/agendaSemanalApi.js';
import './agendaSearchModal.css';

function localDateTime(item) {
  const date = String(item?.data || '').slice(0, 10);
  const minutes = Number(item?.hora_inicio || 0) / 60000;
  const value = new Date(`${date}T00:00:00`);
  value.setMinutes(minutes);
  return value;
}

const formatDate = (value) => value.toLocaleDateString('pt-BR');
const formatTime = (value) => `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
// Ant Design small table rows measure 39px in the approved modal geometry.
// Keep the complete datasource; only the result viewport is bounded visually.
const RESULTS_VISIBLE_HEIGHT = 10 * 39;

export function AgendaSearchModal({ open, onClose, onEdit }) {
  const [query, setQuery] = useState('');
  const [future, setFuture] = useState(true);
  const [past, setPast] = useState(true);
  const [patients, setPatients] = useState(true);
  const [commitments, setCommitments] = useState(true);
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    setQuery(''); setFuture(true); setPast(true); setPatients(true); setCommitments(true);
    setRows([]); setSelectedId(null); setError('');
  }, [open]);
  const canSearch = Boolean(query.trim()) && (future || past);
  const displayedRows = useMemo(() => {
    const now = new Date();
    return rows.filter((item) => {
      const when = localDateTime(item);
      const temporal = when >= now ? future : past;
      const isPatient = Number(item.tipo) === 1 || item.nro_pac != null;
      const type = isPatient ? patients : commitments;
      return temporal && type;
    }).sort((a, b) => localDateTime(a) - localDateTime(b));
  }, [rows, future, past, patients, commitments]);
  const selected = displayedRows.find((item) => String(item.id) === String(selectedId)) || null;
  const runSearch = async () => {
    if (!canSearch || loading) return;
    setLoading(true); setError(''); setSelectedId(null);
    try { setRows(await fetchAgendaSearchEvents({ query })); }
    catch (reason) { setRows([]); setError(reason?.message || 'Falha ao pesquisar agendamentos.'); }
    finally { setLoading(false); }
  };
  const editSelected = () => { if (selected) onEdit?.(selected); };
  const columns = [
    { title: 'Data', dataIndex: 'date', key: 'date', width: 105, align: 'center' },
    { title: 'Hora', dataIndex: 'time', key: 'time', width: 70, align: 'center' },
    {
      title: 'Paciente / Compromisso', dataIndex: 'label', key: 'label', width: 300, align: 'center',
      onHeaderCell: () => ({ className: 'agenda-search-modal__patient-header' }),
    },
    { title: 'Cirurgião', dataIndex: 'surgeon', key: 'surgeon', width: 150, align: 'center' },
  ];
  const data = displayedRows.map((item) => { const when = localDateTime(item); return { key: String(item.id), date: formatDate(when), time: formatTime(when), label: Number(item.tipo) === 2 || item.nro_pac == null ? item.motivo || 'Compromisso' : item.nome || `Paciente #${item.nro_pac}`, surgeon: item.prestador_apelido || '', item }; });
  return <Modal open={open} title="Pesquisa agendamentos" onCancel={onClose} footer={null} width={720} destroyOnClose>
    <div className="agenda-search-modal">
      <label htmlFor="agenda-search-text">Texto a ser pesquisado (nome ou assunto):</label>
      <div className="agenda-search-modal__query"><Input id="agenda-search-text" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onPressEnter={runSearch} /><Button type="primary" disabled={!canSearch} loading={loading} onClick={runSearch}>Pesquisa</Button></div>
      <div className="agenda-search-modal__filters"><Checkbox checked={future} onChange={(event) => setFuture(event.target.checked)}>Agendamentos futuros</Checkbox><Checkbox checked={past} onChange={(event) => setPast(event.target.checked)}>Agendamentos passados</Checkbox><Checkbox checked={patients} onChange={(event) => setPatients(event.target.checked)}>Pesquisar pacientes</Checkbox><Checkbox checked={commitments} onChange={(event) => setCommitments(event.target.checked)}>Pesquisar compromissos</Checkbox></div>
      {error ? <div role="alert">{error}</div> : null}
      <Table columns={columns} dataSource={data} pagination={false} size="small" scroll={{ y: RESULTS_VISIBLE_HEIGHT }} locale={{ emptyText: 'Nenhum agendamento encontrado.' }} rowSelection={{ type: 'radio', selectedRowKeys: selectedId ? [String(selectedId)] : [], onChange: (keys) => setSelectedId(keys[0] || null) }} onRow={(record) => ({ onDoubleClick: () => onEdit?.(record.item), onClick: () => setSelectedId(record.key) })} />
      <div className="agenda-search-modal__footer"><Button type="primary" disabled={!selected} onClick={editSelected}>Edita...</Button><Button onClick={onClose}>Fecha</Button></div>
    </div>
  </Modal>;
}
