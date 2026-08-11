import { InputNumber, Select } from 'antd';

const MONTH_OPTIONS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const VIEW_OPTIONS = [
  { value: 'todos', label: 'Todos os lançamentos' },
  { value: 'tributaveis', label: 'Apenas lançamentos tributáveis' },
  { value: 'debito', label: 'Apenas débitos (Saídas)' },
  { value: 'credito', label: 'Apenas créditos (Entradas)' },
  { value: 'pessoal', label: 'Apenas despesas pessoais' },
];

export function ContaCorrenteCirurgiaoFilters({
  month,
  year,
  surgeonId,
  viewMode,
  surgeonOptions,
  onMonthChange,
  onYearChange,
  onSurgeonChange,
  onViewModeChange,
}) {
  return (
    <div className="conta-corrente-cirurgiao-filters" aria-label="Filtros da conta corrente do cirurgião">
      <label className="conta-corrente-cirurgiao-filter conta-corrente-cirurgiao-filter--month">
        <span className="conta-corrente-cirurgiao-filter-label">Mês</span>
        <Select
          size="small"
          value={month}
          options={MONTH_OPTIONS}
          onChange={(value) => onMonthChange?.(value)}
          aria-label="Mês"
        />
      </label>

      <label className="conta-corrente-cirurgiao-filter conta-corrente-cirurgiao-filter--year">
        <span className="conta-corrente-cirurgiao-filter-label">Ano</span>
        <InputNumber
          size="small"
          value={year}
          min={1900}
          max={2100}
          onChange={(value) => onYearChange?.(Number(value || new Date().getFullYear()))}
          aria-label="Ano"
        />
      </label>

      <label className="conta-corrente-cirurgiao-filter conta-corrente-cirurgiao-filter--surgeon">
        <span className="conta-corrente-cirurgiao-filter-label">Cirurgião</span>
        <Select
          size="small"
          value={surgeonId ?? undefined}
          placeholder="Selecione"
          options={surgeonOptions}
          onChange={(value) => onSurgeonChange?.(value ?? null)}
          allowClear
          aria-label="Cirurgião"
        />
      </label>

      <label className="conta-corrente-cirurgiao-filter conta-corrente-cirurgiao-filter--view">
        <span className="conta-corrente-cirurgiao-filter-label">Visualização</span>
        <Select
          size="small"
          value={viewMode}
          options={VIEW_OPTIONS}
          onChange={(value) => onViewModeChange?.(value)}
          aria-label="Visualização"
        />
      </label>
    </div>
  );
}
