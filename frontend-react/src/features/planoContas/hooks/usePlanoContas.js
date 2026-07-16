import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  atualizarPlanoContasGrupo,
  excluirPlanoContasGrupo,
  criarPlanoContasGrupo,
  excluirPlanoContasCategoria,
  migrarEExcluirPlanoContasCategoria,
  listarPlanoContasGrupos,
} from '../planoContasApi.js';
import { getPlanoContasCategoriesForGroup, getPlanoContasSelectedGroup } from '../planoContasMappers.js';
import { validatePlanoContasGroupPayload } from '../planoContasValidators.js';
import { criarPlanoContasCategoria, atualizarPlanoContasCategoria } from '../planoContasApi.js';
import { validatePlanoContasCategoryPayload } from '../planoContasCategoryValidators.js';
import {
  createPlanoContasSelectionState,
  selectPlanoContasCategory,
  selectPlanoContasGroup,
  updatePlanoContasSelectionAfterCategoryDelete,
  updatePlanoContasSelectionAfterGroupDelete,
  updatePlanoContasSelectionAfterGroupSave,
} from './usePlanoContasSelection.js';
import {
  classifyPlanoContasCategoryError,
  toPlanoContasPositiveInteger,
} from '../planoContasCategoryDeletion.js';
import { buildPlanoContasCategoryMigrationState, reconcilePlanoContasCategoryMigrationSelection } from './usePlanoContasCategoryMigration.js';
import { isPlanoContasSystemProtectedGroup } from '../planoContasSystemGroups.js';
import { classifyPlanoContasGroupError } from '../planoContasGroupDeletion.js';

function getUniqueGroupTypes(groups) {
  const values = new Set();
  (Array.isArray(groups) ? groups : []).forEach((group) => {
    const value = String(group?.tipo ?? '').trim();
    if (value) values.add(value);
  });
  return Array.from(values);
}

export function usePlanoContas() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const [migrationSourceCategory, setMigrationSourceCategory] = useState(null);
  const [migrationDestinations, setMigrationDestinations] = useState([]);
  const [migrationDestinationId, setMigrationDestinationId] = useState(null);
  const [migrationError, setMigrationError] = useState('');
  const [groupDeleteError, setGroupDeleteError] = useState('');
  const savingRef = useRef(false);
  const deletingRef = useRef(false);
  const migratingRef = useRef(false);
  const groupDeletingRef = useRef(false);

  const reload = async (nextSelection = null) => {
    setLoading(true);
    setError('');
    try {
      const data = await listarPlanoContasGrupos();
      const nextGroups = Array.isArray(data) ? data : [];
      setGroups(nextGroups);

      const initialSelection = nextSelection || createPlanoContasSelectionState(nextGroups, {});
      setSelectedGroupId(initialSelection.selectedGroupId);
      setSelectedCategoryId(initialSelection.selectedCategoryId);
      return nextGroups;
    } catch (err) {
      setGroups([]);
      setSelectedGroupId(null);
      setSelectedCategoryId(null);
      const nextError = err?.message || 'Falha ao carregar o plano de contas.';
      setError(nextError);
      message.error(nextError);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const selectedGroup = useMemo(
    () => getPlanoContasSelectedGroup(groups, selectedGroupId),
    [groups, selectedGroupId],
  );

  const selectedGroupIsSystemProtected = useMemo(
    () => isPlanoContasSystemProtectedGroup(selectedGroup),
    [selectedGroup],
  );

  const categories = useMemo(
    () => getPlanoContasCategoriesForGroup(groups, selectedGroupId),
    [groups, selectedGroupId],
  );

  const selectedCategory = useMemo(
    () => categories.find((item) => String(item.id) === String(selectedCategoryId ?? '')) || null,
    [categories, selectedCategoryId],
  );

  const selectionState = useMemo(
    () => createPlanoContasSelectionState(groups, { selectedGroupId, selectedCategoryId }),
    [groups, selectedCategoryId, selectedGroupId],
  );

  const handleSelectGroup = (groupId) => {
    const next = selectPlanoContasGroup(groups, groupId);
    setSelectedGroupId(next.selectedGroupId);
    setSelectedCategoryId(next.selectedCategoryId);
    return next;
  };

  const handleSelectCategory = (categoryId) => {
    const next = selectPlanoContasCategory(groups, selectedGroupId, categoryId);
    setSelectedGroupId(next.selectedGroupId);
    setSelectedCategoryId(next.selectedCategoryId);
    return next;
  };

  const handleSaveGroup = async ({ groupId = null, values } = {}) => {
    if (savingRef.current) {
      return null;
    }

    const { sanitized, valid, errors } = validatePlanoContasGroupPayload(values);
    if (!valid) {
      const validationError = new Error(errors.nome || errors.tipo || 'Falha de validacao do grupo.');
      validationError.validationErrors = errors;
      throw validationError;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      const result = groupId == null
        ? await criarPlanoContasGrupo(sanitized)
        : await atualizarPlanoContasGrupo(groupId, sanitized);
      const savedGroupId = result?.id ?? groupId ?? null;
      const nextSelection = updatePlanoContasSelectionAfterGroupSave(groups, selectionState, savedGroupId);
      await reload(nextSelection);
      message.success(groupId == null ? 'Grupo cadastrado com sucesso.' : 'Grupo atualizado com sucesso.');
      return result;
    } catch (err) {
      const fallback = groupId == null ? 'Falha ao cadastrar o grupo.' : 'Falha ao atualizar o grupo.';
      message.error(err?.message || fallback);
      throw err;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleSaveCategory = async ({ categoryId = null, values } = {}) => {
    if (savingRef.current) {
      return null;
    }

    const { sanitized, valid, errors } = validatePlanoContasCategoryPayload(values);
    if (!valid) {
      const validationError = new Error(errors.nome || errors.tipo || errors.grupo_id || 'Falha de validacao da categoria.');
      validationError.validationErrors = errors;
      throw validationError;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      const result = categoryId == null
        ? await criarPlanoContasCategoria(sanitized)
        : await atualizarPlanoContasCategoria(categoryId, sanitized);
      const nextGroups = await listarPlanoContasGrupos();
      const normalizedGroups = Array.isArray(nextGroups) ? nextGroups : [];
      setGroups(normalizedGroups);
      const savedGroupId = sanitized.grupo_id || selectedGroupId || null;
      const savedCategoryId = result?.id ?? categoryId ?? null;
      const nextSelection = createPlanoContasSelectionState(normalizedGroups, {
        selectedGroupId: savedGroupId,
        selectedCategoryId: savedCategoryId,
      });
      setSelectedGroupId(nextSelection.selectedGroupId);
      setSelectedCategoryId(nextSelection.selectedCategoryId);
      message.success(categoryId == null ? 'Categoria cadastrada com sucesso.' : 'Categoria atualizada com sucesso.');
      return result;
    } catch (err) {
      const fallback = categoryId == null ? 'Falha ao cadastrar a categoria.' : 'Falha ao atualizar a categoria.';
      message.error(err?.message || fallback);
      throw err;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleDeleteCategory = async ({ categoryId = null } = {}) => {
    if (deletingRef.current) {
      return { ok: false, skipped: true };
    }

    const targetCategoryId = categoryId ?? selectedCategoryId ?? null;
    if (targetCategoryId == null) {
      return { ok: false, error: new Error('Selecione uma categoria para excluir.') };
    }

    deletingRef.current = true;
    setDeleting(true);
    try {
      await excluirPlanoContasCategoria(targetCategoryId);
      const safeSelection = updatePlanoContasSelectionAfterCategoryDelete(groups, {
        selectedGroupId,
      });
      setSelectedGroupId(safeSelection.selectedGroupId);
      setSelectedCategoryId(safeSelection.selectedCategoryId);

      try {
        const nextGroups = await listarPlanoContasGrupos();
        const normalizedGroups = Array.isArray(nextGroups) ? nextGroups : [];
        const nextSelection = updatePlanoContasSelectionAfterCategoryDelete(normalizedGroups, {
          selectedGroupId: safeSelection.selectedGroupId,
        });
        setGroups(normalizedGroups);
        setSelectedGroupId(nextSelection.selectedGroupId);
        setSelectedCategoryId(nextSelection.selectedCategoryId);
        message.success('Categoria excluída com sucesso.');
        return { ok: true, refreshed: true };
      } catch (reloadError) {
        message.warning('A categoria foi excluída, mas a lista não pôde ser atualizada.');
        return { ok: true, refreshed: false, reloadError };
      }
    } catch (err) {
      const classified = classifyPlanoContasCategoryError(err);
      const nextMessage = classified.kind === 'category-in-use'
        ? 'Esta categoria está em uso e precisa ter seus lançamentos migrados antes da exclusão.'
        : classified.message || err?.message || 'Falha ao excluir a categoria.';
      if (classified.kind === 'category-in-use') {
        const migrationState = buildPlanoContasCategoryMigrationState(groups, {
          id: targetCategoryId,
          nome: selectedCategory?.nome || '',
          grupo_id: selectedGroupId,
          grupoId: selectedGroupId,
        });
        setMigrationSourceCategory(migrationState.originCategory);
        setMigrationDestinations(migrationState.destinations);
        setMigrationDestinationId(migrationState.migrationDestinationId);
        setMigrationError('');
        setMigrationModalOpen(true);
        message.error(nextMessage);
        return { ok: false, error: classified, message: nextMessage, kind: 'category-in-use' };
      }
      message.error(nextMessage);
      return { ok: false, error: classified, message: nextMessage };
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  const handleDeleteGroup = async ({ groupId = null } = {}) => {
    if (groupDeletingRef.current) {
      return { ok: false, skipped: true };
    }

    const targetGroupId = groupId ?? selectedGroupId ?? null;
    if (targetGroupId == null) {
      return { ok: false, error: new Error('Selecione um grupo para excluir.') };
    }

    const targetGroup = getPlanoContasSelectedGroup(groups, targetGroupId);
    if (isPlanoContasSystemProtectedGroup(targetGroup)) {
      const protectedError = new Error('Grupo nativo do sistema. Nao pode ser excluido.');
      protectedError.status = 409;
      protectedError.code = 'SYSTEM_GROUP_PROTECTED';
      protectedError.data = {
        detail: 'GRUPO BLINDADO DO SISTEMA, NAO PODE SER EXCLUIDO!',
        code: 'SYSTEM_GROUP_PROTECTED',
      };
      message.warning(protectedError.message);
      return { ok: false, error: protectedError, kind: 'system-group-protected' };
    }

    groupDeletingRef.current = true;
    setDeleting(true);
    try {
      const result = await excluirPlanoContasGrupo(targetGroupId);
      const nextGroups = await listarPlanoContasGrupos();
      const normalizedGroups = Array.isArray(nextGroups) ? nextGroups : [];
      setGroups(normalizedGroups);
      const nextSelection = updatePlanoContasSelectionAfterGroupDelete(normalizedGroups, {
        selectedGroupId: targetGroupId,
      });
      setSelectedGroupId(nextSelection.selectedGroupId);
      setSelectedCategoryId(nextSelection.selectedCategoryId);
      setGroupDeleteError('');
      message.success('Grupo excluído com sucesso.');
      return { ok: true, refreshed: true, result };
    } catch (err) {
      const classified = classifyPlanoContasGroupError(err);
      const nextMessage = classified.message || err?.message || 'Falha ao excluir o grupo.';
      setGroupDeleteError(nextMessage);
      message.error(nextMessage);
      return { ok: false, error: classified, message: nextMessage };
    } finally {
      groupDeletingRef.current = false;
      setDeleting(false);
    }
  };

  const handleCancelMigration = () => {
    if (migratingRef.current) return;
    setMigrationModalOpen(false);
    setMigrationSourceCategory(null);
    setMigrationDestinations([]);
    setMigrationDestinationId(null);
    setMigrationError('');
  };

  const handleConfirmMigration = async () => {
    if (migratingRef.current) return { ok: false, skipped: true };
    const originId = toPlanoContasPositiveInteger(migrationSourceCategory?.id);
    const destinationId = toPlanoContasPositiveInteger(migrationDestinationId);
    if (originId == null || destinationId == null || originId === destinationId) {
      const nextError = 'Selecione uma categoria destino válida.';
      setMigrationError(nextError);
      return { ok: false, error: new Error(nextError) };
    }

    migratingRef.current = true;
    setMigrating(true);
    try {
      await migrarEExcluirPlanoContasCategoria(originId, destinationId);
      const nextGroups = await listarPlanoContasGrupos();
      const normalizedGroups = Array.isArray(nextGroups) ? nextGroups : [];
      setGroups(normalizedGroups);
      const nextSelection = reconcilePlanoContasCategoryMigrationSelection(normalizedGroups, destinationId);
      setSelectedGroupId(nextSelection.selectedGroupId);
      setSelectedCategoryId(nextSelection.selectedCategoryId);
      message.success('Lançamentos migrados e categoria eliminada com sucesso.');
      setMigrationModalOpen(false);
      setMigrationSourceCategory(null);
      setMigrationDestinations([]);
      setMigrationDestinationId(null);
      setMigrationError('');
      return { ok: true, refreshed: true, nextSelection };
    } catch (err) {
      const nextError = err?.message || 'Falha ao migrar a categoria.';
      setMigrationError(nextError);
      message.error(nextError);
      return { ok: false, error: err };
    } finally {
      migratingRef.current = false;
      setMigrating(false);
    }
  };

  const groupsEmpty = !loading && !error && groups.length === 0;
  const noSelectedGroup = !loading && !error && !selectedGroup;
  const selectedGroupWithoutCategories = Boolean(selectedGroup) && categories.length === 0;
  const selectedGroupCanBeDeleted = Boolean(selectedGroup && selectionState.context === 'group' && !selectedGroupIsSystemProtected && selectedGroupWithoutCategories && !loading && !error && !saving && !deleting && !migrating && !migrationModalOpen);

  return {
    groups,
    categories,
    selectedGroup,
    selectedCategory,
    loading,
    error,
    groupsEmpty,
    noSelectedGroup,
    selectedGroupWithoutCategories,
    selectedGroupIsSystemProtected,
    selectedGroupCanBeDeleted,
    groupTypes: getUniqueGroupTypes(groups),
    saving,
    deleting,
    migrating,
    migrationModalOpen,
    migrationSourceCategory,
    migrationDestinations,
    migrationDestinationId,
    migrationError,
    groupDeleteError,
    selectionState,
    handleSelectGroup,
    handleSelectCategory,
    handleSaveGroup,
    handleSaveCategory,
    handleDeleteCategory,
    handleDeleteGroup,
    handleCancelMigration,
    handleConfirmMigration,
    setMigrationDestinationId,
    reload,
  };
}
