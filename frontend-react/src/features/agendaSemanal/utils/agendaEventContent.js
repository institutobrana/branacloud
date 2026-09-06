const DEFAULT_FIELDS = ['numeroPaciente', 'nomePaciente', 'fone1', 'fone2', 'sala'];

const FIELD_ALIASES = {
  'numero do paciente': 'numeroPaciente', numeroPaciente: 'numeroPaciente',
  'numero do prontuario': 'numeroProntuario', numeroProntuario: 'numeroProntuario',
  'nome do paciente': 'nomePaciente', nomePaciente: 'nomePaciente',
  matricula: 'matricula', matricula: 'matricula',
  convenio: 'convenio', convenio: 'convenio',
  tabela: 'tabela', 'fone 1': 'fone1', fone1: 'fone1',
  'fone 2': 'fone2', fone2: 'fone2', 'fone 3': 'fone3', fone3: 'fone3',
  sala: 'sala',
};

function key(value) {
  return String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function selectedFields(config) {
  const values = Array.isArray(config?.visualizacao_campos) ? config.visualizacao_campos : DEFAULT_FIELDS;
  return new Set(values.map((value) => FIELD_ALIASES[key(value)] || FIELD_ALIASES[value] || value).filter(Boolean));
}

function text(value) { return String(value ?? '').trim(); }

function displayLabel(event, item) {
  if (Number(event?.type ?? item.tipo) === 2) return text(item.motivo);
  return text(event?.patientName || item.nome || item.motivo || '');
}

function metadata(event) { return event?.metadata && typeof event.metadata === 'object' ? event.metadata : event || {}; }

function time(event) {
  const date = event?.start instanceof Date ? event.start : new Date(event?.start);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function agendaEventContentLines(event, providerConfig = {}, mode = 'week') {
  const item = metadata(event);
  const fields = selectedFields(providerConfig);
  const patient = displayLabel(event, item);
  const patientNumber = text(item.nro_pac ?? event?.patientId);
  const phone = [item.fone1, item.fone2, item.fone3].map(text);
  const selectedPhones = phone.filter((value, index) => fields.has(`fone${index + 1}`) && value);
  const line1 = [time(event), fields.has('numeroPaciente') ? patientNumber : '', fields.has('numeroProntuario') ? text(item.cod_prontuario) : '', fields.has('matricula') ? text(item.matricula) : ''].filter(Boolean).join(' - ');
  const line3 = selectedPhones.join(' | ');
  const line4 = [fields.has('convenio') ? text(item.convenio_nome || item.convenio) && `Convênio: ${text(item.convenio_nome || item.convenio)}` : '', fields.has('tabela') ? text(item.tabela_nome || item.tabela) && `Tabela: ${text(item.tabela_nome || item.tabela)}` : '', fields.has('sala') && text(item.sala) ? `Sala: ${text(item.sala)}` : ''].filter(Boolean).join(' | ');
  if (mode === 'day') {
    return [
      { key: 'day-patient', className: 'agenda-event-content-line agenda-event-content-line--patient', text: [time(event), fields.has('numeroPaciente') ? patientNumber : '', patient].filter(Boolean).join(' - ') },
      { key: 'day-motivo', className: 'agenda-event-content-line', text: text(item.motivo) },
      { key: 'day-phones', className: 'agenda-event-content-line', text: [item.fone1, item.fone2, item.fone3].map(text).filter(Boolean).join(' | ') },
    ].filter((line) => line.text);
  }
  return [
    { key: 'line-1', className: 'agenda-event-content-line agenda-event-content-line--primary', text: line1 },
    { key: 'line-2', className: 'agenda-event-content-line agenda-event-content-line--name', text: fields.has('nomePaciente') ? text(patient) : '' },
    { key: 'line-3', className: 'agenda-event-content-line agenda-event-content-line--secondary', text: line3 },
    { key: 'line-4', className: 'agenda-event-content-line agenda-event-content-line--secondary', text: line4 },
  ].filter((line) => line.text);
}
