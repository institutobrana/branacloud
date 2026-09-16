import { Input, Select } from 'antd';

function Field({ label, children }) { return <label className="agenda-contatos-modal-field"><span>{label}</span>{children}</label>; }

export function AgendaContatosDetalhesTab({ form, lookups, onChange }) {
  const keywordOptions = [{ value: '', label: '' }, ...lookups.palavrasChave.map((item) => ({ value: item.descricao || '', label: item.descricao || '' }))];
  const specialtyOptions = lookups.especialidades.map((item) => ({ value: item.codigo || '', label: item.nome || '' }));
  return <div className="agenda-contatos-modal-pane agenda-contatos-modal-detalhes" aria-label="Detalhes">
    {lookups.error ? <div className="agenda-contatos-lookup-error" role="status">{lookups.error}</div> : null}
    <div className="agenda-contatos-details-top">
      <div className="agenda-contatos-keywords"><Field label="Palavra-chave 1"><Select value={form.palavra_chave_1} options={keywordOptions} loading={lookups.loading} onChange={(value) => onChange({ palavra_chave_1: value })} /></Field><Field label="Palavra-chave 2"><Select value={form.palavra_chave_2} options={keywordOptions} loading={lookups.loading} onChange={(value) => onChange({ palavra_chave_2: value })} /></Field></div>
      <Field label="Registro"><Input maxLength={80} value={form.registro} onChange={(event) => onChange({ registro: event.target.value })} /></Field>
      <Field label="Especialidade"><Select value={form.especialidade} options={specialtyOptions} loading={lookups.loading} onChange={(value) => onChange({ especialidade: value })} /></Field>
    </div>
    <div className="agenda-contatos-details-divider" />
    <Field label="Observações"><Input.TextArea className="agenda-contatos-observacoes" value={form.observacoes} onChange={(event) => onChange({ observacoes: event.target.value })} /></Field>
  </div>;
}
