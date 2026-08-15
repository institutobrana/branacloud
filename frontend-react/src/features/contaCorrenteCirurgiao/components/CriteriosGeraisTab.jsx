import { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { listarCategoriasContaCirurgiao, listarGruposContaCirurgiao } from '../contaCorrenteCirurgiaoApi.js';
import {
  CONTA_CORRENTE_DATE_FORMATS,
  normalizeContaCorrenteDateInput,
} from '../dateParsing.js';

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

function createDefaultDateRange() {
  const today = dayjs();
  return {
    start: today.startOf('month'),
    end: today,
  };
}

function parseDateInput(value) {
  const normalized = normalizeContaCorrenteDateInput(value);
  return normalized && normalized.isValid() ? normalized : null;
}

function finalizeDateInput(value, reference = dayjs()) {
  const normalized = normalizeContaCorrenteDateInput(value, reference);
  return normalized && normalized.isValid() ? normalized : null;
}

function selectDatePickerValue(event) {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) return;
  requestAnimationFrame(() => {
    input.select();
  });
}

function makeDatePickerHandlers(set, field) {
  return {
    onChange: (value) => set(field, parseDateInput(value)),
    onKeyDown: (event) => {
      if (event.key !== 'Tab') return;
      const normalized = finalizeDateInput(event?.currentTarget?.value, dayjs());
      if (normalized) {
        set(field, normalized);
      }
    },
    onBlur: (event) => {
      const normalized = finalizeDateInput(event?.target?.value, dayjs());
      if (normalized) {
        set(field, normalized);
      }
    },
    onFocus: selectDatePickerValue,
    onClick: selectDatePickerValue,
  };
}

function DatePickerField({ value, disabled, onChange }) {
  const containerRef = useRef(null);
  const valueRef = useRef(value);
  const [renderSeed, setRenderSeed] = useState(0);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const input = root.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return undefined;

    const commit = () => {
      const rawValue = input.value;
      const normalized = finalizeDateInput(rawValue, dayjs());
      if (normalized) {
        const normalizedText = normalized.format('DD/MM/YYYY');
        if (rawValue !== normalizedText) {
          onChange(null);
          setTimeout(() => {
            onChange(normalized);
            setRenderSeed((current) => current + 1);
          }, 0);
          return;
        }
        onChange(normalized);
      }
    };

    const handleFocus = () => {
      requestAnimationFrame(() => {
        input.select();
      });
    };

    const handleClick = () => {
      requestAnimationFrame(() => {
        input.select();
      });
    };

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      setTimeout(commit, 50);
    };

    const handleBlur = () => {
      setTimeout(commit, 50);
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('click', handleClick);
    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('click', handleClick);
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('blur', handleBlur);
    };
  }, [disabled, onChange, value]);

  return (
    <div ref={containerRef} className="pesquisa-fluxo-caixa-criterios-date-field">
        <DatePicker
          key={renderSeed}
          value={value}
          format={CONTA_CORRENTE_DATE_FORMATS}
          disabled={disabled}
          preserveInvalidOnBlur
          onChange={(nextValue) => onChange(parseDateInput(nextValue))}
      />
    </div>
  );
}

export function CriteriosGeraisTab({ surgeonOptions = [], initialSurgeonId = null, onStateChange }) {
  const defaultDates = useMemo(() => createDefaultDateRange(), []);
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
    periodoVencimentoInicio: defaultDates.start,
    periodoVencimentoFim: defaultDates.end,
    periodoLancamentoEnabled: false,
    periodoLancamentoInicio: defaultDates.start,
    periodoLancamentoFim: defaultDates.end,
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
    if (typeof onStateChange === 'function') {
      onStateChange({
        ...state,
        groupOptions,
        categoryOptions,
      });
    }
  }, [categoryOptions, groupOptions, onStateChange, state]);

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
          <DatePickerField
            value={state.periodoVencimentoInicio}
            disabled={!state.periodoVencimentoEnabled}
            onChange={(nextValue) => set('periodoVencimentoInicio', nextValue)}
          />
          <span className="pesquisa-fluxo-caixa-criterios-date-separator">até</span>
          <DatePickerField
            value={state.periodoVencimentoFim}
            disabled={!state.periodoVencimentoEnabled}
            onChange={(nextValue) => set('periodoVencimentoFim', nextValue)}
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
          <DatePickerField
            value={state.periodoLancamentoInicio}
            disabled={!state.periodoLancamentoEnabled}
            onChange={(nextValue) => set('periodoLancamentoInicio', nextValue)}
          />
          <span className="pesquisa-fluxo-caixa-criterios-date-separator">até</span>
          <DatePickerField
            value={state.periodoLancamentoFim}
            disabled={!state.periodoLancamentoEnabled}
            onChange={(nextValue) => set('periodoLancamentoFim', nextValue)}
          />
        </div>
      </FieldRow>
    </div>
  );
}
