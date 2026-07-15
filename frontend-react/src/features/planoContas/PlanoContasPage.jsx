import { Alert, Button, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaModal } from '../../components/BranaModal.jsx';
import { PlanoContasCategoryModal } from './components/PlanoContasCategoryModal.jsx';
import { PlanoContasCategoryMigrationModal } from './components/PlanoContasCategoryMigrationModal.jsx';
import { PlanoContasGroupModal } from './components/PlanoContasGroupModal.jsx';
import { PlanoContasGroupsTable } from './components/PlanoContasGroupsTable.jsx';
import { PlanoContasCategoriesTable } from './components/PlanoContasCategoriesTable.jsx';
import { usePlanoContas } from './hooks/usePlanoContas.js';
import './planoContas.css';

function EmptyState({ title, description }) {
  return (
    <div className="plano-contas-empty-state">
      <Typography.Text strong>{title}</Typography.Text>
      <Typography.Text type="secondary">{description}</Typography.Text>
    </div>
  );
}

export function PlanoContasPage() {
  const {
    groups,
    categories,
    selectedGroup,
    selectedCategory,
    loading,
    error,
    groupsEmpty,
    noSelectedGroup,
    selectedGroupWithoutCategories,
    saving,
    deleting,
    groupTypes,
    handleSelectGroup,
    handleSelectCategory,
    handleSaveGroup,
    handleSaveCategory,
    handleDeleteCategory,
    handleCancelMigration,
    handleConfirmMigration,
    migrating,
    migrationModalOpen,
    migrationSourceCategory,
    migrationDestinations,
    migrationDestinationId,
    migrationError,
    setMigrationDestinationId,
    selectionState,
  } = usePlanoContas();
  const [groupModalState, setGroupModalState] = useState({ open: false, mode: 'create' });
  const [categoryModalState, setCategoryModalState] = useState({ open: false, mode: 'create' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toolbarStateRef = useRef({});

  const categoriesTitle = useMemo(
    () => (selectedGroup ? `Categorias - ${selectedGroup.nome || 'Grupo selecionado'}` : 'Categorias'),
    [selectedGroup],
  );

  const groupOptions = useMemo(
    () => groups.map((group) => ({ label: group.nome || `Grupo ${group.id}`, value: group.id })),
    [groups],
  );

  const openCreateGroupModal = () => {
    setGroupModalState({ open: true, mode: 'create', group: null });
  };

  const openEditGroupModal = () => {
    if (!selectedGroup) return;
    setGroupModalState({ open: true, mode: 'edit', group: selectedGroup });
  };

  const openCreateCategoryModal = () => {
    if (!selectedGroup) return;
    setCategoryModalState({ open: true, mode: 'create', category: null });
  };

  const openEditCategoryModal = () => {
    if (!selectedCategory) return;
    setCategoryModalState({ open: true, mode: 'edit', category: selectedCategory });
  };

  const openDeleteCategoryConfirm = () => {
    if (!selectedCategory || !selectedCategory?.id) return;
    setDeleteTarget(selectedCategory);
    setDeleteConfirmOpen(true);
  };

  const closeGroupModal = () => {
    if (saving) return;
    setGroupModalState((current) => ({ ...current, open: false }));
  };

  const closeCategoryModal = () => {
    if (saving) return;
    setCategoryModalState((current) => ({ ...current, open: false }));
  };

  const submitGroupModal = async (values) => {
    const groupId = groupModalState.mode === 'edit' ? selectedGroup?.id ?? null : null;
    await handleSaveGroup({ groupId, values });
    setGroupModalState({ open: false, mode: 'create', group: null });
  };

  const submitCategoryModal = async (values) => {
    const categoryId = categoryModalState.mode === 'edit' ? selectedCategory?.id ?? null : null;
    await handleSaveCategory({ categoryId, values });
    setCategoryModalState({ open: false, mode: 'create', category: null });
  };

  const confirmDeleteCategory = async () => {
    const categoryId = deleteTarget?.id ?? selectedCategory?.id ?? null;
    setDeleteConfirmOpen(false);
    if (categoryId == null) return;
    await handleDeleteCategory({ categoryId });
    setDeleteTarget(null);
  };

  const canEditGroup = Boolean(selectedGroup && !loading && !error);
  const canCreateCategory = Boolean(selectedGroup && !loading && !error);
  const canEditCategory = Boolean(selectedCategory && !loading && !error);
  const canDelete = Boolean(selectedCategory && selectionState.context === 'category' && !loading && !error && !saving && !deleting && !migrating && !migrationModalOpen);

  useEffect(() => {
    toolbarStateRef.current = {
      selectedGroup,
      selectedCategory,
      loading,
      saving,
      deleting,
      migrating,
      migrationModalOpen,
      error,
      selectionState,
    };
    window.dispatchEvent(
      new CustomEvent('brana-plano-contas-toolbar-state', {
        detail: {
          selectedGroupId: selectedGroup?.id ?? null,
          selectedCategoryId: selectedCategory?.id ?? null,
          canEditGroup,
          canCreateCategory,
          canEditCategory,
          canDelete,
          loading,
          saving,
          deleting,
          migrating,
          migrationModalOpen,
          context: selectionState.context,
        },
      }),
    );
  }, [canCreateCategory, canDelete, canEditCategory, canEditGroup, deleting, loading, migrating, migrationModalOpen, saving, selectedCategory?.id, selectedGroup?.id, selectionState.context]);

  useEffect(() => {
    const handleToolbarAction = (event) => {
      const action = event?.detail?.action;
      const current = toolbarStateRef.current || {};
      if (action === 'novo-grupo') {
        openCreateGroupModal();
      }
      if (action === 'alterar-grupo') {
        if (!current.selectedGroup) return;
        setGroupModalState({ open: true, mode: 'edit', group: current.selectedGroup });
      }
      if (action === 'nova-categoria') {
        if (!current.selectedGroup) return;
        setCategoryModalState({ open: true, mode: 'create', category: null });
      }
      if (action === 'alterar-categoria') {
        if (!current.selectedCategory) return;
        setCategoryModalState({ open: true, mode: 'edit', category: current.selectedCategory });
      }
      if (action === 'eliminar-categoria') {
        if (!current.selectedCategory || current.selectionState?.context !== 'category') return;
        setDeleteTarget(current.selectedCategory);
        setDeleteConfirmOpen(true);
      }
    };

    window.addEventListener('brana-plano-contas-toolbar-action', handleToolbarAction);
    return () => window.removeEventListener('brana-plano-contas-toolbar-action', handleToolbarAction);
  }, []);

  return (
    <div className="plano-contas-page">
      <div className="plano-contas-grid">
        <BranaCard className={`plano-contas-panel plano-contas-panel-left${selectedGroup ? ' is-active' : ''}`}>
          <div className="plano-contas-panel-header">
            <Typography.Title level={5}>Grupos de contas</Typography.Title>
            <Typography.Text type="secondary">{groupTypes.length ? groupTypes.join(' | ') : ''}</Typography.Text>
          </div>

          {error ? <Alert type="error" showIcon message="Falha ao carregar grupos." description={error} /> : null}
          {!error && groupsEmpty ? (
            <EmptyState title="Nenhum grupo cadastrado." description="A lista de grupos esta vazia." />
          ) : (
            <PlanoContasGroupsTable
              groups={groups}
              selectedGroupId={selectedGroup?.id ?? null}
              loading={loading}
              onSelectGroup={handleSelectGroup}
            />
          )}
        </BranaCard>

        <BranaCard className={`plano-contas-panel plano-contas-panel-right${selectedGroup ? ' is-active' : ''}`}>
          <div className="plano-contas-panel-header">
            <Typography.Title level={5}>{categoriesTitle}</Typography.Title>
          </div>

          {groupsEmpty ? (
            <EmptyState title="Nenhuma categoria disponivel." description="Carregue grupos para ver as categorias deste painel." />
          ) : noSelectedGroup ? (
            <EmptyState title="Selecione um grupo." description="Escolha um grupo a esquerda para ver suas categorias." />
          ) : null}
          {selectedGroup && selectedGroupWithoutCategories ? (
            <EmptyState title="Nenhuma categoria cadastrada para este grupo." description="Este grupo nao possui categorias." />
          ) : null}
          {selectedGroup && !selectedGroupWithoutCategories ? (
            <>
              {selectedCategory ? (
                <Typography.Text type="secondary" className="plano-contas-context-line">
                  Categoria ativa: <strong>{selectedCategory.nome}</strong>
                </Typography.Text>
              ) : null}
              <PlanoContasCategoriesTable
                categories={categories}
                selectedCategoryId={selectedCategory?.id ?? null}
                loading={loading}
                onSelectCategory={handleSelectCategory}
              />
            </>
          ) : null}
        </BranaCard>
      </div>

      <PlanoContasGroupModal
        open={groupModalState.open}
        mode={groupModalState.mode}
        group={groupModalState.mode === 'edit' ? groupModalState.group || selectedGroup : null}
        saving={saving}
        onCancel={closeGroupModal}
        onSubmit={submitGroupModal}
      />

      <PlanoContasCategoryModal
        open={categoryModalState.open}
        mode={categoryModalState.mode}
        category={categoryModalState.mode === 'edit' ? categoryModalState.category || selectedCategory : null}
        defaultGroupId={selectedGroup?.id ?? null}
        groupOptions={groupOptions}
        saving={saving}
        onCancel={closeCategoryModal}
        onSubmit={submitCategoryModal}
      />

      <BranaModal
        open={deleteConfirmOpen}
        title="Eliminar categoria"
        onCancel={() => {
          if (deleting) return;
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        footer={null}
        destroyOnClose
        width={420}
        maskClosable={!deleting}
        keyboard={!deleting}
      >
        <Typography.Paragraph>
          Confirma a exclusão da categoria “{deleteTarget?.nome || selectedCategory?.nome || 'selecionada'}”?
        </Typography.Paragraph>
        <div className="plano-contas-modal-actions">
          <Button
            danger
            type="primary"
            onClick={() => void confirmDeleteCategory()}
            loading={deleting}
          >
            Eliminar
          </Button>
          <Button
            onClick={() => {
              if (deleting) return;
              setDeleteConfirmOpen(false);
              setDeleteTarget(null);
            }}
            disabled={deleting}
          >
            Cancelar
          </Button>
        </div>
      </BranaModal>

      <PlanoContasCategoryMigrationModal
        open={migrationModalOpen}
        loading={migrating}
        originCategory={migrationSourceCategory}
        destinations={migrationDestinations}
        destinationId={migrationDestinationId}
        canConfirm={Boolean(migrationDestinations.length && migrationDestinationId)}
        error={migrationError}
        onCancel={handleCancelMigration}
        onConfirm={() => void handleConfirmMigration()}
        onChangeDestination={setMigrationDestinationId}
      />
    </div>
  );
}
