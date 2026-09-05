import { useCallback, useState } from 'react';
import { alterarSenhaInterna } from '../api/alterarSenhaInternaApi.js';
import { validateAlterarSenhaValues } from '../validators/alterarSenhaValidation.js';

export function useAlterarSenhaInterna() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = useCallback(async (values) => {
    const validation = validateAlterarSenhaValues(values);
    if (!validation.valid) {
      setError(Object.values(validation.errors)[0] || 'Verifique os dados informados.');
      return { success: false, status: 400 };
    }
    setError('');
    setLoading(true);
    try {
      await alterarSenhaInterna({
        senha_interna_atual: String(values.currentInternalPassword),
        nova_senha_interna: String(values.newInternalPassword),
        confirma_senha_interna: String(values.confirmInternalPassword),
      });
      return { success: true };
    } catch (err) {
      setError(err?.message || 'Falha ao alterar senha interna.');
      return { success: false, status: err?.status, code: err?.code };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, submit };
}
