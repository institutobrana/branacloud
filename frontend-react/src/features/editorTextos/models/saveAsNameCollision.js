export function findSaveAsNameCollisions(items, requestedName) {
  const name = String(requestedName || '').trim().toLocaleLowerCase('pt-BR');
  if (!name) return [];
  return (Array.isArray(items) ? items : [])
    .filter((item) => String(item?.nome_exibicao || item?.nome || '').trim().toLocaleLowerCase('pt-BR') === name)
    .sort((a, b) => Number(Boolean(a?.sistema)) - Number(Boolean(b?.sistema)) || Number(a?.id || 0) - Number(b?.id || 0));
}

export function canReplaceSaveAsCollision(model) {
  return Number(model?.id) > 0 && model?.sistema !== true;
}
