import { Select } from 'antd';

export function ProteticoSelect({ value, options, loading, onChange }) {
  return (
    <label className="servicos-protetico-field">
      <span>Protético</span>
      <Select
        value={value ?? undefined}
        options={options}
        loading={loading}
        onChange={onChange}
        placeholder="Selecione"
        allowClear={false}
      />
    </label>
  );
}
