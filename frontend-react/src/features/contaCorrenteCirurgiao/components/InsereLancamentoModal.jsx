import { useEffect, useMemo, useState } from 'react';

import { Alert, Button, Checkbox, DatePicker, Input, InputNumber, Modal, Select, Space, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import {
  listarCategoriasContaCirurgiao,
  listarFormasPagamentoContaCirurgiao,
  listarSituacoesContaCirurgiao,
} from '../contaCorrenteCirurgiaoApi.js';

function createTabState() {
  const today = dayjs();
  return {
    dataVencimento: today,
    dataLancamento: today,
    valor: null,
    historico: '',
    categoriaId: null,
    situacao: 'Aberto',
    formaPagamento: null,
    documento: '',
    referencia: '',
    complemento: '',
    tributavel: false,
    copiarMeses: false,
    mesesExtras: 0,
    inclusao: today,
    ultimaAtualizacao: null,
  };
}

function formatWeekday(value) {
  const date = dayjs.isDayjs(value) ? value : dayjs(value);
  if (!date.isValid()) return '—';
  const weekday = date.locale('pt-br').format('dddd');
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatDateLabel(value) {
  const date = dayjs.isDayjs(value) ? value : dayjs(value);
  if (!date.isValid()) return '—';
  return date.format('DD/MM/YYYY');
}

function normalizeNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseDecimal(value) {
  if (value == null || value === '') return null;
  const raw = String(value).trim();
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function TabForm({ mode, state, onChange, categories, paymentOptions, situacoes }) {
  const categoryLabel = mode === 'debito' ? 'Categoria de Saída' : 'Categoria de Entrada';

  return (
    <div className="conta-corrente-cirurgiao-modal-form">
      <div className="conta-corrente-cirurgiao-modal-grid conta-corrente-cirurgiao-modal-grid--main">
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--w-date">
          <span>Vencimento</span>
          <DatePicker value={state.dataVencimento} onChange={(value) => onChange('dataVencimento', value)} format="DD/MM/YYYY" />
        </label>
        <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly conta-corrente-cirurgiao-modal-field--w-weekday">
          <span>Dia da semana</span>
          <span className="conta-corrente-cirurgiao-readonly-value">{formatWeekday(state.dataVencimento)}</span>
        </div>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--w-money">
          <span>Valor</span>
          <InputNumber
            value={state.valor}
            min={0}
            step={0.01}
            stringMode={false}
            controls={false}
            precision={2}
            onChange={(value) => onChange('valor', normalizeNumber(value))}
            placeholder="0,00"
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--w-date">
          <span>Data do lançamento</span>
          <DatePicker value={state.dataLancamento} onChange={(value) => onChange('dataLancamento', value)} format="DD/MM/YYYY" />
        </label>

        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--full">
          <span>Histórico</span>
          <Input value={state.historico} onChange={(event) => onChange('historico', event.target.value)} placeholder="Descreva o lançamento" />
        </label>

        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--category">
          <span>{categoryLabel}</span>
          <Select
            value={state.categoriaId}
            onChange={(value) => onChange('categoriaId', value ?? null)}
            placeholder={categories.length ? 'Selecione' : 'Carregando'}
            options={categories}
            showSearch
            optionFilterProp="label"
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--status">
          <span>Situação</span>
          <Select value={state.situacao} onChange={(value) => onChange('situacao', value)} options={situacoes} />
        </label>

        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--payment">
          <span>Forma de pagamento</span>
          <Select
            value={state.formaPagamento}
            onChange={(value) => onChange('formaPagamento', value ?? null)}
            options={paymentOptions}
            placeholder={paymentOptions.length ? 'Selecione' : 'Carregando'}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--doc conta-corrente-cirurgiao-modal-field--equal">
          <span>Nº documento</span>
          <Input value={state.documento} onChange={(event) => onChange('documento', event.target.value)} />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--ref conta-corrente-cirurgiao-modal-field--equal">
          <span>Referência</span>
          <Input value={state.referencia} onChange={(event) => onChange('referencia', event.target.value)} />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--complement conta-corrente-cirurgiao-modal-field--equal">
          <span>Complemento</span>
          <Input value={state.complemento} onChange={(event) => onChange('complemento', event.target.value)} />
        </label>

        <div className="conta-corrente-cirurgiao-modal-meta-row">
          <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly">
            <span>Inclusão</span>
            <span className="conta-corrente-cirurgiao-readonly-value">{formatDateLabel(state.inclusao)}</span>
          </div>
          <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly">
            <span>Última atualização</span>
            <span className="conta-corrente-cirurgiao-readonly-value">{state.ultimaAtualizacao ? formatDateLabel(state.ultimaAtualizacao) : '—'}</span>
          </div>
        </div>

        <div className="conta-corrente-cirurgiao-modal-row conta-corrente-cirurgiao-modal-row--compact">
          <Checkbox checked={state.tributavel} onChange={(event) => onChange('tributavel', event.target.checked)}>
            Tributável
          </Checkbox>
          <Checkbox checked={state.copiarMeses} onChange={(event) => onChange('copiarMeses', event.target.checked)}>
            Copiar lançamentos para próximos meses
          </Checkbox>
          <label className="conta-corrente-cirurgiao-modal-inline-spin">
            <span>Quantidade de meses</span>
            <InputNumber value={state.mesesExtras} min={0} disabled={!state.copiarMeses} onChange={(value) => onChange('mesesExtras', Number(value ?? 0))} />
          </label>
        </div>
      </div>
    </div>
  );
}

function LancamentoTabLabel({ children }) {
  return <span className="conta-corrente-cirurgiao-tab-label">{children}</span>;
}

function cloneTabState(source) {
  return {
    ...createTabState(),
    ...source,
  };
}

function buildStateFromLancamento(lancamento) {
  if (!lancamento) return null;
  const dataLancamento = dayjs(lancamento.data_lancamento || lancamento.dataLancamento || null);
  const dataVencimento = dayjs(lancamento.data_vencimento || lancamento.dataVencimento || null);
  const base = createTabState();
  return {
    ...base,
    dataLancamento: dataLancamento.isValid() ? dataLancamento : base.dataLancamento,
    dataVencimento: dataVencimento.isValid() ? dataVencimento : base.dataVencimento,
    valor: Number(lancamento.valor ?? 0) || null,
    historico: String(lancamento.historico ?? ''),
    categoriaId: Number(lancamento.categoria_id ?? 0) || null,
    situacao: String(lancamento.situacao ?? 'Aberto'),
    formaPagamento: lancamento.forma_pagamento ?? null,
    documento: String(lancamento.documento ?? ''),
    referencia: String(lancamento.referencia ?? ''),
    complemento: String(lancamento.complemento ?? ''),
    tributavel: Boolean(Number(lancamento.tributavel ?? 0)),
    copiarMeses: false,
    mesesExtras: 0,
    inclusao: dataLancamento.isValid() ? dataLancamento : base.inclusao,
    ultimaAtualizacao: lancamento.data_alteracao ? dayjs(lancamento.data_alteracao) : null,
  };
}

export function InsereLancamentoModal({ open, initialType, prestadorId, mode = 'create', lancamento = null, onClose, onSubmit }) {
  const [activeKey, setActiveKey] = useState(initialType || 'debito');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [situacoes, setSituacoes] = useState([
    { value: 'Aberto', label: 'Aberto' },
    { value: 'Efetivado', label: 'Efetivado' },
  ]);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [formState, setFormState] = useState({
    debito: createTabState(),
    credito: createTabState(),
  });

  useEffect(() => {
    if (!open) return;
    setActiveKey(initialType || 'debito');
    setError('');
    setSuccess('');
    setSaving(false);
    const seedState = mode === 'edit' && lancamento ? buildStateFromLancamento(lancamento) : null;
    if (seedState) {
      const key = initialType || (String(lancamento?.tipo || '').toLowerCase() === 'credito' ? 'credito' : 'debito');
      setActiveKey(key);
      setFormState({
        debito: key === 'debito' ? cloneTabState(seedState) : createTabState(),
        credito: key === 'credito' ? cloneTabState(seedState) : createTabState(),
      });
    } else {
      setFormState({
        debito: createTabState(),
        credito: createTabState(),
      });
    }
  }, [initialType, lancamento, mode, open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadingLookup(true);
    Promise.all([
      listarCategoriasContaCirurgiao(activeKey === 'credito' ? 'Entrada' : 'Saída'),
      listarFormasPagamentoContaCirurgiao(),
      listarSituacoesContaCirurgiao(),
    ])
      .then(([cats, payments, statuses]) => {
        if (!active) return;
        setCategories(cats.map((item) => ({ value: item.value, label: item.label })));
        setPaymentOptions(payments.map((item) => ({ value: item.codigo, label: item.descricao })));
        if (Array.isArray(statuses) && statuses.length) {
          setSituacoes(statuses.map((value) => ({ value, label: value })));
        }
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setPaymentOptions([]);
      })
      .finally(() => {
        if (active) setLoadingLookup(false);
      });

    return () => {
      active = false;
    };
  }, [activeKey, open]);

  const currentState = formState[activeKey];
  const currentTipo = activeKey === 'credito' ? 'credito' : 'debito';

  const validationMessage = useMemo(() => {
    if (!prestadorId) return 'Selecione um cirurgião antes de salvar o lançamento.';
    if (!currentState.historico.trim()) return 'Informe o histórico.';
    const parsedValue = parseDecimal(currentState.valor);
    if (parsedValue == null || parsedValue <= 0) return 'Informe um valor válido.';
    if (!currentState.categoriaId) return 'Selecione uma categoria.';
    if (currentState.copiarMeses) {
      const extras = Number(currentState.mesesExtras);
      if (!Number.isFinite(extras) || extras < 0) return 'Quantidade de meses extras inválida.';
    }
    return '';
  }, [currentState.categoriaId, currentState.copiarMeses, currentState.historico, currentState.valor, prestadorId]);

  const buildPayload = () => {
    const parsedValue = parseDecimal(currentState.valor) ?? 0;
    const extras = currentState.copiarMeses ? Math.max(0, Number(currentState.mesesExtras || 0)) : 0;
    return {
      categoria_id: Number(currentState.categoriaId || 0),
      historico: currentState.historico.trim(),
      valor: parsedValue,
      tipo: currentTipo,
      conta: 'CIRURGIAO',
      situacao: currentState.situacao || 'Aberto',
      forma_pagamento: currentState.formaPagamento || null,
      documento: currentState.documento.trim() || null,
      referencia: currentState.referencia.trim() || null,
      complemento: currentState.complemento.trim() || null,
      prestador_id: Number(prestadorId || 0) || null,
      tributavel: currentState.tributavel ? 1 : 0,
      parcelas: 1 + extras,
      data_lancamento: dayjs(currentState.dataLancamento).format('YYYY-MM-DD'),
      data_vencimento: dayjs(currentState.dataVencimento).format('YYYY-MM-DD'),
    };
  };

  const handleOk = async () => {
    if (saving) return;
    if (validationMessage) {
      setError(validationMessage);
      setSuccess('');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await onSubmit?.(buildPayload());
      setSuccess('');
      onClose?.({ saved: true });
    } catch (err) {
      setError(err?.message || 'Falha ao salvar lançamento.');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
    setSaving(false);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title={mode === 'edit' ? 'Altera lançamento' : 'Insere lançamento'}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancela
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk} loading={saving} disabled={saving}>
          {saving ? 'Salvando...' : 'OK'}
        </Button>,
      ]}
      width={760}
      destroyOnClose
      maskClosable={false}
      keyboard
      afterOpenChange={(visible) => {
        if (!visible) {
          setError('');
          setSuccess('');
          setSaving(false);
        }
      }}
      className="conta-corrente-cirurgiao-modal"
      styles={{
        body: {
          padding: '10px 12px 12px',
        },
      }}
    >
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        {error ? <Alert type="error" message={error} showIcon /> : null}
        {success ? <Alert type="success" message={success} showIcon /> : null}
        {!prestadorId ? <Alert type="warning" message="Selecione um cirurgião antes de salvar o lançamento." showIcon /> : null}
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key);
            setError('');
            setSuccess('');
          }}
          type="card"
          className="conta-corrente-cirurgiao-classic-tabs"
          items={[
            {
              key: 'debito',
              label: <LancamentoTabLabel>Débito</LancamentoTabLabel>,
              children: (
                <TabForm
                  mode="debito"
                  state={formState.debito}
                  onChange={(field, value) =>
                    setFormState((prev) => ({
                      ...prev,
                      debito: { ...prev.debito, [field]: value },
                    }))
                  }
                  categories={categories}
                  paymentOptions={paymentOptions}
                  situacoes={situacoes}
                />
              ),
            },
            {
              key: 'credito',
              label: <LancamentoTabLabel>Crédito</LancamentoTabLabel>,
              children: (
                <TabForm
                  mode="credito"
                  state={formState.credito}
                  onChange={(field, value) =>
                    setFormState((prev) => ({
                      ...prev,
                      credito: { ...prev.credito, [field]: value },
                    }))
                  }
                  categories={categories}
                  paymentOptions={paymentOptions}
                  situacoes={situacoes}
                />
              ),
            },
          ]}
        />
        {loadingLookup ? <Typography.Text type="secondary">Carregando dados auxiliares...</Typography.Text> : null}
      </Space>
    </Modal>
  );
}
