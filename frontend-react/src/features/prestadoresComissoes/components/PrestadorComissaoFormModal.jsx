import { Alert, Button, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { DatePickerEntry } from '../../prestadores/components/prestadorForm/PrestadorPrincipalTab.jsx';
import { atualizarComissao, criarComissao, listarEspecialidadesAtivas, listarProcedimentosGenericos } from '../prestadorComissoesApi.js';
import { buildPrestadorComissaoCreatePayload, formatPrestadorComissaoEditRepasse } from '../utils/prestadorComissaoMappers.js';

function publicPrestadorId(item) {
  return item?.is_system_prestador ? 0 : Number(item?.row_id || item?.id || 0) || null;
}

function today() {
  return dayjs();
}

export function PrestadorComissaoFormModal({ open, mode = 'create', item = null, filters, convenios, prestadores, onCancel, onSuccess }) {
  const [draft, setDraft] = useState({ convenio_row_id: null, prestador_row_id: null, especialidade_row_id: null, especialidade: '', procedimento_generico_id: null, vigencia: today(), tipo_repasse_codigo: 1, repasse: '0,00' });
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const activePrestadores = useMemo(() => prestadores.filter((entry) => entry.is_system_prestador || (entry.ativo !== false && entry.inativo !== true)), [prestadores]);
  const historicalPrestador = mode === 'edit' && item && !activePrestadores.some((entry) => publicPrestadorId(entry) === Number(item.prestador_row_id)) && item.prestador_row_id != null
    ? [{ row_id: Number(item.prestador_row_id), nome: item.prestador_nome, apelido: item.prestador_nome, inativo: true }] : [];
  const prestadorOptions = [...activePrestadores, ...historicalPrestador].map((entry) => ({ value: publicPrestadorId(entry), label: entry.is_system_prestador ? 'Clínica' : (entry.apelido || entry.nome) }));
  const historicalConvenio = mode === 'edit' && item && !convenios.some((entry) => Number(entry.row_id || entry.id) === Number(item.convenio_row_id)) && item.convenio_row_id
    ? [{ row_id: Number(item.convenio_row_id), nome: item.convenio_nome }] : [];
  const convenioOptions = [...convenios, ...historicalConvenio].map((entry) => ({ value: Number(entry.row_id || entry.id), label: entry.nome }));
  const specialtyOptions = [...especialidades, ...(mode === 'edit' && item?.especialidade_row_id && !especialidades.some((entry) => Number(entry.id) === Number(item.especialidade_row_id)) ? [{ id: item.especialidade_row_id, descricao: item.especialidade }] : [])]
    .filter((entry) => entry.id && entry.descricao).map((entry) => ({ value: Number(entry.id), label: entry.descricao }));
  const procedureOptions = [...procedimentos, ...(mode === 'edit' && item?.procedimento_generico_id && !procedimentos.some((entry) => Number(entry.id) === Number(item.procedimento_generico_id)) ? [{ id: item.procedimento_generico_id, descricao: item.procedimento_generico_nome }] : [])]
    .filter((entry) => entry.id && entry.descricao).map((entry) => ({ value: Number(entry.id), label: entry.descricao }));

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && item) {
      setDraft({ convenio_row_id: Number(item.convenio_row_id) || null, prestador_row_id: Number(item.prestador_row_id ?? 0), especialidade_row_id: Number(item.especialidade_row_id) || null, especialidade: item.especialidade || '', procedimento_generico_id: Number(item.procedimento_generico_id) || null, vigencia: item.vigencia ? dayjs(item.vigencia, 'DD/MM/YYYY') : null, tipo_repasse_codigo: Number(item.tipo_repasse_codigo) === 2 ? 2 : 1, repasse: formatPrestadorComissaoEditRepasse(item) });
    } else {
      const filteredConvenio = filters?.convenioRowId !== '__all__' ? Number(filters.convenioRowId) : null;
      const contextPrestador = publicPrestadorId(prestadores.find((entry) => publicPrestadorId(entry) === Number(filters?.prestadorRowId)));
      setDraft({ convenio_row_id: filteredConvenio || Number(convenios[0]?.row_id || convenios[0]?.id) || null, prestador_row_id: activePrestadores.some((entry) => publicPrestadorId(entry) === contextPrestador) ? contextPrestador : null, especialidade_row_id: null, especialidade: '', procedimento_generico_id: null, vigencia: today(), tipo_repasse_codigo: 1, repasse: '0,00' });
    }
    setError('');
    setSaving(false);
  }, [activePrestadores, convenios, filters, item, mode, open, prestadores]);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    Promise.allSettled([listarEspecialidadesAtivas(), listarProcedimentosGenericos()]).then(([esp, proc]) => {
      if (!alive) return;
      if (esp.status === 'fulfilled') setEspecialidades(esp.value);
      if (proc.status === 'fulfilled') setProcedimentos(proc.value);
      const failed = [esp, proc].find((result) => result.status === 'rejected');
      if (failed) setError(failed.reason?.message || 'Falha ao carregar auxiliares.');
    });
    return () => { alive = false; };
  }, [open]);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const submit = async () => {
    if (saving || !draft.convenio_row_id || draft.prestador_row_id == null) return;
    setSaving(true);
    setError('');
    try {
      const payload = buildPrestadorComissaoCreatePayload(draft);
      const result = mode === 'edit' ? await atualizarComissao(item.id, payload) : await criarComissao(payload);
      await onSuccess?.(result);
    } catch (nextError) {
      setError(nextError?.message || `Falha ao ${mode === 'edit' ? 'alterar' : 'criar'} fator de comissão.`);
      setSaving(false);
    }
  };

  return (
    <BranaModal open={open} title={mode === 'edit' ? 'Altera fator de comissão' : 'Novo fator de comissão'} onCancel={onCancel} footer={null} width={680} rootClassName="prestador-com-modal prestador-com-new-modal">
      <div className="prestador-com-form">
        <label><span>Convênio</span><Select value={draft.convenio_row_id} options={convenioOptions} onChange={(value) => update('convenio_row_id', value)} /></label>
        <label><span>Prestador</span><Select value={draft.prestador_row_id} options={prestadorOptions} onChange={(value) => update('prestador_row_id', value)} /></label>
        <label><span>Especialidade</span><Select allowClear value={draft.especialidade_row_id} options={[{ value: '', label: '' }, ...specialtyOptions]} onChange={(value, option) => setDraft((current) => ({ ...current, especialidade_row_id: value || null, especialidade: value ? option?.label || '' : '' }))} /></label>
        <label><span>Procedimento genérico</span><Select allowClear value={draft.procedimento_generico_id} options={procedureOptions} onChange={(value) => update('procedimento_generico_id', value || null)} /></label>
        <div className="prestador-com-form-rate-row">
          <label><span>Início da vigência</span><DatePickerEntry value={draft.vigencia} onChange={(value) => update('vigencia', value)} /></label>
          <label><span>Tipo de repasse</span><Select value={draft.tipo_repasse_codigo} options={[{ value: 1, label: '% sobre valor' }, { value: 2, label: 'Valor fixo' }]} onChange={(value) => update('tipo_repasse_codigo', value)} /></label>
          <label><span>Valor de repasse</span><Input value={draft.repasse} onChange={(event) => update('repasse', event.target.value)} /></label>
        </div>
        <div className="prestador-com-readonly-grid">
          <label><span>Inclusão</span><Input className="prestador-com-readonly-cyan" value={mode === 'edit' ? item?.inclusao || '' : ''} readOnly /></label>
          <label><span>Alteração</span><Input className="prestador-com-readonly-cyan" value={mode === 'edit' ? item?.alteracao || '' : ''} readOnly /></label>
        </div>
        {error ? <Alert type="error" message={error} showIcon /> : null}
        <div className="prestador-com-form-footer"><Button type="primary" loading={saving} disabled={!draft.convenio_row_id || draft.prestador_row_id == null} onClick={() => void submit()}>Ok</Button><Button disabled={saving} onClick={onCancel}>Cancela</Button></div>
      </div>
    </BranaModal>
  );
}
