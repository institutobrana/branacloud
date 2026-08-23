import { Alert, Button, DatePicker, Input, Select, Tabs } from 'antd';
import { flushSync } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import { BranaModal } from '../../../components/BranaModal.jsx';
import { normalizeContaCorrenteDateInput } from '../../contaCorrenteCirurgiao/dateParsing.js';
import { atualizarCredenciamento, criarCredenciamento } from '../prestadorCredenciamentosApi.js';
import { buildCredenciamentoCreatePayload } from '../utils/credenciamentoMappers.js';

const EMPTY_DRAFT = {
  convenio_row_id: null,
  prestador_row_id: null,
  inicio: '',
  fim: '',
  valor_us: '1,0000',
  aviso: '',
  observacoes: '',
};

function publicPrestadorId(item) {
  if (!item) return null;
  return item.is_system_prestador ? 0 : Number(item.row_id || item.id || 0) || null;
}

function selectDatePickerText(event) {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) return;
  requestAnimationFrame(() => input.select());
}

function focusRelativeFocusable(control, direction) {
  const root = control?.closest?.('.ant-modal-content') ?? document;
  const selectors = ['input:not([disabled])', 'button:not([disabled])', 'textarea:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(',');
  const focusables = Array.from(root.querySelectorAll?.(selectors) ?? []).filter((element) => element.offsetParent !== null || element === document.activeElement);
  const target = focusables[focusables.indexOf(control) + direction];
  target?.focus();
}

function CredenciamentoDateInput({ value, onChange }) {
  const containerRef = useRef(null);
  const draftValueRef = useRef('');
  const isEditingRef = useRef(false);
  const skipNextBlurCommitRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) draftValueRef.current = dayjs.isDayjs(value) ? value.format('DD/MM/YYYY') : String(value || '');
  }, [value]);

  useEffect(() => {
    const input = containerRef.current?.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return undefined;
    const handleInput = () => { draftValueRef.current = input.value; };
    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [value]);

  const commitDraft = () => {
    if (skipNextBlurCommitRef.current) {
      skipNextBlurCommitRef.current = false;
      return;
    }
    const input = containerRef.current?.querySelector('input');
    const raw = input instanceof HTMLInputElement ? input.value : draftValueRef.current;
    const normalized = normalizeContaCorrenteDateInput(raw);
    isEditingRef.current = false;
    flushSync(() => onChange(normalized || ''));
  };

  return (
    <div ref={containerRef}>
      <DatePicker
        value={value ? dayjs(value, 'DD/MM/YYYY', true) : null}
        format="DD/MM/YYYY"
        onChange={(nextValue) => {
          if (nextValue == null) {
            draftValueRef.current = '';
            onChange('');
            return;
          }
          if (!dayjs.isDayjs(nextValue)) return;
          draftValueRef.current = nextValue.format('DD/MM/YYYY');
          isEditingRef.current = false;
          onChange(nextValue.format('DD/MM/YYYY'));
        }}
        onFocus={(event) => { isEditingRef.current = true; selectDatePickerText(event); }}
        onClick={(event) => { isEditingRef.current = true; selectDatePickerText(event); }}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          skipNextBlurCommitRef.current = true;
          event.preventDefault();
          commitDraft();
          requestAnimationFrame(() => focusRelativeFocusable(event.target, event.shiftKey ? -1 : 1));
        }}
      />
    </div>
  );
}

export function CredenciamentoModal({ open, mode = 'create', record = null, initialPrestador, convenios, prestadores, onCancel, onSuccess }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [activeTab, setActiveTab] = useState('principal');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setDraft(mode === 'edit' && record ? {
      ...EMPTY_DRAFT,
      codigo: record.codigo || '',
      convenio_row_id: record.convenio_row_id ?? null,
      prestador_row_id: record.prestador_sistemico ? 0 : record.prestador_row_id,
      inicio: record.inicio || '',
      fim: record.fim || '',
      valor_us: record.valor_us || '',
      aviso: record.aviso || '',
      observacoes: record.observacoes || '',
    } : { ...EMPTY_DRAFT, prestador_row_id: publicPrestadorId(initialPrestador) });
    setActiveTab('principal');
    setError('');
    setSaving(false);
  }, [initialPrestador, mode, open, record]);

  useEffect(() => {
    if (open && draft.convenio_row_id == null && convenios.length) {
      setDraft((current) => ({ ...current, convenio_row_id: Number(convenios[0].row_id || convenios[0].id) || null }));
    }
  }, [convenios, draft.convenio_row_id, open]);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const currentPrestadorId = record?.prestador_sistemico ? 0 : Number(record?.prestador_row_id || 0);
  const prestadorOptions = prestadores.filter((item) => item.ativo !== false || (mode === 'edit' && (item.is_system_prestador ? 0 : Number(item.row_id || item.id)) === currentPrestadorId)).map((item) => ({
    value: item.is_system_prestador ? 0 : Number(item.row_id || item.id),
    label: item.is_system_prestador ? 'Clínica' : (item.apelido || item.nome),
  }));
  const convenioOptions = convenios.map((item) => ({ value: Number(item.row_id || item.id), label: item.nome }));

  const submit = async () => {
    if (!draft.convenio_row_id || draft.prestador_row_id == null || saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = buildCredenciamentoCreatePayload(draft);
      const result = mode === 'edit'
        ? await atualizarCredenciamento(record.id, payload)
        : await criarCredenciamento(payload);
      await onSuccess?.(result);
    } catch (nextError) {
      setError(nextError?.message || 'Falha ao criar credenciamento.');
      setSaving(false);
    }
  };

  const principal = (
    <div className="prestador-cred-form-tab">
      <label><span>Convênio</span><Select value={draft.convenio_row_id} options={convenioOptions} onChange={(value) => update('convenio_row_id', value)} placeholder="Selecione o convênio" /></label>
      <label><span>Prestador credenciado</span><Select value={draft.prestador_row_id} options={prestadorOptions} onChange={(value) => update('prestador_row_id', value)} placeholder="Selecione o prestador" /></label>
      <div className="prestador-cred-form-grid">
        <label><span>Código</span><Input value={draft.codigo || ''} maxLength={20} onChange={(event) => update('codigo', event.target.value)} /></label>
        <label><span>Vigência início</span><CredenciamentoDateInput value={draft.inicio} onChange={(value) => update('inicio', value)} /></label>
        <label><span>Vigência fim</span><CredenciamentoDateInput value={draft.fim} onChange={(value) => update('fim', value)} /></label>
        <label><span>Valor US</span><Input value={draft.valor_us} onChange={(event) => update('valor_us', event.target.value)} /></label>
      </div>
      <div className="prestador-cred-form-grid prestador-cred-readonly-grid">
        <label><span>Inclusão</span><Input className="prestador-cred-readonly-cyan" value={mode === 'edit' ? record?.inclusao || '' : ''} readOnly /></label>
        <label><span>Alteração</span><Input className="prestador-cred-readonly-cyan" value={mode === 'edit' ? record?.alteracao || '' : ''} readOnly /></label>
      </div>
    </div>
  );
  const details = (
    <div className="prestador-cred-form-tab prestador-cred-details-tab">
      <label><span>Alerta para atendimentos</span><Input.TextArea value={draft.aviso} onChange={(event) => update('aviso', event.target.value)} rows={5} /></label>
      <label><span>Observações</span><Input.TextArea value={draft.observacoes} onChange={(event) => update('observacoes', event.target.value)} rows={5} /></label>
    </div>
  );

  return (
    <BranaModal open={open} title={mode === 'edit' ? 'Altera credenciamento' : 'Novo credenciamento'} onCancel={onCancel} footer={null} width={680} rootClassName="prestador-cred-modal prestador-cred-new-modal">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[{ key: 'principal', label: 'Principal', children: principal }, { key: 'detalhes', label: 'Detalhes', children: details }]} />
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <div className="prestador-cred-modal-footer">
        <Button type="primary" onClick={() => void submit()} loading={saving} disabled={!draft.convenio_row_id || draft.prestador_row_id == null}>Ok</Button>
        <Button onClick={onCancel} disabled={saving}>Cancela</Button>
      </div>
    </BranaModal>
  );
}
