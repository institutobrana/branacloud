function toText(value) {
  return String(value ?? '').trim();
}

function toBoolean(value) {
  return Boolean(value);
}

export function normalizePlanoContasGrupo(item) {
  return {
    id: item?.id,
    nome: toText(item?.nome),
    tipo: toText(item?.tipo),
    categorias: Array.isArray(item?.categorias)
      ? item.categorias.map((categoria) => normalizePlanoContasCategoria(categoria, item?.id))
      : [],
  };
}

export function normalizePlanoContasCategoria(item, grupoId = null) {
  return {
    id: item?.id,
    nome: toText(item?.nome),
    tipo: toText(item?.tipo),
    tributavel: toBoolean(item?.tributavel),
    grupoId: item?.grupo_id ?? grupoId ?? null,
  };
}

export function normalizePlanoContasResponse(response) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => normalizePlanoContasGrupo(item));
}

export function getPlanoContasGroupKey(group) {
  return group?.id == null ? '' : String(group.id);
}

export function getPlanoContasCategoryKey(category) {
  return category?.id == null ? '' : String(category.id);
}

export function getPlanoContasGroupsState(groups) {
  return Array.isArray(groups) ? groups : [];
}

export function getPlanoContasSelectedGroup(groups, selectedGroupId) {
  const list = getPlanoContasGroupsState(groups);
  const key = selectedGroupId == null ? '' : String(selectedGroupId);
  return list.find((group) => getPlanoContasGroupKey(group) === key) || null;
}

export function getPlanoContasCategoriesForGroup(groups, selectedGroupId) {
  const selectedGroup = getPlanoContasSelectedGroup(groups, selectedGroupId);
  return Array.isArray(selectedGroup?.categorias) ? selectedGroup.categorias : [];
}
