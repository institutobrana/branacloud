import dayjs from 'dayjs';

import { buildPrestadorPrincipalDefaults } from './prestadorPrincipalContracts.js';

function toText(value) {
  return String(value ?? '').trim();
}

function toDateText(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value) && value.isValid()) {
    return value.format('DD/MM/YYYY');
  }
  return toText(value);
}

function cloneArray(items) {
  return Array.isArray(items) ? [...items] : [];
}

function toDayjsDate(value) {
  const text = toText(value);
  if (!text) return null;
  const parsed = dayjs(text, 'DD/MM/YYYY', true);
  return parsed.isValid() ? parsed : null;
}

export function buildPrestadorModalDraft(items = [], source = null) {
  const principalDefaults = buildPrestadorPrincipalDefaults(items);
  const record = source && typeof source === 'object' ? source : null;
  const today = dayjs().format('DD/MM/YYYY');
  const toDraftDate = (value, fallback = null) => toDayjsDate(value) || fallback;
  return {
    codigo: record ? toText(record.codigo) : principalDefaults.codigo,
    nome: record ? toText(record.nome) : '',
    apelido: record ? toText(record.apelido) : '',
    tipo_prestador: record ? toText(record.tipo_prestador) || principalDefaults.tipo_prestador : principalDefaults.tipo_prestador,
    inicio: record ? toDraftDate(record.inicio, dayjs(today, 'DD/MM/YYYY', true)) : dayjs(principalDefaults.inicio, 'DD/MM/YYYY', true),
    termino: record ? toDraftDate(record.termino, null) : null,
    inativo: record ? !Boolean(record.ativo ?? true) : principalDefaults.inativo,
    executa_procedimento: record ? Boolean(record.executa_procedimento ?? true) : principalDefaults.executa_procedimento,
    cro: record ? toText(record.cro) : '',
    uf_cro: record ? toText(record.uf_cro) : principalDefaults.uf_cro,
    cpf: record ? toText(record.cpf) : '',
    rg: record ? toText(record.rg) : '',
    inss: record ? toText(record.inss) : '',
    ccm: record ? toText(record.ccm) : '',
    contrato: record ? toText(record.contrato) : '',
    cnes: record ? toText(record.cnes) : '',
    cbos: record ? toText(record.cbos) || principalDefaults.cbos : principalDefaults.cbos,
    nascimento: record ? toDraftDate(record.nascimento, null) : null,
    sexo: record ? toText(record.sexo) : principalDefaults.sexo,
    estado_civil: record ? toText(record.estado_civil) : principalDefaults.estado_civil,
    prefixo: record ? toText(record.prefixo) : principalDefaults.prefixo,
    inclusao: record ? toText(record.inclusao) || principalDefaults.inclusao : principalDefaults.inclusao,
    alteracao: record ? toText(record.alteracao) || principalDefaults.alteracao : principalDefaults.alteracao,
    id_interno: record ? toText(record.id_interno) : principalDefaults.id_interno,
    fone1_tipo: record ? toText(record.fone1_tipo) || 'Residencial' : 'Residencial',
    fone1: record ? toText(record.fone1) : '',
    fone2_tipo: record ? toText(record.fone2_tipo) || 'Comercial' : 'Comercial',
    fone2: record ? toText(record.fone2) : '',
    email: record ? toText(record.email) : '',
    homepage: record ? toText(record.homepage) : '',
    logradouro_tipo: record ? toText(record.logradouro_tipo) : '',
    endereco: record ? toText(record.endereco) : '',
    numero: record ? toText(record.numero) : '',
    complemento: record ? toText(record.complemento) : '',
    bairro: record ? toText(record.bairro) : '',
    cidade: record ? toText(record.cidade) || 'São José do Rio Preto' : 'São José do Rio Preto',
    cep: record ? toText(record.cep) : '',
    uf: record ? toText(record.uf) || 'SP' : 'SP',
    banco: record ? toText(record.banco) : '',
    agencia: record ? toText(record.agencia) : '',
    conta: record ? toText(record.conta) : '',
    nome_conta: record ? toText(record.nome_conta) : '',
    modo_pagamento: record ? toText(record.modo_pagamento) : '',
    faculdade: record ? toText(record.faculdade) : '',
    formatura: record ? toText(record.formatura) : '',
    alerta_agendamentos: record ? toText(record.alerta_agendamentos) : '',
    especialidades_exec: record ? cloneArray(record.especialidades_exec) : [],
    observacoes: record ? toText(record.observacoes) : '',
  };
}

export function buildPrestadorModalPayload(draft, { mode = 'create' } = {}) {
  const src = draft || {};
  const especialidadesExec = cloneArray(src.especialidades_exec)
    .map((item) => toText(item))
    .filter(Boolean);

  return {
    codigo: mode === 'edit' ? toText(src.codigo) : '',
    nome: toText(src.nome),
    apelido: toText(src.apelido),
    tipo_prestador: toText(src.tipo_prestador),
    inicio: toDateText(src.inicio),
    termino: toDateText(src.termino),
    ativo: !Boolean(src.inativo),
    executa_procedimento: Boolean(src.executa_procedimento),
    cro: toText(src.cro),
    uf_cro: toText(src.uf_cro),
    cpf: toText(src.cpf),
    rg: toText(src.rg),
    inss: toText(src.inss),
    ccm: toText(src.ccm),
    contrato: toText(src.contrato),
    cnes: toText(src.cnes),
    cbos: toText(src.cbos),
    nascimento: toDateText(src.nascimento),
    sexo: toText(src.sexo),
    estado_civil: toText(src.estado_civil),
    prefixo: toText(src.prefixo),
    inclusao: toDateText(src.inclusao),
    alteracao: mode === 'edit' ? toDateText(src.alteracao || dayjs().format('DD/MM/YYYY')) : toDateText(src.alteracao),
    id_interno: toText(src.id_interno),
    fone1_tipo: toText(src.fone1_tipo),
    fone1: toText(src.fone1),
    fone2_tipo: toText(src.fone2_tipo),
    fone2: toText(src.fone2),
    email: toText(src.email),
    homepage: toText(src.homepage),
    logradouro_tipo: toText(src.logradouro_tipo),
    endereco: toText(src.endereco),
    numero: toText(src.numero),
    complemento: toText(src.complemento),
    bairro: toText(src.bairro),
    cidade: toText(src.cidade),
    cep: toText(src.cep),
    uf: toText(src.uf),
    banco: toText(src.banco),
    agencia: toText(src.agencia),
    conta: toText(src.conta),
    nome_conta: toText(src.nome_conta),
    modo_pagamento: toText(src.modo_pagamento),
    faculdade: toText(src.faculdade),
    formatura: toText(src.formatura),
    alerta_agendamentos: toText(src.alerta_agendamentos),
    especialidades_exec: especialidadesExec,
    especialidade: toText(src.especialidade) || especialidadesExec[0] || '',
    agenda_config: {},
    observacoes: toText(src.observacoes),
  };
}

export function validatePrestadorModalDraft(draft) {
  const payload = buildPrestadorModalPayload(draft);
  const errors = [];
  if (!payload.nome) errors.push('Nome do prestador é obrigatório.');
  if (!payload.tipo_prestador) errors.push('Tipo do prestador é obrigatório.');
  return {
    isValid: errors.length === 0,
    errors,
    payload,
  };
}
