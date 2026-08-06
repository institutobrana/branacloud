export function mapSimboloGraficoEspecialidadesCatalog(payload) {
  if (!Array.isArray(payload)) return [];

  const seen = new Set();
  const itens = [];

  for (const item of payload) {
    const codigo = String(item?.codigo ?? '').trim();
    const nome = String(item?.nome ?? '').trim();
    if (!codigo || !nome) continue;
    if (seen.has(codigo)) continue;

    seen.add(codigo);
    itens.push({
      value: codigo,
      label: nome,
      disabled: false,
    });
  }

  return itens;
}
