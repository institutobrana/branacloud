import { useEffect } from 'react';
import { Typography } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { DoencaCidTable } from './components/DoencaCidTable.jsx';
import { DoencaCidModal } from './components/DoencaCidModal.jsx';
import { DoencaCidDeleteModal } from './components/DoencaCidDeleteModal.jsx';
import { useDoencasCid } from './hooks/useDoencasCid.js';
import './doencasCid.css';

export function DoencasCidPage({ onClose }) {
  const {
    items,
    loading,
    error,
    selectedId,
    setSelectedId,
    globalSearch,
    sortState,
    setSortState,
    currentPage,
    pageSize,
    totalItems,
    setCurrentPage,
    openEditModal,
    modalOpen,
    modalMode,
    saving,
    deleting,
    deleteModalOpen,
    editingItem,
    closeModal,
    closeDeleteModal,
    confirmDeleteDoencaCid,
    saveDoencaCid,
  } = useDoencasCid();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-doencas-cid-state', {
        detail: {
          selectedId,
          loading,
          deleting,
          globalSearch,
        },
      }),
    );
  }, [deleting, globalSearch, loading, selectedId]);

  return (
    <div className="doencas-cid-page">
      <div className="auxiliary-shell-frame">
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}

        <BranaCard className="auxiliary-main-card">
          <div className="module-table-shell">
            <div className="users-grid-shell" role="grid" aria-label="Listagem de doenças CID">
              <DoencaCidTable
                items={items}
                selectedId={selectedId}
                loading={loading}
                sortState={sortState}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalItems}
                onSort={(key, order) => setSortState({ key, order })}
                onSelect={setSelectedId}
                onEdit={openEditModal}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </BranaCard>
      </div>

      <DoencaCidModal
        open={modalOpen}
        mode={modalMode}
        loading={saving}
        item={editingItem}
        onClose={closeModal}
        onSave={saveDoencaCid}
      />

      <DoencaCidDeleteModal
        open={deleteModalOpen}
        loading={deleting}
        item={items.find((item) => Number(item.id) === Number(selectedId)) || null}
        onCancel={closeDeleteModal}
        onConfirm={() => void confirmDeleteDoencaCid()}
      />

      {!loading && !error && items.length === 0 ? (
        <Typography.Text type="secondary">Nenhum CID cadastrado.</Typography.Text>
      ) : null}
    </div>
  );
}
