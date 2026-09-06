import { useCallback, useEffect, useMemo, useState } from 'react';
import { listarAgendaContatos, listarTiposContato } from '../api/agendaContatosApi.js';
import { filtrarAgendaContatos } from '../normalizers/agendaContatosNormalizers.js';

export function useAgendaContatos() {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [tipo, setTipo] = useState('');
  const [busca, setBusca] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async (preferredId = null) => {
    setLoading(true);
    setError(null);
    try {
      const [contacts, lookup] = await Promise.all([listarAgendaContatos(), listarTiposContato()]);
      setItems(contacts);
      setTypes(lookup);
      setSelectedId((current) => {
        if (preferredId && contacts.some((item) => Number(item.id) === Number(preferredId))) return Number(preferredId);
        return contacts.some((item) => Number(item.id) === Number(current)) ? current : (contacts[0]?.id || null);
      });
    } catch (reason) {
      setError(reason);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => {
    const onToolbar = (event) => {
      const field = event.detail?.field;
      if (field === 'tipo') setTipo(event.detail.value || '');
      if (field === 'busca') setBusca(event.detail.value || '');
    };
    window.addEventListener('brana-agenda-contatos-toolbar-filter', onToolbar);
    return () => {
      window.removeEventListener('brana-agenda-contatos-toolbar-filter', onToolbar);
    };
  }, []);

  const visibleItems = useMemo(() => filtrarAgendaContatos(items, tipo, busca), [items, tipo, busca]);
  const selectedVisible = visibleItems.some((item) => Number(item.id) === Number(selectedId));

  return { items, types, tipo, setTipo, busca, setBusca, selectedId: selectedVisible ? selectedId : null, setSelectedId, visibleItems, loading, error, reload };
}
