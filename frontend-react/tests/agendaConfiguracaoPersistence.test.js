import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAgendaPrestadorPayload,
  mapAgendaDraftFromBackend,
  mapAgendaDraftToBackendConfig,
  saveAgendaPrestadorDraft,
} from '../src/features/agendaConfiguracao/agendaConfiguracaoApi.js';
import { createAgendaConfiguracaoDraft } from '../src/features/agendaConfiguracao/agendaConfiguracaoState.js';

const backendAgendaConfig = {
  manha_inicio: '08:00',
  manha_fim: '12:00',
  tarde_inicio: '13:30',
  tarde_fim: '18:00',
  duracao: '15',
  semana_horarios: '14',
  dia_horarios: '9',
  bloqueios_itens: [{ id: 1, unidade: 'Clínica' }],
  apresentacao_particular_cor: '#ff0000',
  apresentacao_convenio_cor: '#00ff00',
  apresentacao_compromisso_cor: '#0000ff',
  apresentacao_fonte: {
    family: 'Arial',
    size: 10,
    bold: true,
    italic: false,
    underline: true,
    strike: false,
    color: '#111111',
    script: 'Ocidental',
  },
  visualizacao_campos: ['numeroPaciente', 'sala'],
  campo_legado_desconhecido: 'preservar',
};

test('mapAgendaDraftFromBackend converte o contrato backend em draft compartilhado', () => {
  const draft = mapAgendaDraftFromBackend(backendAgendaConfig);
  assert.equal(draft.manhaInicio, '08:00');
  assert.equal(draft.manhaFim, '12:00');
  assert.equal(draft.tardeInicio, '13:30');
  assert.equal(draft.tardeFim, '18:00');
  assert.equal(draft.duracao, 15);
  assert.equal(draft.semanaHorarios, 14);
  assert.equal(draft.diaHorarios, 9);
  assert.equal(draft.corParticular, '#ff0000');
  assert.equal(draft.corConvenio, '#00ff00');
  assert.equal(draft.corCompromisso, '#0000ff');
  assert.equal(Object.prototype.hasOwnProperty.call(draft, 'bloqueiosItens'), false);
  assert.deepEqual(draft.visualizacaoCampos, ['numeroPaciente', 'sala']);
  assert.equal(draft.apresentacaoFonte.family, 'Arial');
  assert.equal(draft.apresentacaoFonte.size, 10);
});

test('mapAgendaDraftToBackendConfig preserva chaves conhecidas e desconhecidas ao salvar', () => {
  const draft = createAgendaConfiguracaoDraft();
  draft.manhaInicio = '09:00';
  draft.corParticular = '#123456';
  draft.apresentacaoFonte = { ...draft.apresentacaoFonte, family: 'Arial' };
  draft.visualizacaoCampos = ['sala'];

  const backend = mapAgendaDraftToBackendConfig(draft, backendAgendaConfig);
  assert.equal(backend.manha_inicio, '09:00');
  assert.equal(backend.campo_legado_desconhecido, 'preservar');
  assert.deepEqual(backend.bloqueios_itens, [{ id: 1, unidade: 'Clínica' }]);
  assert.equal(backend.apresentacao_particular_cor, '#123456');
  assert.equal(backend.apresentacao_fonte.family, 'Arial');
  assert.deepEqual(backend.visualizacao_campos, ['Sala']);
});

test('buildAgendaPrestadorPayload monta payload completo pronto para PUT do prestador', () => {
  const payload = buildAgendaPrestadorPayload({
    codigo: '001',
    nome: 'Clínica',
    ativo: true,
    executa_procedimento: true,
    especialidades_exec: ['Cirurgia'],
    agenda_config: backendAgendaConfig,
  }, createAgendaConfiguracaoDraft());
  assert.equal(payload.codigo, '001');
  assert.equal(payload.nome, 'Clínica');
  assert.equal(payload.agenda_config.manha_inicio, '07:00');
  assert.deepEqual(payload.especialidades_exec, ['Cirurgia']);
});

test('saveAgendaPrestadorDraft envia PUT autenticado no prestador correto', async () => {
  const originalFetch = global.fetch;
  const originalWindow = global.window;
  const calls = [];

  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-agenda' : ''),
    },
  };

  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 7,
        row_id: 7,
        codigo: '001',
        nome: 'Clínica',
        ativo: true,
        executa_procedimento: true,
        agenda_config: backendAgendaConfig,
      }),
    };
  };

  try {
    const saved = await saveAgendaPrestadorDraft(7, createAgendaConfiguracaoDraft(), {
      id: 7,
      row_id: 7,
      codigo: '001',
      nome: 'Clínica',
      ativo: true,
      executa_procedimento: true,
      especialidades_exec: [],
      agenda_config: backendAgendaConfig,
    });
    assert.equal(saved.id, 7);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/7\/agenda-config$/);
    assert.equal(calls[0].options.method, 'PUT');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-agenda');
    const body = JSON.parse(calls[0].options.body);
    assert.equal(body.agenda_config.manha_inicio, '07:00');
    assert.equal(body.agenda_config.campo_legado_desconhecido, 'preservar');
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
  }
});
