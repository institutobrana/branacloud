export function telefoneAgendaContato(item) {
  return [1, 2, 3, 4]
    .map((slot) => {
      const tipo = String(item?.[`tel${slot}_tipo`] || '').trim();
      const numero = String(item?.[`tel${slot}`] || '').trim();
      return numero ? (tipo ? `${tipo} ${numero}` : numero) : '';
    })
    .filter(Boolean)
    .join(' / ');
}

export function filtrarAgendaContatos(items, tipo, busca) {
  const filtroTipo = String(tipo || '').trim().toLowerCase();
  const termo = String(busca || '').trim().toLowerCase();
  return items.filter((item) => {
    if (filtroTipo && String(item?.tipo || '').toLowerCase() !== filtroTipo) return false;
    return !termo || String(item?.nome || '').toLowerCase().includes(termo);
  });
}
