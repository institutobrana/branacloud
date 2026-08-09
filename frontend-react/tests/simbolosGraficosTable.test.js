import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SimbolosGraficosTable } from '../src/features/simbolosGraficos/components/SimbolosGraficosTable.js';
import { mapSimboloGrafico } from '../src/features/simbolosGraficos/simbolosGraficosMapper.js';

test('SimbolosGraficosTable monta tabela compacta com selecao e colunas publicas', () => {
  const html = renderToStaticMarkup(
    React.createElement(SimbolosGraficosTable, {
      rows: [{ id: 1, nome: 'Sorriso', especialidade: 'Clínica' }],
      selectedId: 1,
      onSelect: () => {},
    }),
  );

  assert.match(html, /simbolos-graficos-table/);
  assert.match(html, /Sorriso/);
  assert.match(html, /Clínica/);
  assert.doesNotMatch(html, /oficial/);
  assert.doesNotMatch(html, /Origem/);
  assert.doesNotMatch(html, /registro/);
  assert.match(html, /1 símbolo/);
});

test('SimbolosGraficosTable mostra nome textual vindo do mapper e nao codigo', () => {
  const mapped = mapSimboloGrafico({ id: 7, descricao: 'Exemplo', especialidade: '01' });
  const html = renderToStaticMarkup(
    React.createElement(SimbolosGraficosTable, {
      rows: [mapped],
      selectedId: 7,
      onSelect: () => {},
    }),
  );

  assert.match(html, /Dentística/);
  assert.doesNotMatch(html, />\s*1\s*</);
});

test('SimbolosGraficosTable respeita valores vazios com travessao e nao expõe id', () => {
  const html = renderToStaticMarkup(
    React.createElement(SimbolosGraficosTable, {
      rows: [{ id: 2, nome: '', especialidade: null }],
      selectedId: null,
      onSelect: () => {},
    }),
  );

  assert.match(html, /—/);
  assert.doesNotMatch(html, />\s*2\s*</);
});

test('SimbolosGraficosTable nao depende de API ou estado interno', () => {
  const source = String(SimbolosGraficosTable);
  assert.doesNotMatch(source, /fetch\(|axios|useEffect|useState|api/i);
});

test('SimbolosGraficosTable seleciona apenas um registro por id real', () => {
  const html = renderToStaticMarkup(
    React.createElement(SimbolosGraficosTable, {
      rows: [
        { id: 3, nome: 'Linha A', especialidade: 'Geral' },
        { id: 4, nome: 'Linha B', especialidade: 'Ortodontia' },
      ],
      selectedId: 4,
      onSelect: () => {},
    }),
  );

  assert.match(html, /Linha A/);
  assert.match(html, /Linha B/);
  assert.match(html, /aria-selected="true"/);
});

test('SimbolosGraficosTable usa contador customizado no rodape', () => {
  const html = renderToStaticMarkup(
    React.createElement(SimbolosGraficosTable, {
      rows: [],
      selectedId: null,
      onSelect: () => {},
      footerLabel: '81 símbolos',
    }),
  );

  assert.match(html, /81 símbolos/);
});
