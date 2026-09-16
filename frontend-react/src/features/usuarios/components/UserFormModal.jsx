import { Alert, Checkbox, Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { listarPrestadoresUsuario, listarTiposUsuario, listarUnidadesUsuario, obterProximoCodigoUsuario, criarUsuario, atualizarUsuario, alterarSenhaUsuario } from '../services/usuariosApi.js';

const text = (value) => String(value ?? '').trim();
const idOf = (item) => Number(item?.row_id ?? item?.id ?? 0) || undefined;

export function UserFormModal({ open, mode, user, password, onCancel, onSaved }) {
  const [form] = Form.useForm();
  const [lookups, setLookups] = useState({ tipos: [], prestadores: [], unidades: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setError('');
    setLoading(true);
    Promise.all([listarTiposUsuario(password), listarPrestadoresUsuario(password), listarUnidadesUsuario(password), mode === 'novo' ? obterProximoCodigoUsuario(password) : Promise.resolve({ codigo: user?.codigo })])
      .then(([tipos, prestadores, unidades, next]) => {
        if (!active) return;
        setLookups({ tipos, prestadores, unidades });
        form.setFieldsValue({
          codigo: next?.codigo ?? user?.codigo ?? '', nome: user?.nome ?? '', apelido: user?.apelido ?? '', tipo_usuario: user?.tipo_usuario ?? '', email: user?.email ?? '',
          prestador_row_id: user?.prestador_id ?? user?.prestador_row_id, unidade_row_id: user?.unidade_atendimento_id ?? user?.unidade_row_id,
          inativar: mode === 'editar' ? user?.ativo === false : false, is_admin: user?.is_admin === true, forcar_troca_senha: user?.forcar_troca_senha === true, senha_atual: '', senha: '', confirma_senha: '',
        });
      })
      .catch((err) => { if (active) setError(err?.message || 'Falha ao carregar o formulário.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, mode, user, password, form]);

  const submit = async (values) => {
    setError(''); setLoading(true);
    try {
      const common = { nome: text(values.nome), apelido: text(values.apelido) || null, tipo_usuario: values.tipo_usuario || null, email: text(values.email) || null, prestador_row_id: values.prestador_row_id || null, unidade_row_id: values.unidade_row_id || null, forcar_troca_senha: Boolean(values.forcar_troca_senha), is_admin: Boolean(values.is_admin) };
      if (mode === 'novo') await criarUsuario({ ...common, codigo: Number(values.codigo) || null, senha: values.senha, confirma_senha: values.confirma_senha }, password);
      else {
        const hasPasswordChange = Boolean(values.senha_atual || values.senha || values.confirma_senha);
        if (hasPasswordChange) {
          await alterarSenhaUsuario({
            usuario: text(user.nome),
            codigo: Number(user.codigo) || null,
            senha_atual: values.senha_atual || '',
            nova_senha: values.senha || '',
            confirma_senha: values.confirma_senha || '',
          }, password);
        }
        await atualizarUsuario(user.id, { ...common, ativo: values.inativar !== true }, password);
      }
      onSaved();
    } catch (err) { setError(err?.message || 'Falha ao salvar usuário.'); } finally { setLoading(false); }
  };

  return <Modal className="usuarios-user-form-modal" open={open} title={mode === 'novo' ? 'Novo usuário' : 'Alterar usuário'} onCancel={onCancel} onOk={() => form.submit()} okText="Gravar" cancelText="Cancelar" confirmLoading={loading} destroyOnClose>
    {error ? <Alert type="error" showIcon message={error} /> : null}
    <Form form={form} layout="vertical" onFinish={submit} disabled={loading}>
      <div className="usuarios-user-form-grid">
        <Form.Item label="Nome do usuário" name="nome" rules={[{ required: true, message: 'Informe o nome.' }]}><Input /></Form.Item>
        <Form.Item label="Apelido" name="apelido"><Input /></Form.Item>
        <Form.Item label="Tipo do usuário" name="tipo_usuario"><Select allowClear options={lookups.tipos.map((x) => ({ value: x.descricao, label: x.descricao }))} /></Form.Item>
        <Form.Item label="E-mail" name="email" rules={[{ type: 'email', message: 'Informe um e-mail válido.' }]}><Input /></Form.Item>
        <Form.Item label="Associar a prestador" name="prestador_row_id"><Select allowClear options={lookups.prestadores.map((x) => ({ value: idOf(x), label: text(x.nome || x.apelido || x.descricao) }))} /></Form.Item>
        <Form.Item label="Unidade de atendimento" name="unidade_row_id"><Select allowClear options={lookups.unidades.map((x) => ({ value: idOf(x), label: text(x.nome || x.descricao) }))} /></Form.Item>
        {mode === 'editar' ? <Form.Item label="Senha atual" name="senha_atual" rules={[({ getFieldValue }) => ({ validator(_, value) { const next = getFieldValue('senha'); const confirm = getFieldValue('confirma_senha'); return !next && !confirm || value ? Promise.resolve() : Promise.reject(new Error('Informe a senha atual.')); } })]}><Input.Password autoComplete="current-password" /></Form.Item> : null}
        <Form.Item label="Nova senha" name="senha" rules={mode === 'novo' ? [{ required: true, min: 6, message: 'A senha deve ter ao menos 6 caracteres.' }] : [({ getFieldValue }) => ({ validator(_, value) { const atual = getFieldValue('senha_atual'); return !atual && !value ? Promise.resolve() : value && value.length >= 6 ? Promise.resolve() : Promise.reject(new Error('A senha deve ter ao menos 6 caracteres.')); } })]}><Input.Password autoComplete="new-password" /></Form.Item>
        <Form.Item label="Confirmação" name="confirma_senha" dependencies={['senha']} rules={mode === 'novo' ? [{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { return !value || value === getFieldValue('senha') ? Promise.resolve() : Promise.reject(new Error('As senhas não conferem.')); } })] : [({ getFieldValue }) => ({ validator(_, value) { const next = getFieldValue('senha'); return !next && !value || value === next ? Promise.resolve() : Promise.reject(new Error('As senhas não conferem.')); } })]}><Input.Password autoComplete="new-password" /></Form.Item>
      </div>
      <div className="usuarios-user-form-switches"><Form.Item name="forcar_troca_senha" valuePropName="checked" noStyle><Checkbox>Alterar senha no próximo login</Checkbox></Form.Item><Form.Item name="inativar" valuePropName="checked" noStyle><Checkbox>Inativar usuário</Checkbox></Form.Item><Form.Item name="is_admin" valuePropName="checked" noStyle><Checkbox>Administrador</Checkbox></Form.Item></div>
    </Form>
  </Modal>;
}
