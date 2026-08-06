import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { formatIndiceFinanceiroCotacaoData, formatIndiceFinanceiroCotacaoValor } from '../src/features/indicesFinanceiros/indicesFinanceirosFormatters.js';
import { listarIndicesCotacoes } from '../src/features/indicesFinanceiros/indicesFinanceirosApi.js';

const hookSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/hooks/useIndicesCotacoes.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const tableSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesCotacoesTable.jsx'), 'utf8');

test('formatadores de cotacoes preservam data e decimal em pt-BR', () => {
  assert.equal(formatIndiceFinanceiroCotacaoData('2026-08-04'), '04/08/2026');
  assert.equal(formatIndiceFinanceiroCotacaoData(''), '—');
  assert.equal(formatIndiceFinanceiroCotacaoValor(1), '1,0000');
  assert.equal(formatIndiceFinanceiroCotacaoValor(12.3456), '12,3456');
});

test('API de cotacoes usa o endpoint correto sem clinica_id', async () => {
  const calls = [];
  const originalFetch = global.fetch;
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => [{ id: 7, data: '2026-08-01', valor: 1.2345 }],
    };
  };

  try {
    const response = await listarIndicesCotacoes(255);
    assert.deepEqual(response, [{ id: 7, data: '2026-08-01', valor: 1.2345 }]);
    assert.equal(calls[0].url, '/api/indices-financeiros/255/cotacoes');
    assert.equal(calls[0].options.method, 'GET');
    assert.equal(calls[0].options.headers?.Authorization, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});

test('hook de cotacoes protege a leitura por indice com guards de ordem', () => {
  assert.match(hookSource, /listarIndicesCotacoes/);
  assert.match(hookSource, /AbortController/);
  assert.match(hookSource, /requestSeqRef/);
  assert.match(hookSource, /clearState/);
  assert.match(hookSource, /hasSelectedIndex/);
  assert.match(hookSource, /selectedKey/);
  assert.match(hookSource, /selectedRow/);
  assert.doesNotMatch(hookSource, /clinica_id/);
  assert.doesNotMatch(hookSource, /POST|PATCH|DELETE/);
});

test('page conecta indice selecionado ao detalhe sem HTTP direto', () => {
  assert.match(pageSource, /useIndicesCotacoes/);
  assert.match(pageSource, /clearCotacoesState/);
  assert.match(pageSource, /handleSelectIndice/);
  assert.match(pageSource, /IndicesCotacoesTable/);
  assert.doesNotMatch(pageSource, /fetch\(/);
  assert.doesNotMatch(pageSource, /clinica_id/);
});

test('tabela inferior expõe contrato visual de leitura apenas', () => {
  assert.match(tableSource, /Cotações para reais/);
  assert.match(tableSource, /Nenhuma cotação cadastrada/);
  assert.match(tableSource, /Selecione um índice para visualizar as cotações/);
  assert.match(tableSource, /rowKey="cotacaoId"/);
  assert.match(tableSource, /selectedRowKeys/);
  assert.doesNotMatch(tableSource, /cotacao_id|indice_id|numero|clinica_id/);
  assert.doesNotMatch(tableSource, /POST|PATCH|DELETE/);
});
