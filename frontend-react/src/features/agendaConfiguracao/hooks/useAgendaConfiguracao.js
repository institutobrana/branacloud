import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider.jsx';
import { createAgendaConfiguracaoDraft } from '../agendaConfiguracaoState.js';
import {
  loadAgendaBloqueios,
  loadAgendaPrestadorRecord,
  mapAgendaDraftFromBackend,
  saveAgendaPrestadorDraft,
} from '../agendaConfiguracaoApi.js';

function resolveAgendaPrestadorId(context, user) {
  const candidates = [
    context?.prestadorId,
    user?.prestador_id,
    user?.prestadorId,
    user?.prestador?.id,
    user?.prestador?.prestador_id,
  ];
  for (const candidate of candidates) {
    const id = Number(candidate ?? 0);
    if (Number.isFinite(id) && id > 0) return id;
  }
  return null;
}

export function useAgendaConfiguracao(context, open) {
  const { user } = useAuth();
  const prestadorId = useMemo(() => resolveAgendaPrestadorId(context, user), [context, user]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [baseRecord, setBaseRecord] = useState(null);
  const [draft, setDraft] = useState(() => createAgendaConfiguracaoDraft());
  const [bloqueios, setBloqueios] = useState([]);
  const [bloqueiosLoading, setBloqueiosLoading] = useState(false);
  const [bloqueiosError, setBloqueiosError] = useState('');

  const reloadBloqueios = async () => {
    if (!prestadorId) {
      return [];
    }
    setBloqueiosLoading(true);
    setBloqueiosError('');
    try {
      const rows = await loadAgendaBloqueios(prestadorId);
      setBloqueios(Array.isArray(rows) ? rows : []);
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      setBloqueios([]);
      setBloqueiosError(err?.message || 'Falha ao carregar bloqueios da Agenda.');
      throw err;
    } finally {
      setBloqueiosLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    setError('');
    setBaseRecord(null);
    setBloqueios([]);
    setBloqueiosError('');
    setBloqueiosLoading(true);
    if (!prestadorId) {
      setDraft(createAgendaConfiguracaoDraft());
      setLoading(false);
      setBloqueiosLoading(false);
      setError('Prestador nao informado para a Agenda.');
      return () => {
        alive = false;
      };
    }

    loadAgendaPrestadorRecord(prestadorId)
      .then((record) => {
        if (!alive) return;
        setBaseRecord(record);
        setDraft(mapAgendaDraftFromBackend(record?.agenda_config || {}));
      })
      .catch((err) => {
        if (!alive) return;
        setBaseRecord(null);
        setDraft(createAgendaConfiguracaoDraft());
        setError(err?.message || 'Falha ao carregar configuracao da Agenda.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    loadAgendaBloqueios(prestadorId)
      .then((rows) => {
        if (!alive) return;
        setBloqueios(Array.isArray(rows) ? rows : []);
        setBloqueiosError('');
      })
      .catch((err) => {
        if (!alive) return;
        setBloqueios([]);
        setBloqueiosError(err?.message || 'Falha ao carregar bloqueios da Agenda.');
      })
      .finally(() => {
        if (alive) setBloqueiosLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [open, prestadorId]);

  const save = async () => {
    if (!prestadorId) {
      const errorSave = new Error('Prestador nao informado para a Agenda.');
      errorSave.status = 400;
      throw errorSave;
    }
    setSaving(true);
    setError('');
    try {
      const saved = await saveAgendaPrestadorDraft(prestadorId, draft, baseRecord);
      setBaseRecord(saved);
      setDraft(mapAgendaDraftFromBackend(saved?.agenda_config || {}));
      return saved;
    } catch (err) {
      setError(err?.message || 'Falha ao salvar configuracao da Agenda.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const resetFromBase = () => {
    setDraft(mapAgendaDraftFromBackend(baseRecord?.agenda_config || {}));
  };

  return {
    prestadorId,
    draft,
    setDraft,
    baseRecord,
    loading,
    saving,
    error,
    canSave: Boolean(prestadorId) && !loading && !saving,
    resetFromBase,
    save,
    bloqueios,
    bloqueiosLoading,
    bloqueiosError,
    reloadBloqueios,
  };
}
