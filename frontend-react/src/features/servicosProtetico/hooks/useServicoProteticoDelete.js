import { useCallback, useState } from 'react';
import { message } from 'antd';

import { excluirServicoProtetico } from '../servicosProteticoApi.js';

export function useServicoProteticoDelete() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const deleteServico = useCallback(async (servicoId) => {
    if (deleting) return false;
    setDeleting(true);
    setError('');

    try {
      await excluirServicoProtetico(servicoId);
      return true;
    } catch (err) {
      const nextError = err?.message || 'Falha ao excluir servico.';
      setError(nextError);
      message.error(nextError);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [deleting]);

  const reset = useCallback(() => {
    setError('');
    setDeleting(false);
  }, []);

  return {
    deleting,
    error,
    deleteServico,
    reset,
  };
}
