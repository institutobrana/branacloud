import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { UNIDADE_ATENDIMENTO_COLUMNS } from '../src/features/unidadesAtendimento/constants/unidadeAtendimentoColumns.js';
import { UNIDADE_ATENDIMENTO_PHONE_TYPES, UNIDADE_ATENDIMENTO_UFS } from '../src/features/unidadesAtendimento/constants/unidadeAtendimentoOptions.js';
import { buildUnidadeAtendimentoPayload, formatUnidadeStatus, mapUnidadeAtendimentoToForm } from '../src/features/unidadesAtendimento/utils/unidadeAtendimentoMappers.js';
import { validateUnidadeAtendimentoValues } from '../src/features/unidadesAtendimento/utils/unidadeAtendimentoValidation.js';

const normalized = mapUnidadeAtendimentoToForm({
  id: 7,
  codigo: ' 0012 ',
  nome: ' Unidade Centro ',
  inativo: true,
  fone1: '(11) 1111-1111',
  fone2: '',
  contato1: 'Recepcao',
});

assert.equal(normalized.id, 7);
assert.equal(normalized.codigo, '0012');
assert.equal(normalized.nome, 'Unidade Centro');
assert.equal(normalized.inativo, true);
assert.equal(formatUnidadeStatus({ inativo: false }), 'Ativo');
assert.equal(formatUnidadeStatus({ inativo: true }), 'Inativo');
assert.equal(UNIDADE_ATENDIMENTO_COLUMNS.length, 5);
assert.equal(UNIDADE_ATENDIMENTO_PHONE_TYPES.length, 4);
assert.equal(UNIDADE_ATENDIMENTO_UFS[0].value, 'AC');

const validation = validateUnidadeAtendimentoValues({ nome: '   ' });
assert.equal(validation.valid, false);
assert.equal(validation.errors.nome, 'Informe o nome da unidade.');

const payload = buildUnidadeAtendimentoPayload({
  codigo: ' 0009 ',
  nome: ' Filial Sul ',
  inativo: true,
  qtd_sala: '3',
  fone1: '1133334444',
  inclusao: '01/07/2026',
  alteracao: '',
});

assert.equal(payload.codigo, '0009');
assert.equal(payload.nome, 'Filial Sul');
assert.equal(payload.ativo, false);
assert.equal(payload.qtd_sala, 3);
assert.equal(payload.inclusao, '01/07/2026');

const editPayloadWithoutQtd = buildUnidadeAtendimentoPayload({
  codigo: ' 0010 ',
  nome: ' Unidade Preservada ',
  inativo: false,
  fone1: '1122223333',
});

assert.equal(Object.hasOwn(editPayloadWithoutQtd, 'qtd_sala'), false);

const editPayloadWithQtd = buildUnidadeAtendimentoPayload(
  {
    codigo: ' 0011 ',
    nome: ' Unidade Editada ',
    inativo: false,
  },
  { qtdSala: 7 },
);

assert.equal(editPayloadWithQtd.qtd_sala, 7);
assert.equal(editPayloadWithQtd.ativo, true);

const modalSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/components/UnidadeAtendimentoModal.jsx'), 'utf8');
const identSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/components/UnidadeIdentificacaoSection.jsx'), 'utf8');
const enderecoSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/components/UnidadeEnderecoSection.jsx'), 'utf8');
const phonesSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/components/UnidadeTelefonesSection.jsx'), 'utf8');
const metadataSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/components/UnidadeMetadataSection.jsx'), 'utf8');
const optionsSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/constants/unidadeAtendimentoOptions.js'), 'utf8');
const cssSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/unidadesAtendimento.css'), 'utf8');

assert.match(modalSource, /width=\{584\}/);
assert.match(modalSource, /logradouroOptions/);
assert.match(modalSource, /bairroOptions/);
assert.match(modalSource, /cidadeOptions/);
assert.match(modalSource, /ufOptions/);
assert.match(modalSource, /UnidadeIdentificacaoSection/);
assert.match(modalSource, /UnidadeEnderecoSection/);
assert.match(modalSource, /UnidadeTelefonesSection/);
assert.match(modalSource, /UnidadeMetadataSection/);
assert.doesNotMatch(identSource, /Inativar unidade/);
assert.match(identSource, /Nome da unidade de atendimento/);
assert.match(enderecoSource, /logradouroOptions/);
assert.match(enderecoSource, /bairroOptions/);
assert.match(enderecoSource, /cidadeOptions/);
assert.match(enderecoSource, /ufOptions/);
assert.match(phonesSource, /UNIDADE_ATENDIMENTO_PHONE_TYPES/);
assert.match(phonesSource, /unidades-atendimento-phone-header/);
assert.match(phonesSource, /WA não possui integração nesta etapa/);
assert.match(metadataSource, /Inativar unidade/);
assert.match(optionsSource, /UNIDADE_ATENDIMENTO_PHONE_TYPES/);
assert.match(optionsSource, /UNIDADE_ATENDIMENTO_UFS/);
assert.match(cssSource, /\.unidades-atendimento-modal \.ant-modal-body/);
assert.match(cssSource, /\.unidades-atendimento-grid-identificacao/);
assert.match(cssSource, /\.unidades-atendimento-grid-endereco-primary/);
assert.match(cssSource, /\.unidades-atendimento-grid-endereco-secondary/);
assert.match(cssSource, /\.unidades-atendimento-grid-metadata/);
assert.match(cssSource, /\.unidades-atendimento-phone-header/);
assert.match(cssSource, /\.unidades-atendimento-phone-row/);
assert.match(cssSource, /\.unidades-atendimento-divider/);
assert.match(cssSource, /\.unidades-atendimento-wa-button/);
assert.match(cssSource, /\.unidades-atendimento-field-status/);

console.log('unidadesAtendimento.contract.test.mjs ok');
