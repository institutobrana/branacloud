import { Select } from 'antd';

export function ProteticoSelect({ value, options, loading, disabled = false, onChange }) {
  return (
    <label className="servicos-protetico-field">
      <span>Protético</span>
      <Select
        value={value ?? undefined}
        options={options}
        loading={loading}
        disabled={disabled}
        onChange={onChange}
        placeholder="Selecione"
        allowClear={false}
      />
    </label>
  );
}
