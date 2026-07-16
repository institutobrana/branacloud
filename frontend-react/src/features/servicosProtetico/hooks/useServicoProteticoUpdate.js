import { useCallback, useState } from 'react';
import { message } from 'antd';

import { alterarServicoProtetico } from '../servicosProteticoApi.js';

export function useServicoProteticoUpdate() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [updatedServico, setUpdatedServico] = useState(null);

  const updateServico = useCallback(async (servicoId, payload) => {
    if (saving) return null;
    setSaving(true);
    setError('');
    setUpdatedServico(null);

    try {
      const result = await alterarServicoProtetico(servicoId, payload);
      setUpdatedServico(result);
      return result;
    } catch (err) {
      const nextError = err?.message || 'Falha ao atualizar servico.';
      setError(nextError);
      message.error(nextError);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const reset = useCallback(() => {
    setError('');
    setUpdatedServico(null);
    setSaving(false);
  }, []);

  return {
    saving,
    error,
    updatedServico,
    updateServico,
    reset,
  };
}
