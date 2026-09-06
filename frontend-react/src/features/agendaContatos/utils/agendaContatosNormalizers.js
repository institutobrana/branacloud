export function normalizeAgendaContatoText(value) {
  let text = String(value ?? '').replace(/\u0000/g, '').trim();
  while (text && text.charCodeAt(0) < 32) text = text.slice(1);
  return text.replace(/\s+/g, ' ');
}

export function normalizeNullableInteger(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

export function normalizeAgendaContatoBoolean(value) {
  return value === true;
}

export function agendaContatoToFormState(contato = {}) {
  return {
    nome: String(contato.nome ?? ''), tipo: String(contato.tipo ?? ''), contato: String(contato.contato ?? ''),
    aniversario_dia: contato.aniversario_dia ?? '', aniversario_mes: contato.aniversario_mes ?? '',
    endereco: String(contato.endereco ?? ''), complemento: String(contato.complemento ?? ''),
    bairro: String(contato.bairro ?? ''), cidade: String(contato.cidade ?? ''), cep: String(contato.cep ?? ''),
    uf: String(contato.uf ?? ''), pais: String(contato.pais ?? ''),
    tel1_tipo: String(contato.tel1_tipo ?? ''), tel1: String(contato.tel1 ?? ''),
    tel2_tipo: String(contato.tel2_tipo ?? ''), tel2: String(contato.tel2 ?? ''),
    tel3_tipo: String(contato.tel3_tipo ?? ''), tel3: String(contato.tel3 ?? ''),
    tel4_tipo: String(contato.tel4_tipo ?? ''), tel4: String(contato.tel4 ?? ''),
    email: String(contato.email ?? ''), homepage: String(contato.homepage ?? ''),
    incluir_malas_diretas: contato.incluir_malas_diretas === true,
    incluir_preferidos: contato.incluir_preferidos === true,
    palavra_chave_1: String(contato.palavra_chave_1 ?? ''), palavra_chave_2: String(contato.palavra_chave_2 ?? ''),
    registro: String(contato.registro ?? ''), especialidade: String(contato.especialidade ?? ''),
    observacoes: String(contato.observacoes ?? ''),
  };
}
