import {
  getPlanoContasCategoriesForGroup,
  getPlanoContasGroupKey,
  getPlanoContasSelectedGroup,
} from '../planoContasMappers.js';

export const PLANO_CONTAS_CONTEXT = {
  NONE: 'none',
  GROUP: 'group',
  CATEGORY: 'category',
};

export function createPlanoContasSelectionState(groups, currentState = {}) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const firstGroup = normalizedGroups[0] || null;
  const selectedGroup = getPlanoContasSelectedGroup(normalizedGroups, currentState.selectedGroupId) || firstGroup;
  const selectedGroupId = selectedGroup ? selectedGroup.id : null;
  const categories = getPlanoContasCategoriesForGroup(normalizedGroups, selectedGroupId);
  const selectedCategoryId = categories.some((category) => String(category.id) === String(currentState.selectedCategoryId ?? ''))
    ? currentState.selectedCategoryId
    : null;
  const context = selectedCategoryId != null
    ? PLANO_CONTAS_CONTEXT.CATEGORY
    : selectedGroupId != null
      ? PLANO_CONTAS_CONTEXT.GROUP
      : PLANO_CONTAS_CONTEXT.NONE;

  return {
    groups: normalizedGroups,
    selectedGroupId,
    selectedCategoryId,
    context,
    selectedGroup,
    categories,
    selectedGroupKey: selectedGroup ? getPlanoContasGroupKey(selectedGroup) : '',
  };
}

export function selectPlanoContasGroup(groups, groupId) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const selectedGroup = getPlanoContasSelectedGroup(normalizedGroups, groupId);
  return {
    groups: normalizedGroups,
    selectedGroupId: selectedGroup ? selectedGroup.id : null,
    selectedCategoryId: null,
    context: selectedGroup ? PLANO_CONTAS_CONTEXT.GROUP : PLANO_CONTAS_CONTEXT.NONE,
    selectedGroup,
    categories: Array.isArray(selectedGroup?.categorias) ? selectedGroup.categorias : [],
    selectedGroupKey: selectedGroup ? getPlanoContasGroupKey(selectedGroup) : '',
  };
}

export function selectPlanoContasCategory(groups, groupId, categoryId) {
  const groupState = selectPlanoContasGroup(groups, groupId);
  const selectedCategory = (groupState.categories || []).find((item) => String(item.id) === String(categoryId ?? '')) || null;
  return {
    ...groupState,
    selectedCategoryId: selectedCategory ? selectedCategory.id : null,
    context: selectedCategory ? PLANO_CONTAS_CONTEXT.CATEGORY : groupState.context,
  };
}

export function updatePlanoContasSelectionAfterGroupSave(groups, currentState = {}, savedGroupId = null) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const desiredGroupId = savedGroupId != null ? savedGroupId : currentState.selectedGroupId ?? null;
  const nextSelection = createPlanoContasSelectionState(normalizedGroups, {
    selectedGroupId: desiredGroupId,
    selectedCategoryId: currentState.selectedCategoryId ?? null,
  });

  if (
    currentState.context === PLANO_CONTAS_CONTEXT.CATEGORY &&
    String(currentState.selectedGroupId ?? '') === String(desiredGroupId ?? '')
  ) {
    const categoryExists = nextSelection.categories.some(
      (category) => String(category.id) === String(currentState.selectedCategoryId ?? ''),
    );

    if (categoryExists) {
      nextSelection.selectedCategoryId = currentState.selectedCategoryId;
      nextSelection.context = PLANO_CONTAS_CONTEXT.CATEGORY;
    }
  }

  return nextSelection;
}

export function updatePlanoContasSelectionAfterCategoryDelete(groups, currentState = {}) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const selectedGroupId = currentState.selectedGroupId ?? null;
  const selectedGroup = getPlanoContasSelectedGroup(normalizedGroups, selectedGroupId);
  const categories = getPlanoContasCategoriesForGroup(normalizedGroups, selectedGroupId);
  const hasSelectedGroup = Boolean(selectedGroup);

  return {
    groups: normalizedGroups,
    selectedGroupId: hasSelectedGroup ? selectedGroup.id : null,
    selectedCategoryId: null,
    context: hasSelectedGroup ? PLANO_CONTAS_CONTEXT.GROUP : PLANO_CONTAS_CONTEXT.NONE,
    selectedGroup: hasSelectedGroup ? selectedGroup : null,
    categories,
    selectedGroupKey: hasSelectedGroup ? getPlanoContasGroupKey(selectedGroup) : '',
  };
}

export function updatePlanoContasSelectionAfterGroupDelete(groups, currentState = {}) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  return createPlanoContasSelectionState(normalizedGroups, {
    selectedGroupId: currentState.selectedGroupId ?? null,
    selectedCategoryId: null,
  });
}
