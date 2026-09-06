import { Alert, Button, Tabs } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { ConvenioPrincipalTab } from './ConvenioPrincipalTab.jsx';
import { ConvenioDetalhesTab } from './ConvenioDetalhesTab.jsx';
import { useConvenioForm } from '../hooks/useConvenioForm.js';
import { alterarConvenio, criarConvenio } from '../conveniosPlanosApi.js';

const POST_FIELDS = ['codigo', 'codigo_ans', 'nome', 'razao_social', 'tipo_logradouro', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'cep', 'uf', 'tipo_fone1', 'telefone', 'contato1', 'tipo_fone2', 'telefone2', 'contato2', 'tipo_fone3', 'telefone3', 'contato3', 'tipo_fone4', 'telefone4', 'contato4', 'email', 'email_tecnico', 'homepage', 'cnpj', 'inscricao_estadual', 'inscricao_municipal', 'tipo_faturamento', 'observacoes', 'inativo'];
const OPTIONAL_INTEGER_FIELDS = new Set(['tipo_logradouro', 'tipo_fone1', 'tipo_fone2', 'tipo_fone3', 'tipo_fone4']);

export function ConvenioModal({ open, mode = 'new', record = null, activeTab, onTabChange, onClose, onSaved }) {
  const isDetails = activeTab === 'details';
  const convenioForm = useConvenioForm(open, record);
  const handleClose = () => { convenioForm.reset(); onClose(); };
  const handleSubmit = async () => {
    if (convenioForm.submitting) return;
    if (!String(convenioForm.form.nome || '').trim()) {
      convenioForm.setSubmitError('Informe o nome do convênio.');
      return;
    }
    convenioForm.setSubmitError('');
    convenioForm.setSubmitting(true);
    try {
      const payload = Object.fromEntries(POST_FIELDS.map((field) => [field, OPTIONAL_INTEGER_FIELDS.has(field) && convenioForm.form[field] === '' ? null : convenioForm.form[field]]));
      const saved = mode === 'edit' ? await alterarConvenio(record.row_id || record.id, payload) : await criarConvenio(payload);
      await onSaved?.(saved);
      onClose();
    } catch (error) {
      convenioForm.setSubmitError(error?.message || 'Falha ao criar convênio.');
    } finally {
      convenioForm.setSubmitting(false);
    }
  };
  return (
    <BranaModal
      open={open}
      title={mode === 'edit' ? 'Altera convênio' : 'Novo convênio'}
      centered
      width={560}
      keyboard={false}
      maskClosable
      destroyOnClose={false}
      onCancel={handleClose}
      footer={
        <div className="convenios-planos-convenio-modal-footer">
          {convenioForm.submitError ? <Alert className="convenios-planos-convenio-modal-submit-error" type="error" showIcon message={convenioForm.submitError} /> : null}
          <Button type="primary" loading={convenioForm.submitting} onClick={handleSubmit}>Ok</Button>
          <Button onClick={handleClose} disabled={convenioForm.submitting}>Cancela</Button>
        </div>
      }
      rootClassName="convenios-planos-convenio-modal-root"
    >
      <Tabs
        activeKey={isDetails ? 'details' : 'principal'}
        onChange={onTabChange}
        type="card"
        animated={false}
        destroyInactiveTabPane={false}
        className="convenios-planos-convenio-modal-tabs"
        items={[
          { key: 'principal', label: 'Principal', children: <ConvenioPrincipalTab form={convenioForm.form} options={convenioForm.options} loading={convenioForm.lookups.loading} error={convenioForm.lookups.error} cepLookupLoading={convenioForm.cepLookupLoading} cepLookupError={convenioForm.cepLookupError} lookupCep={convenioForm.lookupCep} onChange={convenioForm.updateField} /> },
          { key: 'details', label: 'Detalhes', children: <ConvenioDetalhesTab form={convenioForm.form} onChange={convenioForm.updateField} /> },
        ]}
      />
    </BranaModal>
  );
}
