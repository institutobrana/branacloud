import { AgendaTemporalNavigation, useAgendaTemporalLabel } from './AgendaTemporalNavigation.jsx';
import { emitAgendaTemporalNavigation } from './agendaTemporalNavigation.js';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  PrinterOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { BranaPacienteIcon } from '../../../layout/branaTopbarIcons.jsx';
import { AgendaDateNavigator } from './AgendaDateNavigator.jsx';

const functionalCommands = [
  { label: 'Calendário', icon: CalendarOutlined },
  { label: 'Paciente', icon: BranaPacienteIcon },
  { label: 'Horário', icon: ClockCircleOutlined },
  { label: 'Imprimir agenda', icon: PrinterOutlined },
  { label: 'Envio de aviso', icon: NotificationOutlined },
  { label: 'Publicar no Google agenda', icon: CalendarOutlined },
  { label: 'Configura', icon: SettingOutlined },
];

function navigate(unit, direction) {
    emitAgendaTemporalNavigation(unit, direction);
}

export function AgendaSemanalToolbar({ state, onConfigure, onPatient, onHour, onNotice, onPublish }) {
  const monthLabel = useAgendaTemporalLabel();
  const handleConfigure = (event) => {
    const toolbar = event.currentTarget.closest('.agenda-spike-toolbar');
    const surgeonSelect = toolbar?.querySelectorAll('.agenda-toolbar-filters select')[1];
    onConfigure?.({
      prestadorId: surgeonSelect?.value || state.selected.prestadorId,
      prestadorNome: surgeonSelect?.selectedOptions?.[0]?.textContent?.trim() || '',
    });
  };
  return (
    <div className="agenda-spike-toolbar" role="toolbar" aria-label="Controles da Agenda semanal">
      <div className="agenda-temporal-navigation">
          <AgendaTemporalNavigation unit="Mês" testId="month" label={monthLabel} onPrevious={() => navigate('month', -1)} onNext={() => navigate('month', 1)} />
          <AgendaTemporalNavigation unit="Semana" testId="week" label="Semana" onPrevious={() => navigate('week', -1)} onNext={() => navigate('week', 1)} onLabel={() => window.dispatchEvent(new CustomEvent('brana-agenda-spike-view', { detail: { view: 'week' } }))} />
          <AgendaTemporalNavigation unit="Dia" testId="day" label="Dia" onPrevious={() => navigate('day', -1)} onNext={() => navigate('day', 1)} onLabel={() => window.dispatchEvent(new CustomEvent('brana-agenda-spike-view', { detail: { view: 'day' } }))} />
      </div>
      <span className="agenda-toolbar-divider" aria-hidden="true" />
      <div className="agenda-functional-commands" aria-label="Comandos da Agenda">
        {functionalCommands.map(({ label, icon: Icon }) => label === 'Calendário' ? (
          <AgendaDateNavigator key={label} />
        ) : (
          <button
            key={label}
            type="button"
            className="auxiliary-shell-button agenda-functional-icon-button"
            aria-label={label}
            title={label}
            disabled={label === 'Configura' ? (!state.selected.prestadorId || state.loading) : !['Paciente', 'Horário', 'Envio de aviso', 'Publicar no Google agenda'].includes(label)}
            onClick={label === 'Configura' ? handleConfigure : label === 'Paciente' ? onPatient : label === 'Horário' ? onHour : label === 'Envio de aviso' ? onNotice : label === 'Publicar no Google agenda' ? onPublish : undefined}
          >
            <Icon aria-hidden="true" />
          </button>
        ))}
      </div>
      <span className="agenda-toolbar-divider" aria-hidden="true" />
      <div className="agenda-toolbar-filters">
        <label className="agenda-toolbar-filter">Especialidade
          <select value={state.selected.especialidade} disabled={state.loading} onChange={(event) => window.dispatchEvent(new CustomEvent('brana-agenda-filter-change', { detail: { field: 'especialidade', value: event.target.value } }))}>
            {state.especialidades.map((option) => <option key={`esp-${option.value}`} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="agenda-toolbar-filter">Cirurgião
          <select value={state.selected.prestadorId} disabled={state.loading} onChange={(event) => window.dispatchEvent(new CustomEvent('brana-agenda-filter-change', { detail: { field: 'prestadorId', value: event.target.value } }))}>
            {state.prestadores.map((option) => <option key={`prest-${option.value}`} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="agenda-toolbar-filter">Unidade
          <select value={state.selected.unidadeId} disabled={state.loading} onChange={(event) => window.dispatchEvent(new CustomEvent('brana-agenda-filter-change', { detail: { field: 'unidadeId', value: event.target.value } }))}>
            {state.unidades.map((option) => <option key={`unid-${option.value}`} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      {state.error && <span className="agenda-toolbar-error">{state.error}</span>}
    </div>
  );
}
