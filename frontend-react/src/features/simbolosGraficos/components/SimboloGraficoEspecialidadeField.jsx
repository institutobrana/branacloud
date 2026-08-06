import { Alert, Select } from 'antd';

export function SimboloGraficoEspecialidadeField({
  value,
  options,
  loading = false,
  error = '',
  empty = false,
  onChange,
}) {
  const normalizedValue = String(value ?? '').trim();
  const normalizedOptions = Array.isArray(options)
    ? options.map((item) => ({
        ...item,
        value: String(item?.value ?? '').trim(),
      }))
    : [];
  const optionValues = new Set(normalizedOptions.map((item) => item.value));
  const normalizedPaddedValue = normalizedValue && normalizedValue.length === 1 ? normalizedValue.padStart(2, '0') : normalizedValue;
  const resolvedValue = optionValues.has(normalizedValue)
    ? normalizedValue
    : optionValues.has(normalizedPaddedValue)
      ? normalizedPaddedValue
      : normalizedValue;

  return (
    <div className="simbolos-graficos-create-field">
      <span className="simbolos-graficos-create-right-title">Especialidade</span>
      <Select
        className="simbolos-graficos-create-select"
        value={resolvedValue || undefined}
        options={normalizedOptions}
        placeholder=""
        loading={loading}
        disabled={loading || empty}
        onChange={(nextValue) => onChange?.(String(nextValue ?? '').trim())}
      />
      {error ? <Alert type="error" showIcon message="Não foi possível carregar as especialidades." description={error} /> : null}
      {!error && empty ? <Alert type="info" showIcon message="Nenhuma especialidade disponível." /> : null}
    </div>
  );
}
