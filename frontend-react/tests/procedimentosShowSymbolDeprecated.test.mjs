import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as concrete from '../src/features/procedimentos/procedimentosEditorMappers.js';
import * as generic from '../src/features/procedimentosGenericos/procedimentosGenericosFasesUtils.js';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('React concreto não transporta opção de ocultação no state, hydration ou payload', () => {
  for (const historical of [true, false]) {
    const item = { codigo: 1, nome: 'Teste', simbolo_grafico: 'sim_outras.bmp', simbolo_grafico_legacy_id: 58, mostrar_simbolo: historical };
    for (const value of [concrete.normalizeProcedimento(item), concrete.createEmptyProcedimentoForm(), concrete.hydrateProcedimentoForm(item), concrete.buildProcedimentoPayload(item)]) {
      assert.equal('mostrar_simbolo' in value, false);
    }
    assert.equal(item.mostrar_simbolo, historical); // No mutation of raw legacy data.
  }
});

test('Genéricos mantêm símbolos/fases/materiais sem state ou payload do flag residual', () => {
  for (const historical of [true, false]) {
    const item = { codigo: 'G', descricao: 'Genérico', simbolo_grafico: 'sim_outras.bmp', simbolo_grafico_legacy_id: 58, mostrar_simbolo: historical,
      fases: [{ descricao: 'F1', sequencia: 1, tempo: 10 }], materiais: [{ material_id: 1, quantidade: 2 }] };
    const hydrated = generic.normalizeProcedimentoGenericoDetalhe(item);
    const payload = generic.buildProcedimentoGenericoPayload(hydrated);
    for (const state of [hydrated, payload, generic.buildEmptyProcedimentoGenericoState()]) assert.equal('mostrar_simbolo' in state, false);
    assert.equal(payload.simbolo_grafico_legacy_id, 58);
    assert.equal(payload.fases[0].descricao, 'F1');
    assert.deepEqual(payload.materiais, [{ material_id: 1, quantidade: 2 }]);
  }
});

test('APIs/modal React de Genéricos e Procedimentos não reintroduzem transporte do flag', () => {
  for (const path of [
    '../src/features/procedimentos/procedimentosApi.js',
    '../src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx',
    '../src/features/procedimentosGenericos/procedimentosGenericosApi.js',
    '../src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx',
  ]) assert.doesNotMatch(read(path), /mostrar_simbolo|show_symbol|showSymbol/);
  const page = read('../src/features/procedimentos/ProcedimentosPage.jsx');
  assert.match(page, /const \{ mostrar_simbolo: _deprecatedFlag, \.\.\.detalhe \} = await obterProcedimentoDetalhe/);
  assert.doesNotMatch(page.replace('mostrar_simbolo: _deprecatedFlag', ''), /mostrar_simbolo|show_symbol|showSymbol/);
});

test('caminhos gráficos existentes não consultam flag legado; FC4 não é implementado nesta fase', () => {
  for (const path of [
    '../../backend/services/odontograma_service.py', '../../backend/routes/odontograma_routes.py',
    '../src/features/fichaClinica/FichaClinicaPage.jsx',
    '../../frontend/js/modules/odontograma-v1.js',
  ]) assert.doesNotMatch(read(path), /mostrar_simbolo|show_symbol|showSymbol/);
});

test('contrato canônico retira opção, vale para futuros tenants e registra obrigatoriedade R2 sem FC4', () => {
  const doc = read('../../docs/contrato_edicao_procedimentos_roundtrip.md');
  assert.match(doc, /TODAS as clínicas\/tenants atuais e futuros/);
  assert.match(doc, /Não existe opção do usuário para ocultá-lo/);
  assert.match(doc, /DEPRECATED_INTERNAL_FIELD/);
  assert.match(doc, /mesmo quando o valor histórico é false/);
  assert.match(doc, /Nome > Procedimento genérico > Especialidade > Símbolo gráfico > Forma de cobrança/);
  assert.match(doc, /não implementa\/retoma FC4/);
  assert.match(doc, /Não remover colunas ou executar migration/);
});

test('autoridade canônica e homologação estão registradas sem contratos concorrentes', () => {
  const doc = read('../../docs/contrato_edicao_procedimentos_roundtrip.md');
  const index = read('../../docs/indice_oficial_contratos_regras_vigentes.md');
  assert.match(doc, /CANÔNICO \/ VIGENTE \/ HOMOLOGADO/);
  assert.match(doc, /Inclusão = readonly; Alteração = readonly/);
  assert.match(doc, /quantidade próprios prevalecem/);
  assert.match(doc, /Save comum sem troca não recompõe fases/);
  assert.match(doc, /Não há duas regras vigentes/);
  for (const field of ['MANUAL_HOMOLOGATION', 'USER_CONFIRMED_EDIT_ROUNDTRIP', 'USER_CONFIRMED_GENERIC_CHANGE',
    'USER_CONFIRMED_MATERIALS', 'USER_CONFIRMED_PHASES', 'USER_CONFIRMED_NO_SHOW_SYMBOL_OPTION']) {
    assert.ok(doc.includes(`${field} = PASS`), field);
  }
  assert.match(doc, /USER_FOUND_ERRORS = NÃO/);
  assert.match(doc, /lista exata de tabelas por caminho\/política de provisionamento exige auditoria documental própria/);
  assert.match(index, /### `docs\/contrato_edicao_procedimentos_roundtrip.md`/);
  assert.match(index, /regras de domínio conflitantes \(inclusive seção 9\) SUPERSEDED/);
  for (const filename of ['contrato_funcional_campos_procedimentos.md', 'contrato_funcional_regras_materiais_genericos_intervencoes.md',
    'contrato_implementacao_procedimentos_genericos_frontend_react.md', 'contrato_combo_simbolos_procedimentos.md',
    'contrato_preservacao_simbolos_procedimentos_p4a.md', 'validacao_heranca_procedimento_generico_no_procedimento.md']) {
    const previous = read(`../../docs/${filename}`);
    assert.ok(previous.includes('contrato_edicao_procedimentos_roundtrip.md'), filename);
    assert.ok(previous.includes('SUPERSEDED'), filename);
  }
});
