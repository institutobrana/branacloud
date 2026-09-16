import { Button, Checkbox, Modal, Select, Table } from 'antd';
import { useAgendaNotices } from '../hooks/useAgendaNotices.js';
import { SharedDatePicker } from './AgendaFreeSlotsModal.jsx';

export function AgendaNoticeModal({ open, onClose, providerId = '' }) {
  const state = useAgendaNotices({ open, providerId });
  const update = (key, value) => state.update(key, value);
  const contact = state.filters.sendType === 'whatsapp' ? 'WhatsApp' : 'E-mail';
  const data = state.rows.map((row, index) => ({ ...row, key: index, dateLabel: row.data ? row.data.split('-').reverse().join('/') : '', contact: row.contato || '', index }));
  const columns = [
    { title: 'Data', dataIndex: 'dateLabel' }, { title: 'Hora', dataIndex: 'hora' }, { title: 'Paciente', dataIndex: 'paciente' }, { title: contact, dataIndex: 'contact' },
    { title: 'Ok', dataIndex: 'ok', render: (_, row) => <Checkbox checked={row.ok === true} disabled={row.identity_eligible !== true || row.contact_eligible !== true || !String(row.contato || '').trim()} onChange={() => state.toggleOk(row.index)} aria-label={`Incluir ${row.paciente || row.id}`} /> },
  ];
  const advanceDateOnEnter = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    const target = event.target;
    target.blur();
    requestAnimationFrame(() => {
      const content = target.closest('.ant-modal-content');
      const focusables = Array.from(content?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);
      const next = focusables[focusables.indexOf(target) + 1];
      if (next instanceof HTMLElement) next.focus();
    });
  };
  const close = () => { state.reset(); onClose?.(); };
  return <Modal open={open} title="Enviar avisos de agendamento" onCancel={close} footer={null} width={720} destroyOnClose>
    <div className="agenda-notice-modal">
      <div className="agenda-notice-modal__top">
        <label>Período:<div><span onKeyDown={advanceDateOnEnter}><SharedDatePicker value={state.filters.startDate} onChange={(value) => update('startDate', value)} /></span><span>a</span><span onKeyDown={advanceDateOnEnter}><SharedDatePicker value={state.filters.endDate} onChange={(value) => update('endDate', value)} /></span></div></label>
        <label>Tipo de envio:<Select className="agenda-notice-modal__select" popupClassName="agenda-notice-modal__select-dropdown" value={state.filters.sendType} options={[{ value: 'email', label: 'E-mail' }, { value: 'whatsapp', label: 'WhatsApp' }]} onChange={state.changeType} /></label>
        <label>Arquivo:<Select className="agenda-notice-modal__select" popupClassName="agenda-notice-modal__select-dropdown" value={state.filters.modelId || undefined} options={state.models.map((item) => ({ value: String(item.id), label: item.nome }))} onChange={state.changeModel} /></label>
        <Button type="primary" disabled={!state.canSearch} loading={state.loading} onClick={state.search}>Pesquisa</Button>
      </div>
      <Checkbox checked={state.filters.allProviders} onChange={(event) => { update('allProviders', event.target.checked); setTimeout(() => {}, 0); }}>Todos os cirurgiões</Checkbox>
      {state.error && <div role="alert">{state.error}</div>}{state.feedback && <div role="status">{state.feedback}</div>}
      <Table className="agenda-notice-modal__table" columns={columns} dataSource={data} pagination={false} tableLayout="fixed" scroll={{ y: 310, x: 'max-content' }} onRow={(record) => ({ onClick: () => state.setSelectedIndex(record.index) })} rowClassName={(record) => record.index === state.selectedIndex ? 'agenda-notice-selected-row' : ''} locale={{ emptyText: '' }} />
      <div className="agenda-notice-modal__footer"><Button type="primary" disabled={!state.canSend} loading={state.sending} onClick={state.send}>Ok</Button><Button onClick={close}>Cancela</Button></div>
    </div>
  </Modal>;
}
