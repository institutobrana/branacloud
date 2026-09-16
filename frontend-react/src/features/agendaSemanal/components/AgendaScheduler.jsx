import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import ptBrLocale from '@fullcalendar/react/locales/pt-br';
import '@fullcalendar/react/skeleton.css';
import { AgendaEventContent } from './AgendaEventContent.jsx';
import { AgendaTemporalStrip } from './AgendaTemporalStrip.jsx';
import { AgendaDiaCalendar } from './AgendaDiaCalendar.jsx';
import { AgendaClinicaView } from './AgendaClinicaView.jsx';
import { AgendaEventModal } from './AgendaEventModal.jsx';
import { AgendaContextMenu } from './AgendaContextMenu.jsx';
import { AgendaDeleteConfirmModal } from './AgendaDeleteConfirmModal.jsx';
import { deleteAgendaEvent } from '../api/agendaSemanalApi.js';
import { fromSchedulerDrop, toSchedulerEvent } from '../adapters/agendaSchedulerAdapter.js';
import { agendaSpikeConfig, agendaSpikeFixture, hasTemporalConflict } from '../utils/agendaSpikeFixture.js';
import { resolveAgendaEventPresentation } from './agendaEventPresentation.js';
import { shiftAgendaDate, subscribeAgendaTemporalNavigation } from './agendaTemporalNavigation.js';
import { resolveWeeklyDisplayDate } from '../utils/agendaWeeklyDate.js';
import { normalizeAgendaEvent } from '../utils/agendaRealNormalizer.js';
import { agendaSlotMinHeight } from '../utils/agendaSchedulerScale.js';
import { isAgendaDoubleClick } from '../utils/agendaInteraction.js';
import './agendaScheduler.css';

const WEEK_HIDDEN_DAYS = [0];
const DAY_HIDDEN_DAYS = [];

function timeValue(value, fallback) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallback;
  return `${String(Number(match[1])).padStart(2, '0')}:${match[2]}:00`;
}

function durationValue(value, fallback) {
  const minutes = Math.max(5, Number(value || fallback));
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00`;
}

function localTimeFromDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function localDateIso(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function AgendaScheduler({ events: externalEvents, statusCatalog = [], providers = [], selectedProviderId = '', selectedUnitId = '', readOnly = false, loading = false, error = '', onVisibleRangeChange, initialMode = 'semana' }) {
  const calendarRef = useRef(null);
  const schedulerMainRef = useRef(null);
  const visibleDateRef = useRef(null);
  const [view, setView] = useState(initialMode === 'dia' ? 'timeGridDay' : 'timeGridWeek');
  const [mode, setMode] = useState(initialMode === 'dia' ? 'dia' : 'semana');
  const [calendarDate, setCalendarDate] = useState(null);
  const [temporalDate, setTemporalDate] = useState(null);
  const [events, setEvents] = useState(() => agendaSpikeFixture);
  const [message, setMessage] = useState('');
  const [schedulerHeight, setSchedulerHeight] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editor, setEditor] = useState(null);
  const [contextMenu, setContextMenu] = useState({ open: false, kind: null, x: 0, y: 0, date: '', startTime: '', providerId: '', unitId: '', room: null, event: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, event: null, submitting: false, error: '' });

  useEffect(() => {
    const element = schedulerMainRef.current;
    if (!element) return undefined;
    const updateHeight = () => setSchedulerHeight(Math.round(element.getBoundingClientRect().height));
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => {
    const onView = (event) => {
      const nextMode = event.detail?.view === 'day' ? 'dia' : event.detail?.view === 'clinic' ? 'clinica' : 'semana';
      setMode(nextMode);
      setView(nextMode === 'dia' ? 'timeGridDay' : 'timeGridWeek');
      const api = calendarRef.current?.getApi();
      if (nextMode !== 'clinica') {
        const focusDate = visibleDateRef.current || api?.getDate?.() || new Date();
        const displayDate = nextMode === 'semana' ? resolveWeeklyDisplayDate(focusDate) : focusDate;
        api?.changeView?.(nextMode === 'dia' ? 'timeGridDay' : 'timeGridWeek', displayDate);
      }
    };
    window.addEventListener('brana-agenda-spike-view', onView);
    return () => window.removeEventListener('brana-agenda-spike-view', onView);
  }, []);
  useEffect(() => {
    const onFreeSlot = (event) => { const slot = event.detail; if (slot) setEditor({ mode: 'novo', context: { date: slot.data || '', startTime: slot.hora || '', providerId: slot.id_prestador || selectedProviderId || '', unitId: slot.id_unidade || selectedUnitId || '', duration: slot.duracao_min || slot.duracao || 5 } }); };
    window.addEventListener('brana-agenda-free-slot-edit', onFreeSlot);
    return () => window.removeEventListener('brana-agenda-free-slot-edit', onFreeSlot);
  }, [selectedProviderId, selectedUnitId]);

  useEffect(() => {
    const onSearchEdit = (event) => {
      if (event.detail) openEditEditor({ event: toSchedulerEvent(normalizeAgendaEvent(event.detail)) });
    };
    window.addEventListener('brana-agenda-search-edit', onSearchEdit);
    return () => window.removeEventListener('brana-agenda-search-edit', onSearchEdit);
  }, []);

  useEffect(() => {
    const onFreeSlotEdit = (event) => {
      const slot = event.detail;
      if (!slot) return;
      setEditor({ mode: 'novo', context: { date: slot.data || '', startTime: slot.hora || '', providerId: slot.id_prestador || selectedProviderId || '', unitId: slot.id_unidade || selectedUnitId || '', duration: slot.duracao_min || slot.duracao || 5, fromFreeSlots: true } });
    };
    window.addEventListener('brana-agenda-free-slot-edit', onFreeSlotEdit);
    return () => window.removeEventListener('brana-agenda-free-slot-edit', onFreeSlotEdit);
  }, [selectedProviderId, selectedUnitId]);

  useEffect(() => {
    const onDateSelect = (event) => {
      const date = event.detail?.date;
      if (!date) return;
      const api = calendarRef.current?.getApi();
      visibleDateRef.current = new Date(`${date}T00:00:00`);
      if (api?.gotoDate) api.gotoDate(date);
      else setCalendarDate(date);
    };
    window.addEventListener('brana-agenda-calendar-date-select', onDateSelect);
    return () => window.removeEventListener('brana-agenda-calendar-date-select', onDateSelect);
  }, []);

  const selectMode = (nextMode) => {
    if (nextMode === 'dia' || nextMode === 'semana' || nextMode === 'clinica') {
      window.dispatchEvent(new CustomEvent('brana-agenda-spike-view', { detail: { view: nextMode === 'dia' ? 'day' : nextMode === 'clinica' ? 'clinic' : 'week' } }));
    }
  };

  const selectDay = (date) => {
    const nextDate = new Date(date);
    visibleDateRef.current = nextDate;
    setTemporalDate(nextDate);
    calendarRef.current?.getApi?.().gotoDate?.(nextDate);
  };

  useEffect(() => {
    const onNavigate = ({ unit: requestedUnit, direction }) => {
      const api = calendarRef.current?.getApi();
      const unit = requestedUnit === 'month' ? 'month' : requestedUnit === 'day' ? 'day' : 'week';
      const base = visibleDateRef.current || api?.getDate?.() || new Date();
      const nextDate = shiftAgendaDate(base, unit, direction);
      visibleDateRef.current = nextDate;
      setTemporalDate(nextDate);
      if (api?.gotoDate) api.gotoDate(nextDate);
      else setCalendarDate(nextDate.toISOString().slice(0, 10));
    };
    const unsubscribe = subscribeAgendaTemporalNavigation(onNavigate);
    return unsubscribe;
  }, []);

  const realMode = Array.isArray(externalEvents);
  const calendarInitialDate = realMode
    ? calendarDate || (mode === 'semana' ? resolveWeeklyDisplayDate(temporalDate || new Date()) : temporalDate || undefined)
    : agendaSpikeConfig.initialDate;
  const currentEvents = realMode ? externalEvents : events;
  const providerConfigs = useMemo(() => new Map(providers.map((provider) => [String(provider.id), provider.agenda_config || {}])), [providers]);
  const eventsWithPresentation = useMemo(() => currentEvents.map((event) => ({
    ...event,
    providerConfig: providerConfigs.get(String(event.providerId)) || {},
    presentation: resolveAgendaEventPresentation(event, providerConfigs.get(String(event.providerId)) || {}, statusCatalog),
  })), [currentEvents, providerConfigs, statusCatalog]);
  const schedulerEvents = useMemo(() => eventsWithPresentation.map((event) => toSchedulerEvent(event)), [eventsWithPresentation]);
  const selectedProvider = providers.find((provider) => String(provider.id) === String(selectedProviderId));
  const selectedConfig = selectedProvider?.agenda_config || {};
  const slotDuration = realMode ? durationValue(selectedConfig.duracao, 5) : agendaSpikeConfig.slotDuration;
  const slotMinTime = realMode ? timeValue(selectedConfig.manha_inicio, agendaSpikeConfig.slotMinTime.slice(0, 5)) : agendaSpikeConfig.slotMinTime;
  const slotMaxTime = realMode ? timeValue(selectedConfig.tarde_fim, agendaSpikeConfig.slotMaxTime.slice(0, 5)) : agendaSpikeConfig.slotMaxTime;
  const visibleScheduleCount = Math.max(
    1,
    Math.trunc(Number(mode === 'dia' ? selectedConfig.dia_horarios : selectedConfig.semana_horarios) || 12),
  );
  const slotHeight = agendaSlotMinHeight(visibleScheduleCount);

  const isAllowed = (dropInfo, draggedEvent) => {
    const candidate = {
      id: draggedEvent.id,
      start: dropInfo.start,
      end: dropInfo.end,
    };
    const day = candidate.start.getDay();
    if (day === 0 || candidate.start < agendaSpikeConfig.validStart || candidate.end > agendaSpikeConfig.validEnd) return false;
    return !hasTemporalConflict(candidate, currentEvents);
  };

  const openNewEditor = (info) => {
    setEditor({
      mode: 'novo',
      context: {
        date: String(info.dateStr || '').slice(0, 10),
        startTime: info.timeStr || localTimeFromDate(info.date),
        providerId: info.providerId || selectedProviderId || '',
      },
    });
  };

  const openEditEditor = (info) => {
    setEditor({ mode: 'edicao', event: info.event });
  };

  const handleDateClick = (info) => {
    if (isAgendaDoubleClick(info.jsEvent)) openNewEditor(info);
  };

  const handleEventClick = (info) => {
    setSelectedEventId(String(info.event.id));
    if (isAgendaDoubleClick(info.jsEvent)) openEditEditor(info);
  };

  const closeContextMenu = () => setContextMenu((current) => ({ ...current, open: false }));
  const openFreeContextMenu = (event) => {
    if (event.target.closest?.('.fc-timegrid-event')) return;
    const slot = event.target.closest?.('.fc-timegrid-slot')
      || document.elementsFromPoint(event.clientX, event.clientY).find((element) => element.matches?.('[data-time]'));
    const column = slot?.closest?.('[data-date]')
      || [...(schedulerMainRef.current?.querySelectorAll('[role="columnheader"][data-date]') || [])]
        .find((header) => { const rect = header.getBoundingClientRect(); return event.clientX >= rect.left && event.clientX <= rect.right; });
    if (!slot || !column) return;
    event.preventDefault();
    setContextMenu({ open: true, kind: 'free-slot', x: event.clientX, y: event.clientY, date: column.dataset.date || '', startTime: String(slot.dataset.time || '').slice(0, 5), providerId: selectedProviderId || '', unitId: selectedUnitId || '', room: null, event: null });
  };
  const handleContextAction = (action, context) => {
    if (action === 'novo') { setEditor({ mode: 'novo', context: { date: context.date, startTime: context.startTime, providerId: context.providerId } }); return; }
    if (action === 'editar') { setEditor({ mode: 'edicao', event: context.event }); return; }
    if (action === 'excluir') { setDeleteConfirm({ open: true, event: context.event, submitting: false, error: '' }); return; }
    if (action === 'repetir') { setEditor({ mode: 'edicao', event: context.event, initialTab: 'repete' }); return; }
    const messages = { odontograma: 'Abrir odontograma: em planejamento.', ficha: 'Abrir ficha pessoal: em planejamento.', iguais: 'Pesquisar iguais: em planejamento.' };
    if (messages[action]) setMessage(messages[action]);
  };
  const handleEventContextMenu = (calendarEvent, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedEventId(String(calendarEvent.id));
    const currentEvent = currentEvents.find((item) => String(item.id) === String(calendarEvent.id));
    const contextEvent = currentEvent ? toSchedulerEvent(currentEvent) : calendarEvent;
    setContextMenu({ open: true, kind: 'existing-event', x: event.clientX, y: event.clientY, date: '', startTime: '', providerId: '', unitId: '', room: null, event: contextEvent });
  };
  const confirmDelete = async () => {
    if (!deleteConfirm.event || deleteConfirm.submitting) return;
    setDeleteConfirm((current) => ({ ...current, submitting: true, error: '' }));
    try {
      await deleteAgendaEvent(deleteConfirm.event.id);
      setDeleteConfirm({ open: false, event: null, submitting: false, error: '' });
      setSelectedEventId(null);
      window.dispatchEvent(new CustomEvent('brana-agenda-bloqueios-changed'));
    } catch (error) {
      setDeleteConfirm((current) => ({ ...current, submitting: false, error: error?.message || 'Falha ao eliminar o agendamento.' }));
    }
  };

  const handleClinicSlotClick = ({ date, slot, provider, jsEvent }) => {
    if (!isAgendaDoubleClick(jsEvent)) return;
    const slotDate = new Date(date || temporalDate || new Date());
    slotDate.setHours(Math.floor(slot / 60), slot % 60, 0, 0);
    const dateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`;
    openNewEditor({
      dateStr,
      timeStr: `${String(Math.floor(slot / 60)).padStart(2, '0')}:${String(slot % 60).padStart(2, '0')}`,
      date: slotDate,
      providerId: provider?.id || selectedProviderId || '',
    });
  };

  const handleClinicEventClick = ({ event, jsEvent }) => {
    setSelectedEventId(String(event.id));
    if (isAgendaDoubleClick(jsEvent)) openEditEditor({ event });
  };

  const handleEditorCancel = () => { const fromFreeSlots = editor?.context?.fromFreeSlots; setEditor(null); if (fromFreeSlots) window.dispatchEvent(new CustomEvent('brana-agenda-free-slot-cancelled')); };

  const handleEditorNew = () => setEditor({
    mode: 'novo',
    context: { date: '', startTime: '', providerId: selectedProviderId || '' },
  });

  return (
    <div className={`agenda-spike-shell agenda-unified-shell agenda-spike-shell--${mode}`} data-selected-event-id={selectedEventId || ''} style={{ '--agenda-visible-slot-height': `${slotHeight}px` }}>
      <AgendaTemporalStrip date={temporalDate} weekDisplayDate={resolveWeeklyDisplayDate(temporalDate || new Date())} activeMode={mode} onSelect={selectMode} />
      {message && <div className="agenda-spike-status" role="status" aria-live="polite">{message}</div>}
      {loading && <div className="agenda-spike-status" role="status">Carregando agendamentos...</div>}
      {error && <div className="agenda-spike-status agenda-spike-error" role="alert">{error}</div>}
      <div className="agenda-scheduler-content">
      <div className="agenda-scheduler-main" ref={schedulerMainRef} onContextMenuCapture={openFreeContextMenu}>
      {mode === 'dia' && <h2 className="agenda-dia-heading">{temporalDate ? new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(temporalDate) : ''}</h2>}
      {mode === 'clinica' ? <AgendaClinicaView date={temporalDate} providers={providers} events={eventsWithPresentation} statusCatalog={statusCatalog} onVisibleRangeChange={onVisibleRangeChange} onSlotClick={handleClinicSlotClick} onEventClick={handleClinicEventClick} /> : <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView={view}
        initialDate={calendarInitialDate}
        views={{ timeGridWeek: { type: 'timeGrid', duration: { weeks: 1 } } }}
        headerToolbar={false}
        weekends
        hiddenDays={mode === 'semana' ? WEEK_HIDDEN_DAYS : DAY_HIDDEN_DAYS}
        firstDay={1}
        locale={ptBrLocale}
        dayHeaderContent={(info) => {
          const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(info.date).replace('.', '');
          const label = weekday.charAt(0).toUpperCase() + weekday.slice(1);
          const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(info.date);
          return `${label} - ${date}`;
        }}
        slotHeaderFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        slotDuration={slotDuration}
        slotHeaderInterval={slotDuration}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        validRange={realMode ? undefined : { start: agendaSpikeConfig.validStart, end: agendaSpikeConfig.validEnd }}
        allDaySlot={false}
        editable={!readOnly}
        eventStartEditable={!readOnly}
        eventDurationEditable={false}
        eventResizableFromStart={false}
        eventAllow={readOnly ? undefined : isAllowed}
        datesSet={(info) => {
          if (!visibleDateRef.current) visibleDateRef.current = temporalDate || new Date();
          if (!temporalDate) setTemporalDate(new Date());
          const focusDate = localDateIso(visibleDateRef.current) || info.startStr;
          window.dispatchEvent(new CustomEvent('brana-agenda-calendar-state', { detail: { date: info.startStr, focusDate } }));
          onVisibleRangeChange?.(info);
        }}
        eventContent={(eventInfo) => <AgendaEventContent eventInfo={eventInfo} />}
        eventDidMount={(info) => {
          const handler = (event) => handleEventContextMenu(info.event, event);
          info.el.addEventListener('contextmenu', handler);
          info.el.__branaContextMenuHandler = handler;
        }}
        eventWillUnmount={(info) => {
          if (info.el.__branaContextMenuHandler) info.el.removeEventListener('contextmenu', info.el.__branaContextMenuHandler);
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={schedulerEvents}
        eventDrop={readOnly ? undefined : (dropInfo) => {
          const next = fromSchedulerDrop(dropInfo);
          const invalidDestination = next.start.getDay() === 0
            || next.start < agendaSpikeConfig.validStart
            || next.end > agendaSpikeConfig.validEnd
            || hasTemporalConflict(next, events);
          if (invalidDestination) {
            dropInfo.revert();
            setMessage('Spike local: destino rejeitado.');
            return;
          }
          // O FullCalendar mantém a instância arrastada no store interno;
          // removê-la antes da reconciliação evita duplicação no estado
          // controlado do spike.
          dropInfo.event.remove();
          setEvents((current) => current.map((event) => String(event.id) === String(next.id) ? { ...event, start: next.start, end: next.end } : event));
          setMessage(`Spike local: ${next.id} movido; duração preservada em ${next.durationMinutes} minutos.`);
        }}
        eventDragStop={() => setMessage('')}
        height="100%"
        expandRows={false}
        slotMinHeight={slotHeight}
        scrollTime="07:00:00"
      />}
      </div>
      {mode === 'dia' && <AgendaDiaCalendar value={temporalDate} onChange={selectDay} />}
      </div>
      <AgendaContextMenu context={contextMenu} onAction={handleContextAction} onClose={closeContextMenu} />
      <AgendaDeleteConfirmModal open={deleteConfirm.open} event={deleteConfirm.event} submitting={deleteConfirm.submitting} error={deleteConfirm.error} onConfirm={confirmDelete} onCancel={() => setDeleteConfirm({ open: false, event: null, submitting: false, error: '' })} />
      <AgendaEventModal editor={editor} onCancel={handleEditorCancel} onNew={handleEditorNew} initialTab={editor?.initialTab} initialDuration={selectedConfig.duracao} statusCatalog={statusCatalog} providerId={selectedProviderId} unitId={selectedUnitId} onCreated={() => window.dispatchEvent(new CustomEvent('brana-agenda-bloqueios-changed'))} />
    </div>
  );
}
