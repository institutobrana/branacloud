import { Select } from 'antd';

const FIELDS = [
  ['modelo_impresso_atestados', 'Modelo de impresso para atestados'],
  ['modelo_impresso_receitas', 'Modelo de impresso para receitas'],
  ['modelo_impresso_recibos', 'Modelo de impresso para recibos'],
  ['modelo_padrao_etiquetas', 'Modelo padrão para etiquetas'],
  ['modelo_texto_email_agenda', 'Modelo de texto para e-mail agenda'],
  ['modelo_padrao_orcamentos', 'Modelo padrão para orçamentos'],
  ['modelo_texto_whatsapp_agenda', 'Modelo de texto para WhatsApp agenda'],
];

export function ModelosTab({ values, options, update, loading }) {
  return <div className="config-preferencias-modelos" aria-label="Modelos">
    {FIELDS.map(([key, label]) => <label className="config-preferencias-model-row" key={key}>
      <span>{label}</span>
      <Select allowClear loading={loading} value={values[`${key}_id`] ?? undefined} options={(options[key] || []).map((item) => ({ value: item.id ?? undefined, label: item.nome || '' }))} onChange={(value) => update({ [`${key}_id`]: value ?? null })} />
    </label>)}
  </div>;
}
