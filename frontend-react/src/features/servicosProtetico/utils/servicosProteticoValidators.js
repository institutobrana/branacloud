import { parsePtBrDecimal, parsePtBrInteger } from './servicosProteticoCreatePayload.js';

export function validateServicoProteticoValues(values = {}) {
  const errors = {};
  const codigo = String(values.codigo ?? '').trim();
  const nome = String(values.nome ?? '').trim();

  if (!codigo) {
    errors.codigo = 'Informe o código.';
  } else if (codigo.length > 30) {
    errors.codigo = 'O código deve ter no máximo 30 caracteres.';
  }

  if (!nome) {
    errors.nome = 'Informe o nome do serviço.';
  } else if (nome.length > 180) {
    errors.nome = 'O nome do serviço deve ter no máximo 180 caracteres.';
  }

  const indice = String(values.indice ?? '').trim();
  if (!indice) {
    errors.indice = 'Informe o índice.';
  }

  const precoRaw = String(values.preco ?? '').trim();
  const preco = parsePtBrDecimal(precoRaw);
  if (precoRaw && preco === null) {
    errors.preco = 'Informe um preço válido.';
  } else if (preco !== null && preco < 0) {
    errors.preco = 'O preço não pode ser negativo.';
  }

  const prazoRaw = String(values.prazo ?? '').trim();
  const prazo = parsePtBrInteger(prazoRaw);
  if (prazoRaw && prazo === null) {
    errors.prazo = 'Informe um prazo válido.';
  } else if (prazo !== null && prazo < 0) {
    errors.prazo = 'O prazo não pode ser negativo.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
