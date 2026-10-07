import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';
import * as mappers from '../src/features/procedimentos/procedimentosEditorMappers.js';
import { listarSimbolosGraficoProcedimentos } from '../src/features/procedimentos/procedimentosApi.js';

const source = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const snapshot = JSON.parse(source('../../backend/scripts/easy_simbolos_catalogo_atual_snapshot.json'));
const expectedIds = [...Array.from({ length: 59 }, (_, i) => i + 1), 77, 78, 79, 81];
const labels = { 46: 'Hemissecção', 56: 'Prótese (diversos)', 57: 'Símbolo genérico (dente)', 58: 'Símbolo genérico (grupo)' };
const combo = snapshot.filter((r) => expectedIds.includes(r.nrosim)).map((r) => mappers.normalizeProcedimentoSymbol({
  id: 15000 + r.nrosim, legacy_id: r.nrosim, codigo: r.codigo,
  descricao: labels[r.nrosim] || r.descricao, especialidade: r.especial,
}));
const outside = { simbolo_grafico: 'outside.bmp', simbolo_grafico_legacy_id: 60, mostrar_simbolo: false };

test('conjunto contextual de 63 identidades sem os 18 diagnósticos, sem dedup de resource', () => {
  assert.equal(combo.length, 63);
  assert.deepEqual(combo.map((r) => r.legacyId).sort((a,b) => a-b), expectedIds);
  const byId = new Map(combo.map((r) => [r.legacyId,r]));
  for (const id of [57,58,81]) assert.ok(byId.has(id));
  assert.equal(byId.get(57).label, 'Símbolo genérico (dente)');
  assert.equal(byId.get(58).label, 'Símbolo genérico (grupo)');
  assert.equal(byId.get(81).label, 'Raspagem para arcada');
  assert.equal(byId.get(57).codigo, byId.get(58).codigo);
  assert.notEqual(byId.get(57).value, byId.get(58).value);
});

test('API do modal solicita exclusivamente scope=procedimentos-combo, sem fallback amplo', async () => {
  const prior = { window:globalThis.window, fetch:globalThis.fetch };
  const calls=[];
  globalThis.window={localStorage:{getItem:()=> 'synthetic-test-token'}};
  globalThis.fetch=async (url,options) => {
    calls.push({url,method:options.method || 'GET'});
    return {ok:true,json:async()=>combo.map((r)=>r.raw)};
  };
  try {
    assert.equal((await listarSimbolosGraficoProcedimentos()).length,63);
    assert.deepEqual(calls,[{url:'/api/cadastros/simbolos-graficos?scope=procedimentos-combo',method:'GET'}]);
    globalThis.fetch=async (url) => { calls.push({url,method:'GET'}); return {ok:false,status:503,json:async()=>({detail:'indisponível'})}; };
    await assert.rejects(listarSimbolosGraficoProcedimentos(), /indisponível/);
    assert.equal(calls.length,2);
    assert.ok(calls.every((r)=>r.url.endsWith('scope=procedimentos-combo')));
  } finally {globalThis.window=prior.window;globalThis.fetch=prior.fetch;}
});

test('hidratação e payload preservam símbolo fora do combo e mostrar_simbolo=false', () => {
  const original={...outside};
  const hydrated={...outside,...mappers.hydrateProcedimentoSymbolState(combo,outside)};
  const payload=mappers.extractProcedimentoSymbolPayload(combo,hydrated);
  assert.equal(payload.simbolo_grafico,original.simbolo_grafico);
  assert.equal(payload.simbolo_grafico_legacy_id,original.simbolo_grafico_legacy_id);
  assert.equal(payload.mostrar_simbolo,false);
  assert.deepEqual(outside,original);
});

test('display de referência atual não acrescenta opção fora dos 63', () => {
  const before=structuredClone(combo);
  const display=mappers.resolveProcedimentoSymbolSelectDisplay(combo,outside);
  assert.match(display.value,/^existing:/);
  assert.match(display.label,/legado 60/);
  assert.ok(!combo.some((r)=>r.value===display.value));
  assert.deepEqual(combo,before);
});

test('símbolo vazio continua permitido, sem obrigatoriedade nova', () => {
  assert.equal(mappers.resolveProcedimentoSymbolSelectDisplay(combo,{}),undefined);
  assert.equal(mappers.extractProcedimentoSymbolPayload(combo,{}).simbolo_grafico,null);
});

test('resposta ampla de backend antigo é rejeitada, nunca usada como fallback', () => {
  assert.throws(()=>mappers.buildProcedimentoSymbolCombo(snapshot.map((r)=>({
    id:15000+r.nrosim,legacy_id:r.nrosim,codigo:r.codigo,descricao:r.descricao,
  }))), /incompatível/);
  assert.throws(()=>mappers.buildProcedimentoSymbolCombo([...combo,{id:99999,codigo:'auxiliary.bmp'}]), /incompatível/);
  assert.throws(()=>mappers.buildProcedimentoSymbolCombo([...combo,combo[0]]), /incompatível/);
  assert.equal(mappers.buildProcedimentoSymbolCombo(combo).length,63);
});

test('clínica de teste com catálogo incompleto recebe só seu subconjunto, sem inventar símbolo', () => {
  const local=combo.filter((r)=>r.legacyId!==81);
  assert.equal(mappers.buildProcedimentoSymbolCombo(local).length,62);
});

test('57/58 com mesmo bitmap resolvem pela identidade persistida distinta', () => {
  for (const id of [57,58]) {
    const item=combo.find((r)=>r.legacyId===id);
    const state={simbolo_grafico:item.codigo,simbolo_grafico_legacy_id:id};
    assert.equal(mappers.resolveProcedimentoSymbolSelectDisplay(combo,state).value,item.catalogId);
    assert.equal(mappers.extractProcedimentoSymbolPayload(combo,state).simbolo_grafico_legacy_id,id);
  }
});

async function withPanel(form,run) {
  const dom=new JSDOM('<div id="test"></div>');
  const prior={window:globalThis.window,document:globalThis.document,act:globalThis.IS_REACT_ACT_ENVIRONMENT};
  globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const changes=[];let symbolProps;
  const input=()=>null;input.TextArea=input;
  const jsx=await import('react/jsx-runtime');
  const mocks={react:React,'react/jsx-runtime':jsx,antd:{Input:input,Checkbox:()=>null,
    Select:(props)=>{
      if (props.labelInValue) {
        symbolProps=props;
        return React.createElement('div',{'data-testid':'symbol-select','data-count':props.options.length},props.value?.label || '');
      }
      return null;
    }},
    '../procedimentosEditorMappers.js':mappers,
    '../procedimentosEditorConstants.js':{PROCEDIMENTO_FORMA_COBRANCA_OPTIONS:[]}};
  const code=transformSync(source('../src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx'),{loader:'jsx',format:'cjs',jsx:'automatic'}).code;
  const module={exports:{}};
  vm.runInNewContext(code,{module,exports:module.exports,require:(name)=>{
    assert.ok(name in mocks,`Unexpected dependency ${name}`);return mocks[name];
  }});
  const root=createRoot(document.querySelector('#test'));
  try {
    await act(async()=>root.render(React.createElement(module.exports.ProcedimentoCadastroPanel,{form,
      especialidadeOptions:[],procedimentoGenericoOptions:[],simboloOptions:combo,
      onChange:(field,value)=>changes.push([field,value])})));
    await run({props:()=>symbolProps,changes,container:document.querySelector('#test')});
  } finally {
    await act(async()=>root.unmount());dom.window.close();globalThis.window=prior.window;
    globalThis.document=prior.document;globalThis.IS_REACT_ACT_ENVIRONMENT=prior.act;
  }
}

test('panel renderiza 63 escolhas e preserva referência externa sem emitir alterações', async()=>{
  await withPanel(outside,async({props,changes,container})=>{
    assert.equal(props().options.length,63);
    assert.equal(props().virtual,false);
    assert.match(container.textContent,/referência preservada/);
    assert.match(container.textContent,/legado 60/);
    assert.deepEqual(changes,[]);
  });
});

test('escolha explícita do 58 produz par coerente, nunca usa ID do 57',async()=>{
  await withPanel({},async({props,changes})=>{
    const item=combo.find((r)=>r.legacyId===58);
    await act(async()=>props().onChange({value:item.value,label:item.label}));
    assert.deepEqual(changes,[['simbolo_catalogo_id',item.catalogId],['simbolo_grafico_legacy_id',58],
      ['simbolo_grafico',item.codigo],['mostrar_simbolo',true]]);
  });
});

test('limpeza acontece somente por ação explícita no seletor, não por filtro/render',async()=>{
  await withPanel(outside,async({props,changes})=>{
    assert.deepEqual(changes,[]);
    await act(async()=>props().onChange(undefined));
    assert.deepEqual(changes,[['simbolo_catalogo_id',null],['simbolo_grafico_legacy_id',null],
      ['simbolo_grafico',''],['mostrar_simbolo',false]]);
  });
});

test('erro de lookups elimina lista antiga e propaga erro; nenhum fallback de biblioteca',()=>{
  const page=source('../src/features/procedimentos/ProcedimentosPage.jsx');
  assert.match(page,/catch \(err\) \{\s*setSimboloOptions\(\[\]\);\s*message\.error[^;]+;\s*throw err;/);
  assert.match(page,/listarSimbolosGraficoProcedimentos\(\)/);
  assert.doesNotMatch(page,/scope=(catalogo|biblioteca|todos|amplo)/);
  const close = page.match(/onClose=\{\(\) => \{([\s\S]*?)\}\}/)?.[1];
  assert.ok(close);
  assert.match(close,/setEditorOpen\(false\)/);
  assert.doesNotMatch(close,/salvarProcedimento|handleSave|simbolo_grafico/);
});

async function withPage(run) {
  const dom=new JSDOM('<div id="page"></div>');
  const prior={window:globalThis.window,document:globalThis.document,act:globalThis.IS_REACT_ACT_ENVIRONMENT};
  globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const stored={id:123,codigo:123,nome:'Teste isolado',tabela_id:78,...outside};
  const writes=[];const errors=[];let modal;let table;let failLookups=false;
  const box=({children})=>React.createElement('div',null,children);
  const unexpectedAction=()=>{throw new Error('Unexpected table/action request in symbol fixture');};
  const mocks={react:React,'react/jsx-runtime':await import('react/jsx-runtime'),
    antd:{Typography:{Text:box,Paragraph:box},Alert:()=>null,message:{error:(e)=>errors.push(e),warning:(e)=>errors.push(e),success:()=>{}}},
    '../../components/BranaCard.jsx':{BranaCard:box},
    '../../components/BranaModal.jsx':{BranaModal:()=>null},
    '../../components/BranaTable.jsx':{BranaTable:(props)=>{table=props;return null;}},
    '../../components/TableColumnFilterHeader.jsx':{TableColumnFilterHeader:()=>null},
    './procedimentosEditorMappers.js':mappers,
    './procedimentosEditorValidators.js':{validateProcedimentoForm:()=>[]},
    './components/ProcedimentoEditorModal.jsx':{ProcedimentoEditorModal:(props)=>{
      modal=props;return props.open?React.createElement('div',{role:'dialog'},props.error || props.form.nome):null;
    }},
    // R1 table/action modals are outside this fixture's symbol/editor scope.
    './components/ProcedimentoTabelaModal.jsx':{
      ProcedimentoTabelaModal:()=>null,createTabelaForm:()=>({}),
      validateTabelaForm:unexpectedAction,buildTabelaPayload:unexpectedAction,
    },
    './components/ProcedimentoReajusteModal.jsx':{
      ProcedimentoReajusteModal:()=>null,reajustePreviewKey:unexpectedAction,
    },
    './procedimentos.css':{},
    './procedimentosApi.js':{
      listarProcedimentosFiltros:async()=>({tabelas:[{id:78,nome:'Teste'}],especialidades:[]}),
      listarProcedimentos:async()=>[{...stored}],listarProcedimentosGenericosCombos:async()=>[],
      listarSimbolosGraficoProcedimentos:async()=>{if(failLookups)throw new Error('lookup failure');return combo;},
      obterProcedimentoDetalhe:async()=>({...stored}),obterProximoCodigoProcedimento:async()=>124,
      salvarProcedimento:async(args)=>{writes.push(structuredClone(args));return {...stored,...args.payload};},
      excluirProcedimento:unexpectedAction,criarTabelaProcedimentos:unexpectedAction,
      atualizarTabelaProcedimentos:unexpectedAction,excluirTabelaProcedimentos:unexpectedAction,
      previewReajusteTabela:unexpectedAction,aplicarReajusteTabela:unexpectedAction,
    }};
  const module={exports:{}};
  const code=transformSync(source('../src/features/procedimentos/ProcedimentosPage.jsx'),{loader:'jsx',format:'cjs',jsx:'automatic'}).code;
  vm.runInNewContext(code,{module,exports:module.exports,window:dom.window,CustomEvent:dom.window.CustomEvent,
    require:(name)=>{assert.ok(name in mocks,`Unexpected dependency ${name}`);return mocks[name];}});
  const root=createRoot(document.querySelector('#page'));
  try {
    await act(async()=>root.render(React.createElement(module.exports.ProcedimentosPage)));
    await run({modal:()=>modal,table:()=>table,writes,errors,
      fail:()=>{failLookups=true;},
      open:async()=>{await act(async()=>table.onRow(table.dataSource[0]).onDoubleClick());},
      newModal:async()=>{await act(async()=>window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-action',{detail:{action:'novo'}})));}});
  } finally {
    await act(async()=>root.unmount());dom.window.close();globalThis.window=prior.window;
    globalThis.document=prior.document;globalThis.IS_REACT_ACT_ENVIRONMENT=prior.act;
  }
}

test('integração React isolada: abrir/cancelar edição não salva nem limpa símbolo',async()=>{
  await withPage(async({open,modal,writes})=>{
    await open();assert.equal(modal().open,true);assert.equal(modal().simboloOptions.length,63);
    assert.equal(modal().form.simbolo_grafico,outside.simbolo_grafico);
    assert.equal(modal().form.simbolo_grafico_legacy_id,60);
    await act(async()=>modal().onClose());
    assert.equal(modal().open,false);assert.deepEqual(writes,[]);
  });
});

test('integração React isolada: salvar outro campo preserva símbolo fora do combo',async()=>{
  await withPage(async({open,modal,writes})=>{
    await open();await act(async()=>modal().onChangeField('nome','Nome de teste'));
    await act(async()=>modal().onSave());
    assert.equal(writes.length,1);
    assert.equal(writes[0].payload.nome,'Nome de teste');
    assert.equal(writes[0].payload.simbolo_grafico,outside.simbolo_grafico);
    assert.equal(writes[0].payload.simbolo_grafico_legacy_id,60);
    assert.equal(writes[0].payload.mostrar_simbolo,false);
  });
});

test('integração React isolada: falha de scope não reutiliza lista anterior ampla/contextual',async()=>{
  await withPage(async({fail,newModal,modal,writes,errors})=>{
    assert.equal(modal().simboloOptions.length,63);fail();await newModal();
    assert.equal(modal().simboloOptions.length,0);
    assert.match(modal().error,/lookup failure/);
    assert.deepEqual(writes,[]);assert.ok(errors.length>0);
  });
});
