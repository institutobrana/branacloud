import { useCallback, useState } from 'react';
import { message } from 'antd';

import { criarServicoProtetico } from '../servicosProteticoApi.js';

export function useServicoProteticoCreate() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [createdServico, setCreatedServico] = useState(null);

  const createServico = useCallback(async (proteticoId, payload) => {
    if (saving) return null;
    setSaving(true);
    setError('');
    setCreatedServico(null);

    try {
      const result = await criarServicoProtetico(proteticoId, payload);
      setCreatedServico(result);
      return result;
    } catch (err) {
      const nextError = err?.message || 'Falha ao salvar servico.';
      setError(nextError);
      message.error(nextError);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const reset = useCallback(() => {
    setError('');
    setCreatedServico(null);
    setSaving(false);
  }, []);

  return {
    saving,
    error,
    createdServico,
    createServico,
    reset,
  };
}
