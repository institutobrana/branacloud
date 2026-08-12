import { useEffect, useMemo, useState } from 'react';

import { Alert, Button, Checkbox, DatePicker, Input, InputNumber, Modal, Select, Space, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';

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
    mesesExtras: 1,
    inclusao: today,
    ultimaAtualizacao: null,
  };
}

function formatWeekday(value) {
  const date = dayjs.isDayjs(value) ? value : dayjs(value);
  if (!date.isValid()) return '—';
  return date.locale('pt-br').format('ddd');
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

function TabForm({
  mode,
  state,
  onChange,
  categories,
  paymentOptions,
  situacoes,
}) {
  const categoryLabel = mode === 'debito' ? 'Categoria de Saída' : 'Categoria de Entrada';

  return (
    <div className="conta-corrente-cirurgiao-modal-form">
      <div className="conta-corrente-cirurgiao-modal-grid">
        <label className="conta-corrente-cirurgiao-modal-field">
          <span>Vencimento</span>
          <DatePicker
            value={state.dataVencimento}
            onChange={(value) => onChange('dataVencimento', value)}
            format="DD/MM/YYYY"
          />
        </label>
        <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly">
          <span>Dia da semana</span>
          <Typography.Text>{formatWeekday(state.dataVencimento)}</Typography.Text>
        </div>
        <label className="conta-corrente-cirurgiao-modal-field">
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
        <label className="conta-corrente-cirurgiao-modal-field">
          <span>Data do lançamento</span>
          <DatePicker
            value={state.dataLancamento}
            onChange={(value) => onChange('dataLancamento', value)}
            format="DD/MM/YYYY"
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--full">
          <span>Histórico</span>
          <Input
            value={state.historico}
            onChange={(event) => onChange('historico', event.target.value)}
            placeholder="Descreva o lançamento"
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field">
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
        <label className="conta-corrente-cirurgiao-modal-field">
          <span>Situação</span>
          <Select
            value={state.situacao}
            onChange={(value) => onChange('situacao', value)}
            options={situacoes}
          />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field">
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
        <label className="conta-corrente-cirurgiao-modal-field">
          <span>Nº documento</span>
          <Input value={state.documento} onChange={(event) => onChange('documento', event.target.value)} />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field">
          <span>Referência</span>
          <Input value={state.referencia} onChange={(event) => onChange('referencia', event.target.value)} />
        </label>
        <label className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--full">
          <span>Complemento</span>
          <Input value={state.complemento} onChange={(event) => onChange('complemento', event.target.value)} />
        </label>
        <div className="conta-corrente-cirurgiao-modal-row">
          <Checkbox checked={state.tributavel} onChange={(event) => onChange('tributavel', event.target.checked)}>
            Tributável
          </Checkbox>
          <Checkbox checked={state.copiarMeses} onChange={(event) => onChange('copiarMeses', event.target.checked)}>
            Copiar lançamentos para próximos meses
          </Checkbox>
          <label className="conta-corrente-cirurgiao-modal-inline-spin">
            <span>Quantidade de meses</span>
            <InputNumber
              value={state.mesesExtras}
              min={1}
              disabled={!state.copiarMeses}
              onChange={(value) => onChange('mesesExtras', Number(value || 1))}
            />
          </label>
        </div>
        <div className="conta-corrente-cirurgiao-modal-grid conta-corrente-cirurgiao-modal-grid--meta">
          <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly">
            <span>Inclusão</span>
            <Typography.Text>{formatDateLabel(state.inclusao)}</Typography.Text>
          </div>
          <div className="conta-corrente-cirurgiao-modal-field conta-corrente-cirurgiao-modal-field--readonly">
            <span>Última atualização</span>
            <Typography.Text>{state.ultimaAtualizacao ? formatDateLabel(state.ultimaAtualizacao) : '—'}</Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsereLancamentoModal({ open, initialType, prestadorId, onClose }) {
  const [activeKey, setActiveKey] = useState(initialType || 'debito');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [situacoes, setSituacoes] = useState([{ value: 'Aberto', label: 'Aberto' }, { value: 'Efetivado', label: 'Efetivado' }]);
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
    setFormState({
      debito: createTabState(),
      credito: createTabState(),
    });
  }, [initialType, open]);

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
        setCategories(cats.map((item) => ({ value: item.id, label: item.nome })));
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

  const onChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [field]: value,
      },
    }));
  };

  const validationMessage = useMemo(() => {
    if (!currentState.historico.trim()) return 'Informe o histórico.';
    if (currentState.valor == null || Number(currentState.valor) <= 0) return 'Informe um valor válido.';
    if (!currentState.categoriaId) return 'Selecione uma categoria.';
    return '';
  }, [currentState.categoriaId, currentState.historico, currentState.valor]);

  const handleOk = () => {
    if (validationMessage) {
      setError(validationMessage);
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('Persistência ainda não implementada nesta etapa.');
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title="Insere lançamento"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancela
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
      width={980}
      destroyOnClose
      maskClosable={false}
      keyboard
      afterOpenChange={(visible) => {
        if (!visible) {
          setError('');
          setSuccess('');
        }
      }}
      className="conta-corrente-cirurgiao-modal"
      styles={{
        body: {
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
        },
      }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {error ? <Alert type="error" message={error} showIcon /> : null}
        {success ? <Alert type="success" message={success} showIcon /> : null}
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key);
            setError('');
            setSuccess('');
          }}
          items={[
            {
              key: 'debito',
              label: 'Débito',
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
                  categories={activeKey === 'debito' ? categories : []}
                  paymentOptions={paymentOptions}
                  situacoes={situacoes}
                />
              ),
            },
            {
              key: 'credito',
              label: 'Crédito',
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
                  categories={activeKey === 'credito' ? categories : []}
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
