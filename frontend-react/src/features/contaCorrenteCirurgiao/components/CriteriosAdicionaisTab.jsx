import { useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, Select } from 'antd';
import { listarFormasPagamentoContaCirurgiao } from '../contaCorrenteCirurgiaoApi.js';

const situacaoOptions = [
  { value: 'Aberto', label: 'Aberto' },
  { value: 'Efetivado', label: 'Efetivado' },
];

function FieldRow({ label, checked, onCheckedChange, children }) {
  return (
    <div className="pesquisa-fluxo-caixa-adicionais-row">
      <label className="pesquisa-fluxo-caixa-adicionais-check">
        <Checkbox checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
      </label>
      <div className="pesquisa-fluxo-caixa-adicionais-label">{label}</div>
      <div className="pesquisa-fluxo-caixa-adicionais-control">{children}</div>
    </div>
  );
}

export function CriteriosAdicionaisTab({ onStateChange }) {
  const [state, setState] = useState({
    tributaveis: false,
    nTributaveis: false,
    situacaoEnabled: false,
    situacao: 'Aberto',
    formaPagamentoEnabled: false,
    formaPagamento: null,
    referenciaEnabled: false,
    referencia: '',
    complementoEnabled: false,
    complemento: '',
    documentoEnabled: false,
    documento: '',
  });

  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const set = (key, value) => setState((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    let active = true;
    setLoadingPayments(true);
    listarFormasPagamentoContaCirurgiao()
      .then((rows) => {
        if (!active) return;
        const options = rows.map((item) => ({
          value: item.codigo ?? item.value ?? item.id ?? item.descricao ?? item.label,
          label: item.descricao ?? item.label ?? String(item.codigo ?? item.value ?? item.id ?? '').trim(),
        })).filter((item) => item.value != null && item.label);
        setPaymentOptions(options);
      })
      .catch(() => {
        if (!active) return;
        setPaymentOptions([]);
      })
      .finally(() => {
        if (active) setLoadingPayments(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof onStateChange === 'function') {
      onStateChange({
        ...state,
        paymentOptions,
      });
    }
  }, [onStateChange, paymentOptions, state]);

  return (
    <div className="pesquisa-fluxo-caixa-adicionais">
      <FieldRow label="Lançamentos tributáveis" checked={state.tributaveis} onCheckedChange={(checked) => set('tributaveis', checked)}>
        <div className="pesquisa-fluxo-caixa-adicionais-static" />
      </FieldRow>

      <FieldRow label="Lançamentos não tributáveis" checked={state.nTributaveis} onCheckedChange={(checked) => set('nTributaveis', checked)}>
        <div className="pesquisa-fluxo-caixa-adicionais-static" />
      </FieldRow>

      <FieldRow label="Situação do lançamento" checked={state.situacaoEnabled} onCheckedChange={(checked) => set('situacaoEnabled', checked)}>
        <Select
          value={state.situacao}
          onChange={(value) => set('situacao', value)}
          options={situacaoOptions}
          disabled={!state.situacaoEnabled}
          className="pesquisa-fluxo-caixa-adicionais-select"
        />
      </FieldRow>

      <FieldRow label="Forma de pagamento" checked={state.formaPagamentoEnabled} onCheckedChange={(checked) => set('formaPagamentoEnabled', checked)}>
        <Select
          value={state.formaPagamento}
          onChange={(value) => set('formaPagamento', value ?? null)}
          options={paymentOptions}
          disabled={!state.formaPagamentoEnabled}
          allowClear
          placeholder="Selecione"
          className="pesquisa-fluxo-caixa-adicionais-select"
          showSearch
          optionFilterProp="label"
          loading={loadingPayments}
        />
      </FieldRow>

      <FieldRow label="Referência" checked={state.referenciaEnabled} onCheckedChange={(checked) => set('referenciaEnabled', checked)}>
        <Input value={state.referencia} onChange={(event) => set('referencia', event.target.value)} disabled={!state.referenciaEnabled} />
      </FieldRow>

      <FieldRow label="Complemento" checked={state.complementoEnabled} onCheckedChange={(checked) => set('complementoEnabled', checked)}>
        <Input value={state.complemento} onChange={(event) => set('complemento', event.target.value)} disabled={!state.complementoEnabled} />
      </FieldRow>

      <FieldRow label="Nº documento" checked={state.documentoEnabled} onCheckedChange={(checked) => set('documentoEnabled', checked)}>
        <Input value={state.documento} onChange={(event) => set('documento', event.target.value)} disabled={!state.documentoEnabled} />
      </FieldRow>
    </div>
  );
}
