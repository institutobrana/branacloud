import { useEffect, useRef, useState } from 'react';
import { completeFirstAccess } from './firstAccessApi.js';
import { buildFirstAccessPayload, validateFirstAccessValues } from './firstAccessValidation.js';

export function useCompleteFirstAccess({ token, refreshSession, onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inFlightRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (inFlightRef.current) {
        inFlightRef.current.abort();
      }
    };
  }, []);

  const submit = async (values = {}) => {
    if (inFlightRef.current) {
      return null;
    }

    const validation = validateFirstAccessValues(values);
    if (!validation.valid) {
      const firstError = validation.errors.senha || validation.errors.confirmaSenha;
      setError(firstError || 'Verifique os dados informados.');
      return null;
    }

    const controller = new AbortController();
    inFlightRef.current = controller;
    setLoading(true);
    setError('');

    try {
      const result = await completeFirstAccess(buildFirstAccessPayload(values), token, {
        signal: controller.signal,
      });
      const nextUser = await refreshSession();
      if (!nextUser || nextUser.setup_completed !== true) {
        throw new Error('Nao foi possivel validar a sessao apos concluir o primeiro acesso.');
      }
      if (typeof onSuccess === 'function') {
        onSuccess(nextUser, result);
      }
      return result;
    } catch (err) {
      if (err?.name === 'AbortError') {
        return null;
      }
      if (mountedRef.current) {
        setError(err?.message || 'Falha ao concluir o primeiro acesso.');
      }
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      inFlightRef.current = null;
    }
  };

  return {
    loading,
    error,
    submit,
    clearError: () => setError(''),
  };
}
