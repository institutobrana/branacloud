import { Button, Checkbox, DatePicker, Modal, Select, Table, TimePicker } from 'antd';
import { flushSync } from 'react-dom';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { normalizeContaCorrenteDateInput } from '../../contaCorrenteCirurgiao/dateParsing.js';
import { useAgendaFreeSlots } from '../hooks/useAgendaFreeSlots.js';
import './agendaFreeSlotsModal.css';

const days = [['1', 'Segunda-feira'], ['2', 'Terça-feira'], ['3', 'Quarta-feira'], ['4', 'Quinta-feira'], ['5', 'Sexta-feira'], ['6', 'Sábado']];
const asDate = (value) => value ? dayjs(value) : null;
const asTime = (value) => value ? dayjs(value, 'HH:mm') : null;

function focusRelativeFocusable(target, direction) {
  const content = target?.closest?.('.ant-modal-content');
  if (!content) return;
  const focusables = Array.from(content.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  const currentIndex = focusables.indexOf(target);
  const next = focusables[currentIndex + direction];
  if (next instanceof HTMLElement) next.focus();
}

export function SharedDatePicker({ value, disabled, onChange }) {
  const containerRef = useRef(null);
  const draftRef = useRef('');
  const editingRef = useRef(false);
  const skipNextBlurCommitRef = useRef(false);

  useEffect(() => {
    if (editingRef.current) return;
    draftRef.current = value ? dayjs(value).format('DD/MM/YYYY') : '';
  }, [value]);

  useEffect(() => {
    const input = containerRef.current?.querySelector('input');
    if (!input) return undefined;
    const handleInput = () => { draftRef.current = input.value; };
    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, []);

  const commit = (event) => {
    if (skipNextBlurCommitRef.current) {
      skipNextBlurCommitRef.current = false;
      return;
    }
    const input = containerRef.current?.querySelector('input');
    const raw = input instanceof HTMLInputElement ? input.value : draftRef.current;
    const normalized = normalizeContaCorrenteDateInput(raw);
    editingRef.current = false;
    flushSync(() => onChange(normalized ? normalized.format('YYYY-MM-DD') : ''));
  };

  const selectText = (event) => {
    const input = event?.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) return;
    editingRef.current = true;
    requestAnimationFrame(() => input.select());
  };

  return <div ref={containerRef}>
    <DatePicker
      disabled={disabled}
      format="DD/MM/YYYY"
      value={asDate(value)}
      onChange={(nextValue) => {
        if (!nextValue) {
          draftRef.current = '';
          onChange('');
          return;
        }
        if (!dayjs.isDayjs(nextValue)) return;
        draftRef.current = nextValue.format('DD/MM/YYYY');
        editingRef.current = false;
        onChange(nextValue.format('YYYY-MM-DD'));
      }}
      onFocus={selectText}
      onClick={selectText}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          skipNextBlurCommitRef.current = true;
          event.preventDefault();
          commit(event);
          requestAnimationFrame(() => focusRelativeFocusable(event.target, event.shiftKey ? -1 : 1));
        }
      }}
    />
  </div>;
}

export function AgendaFreeSlotsModal({ open, onClose, providers = [], units = [], providerId = '', unitId = '', onEdit }) {
  const state = useAgendaFreeSlots({ open, providerId, unitId, onClose });
  const update = (key, value) => state.setFilters((current) => ({ ...current, [key]: value }));
  const selected = state.rows[state.selectedIndex] || null;
  const columns = [
    { title: 'Data', dataIndex: 'data', align: 'center' },
    { title: 'Dia', dataIndex: 'dia', align: 'center' },
    { title: 'Hora', dataIndex: 'hora', align: 'center' },
    { title: 'Duração', dataIndex: 'duracao', align: 'center' },
    { title: 'Cirurgião', dataIndex: 'cirurgiao', align: 'center' },
  ];
  const data = state.rows.map((item, index) => ({ ...item, key: index, data: item.data ? dayjs(item.data).format('DD/MM/YYYY') : '', duracao: item.duracao_min ?? item.duracao ?? '', cirurgiao: item.cirurgiao || '', index }));
  const openSelected = () => { if (selected) onEdit?.(selected); };
  const close = () => { state.reset(); onClose?.(); };
  return <Modal open={open} title="Pesquisa horarios livres" onCancel={close} footer={null} width={720}>
    <div className="agenda-free-slots-modal">
      <div className="agenda-free-slots-modal__top">
        <fieldset><legend>Dias da semana</legend>{days.map(([value, label]) => <Checkbox key={value} checked={state.filters.weekdays.includes(value)} onChange={(e) => update('weekdays', e.target.checked ? [...state.filters.weekdays, value].sort() : state.filters.weekdays.filter((day) => day !== value))}>{label}</Checkbox>)}</fieldset>
        <div className="agenda-free-slots-modal__filters">
          <label>Cirurgião<Select value={state.filters.providerId || providerId || undefined} options={providers.filter((item) => item.value).map((item) => ({ value: String(item.value), label: item.label }))} onChange={(value) => update('providerId', value)} /></label>
          <label>Unidade<Select value={state.filters.unitId || unitId || undefined} options={units.filter((item) => item.value).map((item) => ({ value: String(item.value), label: item.label }))} onChange={(value) => update('unitId', value)} /></label>
          <label>Horário entre<div><TimePicker format="HH:mm" value={asTime(state.filters.startTime)} onChange={(value) => update('startTime', value?.format('HH:mm') || '')} /><span>e</span><TimePicker format="HH:mm" value={asTime(state.filters.endTime)} onChange={(value) => update('endTime', value?.format('HH:mm') || '')} /></div></label>
          <div className="agenda-free-slots-modal__period"><Checkbox checked={state.filters.period} onChange={(e) => update('period', e.target.checked)}>Período entre:</Checkbox><SharedDatePicker disabled={!state.filters.period} value={state.filters.startDate} onChange={(value) => update('startDate', value)} /><span>e</span><SharedDatePicker disabled={!state.filters.period} value={state.filters.endDate} onChange={(value) => update('endDate', value)} /></div>
          <div className="agenda-free-slots-modal__search"><Button type="primary" disabled={!state.canSearch} loading={state.loading} onClick={state.search}>Pesquisa</Button></div>
        </div>
      </div>
      {state.error && <div role="alert">{state.error}</div>}
      <Table columns={columns} dataSource={data} pagination={false} size="small" scroll={{ y: 214 }} rowSelection={{ type: 'radio', selectedRowKeys: state.selectedIndex == null ? [] : [state.selectedIndex], onChange: (keys) => state.setSelectedIndex(keys[0] ?? null) }} onRow={(record) => ({ onClick: () => state.setSelectedIndex(record.index), onDoubleClick: () => onEdit?.(record) })} locale={{ emptyText: '' }} />
      <div className="agenda-free-slots-modal__footer"><Button type="primary" disabled={!selected} onClick={openSelected}>Edita...</Button><Button onClick={close}>Fecha</Button></div>
    </div>
  </Modal>;
}
