import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';

import { atualizarDoencaCid, criarDoencaCid, excluirDoencaCid, listarDoencasCid } from '../doencasCidApi.js';

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

export function useDoencasCid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [codigoSearch, setCodigoSearch] = useState('');
  const [doencaSearch, setDoencaSearch] = useState('');
  const [sortState, setSortState] = useState({ key: 'codigo', order: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarDoencasCid();
      setItems(data);
      setSelectedId((current) => (data.some((item) => Number(item.id) === Number(current)) ? Number(current) : null));
    } catch (err) {
      setItems([]);
      setSelectedId(null);
      const nextError = err?.message || 'Falha ao carregar doenÃ§as CID.';
      setError(nextError);
      message.error(nextError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const globalTermo = normalizeText(globalSearch);
    const codigoTermo = normalizeText(codigoSearch);
    const doencaTermo = normalizeText(doencaSearch);
    return items.filter((item) => {
      const codigo = normalizeText(item?.codigo);
      const doenca = normalizeText(item?.descricao);
      const globalMatch = !globalTermo || codigo.includes(globalTermo) || doenca.includes(globalTermo);
      return globalMatch && (!codigoTermo || codigo.includes(codigoTermo)) && (!doencaTermo || doenca.includes(doencaTermo));
    });
  }, [codigoSearch, doencaSearch, globalSearch, items]);

  const sortedItems = useMemo(() => {
    const next = [...filteredItems];
    if (!sortState.key || !sortState.order) return next;

    next.sort((left, right) => {
      const leftValue = normalizeText(left?.[sortState.key]);
      const rightValue = normalizeText(right?.[sortState.key]);
      const comparison = leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
      return sortState.order === 'asc' ? comparison : -comparison;
    });

    return next;
  }, [filteredItems, sortState.key, sortState.order]);

  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [pageSize, safePage, sortedItems]);

  useEffect(() => {
    if (selectedId && !sortedItems.some((item) => Number(item.id) === Number(selectedId))) {
      setSelectedId(null);
    }
  }, [selectedId, sortedItems]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [codigoSearch, doencaSearch, globalSearch, sortState.key, sortState.order]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedId(null);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (item = null) => {
    const targetItem = item || sortedItems.find((entry) => Number(entry.id) === Number(selectedId));
    const selectedItem = targetItem ? sortedItems.find((entry) => Number(entry.id) === Number(targetItem.id)) : null;
    if (!selectedItem) {
      message.warning('Selecione uma doenÃ§a para alterar.');
      return;
    }
    setSelectedId(Number(selectedItem.id) || null);
    setEditingItem(selectedItem);
    setModalMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingItem(null);
    setModalMode('create');
  };

  const deleteSelectedDoencaCid = () => {
    const selectedItem = sortedItems.find((item) => Number(item.id) === Number(selectedId));
    if (!selectedItem) {
      message.warning('Selecione uma doenÃ§a para excluir.');
      return;
    }
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
  };

  const confirmDeleteDoencaCid = async () => {
    if (deleting) return;
    const selectedItem = sortedItems.find((item) => Number(item.id) === Number(selectedId));
    if (!selectedItem) {
      setDeleteModalOpen(false);
      message.warning('Selecione uma doenÃ§a para excluir.');
      return;
    }

    setDeleting(true);
    try {
      await excluirDoencaCid(selectedItem.id);
      message.success('DoenÃ§a excluÃ­da com sucesso.');
      setSelectedId(null);
      await loadItems();
      setDeleteModalOpen(false);
    } catch (err) {
      message.error(err?.message || 'Falha ao excluir doenÃ§a.');
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  const saveDoencaCid = async (values) => {
    setSaving(true);
    try {
      const payload = {
        codigo: values.codigo,
        descricao: values.descricao,
        observacoes: values.observacoes,
        preferido: values.preferido,
      };
      const saved = modalMode === 'edit' && editingItem?.id
        ? await atualizarDoencaCid(editingItem.id, payload)
        : await criarDoencaCid(payload);

      message.success(modalMode === 'edit' ? 'DoenÃ§a atualizada com sucesso.' : 'DoenÃ§a criada com sucesso.');
      await loadItems();
      setSelectedId(saved?.id ? Number(saved.id) : null);
      setModalOpen(false);
      setEditingItem(null);
      setModalMode('create');
      return saved;
    } catch (err) {
      message.error(err?.message || 'Falha ao salvar doenÃ§a.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo') {
        openCreateModal();
      } else if (action === 'alterar') {
        openEditModal();
      } else if (action === 'eliminar') {
        deleteSelectedDoencaCid();
      }
    };

    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      const value = event?.detail?.value;
      if (field === 'search') {
        setGlobalSearch(String(value || ''));
      }
    };

    window.addEventListener('brana-doencas-cid-toolbar-action', onToolbarAction);
    window.addEventListener('brana-doencas-cid-toolbar-filter', onToolbarFilter);
    return () => {
      window.removeEventListener('brana-doencas-cid-toolbar-action', onToolbarAction);
      window.removeEventListener('brana-doencas-cid-toolbar-filter', onToolbarFilter);
    };
  }, [deleteSelectedDoencaCid, openCreateModal, openEditModal]);

  return {
    items: paginatedItems,
    loading,
    error,
    selectedId,
    setSelectedId,
    globalSearch,
    setGlobalSearch,
    codigoSearch,
    setCodigoSearch,
    doencaSearch,
    setDoencaSearch,
    sortState,
    setSortState,
    currentPage: safePage,
    setCurrentPage: handlePageChange,
    pageSize,
    totalItems,
    totalPages,
    reload: loadItems,
    modalOpen,
    modalMode,
    saving,
    deleting,
    deleteModalOpen,
    setDeleteModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
    deleteSelectedDoencaCid,
    closeDeleteModal,
    confirmDeleteDoencaCid,
    saveDoencaCid,
  };
}
