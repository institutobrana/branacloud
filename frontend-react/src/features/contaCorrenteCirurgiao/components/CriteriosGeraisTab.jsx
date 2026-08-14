import { useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, Select } from 'antd';
import { listarCategoriasContaCirurgiao, listarGruposContaCirurgiao } from '../contaCorrenteCirurgiaoApi.js';

const tipoLancamentoOptions = [
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
];

const tipoGrupoOptions = [
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'profissional', label: 'Profissional' },
];

function FieldRow({ label, checked, onCheckedChange, children, className = '' }) {
  return (
    <div className={`pesquisa-fluxo-caixa-criterios-row ${className}`.trim()}>
      <label className="pesquisa-fluxo-caixa-criterios-check">
        <Checkbox checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
      </label>
      <div className="pesquisa-fluxo-caixa-criterios-label">{label}</div>
      <div className="pesquisa-fluxo-caixa-criterios-control">{children}</div>
    </div>
  );
}

export function CriteriosGeraisTab({ surgeonOptions = [], initialSurgeonId = null }) {
  const [state, setState] = useState({
    contaCorrenteEnabled: true,
    contaCorrente: initialSurgeonId ?? null,
    tipoLancamentoEnabled: true,
    tipoLancamento: 'debito',
    grupoEnabled: false,
    grupo: null,
    tipoGrupoEnabled: true,
    tipoGrupo: 'pessoal',
    categoriaEnabled: false,
    categoria: null,
    periodoVencimentoEnabled: false,
    periodoVencimentoInicio: null,
    periodoVencimentoFim: null,
    periodoLancamentoEnabled: false,
    periodoLancamentoInicio: null,
    periodoLancamentoFim: null,
  });
  const [groupOptions, setGroupOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const emptyOptions = useMemo(() => [], []);
  const set = (key, value) => setState((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (state.contaCorrente == null && surgeonOptions.length) {
      setState((current) => ({ ...current, contaCorrente: surgeonOptions[0].value }));
    }
  }, [surgeonOptions, state.contaCorrente]);

  useEffect(() => {
    let active = true;
    setLoadingGroups(true);
    listarGruposContaCirurgiao()
      .then((rows) => {
        if (!active) return;
        setGroupOptions(rows);
      })
      .catch(() => {
        if (!active) return;
        setGroupOptions([]);
      })
      .finally(() => {
        if (active) setLoadingGroups(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const tipo = state.tipoLancamento === 'credito' ? 'Entrada' : 'Saída';
    setLoadingCategories(true);
    listarCategoriasContaCirurgiao(tipo)
      .then((rows) => {
        if (!active) return;
        setCategoryOptions(rows);
        setState((current) => (
          current.categoria != null && rows.some((item) => String(item.value) === String(current.categoria))
            ? current
            : { ...current, categoria: null }
        ));
      })
      .catch(() => {
        if (!active) return;
        setCategoryOptions([]);
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });
    return () => {
      active = false;
    };
  }, [state.tipoLancamento]);

  return (
    <div className="pesquisa-fluxo-caixa-criterios">
      <FieldRow
        label="Conta corrente"
        checked={state.contaCorrenteEnabled}
        onCheckedChange={(checked) => set('contaCorrenteEnabled', checked)}
      >
        <Select
          value={state.contaCorrente}
          onChange={(value) => set('contaCorrente', value ?? null)}
          options={surgeonOptions}
          disabled={!state.contaCorrenteEnabled}
          className="pesquisa-fluxo-caixa-criterios-select"
          placeholder={surgeonOptions.length ? 'Selecione' : 'Carregando'}
          allowClear
          showSearch
          optionFilterProp="label"
        />
      </FieldRow>

      <FieldRow
        label="Tipo de lançamento"
        checked={state.tipoLancamentoEnabled}
        onCheckedChange={(checked) => set('tipoLancamentoEnabled', checked)}
      >
        <Select
          value={state.tipoLancamento}
          onChange={(value) => set('tipoLancamento', value)}
          options={tipoLancamentoOptions}
          disabled={!state.tipoLancamentoEnabled}
          className="pesquisa-fluxo-caixa-criterios-select"
        />
      </FieldRow>

      <FieldRow label="Grupo" checked={state.grupoEnabled} onCheckedChange={(checked) => set('grupoEnabled', checked)}>
        <Select
          value={state.grupo}
          onChange={(value) => set('grupo', value ?? null)}
          options={groupOptions}
          placeholder="Selecione"
          disabled={!state.grupoEnabled}
          allowClear
          className="pesquisa-fluxo-caixa-criterios-select"
          showSearch
          optionFilterProp="label"
          loading={loadingGroups}
        />
      </FieldRow>

      <FieldRow
        label="Tipo de grupo"
        checked={state.tipoGrupoEnabled}
        onCheckedChange={(checked) => set('tipoGrupoEnabled', checked)}
      >
        <Select
          value={state.tipoGrupo}
          onChange={(value) => set('tipoGrupo', value)}
          options={tipoGrupoOptions}
          disabled={!state.tipoGrupoEnabled}
          className="pesquisa-fluxo-caixa-criterios-select"
        />
      </FieldRow>

      <FieldRow
        label="Categoria"
        checked={state.categoriaEnabled}
        onCheckedChange={(checked) => set('categoriaEnabled', checked)}
      >
        <Select
          value={state.categoria}
          onChange={(value) => set('categoria', value ?? null)}
          options={categoryOptions}
          placeholder="Selecione"
          disabled={!state.categoriaEnabled}
          allowClear
          className="pesquisa-fluxo-caixa-criterios-select"
          showSearch
          optionFilterProp="label"
          loading={loadingCategories}
        />
      </FieldRow>

      <FieldRow
        label="Período de vencimento"
        checked={state.periodoVencimentoEnabled}
        onCheckedChange={(checked) => set('periodoVencimentoEnabled', checked)}
        className="pesquisa-fluxo-caixa-criterios-row--dates"
      >
        <div className="pesquisa-fluxo-caixa-criterios-dates">
          <DatePicker
            value={state.periodoVencimentoInicio}
            onChange={(value) => set('periodoVencimentoInicio', value)}
            format="DD/MM/YYYY"
            disabled={!state.periodoVencimentoEnabled}
          />
          <span className="pesquisa-fluxo-caixa-criterios-date-separator">até</span>
          <DatePicker
            value={state.periodoVencimentoFim}
            onChange={(value) => set('periodoVencimentoFim', value)}
            format="DD/MM/YYYY"
            disabled={!state.periodoVencimentoEnabled}
          />
        </div>
      </FieldRow>

      <FieldRow
        label="Período de lançamento"
        checked={state.periodoLancamentoEnabled}
        onCheckedChange={(checked) => set('periodoLancamentoEnabled', checked)}
        className="pesquisa-fluxo-caixa-criterios-row--dates"
      >
        <div className="pesquisa-fluxo-caixa-criterios-dates">
          <DatePicker
            value={state.periodoLancamentoInicio}
            onChange={(value) => set('periodoLancamentoInicio', value)}
            format="DD/MM/YYYY"
            disabled={!state.periodoLancamentoEnabled}
          />
          <span className="pesquisa-fluxo-caixa-criterios-date-separator">até</span>
          <DatePicker
            value={state.periodoLancamentoFim}
            onChange={(value) => set('periodoLancamentoFim', value)}
            format="DD/MM/YYYY"
            disabled={!state.periodoLancamentoEnabled}
          />
        </div>
      </FieldRow>
    </div>
  );
}
