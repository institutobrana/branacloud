import { agendaEventDurationMinutes, agendaEventPresentationForDuration, resolveAgendaEventPresentation } from './agendaEventPresentation.js';
import { agendaEventContentLines } from '../utils/agendaEventContent.js';

export function AgendaEventContent({ eventInfo }) {
  const props = eventInfo.event.extendedProps;
  const durationMinutes = agendaEventDurationMinutes(eventInfo);
  const presentation = agendaEventPresentationForDuration(durationMinutes);
  const visual = props.presentation || resolveAgendaEventPresentation(props, props.providerConfig);
  const lines = agendaEventContentLines(props, props.providerConfig, eventInfo.view?.type === 'timeGridDay' ? 'day' : 'week');
  return (
    <div
      className={`agenda-spike-event-content agenda-event-${presentation}`}
      style={visual}
    >
      {eventInfo.view?.type === 'timeGridDay' ? (
        <span className="agenda-event-content-day-cols">
          {lines.map((line) => <span className={line.className} key={line.key}>{line.text}</span>)}
        </span>
      ) : lines.map((line) => <span className={line.className} key={line.key}>{line.text}</span>)}
    </div>
  );
}
