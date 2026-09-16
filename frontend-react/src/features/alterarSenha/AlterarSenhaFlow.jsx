import { useEffect } from 'react';
import { message } from 'antd';
import { AlterarSenhaInternaModal } from './components/AlterarSenhaInternaModal.jsx';
import { useAlterarSenhaInterna } from './hooks/useAlterarSenhaInterna.js';

export function AlterarSenhaFlow({ open, onClose }) {
  const state = useAlterarSenhaInterna();

  useEffect(() => {
    if (!open) state.setError('');
  }, [open]);

  const close = () => {
    state.setError('');
    onClose?.();
  };

  const handleSubmit = async (values) => {
    const result = await state.submit(values);
    if (!result.success) return;
    onClose?.();
    message.success('Senha interna alterada com sucesso.');
  };

  return <AlterarSenhaInternaModal open={open} loading={state.loading} error={state.error} onSubmit={handleSubmit} onCancel={close} />;
}
