export const EMPTY_CONVENIO_FORM = { codigo: '', nome: '', razao_social: '', codigo_ans: '', tipo_logradouro: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', cep: '', uf: '', tipo_fone1: '', telefone: '', contato1: '', tipo_fone2: '', telefone2: '', contato2: '', tipo_fone3: '', telefone3: '', contato3: '', tipo_fone4: '', telefone4: '', contato4: '', data_inclusao: '', data_alteracao: '', email: '', email_tecnico: '', homepage: '', cnpj: '', inscricao_estadual: '', inscricao_municipal: '', tipo_faturamento: 1, observacoes: '', inativo: false };

export function mapConvenioAuxiliaryOptions(items, { historicalIndex = false } = {}) {
  return (Array.isArray(items) ? items : []).map((item, index) => {
    const label = String(item?.descricao ?? item?.name ?? '').trim();
    return label ? { value: historicalIndex ? String(index + 1) : label, label } : null;
  }).filter(Boolean);
}
