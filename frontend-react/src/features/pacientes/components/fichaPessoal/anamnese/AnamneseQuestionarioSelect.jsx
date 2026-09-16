export function AnamneseQuestionarioSelect({ items, value, onChange, disabled }) {
  return <label className="ficha-anamnese-field"><span>Questionario:</span><select value={value || ''} onChange={(event) => onChange(event.target.value)} disabled={disabled}><option value="">Selecione...</option>{items.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>;
}
