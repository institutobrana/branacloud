import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  resolveProcedimentoSymbolPreviewCandidates,
} from '../src/features/procedimentos/procedimentosEditorMappers.js';

const cirurgia = {
  id: 45,
  legacy_id: 45,
  codigo: 'int_cirur.bmp',
  descricao: 'Cirurgia',
  icone: 'int_cirur.bmp',
  bitmap1: 'int_cirur.bmp',
  imagem_url: '/desktop-assets/easy/int_cirur.bmp',
};

test('preserva imagem_url /desktop-assets como primeira candidata para Cirurgia', () => {
  const candidates = resolveProcedimentoSymbolPreviewCandidates([cirurgia], {
    simbolo_catalogo_id: 45,
    simbolo_grafico: 'int_cirur.bmp',
    simbolo_grafico_legacy_id: 45,
  });

  assert.equal(candidates[0], '/desktop-assets/easy/int_cirur.bmp');
  assert.equal(candidates.includes('/assets/easy/int_cirur.bmp'), false);
  assert.equal(candidates.includes('/react/assets/easy/int_cirur.bmp'), false);
});

test('preserva URL absoluta, data:image e blob quando fornecidos pelo backend', () => {
  for (const imagemUrl of [
    'https://cdn.example.test/simbolo.bmp',
    'data:image/png;base64,abc',
    'blob:https://app.institutobrana.com.br/abc',
  ]) {
    const candidates = resolveProcedimentoSymbolPreviewCandidates([
      { ...cirurgia, id: imagemUrl.length, imagem_url: imagemUrl },
    ], {
      simbolo_catalogo_id: imagemUrl.length,
    });

    assert.equal(candidates[0], imagemUrl);
  }
});

test('fallback por codigo usa /desktop-assets/easy e remove duplicatas', () => {
  const candidates = resolveProcedimentoSymbolPreviewCandidates([
    {
      id: 77,
      codigo: ' exemplo.bmp ',
      descricao: 'Exemplo',
      imagem_url: '',
      icone: '',
      bitmap1: '',
    },
  ], {
    simbolo_catalogo_id: 77,
  });

  assert.equal(candidates[0], '/desktop-assets/easy/exemplo.bmp');
  assert.equal(new Set(candidates).size, candidates.length);
});

test('campos vazios sao ignorados sem gerar caminhos invalidos', () => {
  const candidates = resolveProcedimentoSymbolPreviewCandidates([
    {
      id: 88,
      codigo: '',
      descricao: 'Sem arquivo',
      imagem_url: '',
      icone: '',
      bitmap1: '',
      bitmap2: '',
      bitmap3: '',
    },
  ], {
    simbolo_catalogo_id: 88,
  });

  assert.deepEqual(candidates, []);
});

test('componente tenta candidatas em sequencia e mostra placeholder controlado', () => {
  const source = fs.readFileSync(
    path.resolve('src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx'),
    'utf8',
  );

  assert.match(source, /onError=\{\(\) => setIndex/);
  assert.match(source, /current < sources\.length - 1 \? current \+ 1 : sources\.length/);
  assert.match(source, /useEffect\(\(\) => \{\s*setIndex\(0\);/);
  assert.match(source, /Sem imagem/);
  assert.match(source, /Símbolo gráfico:/);
});

console.log('procedimentosSymbolPreview.test.mjs ok');
