import { Alert, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { atualizarEtiquetaModelo, criarEtiquetaModelo, listarEtiquetasArquivos, listarEtiquetasPadroes } from '../api/etiquetasApi.js';
import { EMPTY_ETIQUETA_DRAFT } from '../utils/etiquetaDefaults.js';
import { EtiquetaModeloForm } from '../components/EtiquetaModeloForm.jsx';
import { EtiquetaLayoutPreview } from '../components/EtiquetaLayoutPreview.jsx';

export function EtiquetaModeloModal({ open, mode = 'create', model = null, onCancel, onCreated, onUpdated }) {
  const [values, setValues] = useState(EMPTY_ETIQUETA_DRAFT); const [files, setFiles] = useState([]); const [patterns, setPatterns] = useState([]); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { if (!open) return; setValues(mode === 'edit' && model ? { ...EMPTY_ETIQUETA_DRAFT, ...model } : EMPTY_ETIQUETA_DRAFT); setError(''); Promise.all([listarEtiquetasArquivos(), listarEtiquetasPadroes()]).then(([f, p]) => { setFiles(f); setPatterns(p); }).catch(() => setError('Não foi possível carregar as opções do modelo.')); }, [open, mode, model]);
  const submit = async () => { if (!values.nome.trim() || !values.modelo_documento_id) { setError('Informe o nome e o arquivo de modelo.'); return; } setSaving(true); try { const payload = { ...values, nome: values.nome.trim() }; if (mode === 'edit') { const updated = await atualizarEtiquetaModelo(model?.id, payload); onUpdated?.(updated); } else { const created = await criarEtiquetaModelo(payload); onCreated?.(created); } } catch (err) { setError(err.message || (mode === 'edit' ? 'Não foi possível atualizar o modelo.' : 'Não foi possível criar o modelo.')); } finally { setSaving(false); } };
  return <Modal open={open} title={mode === 'edit' ? 'Altera modelo de etiqueta' : 'Novo modelo de etiqueta'} centered width={780} onCancel={onCancel} maskClosable={false} destroyOnClose footer={[<button key="cancel" type="button" className="etiqueta-modal-cancel" onClick={onCancel} disabled={saving}>Cancela</button>, <button key="ok" type="button" className="etiqueta-modal-ok" onClick={() => void submit()} disabled={saving}>Ok</button>]}><>{error ? <Alert type="error" showIcon message={error} /> : null}<div className="etiqueta-modelo-modal-layout"><EtiquetaModeloForm values={values} files={files} patterns={patterns} onChange={(key, value) => setValues((current) => typeof key === 'object' ? { ...current, ...key } : { ...current, [key]: value })} /><EtiquetaLayoutPreview values={values} /></div></></Modal>;
}
