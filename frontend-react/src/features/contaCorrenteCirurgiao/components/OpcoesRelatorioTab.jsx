import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Radio, Select } from 'antd';

const REPORT_OPTION_CATALOG = [
  { key: 'categoria', label: 'Categoria' },
  { key: 'cirurgiao', label: 'Cirurgião' },
  { key: 'complemento', label: 'Complemento' },
  { key: 'credito', label: 'Crédito' },
  { key: 'data', label: 'Data' },
  { key: 'debito', label: 'Débito' },
  { key: 'grupo', label: 'Grupo' },
  { key: 'historico', label: 'Histórico' },
  { key: 'lancamento', label: 'Lançamento' },
  { key: 'numero_documento', label: 'Nº Documento' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'referencia', label: 'Referência' },
  { key: 'saldo', label: 'Saldo' },
];

const outputOptions = [
  { value: 'tela', label: 'Tela' },
  { value: 'pdf', label: 'PDF' },
  { value: 'html', label: 'HTML' },
  { value: 'rtf', label: 'RTF' },
  { value: 'xls', label: 'XLS' },
  { value: 'txt', label: 'TXT' },
  { value: 'csv', label: 'CSV' },
  { value: 'imprimir', label: 'Imprimir' },
];

const defaultFormState = {
  selectedFields: [],
  reportName: 'Relatório de contas do cirurgião',
  output: 'tela',
  orientation: 'retrato',
};

const allowedOutputValues = new Set(outputOptions.map((item) => item.value));
const allowedOrientations = new Set(['retrato', 'paisagem']);
const labelByKey = new Map(REPORT_OPTION_CATALOG.map((item) => [item.key, item.label]));
const keyByLabel = new Map(REPORT_OPTION_CATALOG.map((item) => [normalizeReportOptionText(item.label), item.key]));

function normalizeReportOptionText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizeReportOptionKey(value) {
  return String(value ?? '').trim().toLowerCase();
}

function resolveKeyFromPreference(value) {
  const normalized = normalizeReportOptionKey(value);
  if (!normalized) return '';
  if (labelByKey.has(normalized)) return normalized;
  return keyByLabel.get(normalizeReportOptionText(normalized)) || '';
}

function buildSelectionFromPreferences(initialPreferences) {
  const selectedFields = Array.isArray(initialPreferences?.selectedFields)
    ? initialPreferences.selectedFields.map((field) => resolveKeyFromPreference(field)).filter(Boolean)
    : [];

  const reportName = String(initialPreferences?.reportName ?? defaultFormState.reportName).trim() || defaultFormState.reportName;
  const outputRaw = String(initialPreferences?.output ?? defaultFormState.output).trim().toLowerCase();
  const outputValue = outputRaw === 'arquivo' ? 'pdf' : outputRaw;
  const orientationValue = normalizeReportOptionKey(initialPreferences?.orientation || defaultFormState.orientation);

  return {
    selectedFields,
    reportName,
    output: allowedOutputValues.has(outputValue) ? outputValue : defaultFormState.output,
    orientation: allowedOrientations.has(orientationValue) ? orientationValue : defaultFormState.orientation,
  };
}

function buildRows(items) {
  return items.map((item) => ({ key: item.key, nome: item.label }));
}

function moveItemToFront(items, value) {
  if (!value || !items.includes(value)) {
    return items;
  }

  return [value, ...items.filter((item) => item !== value)];
}

function findLabelByKey(key) {
  return labelByKey.get(key) || key;
}

function mergeState(base, updates) {
  return {
    ...base,
    ...updates,
    selectedFields: Array.isArray(updates.selectedFields) ? updates.selectedFields : base.selectedFields,
  };
}

export function OpcoesRelatorioTab({ onStateChange, initialPreferences = null, loadingPreferences = false }) {
  const resolvedPreferences = useMemo(() => buildSelectionFromPreferences(initialPreferences), [initialPreferences]);
  const [draftState, setDraftState] = useState(null);
  const [selectedDisponiveis, setSelectedDisponiveis] = useState([]);
  const [selectedSelecionados, setSelectedSelecionados] = useState([]);

  const currentState = draftState ?? resolvedPreferences ?? defaultFormState;
  const selecionados = Array.isArray(currentState.selectedFields) ? currentState.selectedFields : [];
  const nomeRelatorio = currentState.reportName || defaultFormState.reportName;
  const saida = currentState.output || defaultFormState.output;
  const orientacao = currentState.orientation || defaultFormState.orientation;
  const ordemAtual = selecionados[0] || '';

  useEffect(() => {
    if (loadingPreferences) {
      return;
    }
    setDraftState((current) => {
      if (current && current.selectedFields.join('|') === resolvedPreferences.selectedFields.join('|')
        && current.reportName === resolvedPreferences.reportName
        && current.output === resolvedPreferences.output
        && current.orientation === resolvedPreferences.orientation) {
        return current;
      }
      return resolvedPreferences;
    });
  }, [loadingPreferences, resolvedPreferences]);

  const rowsDisponiveis = useMemo(() => buildRows(REPORT_OPTION_CATALOG), []);
  const rowsSelecionados = useMemo(() => buildRows(REPORT_OPTION_CATALOG.filter((item) => selecionados.includes(item.key))), [selecionados]);
  const orderOptions = useMemo(() => {
    return selecionados.map((item) => ({ value: item, label: findLabelByKey(item) }));
  }, [selecionados]);

  const updateState = (updater) => {
    const base = draftState ?? resolvedPreferences ?? defaultFormState;
    const next = typeof updater === 'function' ? updater(base) : updater;
    const merged = mergeState(base, next);
    setDraftState(merged);
    if (typeof onStateChange === 'function') {
      onStateChange({
        selectedItems: merged.selectedFields.map((item) => findLabelByKey(item)),
        selectedFields: merged.selectedFields,
        order: findLabelByKey(merged.selectedFields[0] || ''),
        orderField: merged.selectedFields[0] || '',
        reportName: merged.reportName,
        output: merged.output,
        orientation: merged.orientation,
        mode: merged.orientation,
      });
    }
  };

  const incluir = () => {
    if (!selectedDisponiveis.length) return;
    updateState((base) => {
      const next = [...base.selectedFields];
      selectedDisponiveis.forEach((key) => {
        if (!next.includes(key)) next.push(key);
      });
      return { selectedFields: next };
    });
    setSelectedDisponiveis([]);
  };

  const excluir = () => {
    if (!selectedSelecionados.length) return;
    updateState((base) => ({
      selectedFields: base.selectedFields.filter((item) => !selectedSelecionados.includes(item)),
    }));
    setSelectedSelecionados([]);
  };

  const incluirPorDuploClique = (key) => {
    setSelectedDisponiveis([key]);
    updateState((base) => ({
      selectedFields: base.selectedFields.includes(key) ? base.selectedFields : [...base.selectedFields, key],
    }));
    setSelectedDisponiveis([]);
  };

  const excluirPorDuploClique = (key) => {
    setSelectedSelecionados([key]);
    updateState((base) => ({
      selectedFields: base.selectedFields.filter((item) => item !== key),
    }));
    setSelectedSelecionados([]);
  };

  const onChangeOrdem = (value) => {
    updateState((base) => ({
      selectedFields: moveItemToFront(base.selectedFields, value),
    }));
  };

  if (loadingPreferences && !initialPreferences) {
    return (
      <div className="pesquisa-fluxo-caixa-opcoes pesquisa-fluxo-caixa-opcoes--loading" aria-live="polite">
        <div className="pesquisa-fluxo-caixa-opcoes-loading">Carregando preferências do relatório...</div>
      </div>
    );
  }

  return (
    <div className="pesquisa-fluxo-caixa-opcoes">
      <div className="pesquisa-fluxo-caixa-opcoes-grid">
        <section className="pesquisa-fluxo-caixa-opcoes-panel pesquisa-fluxo-caixa-opcoes-panel--available">
          <div className="pesquisa-fluxo-caixa-opcoes-title">Dados disponíveis:</div>
          <div className="pesquisa-fluxo-caixa-opcoes-list" role="listbox" aria-label="Dados disponíveis">
            {rowsDisponiveis.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`pesquisa-fluxo-caixa-opcoes-row${selectedDisponiveis[0] === item.key ? ' is-selected' : ''}`}
                onClick={() => setSelectedDisponiveis([item.key])}
                onDoubleClick={() => incluirPorDuploClique(item.key)}
              >
                <span className="pesquisa-fluxo-caixa-opcoes-row-text">{item.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pesquisa-fluxo-caixa-opcoes-actions">
          <Button onClick={incluir} disabled={!selectedDisponiveis.length}>
            Inclui &gt;&gt;
          </Button>
          <Button onClick={excluir} disabled={!selectedSelecionados.length}>
            &lt;&lt; Exclui
          </Button>
        </div>

        <section className="pesquisa-fluxo-caixa-opcoes-panel pesquisa-fluxo-caixa-opcoes-panel--selected">
          <div className="pesquisa-fluxo-caixa-opcoes-title">Dados selecionados:</div>
          <div className="pesquisa-fluxo-caixa-opcoes-list" role="listbox" aria-label="Dados selecionados">
            {rowsSelecionados.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`pesquisa-fluxo-caixa-opcoes-row${selectedSelecionados[0] === item.key ? ' is-selected' : ''}`}
                onClick={() => setSelectedSelecionados([item.key])}
                onDoubleClick={() => excluirPorDuploClique(item.key)}
              >
                <span className="pesquisa-fluxo-caixa-opcoes-row-text">{item.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pesquisa-fluxo-caixa-opcoes-side">
          <label className="pesquisa-fluxo-caixa-opcoes-field">
            <span>Ordem de impressão:</span>
            <Select value={ordemAtual} onChange={onChangeOrdem} options={orderOptions} placeholder="Selecione" />
          </label>

          <label className="pesquisa-fluxo-caixa-opcoes-field">
            <span>Saída do relatório:</span>
            <Select value={saida} onChange={(value) => updateState({ output: String(value || '').trim() || defaultFormState.output })} options={outputOptions} />
          </label>

          <div className="pesquisa-fluxo-caixa-opcoes-radio-group">
            <div className="pesquisa-fluxo-caixa-opcoes-radio-title">Modo de impressão</div>
            <Radio.Group value={orientacao} onChange={(event) => updateState({ orientation: event.target.value })}>
              <Radio value="retrato">Modo "Retrato"</Radio>
              <Radio value="paisagem">Modo "Paisagem"</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div className="pesquisa-fluxo-caixa-opcoes-footer">
        <label className="pesquisa-fluxo-caixa-opcoes-field pesquisa-fluxo-caixa-opcoes-field--full">
          <span>Nome do relatório:</span>
          <Input value={nomeRelatorio} onChange={(event) => updateState({ reportName: event.target.value })} />
        </label>
      </div>
    </div>
  );
}
