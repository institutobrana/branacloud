import { Input } from 'antd';

function Field({ label, children, className = '' }) {
  return (
    <label className={`prestadores-modal-field ${className}`.trim()}>
      <span className="prestadores-modal-field-label">{label}</span>
      <div className="prestadores-modal-field-control">{children}</div>
    </label>
  );
}

export function PrestadorObservacoesTab({ draft, updateDraft }) {
  const value = draft?.observacoes ?? '';

  return (
    <div className="prestadores-modal-tab prestadores-modal-tab--observacoes">
      <Field label="Observações" className="prestadores-modal-field--observacoes">
        <Input.TextArea
          value={value}
          onChange={(event) => updateDraft({ observacoes: event.target.value })}
          placeholder="Observações"
          autoSize={false}
          rows={13}
        />
      </Field>
    </div>
  );
}
