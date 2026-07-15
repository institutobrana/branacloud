import {
  buildPlanoContasCategoryMigrationPayload,
  normalizePlanoContasCategoryDestinationList,
  selectFirstPlanoContasCategoryDestination,
  toPlanoContasPositiveInteger,
} from '../planoContasCategoryDeletion.js';

export function buildPlanoContasCategoryMigrationState(groups, originCategory) {
  const originId = toPlanoContasPositiveInteger(originCategory?.id);
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const sourceGroupId = toPlanoContasPositiveInteger(originCategory?.grupo_id ?? originCategory?.grupoId);

  const rawDestinations = normalizedGroups.flatMap((group) => {
    const groupCategories = Array.isArray(group?.categorias) ? group.categorias : [];
    return groupCategories.map((category) => ({
      ...category,
      grupo_id: group?.id ?? category?.grupo_id ?? null,
    }));
  });

  const destinations = normalizePlanoContasCategoryDestinationList(rawDestinations, originId);
  const destination = selectFirstPlanoContasCategoryDestination(destinations, originId);

  return {
    originId,
    originCategory: originCategory || null,
    sourceGroupId,
    destinations,
    destination,
    migrationDestinationId: destination?.id ?? null,
    canConfirm: Boolean(originId && destination?.id),
    payloadPreview: destination ? buildPlanoContasCategoryMigrationPayload(destination.id) : null,
  };
}

export function reconcilePlanoContasCategoryMigrationSelection(groups, destinationId) {
  const normalizedGroups = Array.isArray(groups) ? groups : [];
  const targetId = toPlanoContasPositiveInteger(destinationId);

  if (targetId == null) {
    return {
      selectedGroupId: null,
      selectedCategoryId: null,
      context: 'none',
      selectedGroup: null,
      selectedCategory: null,
    };
  }

  for (const group of normalizedGroups) {
    const categories = Array.isArray(group?.categorias) ? group.categorias : [];
    const selectedCategory = categories.find((item) => toPlanoContasPositiveInteger(item?.id) === targetId) || null;
    if (selectedCategory) {
      return {
        selectedGroupId: group?.id ?? null,
        selectedCategoryId: selectedCategory.id ?? null,
        context: 'category',
        selectedGroup: group || null,
        selectedCategory,
      };
    }
  }

  const firstGroup = normalizedGroups[0] || null;
  return {
    selectedGroupId: firstGroup?.id ?? null,
    selectedCategoryId: null,
    context: firstGroup ? 'group' : 'none',
    selectedGroup: firstGroup,
    selectedCategory: null,
  };
}
