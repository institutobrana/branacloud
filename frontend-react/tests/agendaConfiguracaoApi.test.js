import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAgendaBloqueio,
  loadAgendaBloqueios,
  loadAgendaPrestadorRecord,
  saveAgendaPrestadorDraft,
  updateAgendaBloqueio,
} from '../src/features/agendaConfiguracao/agendaConfiguracaoApi.js';

test('agenda configuracao usa rota especifica para ler a agenda do prestador', async () => {
  const originalFetch = global.fetch;
  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 255,
        row_id: 255,
        source_id: 255,
        codigo: '001',
        nome: 'Clínica',
        is_system_prestador: true,
        agenda_config: { manha_inicio: '08:00' },
      }),
    };
  };

  try {
    const result = await loadAgendaPrestadorRecord(255);
    assert.equal(result.id, 255);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/255\/agenda-config$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
  } finally {
    global.fetch = originalFetch;
  }
});

test('agenda configuracao salva somente agenda_config na rota especifica', async () => {
  const originalFetch = global.fetch;
  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 255,
        row_id: 255,
        source_id: 255,
        codigo: '001',
        nome: 'Clínica',
        is_system_prestador: true,
        agenda_config: { manha_inicio: '09:00' },
      }),
    };
  };

  try {
    const result = await saveAgendaPrestadorDraft(255, {
      manhaInicio: '09:00',
      apresentacaoFonte: { family: 'Arial', size: 10 },
      visualizacaoCampos: ['nomePaciente'],
    }, {
      id: 255,
      row_id: 255,
      agenda_config: { manha_inicio: '08:00' },
    });
    assert.equal(result.id, 255);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.method, 'PUT');
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/255\/agenda-config$/);
    assert.match(calls[0].options.body, /agenda_config/);
    assert.doesNotMatch(calls[0].options.body, /selectedPrestadorSnapshot|familySearch/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('agenda configuracao carrega bloqueios pela rota operacional do prestador', async () => {
  const originalFetch = global.fetch;
  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ([
        {
          id: 7,
          id_bloqueio: 21,
          id_prestador: 11,
          id_unidade: 4,
          unidade: 'Instituto Brana - Odontologia',
          dia_sem: 3,
          data_ini: '2026-08-22',
          data_fin: null,
          hora_ini: 27000000,
          hora_fin: 30600000,
          msg_agenda: 'Teste operacional',
        },
      ]),
    };
  };

  try {
    const result = await loadAgendaBloqueios(11);
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], {
      id: 7,
      id_bloqueio: 21,
      id_prestador: 11,
      id_unidade: 4,
      unidade: 'Instituto Brana - Odontologia',
      dia_sem: 3,
      data_ini: '2026-08-22',
      data_fin: null,
      hora_ini: 27000000,
      hora_fin: 30600000,
      msg_agenda: 'Teste operacional',
    });
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/11\/bloqueios$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
  } finally {
    global.fetch = originalFetch;
  }
});

test('agenda configuracao cria bloqueio pela rota operacional do prestador', async () => {
  const originalFetch = global.fetch;
  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 7,
        id_bloqueio: 21,
        id_prestador: 11,
        id_unidade: 4,
        unidade: 'Instituto Brana - Odontologia',
        dia_sem: 3,
        data_ini: '2026-08-22',
        data_fin: null,
        hora_ini: 800,
        hora_fin: 900,
        msg_agenda: 'Teste operacional',
      }),
    };
  };

  try {
    const result = await createAgendaBloqueio(11, {
      id_unidade: 4,
      dia_sem: 3,
      data_ini: '2026-08-22',
      data_fin: null,
      hora_ini: 800,
      hora_fin: 900,
      msg_agenda: 'Teste operacional',
    });
    assert.equal(result.id, 7);
    assert.equal(result.id_bloqueio, 21);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.method, 'POST');
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/11\/bloqueios$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
    assert.match(calls[0].options.body, /"id_unidade":4/);
    assert.match(calls[0].options.body, /"dia_sem":3/);
    assert.match(calls[0].options.body, /"hora_ini":800/);
    assert.match(calls[0].options.body, /"hora_fin":900/);
    assert.match(calls[0].options.body, /"msg_agenda":"Teste operacional"/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('agenda configuracao atualiza bloqueio pela rota operacional do prestador', async () => {
  const originalFetch = global.fetch;
  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 7,
        id_bloqueio: 21,
        id_prestador: 11,
        id_unidade: 4,
        unidade: 'Instituto Brana - Odontologia',
        dia_sem: 4,
        data_ini: '2026-08-22',
        data_fin: null,
        hora_ini: 900,
        hora_fin: 1000,
        msg_agenda: 'Atualizado',
      }),
    };
  };

  try {
    const result = await updateAgendaBloqueio(11, 7, {
      id_unidade: 4,
      dia_sem: 4,
      data_ini: '2026-08-22',
      data_fin: null,
      hora_ini: 900,
      hora_fin: 1000,
      msg_agenda: 'Atualizado',
    });
    assert.equal(result.id, 7);
    assert.equal(result.id_bloqueio, 21);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.method, 'PUT');
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/11\/bloqueios\/7$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
    assert.match(calls[0].options.body, /"id_unidade":4/);
    assert.match(calls[0].options.body, /"dia_sem":4/);
    assert.match(calls[0].options.body, /"hora_ini":900/);
    assert.match(calls[0].options.body, /"hora_fin":1000/);
    assert.match(calls[0].options.body, /"msg_agenda":"Atualizado"/);
  } finally {
    global.fetch = originalFetch;
  }
});
