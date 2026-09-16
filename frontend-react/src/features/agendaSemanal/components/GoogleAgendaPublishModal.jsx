import { Alert, Button, Modal, Spin, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { disconnectGoogleCalendar, fetchGoogleCalendarPreview, fetchGoogleCalendarStatus, startGoogleCalendarOAuth } from '../api/googleAgendaApi.js';
import { SharedDatePicker } from './AgendaFreeSlotsModal.jsx';
import './googleAgendaPublishModal.css';

function weekRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  const iso = (value) => value.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}

function normalizePreviewRows(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const payload = item?.payload || {};
    const start = payload.start || {};
    const dateTime = String(start.dateTime || '');
    const data = item?.data || dateTime.slice(0, 10);
    const hora = item?.hora || (dateTime.length >= 16 ? dateTime.slice(11, 16) : '');
    return { ...item, data, hora, titulo: item?.titulo || payload.summary || 'Compromisso' };
  });
}

export function GoogleAgendaPublishModal({ open, onClose, providerId = '', unitId = '' }) {
  const [status, setStatus] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const defaultRange = useMemo(weekRange, []);
  const [start, setStart] = useState(defaultRange.start);
  const [end, setEnd] = useState(defaultRange.end);
  const range = { start, end };

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true); setError('');
    fetchGoogleCalendarStatus().then((data) => {
      if (active) setStatus(data || {});
    }).catch((reason) => {
      if (active) setError(reason?.message || 'Falha ao consultar a conexão Google.');
    }).finally(() => { if (active) setLoading(false); });
    setPreview([]); setPreviewError('');
    setStart(defaultRange.start); setEnd(defaultRange.end);
    return () => { active = false; };
  }, [open, defaultRange.end, defaultRange.start]);

  const loadPreview = () => {
    if (!start || !end || end < start) return;
    setPreviewLoading(true); setPreviewError('');
    fetchGoogleCalendarPreview({ start, end, providerId, unitId }).then((data) => {
      setPreview(normalizePreviewRows(data));
    }).catch((reason) => {
      setPreviewError(reason?.message || 'Falha ao carregar o preview da Agenda.');
    }).finally(() => setPreviewLoading(false));
  };

  const validPeriod = Boolean(start && end && end >= start);

  const connectGoogle = async () => {
    const popup = window.open('', 'brana_google_calendar_oauth', 'width=580,height=700,resizable=yes,scrollbars=yes');
    if (!popup) {
      setError('Não foi possível abrir a janela de autorização Google.');
      return;
    }
    try {
      const data = await startGoogleCalendarOAuth();
      const authUrl = String(data?.auth_url || '').trim();
      if (!authUrl || !/^https:\/\/(accounts\.google\.com|oauth2\.googleapis\.com)\//i.test(authUrl)) {
        popup.close();
        setError('URL de autorização Google inválida.');
        return;
      }
      popup.location.assign(authUrl);
    } catch (reason) {
      popup.close();
      setError(reason?.message || 'Falha ao iniciar conexão com Google Agenda.');
    }
  };

  const disconnectGoogle = async () => {
    setLoading(true); setError('');
    try {
      await disconnectGoogleCalendar();
      setStatus((current) => ({ ...(current || {}), connected: false, email: '', requires_reconnect: false }));
      setPreview([]);
    } catch (reason) {
      setError(reason?.message || 'Falha ao desconectar o Google Agenda.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Data', dataIndex: 'data', width: 120, render: (value) => value ? String(value).split('-').reverse().join('/') : '' },
    { title: 'Hora', dataIndex: 'hora', width: 100 },
    { title: 'Paciente / compromisso', dataIndex: 'titulo', render: (value, record) => value || record.paciente_nome || record.descricao || '' },
  ];

  const dateLabel = (value) => value.split('-').reverse().join('/');
  const rows = preview.map((item, index) => ({ ...item, key: item.agenda_id || item.id || index }));

  return <Modal open={open} title="Publicar agenda no Google" onCancel={onClose} footer={null} width={720} destroyOnClose className="google-agenda-publish-modal">
    {loading ? <div className="google-agenda-publish-modal__loading"><Spin aria-label="Consultando conexão Google" /></div> : <div className="google-agenda-publish-modal__content">
      {error && <Alert role="alert" type="error" showIcon message={error} />}
      <div className="google-agenda-publish-modal__top-row">
        <label className="google-agenda-publish-modal__account"><span className="google-agenda-publish-modal__label">Conta Google:</span><input className="google-agenda-publish-modal__readonly" type="text" readOnly value={status?.email || ''} aria-label="Conta Google" /></label>
        <div className="google-agenda-publish-modal__period"><span className="google-agenda-publish-modal__label">Período a exportar:</span><div className="google-agenda-publish-modal__date-fields"><SharedDatePicker value={start} onChange={setStart} /><span>a</span><SharedDatePicker value={end} onChange={setEnd} /></div></div>
        <Button disabled={!validPeriod || previewLoading} loading={previewLoading} onClick={loadPreview}>Visualiza</Button>
      </div>
      <div className="google-agenda-publish-modal__status-row">
        <span>Google Agenda: <strong>{status?.connected ? 'Conectado' : 'Não conectado'}</strong></span>
        {status?.connected ? <Button danger title="Desconectar Google" onClick={disconnectGoogle}>Desconectar Google</Button> : <Button type="primary" title="Conectar Google" onClick={connectGoogle}>Conectar Google</Button>}
      </div>
      <div className="google-agenda-publish-modal__table-section">
        {previewError && <Alert role="alert" type="error" showIcon message={previewError} />}
        <Table className="google-agenda-publish-modal__table" size="small" loading={previewLoading} columns={columns} dataSource={rows} pagination={false} scroll={{ y: 330 }} tableLayout="fixed" locale={{ emptyText: 'Nenhum agendamento no período.' }} />
      </div>
      <div className="google-agenda-publish-modal__footer"><Button type="primary" disabled title="Publicação temporariamente pausada">Exporta</Button><Button onClick={onClose}>Fecha</Button></div>
    </div>}
  </Modal>;
}
