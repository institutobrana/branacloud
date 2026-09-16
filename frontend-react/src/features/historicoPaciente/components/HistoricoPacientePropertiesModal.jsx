import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { DateField } from '../../pacientes/components/fichaPessoal/DadosPessoaisTab.jsx';
import { AgendaColorDropdown } from '../../agendaConfiguracao/components/AgendaColorDropdown.jsx';
import { AGENDA_APRESENTACAO_COLORS } from '../../agendaConfiguracao/agendaConfiguracaoColors.js';
import { historicoHexToInteger, historicoIntegerToPaletteValue } from '../historicoPacienteUtils.js';

export function HistoricoPacientePropertiesModal({ open, item, prestadores, loading, onCancel, onSave }) {
  const [draft, setDraft] = useState(null);
  useEffect(() => {
    if (!item) return;
    setDraft({ data: item.data, prestador_id: item.prestador_id, regiao: item.regiao || '', cor: item.cor ?? 16777215, descricao: item.descricao || '' });
  }, [item]);
  if (!open || !item || !draft) return null;
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  return <Modal open={open} title="Propriedades do histórico" onCancel={onCancel} width={720} className="historico-paciente-properties-modal" footer={[
    <Button key="ok" type="primary" loading={loading} onClick={() => onSave(draft)}>Ok</Button>,
    <Button key="cancel" onClick={onCancel}>Cancela</Button>,
  ]}>
    <div className="historico-paciente-properties">
      <div className="historico-paciente-properties-main-row">
        <DateField label="Data" value={draft.data || null} className="historico-paciente-property-date" onChange={(value) => update('data', value?.format?.('YYYY-MM-DD') || value || '')} />
        <Field label="Cirurgião responsável"><Select value={draft.prestador_id} onChange={(value) => update('prestador_id', value)} options={prestadores.map((p) => ({ value: p.id, label: p.apelido || p.nome }))} /></Field>
        <Field label="Região"><Input value={draft.regiao} onChange={(event) => update('regiao', event.target.value)} /></Field>
        <Field label="Cor de fundo">
          <AgendaColorDropdown
            value={historicoIntegerToPaletteValue(draft.cor)}
            options={AGENDA_APRESENTACAO_COLORS}
            onChange={(value) => update('cor', historicoHexToInteger(value))}
            aria-label="Cor de fundo"
            className="historico-paciente-property-color"
          />
        </Field>
      </div>
      <Field label="Histórico" className="historico-paciente-properties-history"><Textarea value={draft.descricao} onChange={(event) => update('descricao', event.target.value)} /></Field>
      <div className="historico-paciente-properties-audit-row">
        <Field label="Data de inserção" className="ficha-dados-readonly-cyan"><Input readOnly value={formatAudit(item.criado_em, item.criado_por_nome)} /></Field>
        <Field label="Data de atualização" className="ficha-dados-readonly-cyan"><Input readOnly value={formatAudit(item.atualizado_em, item.atualizado_por_nome)} /></Field>
      </div>
    </div>
  </Modal>;
}

function Field({ label, className = '', children }) { return <label className={`historico-paciente-property-field ${className}`.trim()}><span>{label}</span>{children}</label>; }
function Textarea({ value, onChange }) { return <Input.TextArea rows={4} value={value} onChange={onChange} />; }
function formatAudit(value, user) { return value ? `${new Date(value).toLocaleString('pt-BR')} - ${user || ''}` : ''; }
