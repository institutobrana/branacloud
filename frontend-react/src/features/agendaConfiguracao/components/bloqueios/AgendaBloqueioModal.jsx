import { Button, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { BranaModal } from '../../../../components/BranaModal.jsx';
import {
  AGENDA_BLOQUEIO_DIA_OPTIONS,
  agendaBloqueioDiaValue,
  agendaBloqueioMaskDateInput,
  agendaBloqueioMaskTimeInput,
  agendaBloqueioNormalizeDateInput,
  agendaBloqueioNormalizeTimeInput,
  agendaBloqueioParseDateInput,
  buildAgendaBloqueioDraft,
  buildAgendaBloqueioPayload,
} from '../../agendaConfiguracaoBloqueios.js';

function focusSelectText(event) {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) return;
  requestAnimationFrame(() => {
    input.select();
  });
}

function BlockField({ label, children, className = '' }) {
  return (
    <label className={`agenda-bloqueio-field ${className}`.trim()}>
      <span className="agenda-bloqueio-label">{label}</span>
      <div className="agenda-bloqueio-control">{children}</div>
    </label>
  );
}

function DateEntry({ value, onChange, onCommit, status }) {
  const [draftValue, setDraftValue] = useState(() => String(value || ''));

  useEffect(() => {
    setDraftValue(String(value || ''));
  }, [value]);

  return (
    <Input
      value={draftValue}
      onChange={(event) => {
        const masked = agendaBloqueioMaskDateInput(event.target.value);
        setDraftValue(masked);
        onChange?.(masked);
      }}
      onBlur={(event) => {
        const current = String(event.target.value || '').trim();
        const normalized = agendaBloqueioNormalizeDateInput(current, dayjs());
        const nextValue = normalized || current;
        setDraftValue(nextValue);
        onCommit?.(nextValue);
      }}
      onFocus={focusSelectText}
      inputMode="numeric"
      placeholder="dd/mm/aaaa"
      maxLength={10}
      status={status}
      className="agenda-bloqueio-date-input"
    />
  );
}

function TimeEntry({ value, onChange, onCommit, status }) {
  const [draftValue, setDraftValue] = useState(() => String(value || ''));

  useEffect(() => {
    setDraftValue(String(value || ''));
  }, [value]);

  return (
    <Input
      value={draftValue}
      onChange={(event) => {
        const masked = agendaBloqueioMaskTimeInput(event.target.value);
        setDraftValue(masked);
        onChange?.(masked);
      }}
      onBlur={(event) => {
        const current = String(event.target.value || '').trim();
        const normalized = agendaBloqueioNormalizeTimeInput(current);
        const nextValue = normalized || current;
        setDraftValue(nextValue);
        onCommit?.(nextValue);
      }}
      onFocus={focusSelectText}
      inputMode="numeric"
      placeholder="HH:MM"
      maxLength={5}
      status={status}
      className="agenda-bloqueio-time-input"
    />
  );
}

export function AgendaBloqueioModal({
  open,
  mode = 'create',
  record = null,
  unidadeOptions = [],
  loadingUnidades = false,
  onCancel,
  onConfirm,
}) {
  const [draft, setDraft] = useState(() => buildAgendaBloqueioDraft(record));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setDraft(buildAgendaBloqueioDraft(record));
    setSaving(false);
  }, [open, record]);

  const selectedUnit = useMemo(() => {
    const desiredRowId = Number(draft.unidade_row_id || 0) || null;
    const desiredSourceId = Number(draft.unidade_id || 0) || null;
    const desiredLabel = String(draft.unidade || '').trim().toLowerCase();
    const options = Array.isArray(unidadeOptions) ? unidadeOptions : [];
    return (
      options.find((item) => Number(item.row_id || 0) === desiredRowId) ||
      options.find((item) => Number(item.source_id || 0) === desiredSourceId) ||
      options.find((item) => String(item.nome || '').trim().toLowerCase() === desiredLabel) ||
      options[0] ||
      null
    );
  }, [draft.unidade, draft.unidade_id, draft.unidade_row_id, unidadeOptions]);

  useEffect(() => {
    if (!open || record || !Array.isArray(unidadeOptions) || !unidadeOptions.length) return;
    setDraft((current) => {
      if (String(current.unidade || '').trim()) return current;
      const first = unidadeOptions[0];
      return {
        ...current,
        unidade: String(first?.nome || '').trim(),
        unidade_id: Number(first?.source_id || 0) || null,
        unidade_row_id: Number(first?.row_id || 0) || null,
      };
    });
  }, [open, record, unidadeOptions]);

  const updateDraft = (patch) => {
    setDraft((current) => ({
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  };

  const isValidDate = (value) => {
    const normalized = agendaBloqueioNormalizeDateInput(value || '');
    return !String(value || '').trim() || Boolean(normalized);
  };

  const isValidTime = (value) => {
    const normalized = agendaBloqueioNormalizeTimeInput(value || '');
    return !String(value || '').trim() || Boolean(normalized);
  };

  const isValidDateRange = () => {
    const ini = String(draft.vigencia_inicio || '').trim();
    const fim = String(draft.vigencia_fim || '').trim();
    if (ini && fim) {
      const iniNorm = agendaBloqueioParseDateInput(ini, dayjs());
      const fimNorm = agendaBloqueioParseDateInput(fim, dayjs());
      if (!iniNorm || !fimNorm) return false;
      return fimNorm.valueOf() >= iniNorm.valueOf();
    }
    return isValidDate(ini) && isValidDate(fim);
  };

  const isValidTimeRange = () => {
    const ini = String(draft.hora_ini || '').trim();
    const fim = String(draft.hora_fin || '').trim();
    if (!ini && !fim) return true;
    if (!ini || !fim) return false;
    const iniNorm = agendaBloqueioNormalizeTimeInput(ini);
    const fimNorm = agendaBloqueioNormalizeTimeInput(fim);
    if (!iniNorm || !fimNorm) return false;
    return iniNorm < fimNorm;
  };

  const canSubmit = Boolean(selectedUnit?.nome)
    && isValidDate(draft.vigencia_inicio)
    && isValidDate(draft.vigencia_fim)
    && isValidDateRange()
    && isValidTime(draft.hora_ini)
    && isValidTime(draft.hora_fin)
    && isValidTimeRange();

  const handleConfirm = async () => {
    if (saving) return;
    const payload = buildAgendaBloqueioPayload(draft, selectedUnit);
    if (!payload.unidade) return;
    try {
      setSaving(true);
      await onConfirm?.(payload, selectedUnit);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BranaModal
      open={open}
      title={mode === 'edit' ? 'Altera bloqueio' : 'Novo bloqueio'}
      centered
      width={640}
      destroyOnClose
      maskClosable={false}
      keyboard
      onCancel={onCancel}
      footer={null}
      className="agenda-bloqueio-modal"
    >
      <div className="agenda-bloqueio-shell">
        <div className="agenda-bloqueio-row agenda-bloqueio-row--unit">
          <BlockField label="Unidade de atendimento:" className="agenda-bloqueio-field--unit">
            <Select
              placeholder="Selecione"
              loading={loadingUnidades}
              options={Array.isArray(unidadeOptions) ? unidadeOptions.map((item) => ({
                value: String(item.row_id || ''),
                label: item.nome,
              })) : []}
              value={String(selectedUnit?.row_id || '') || undefined}
              onChange={(value, option) => {
                const next = Array.isArray(unidadeOptions)
                  ? unidadeOptions.find((item) => String(item.row_id || '') === String(value || ''))
                  : null;
                setDraft((current) => ({
                  ...current,
                  unidade: String(next?.nome || option?.label || '').trim(),
                  unidade_id: Number(next?.source_id || 0) || null,
                  unidade_row_id: Number(next?.row_id || 0) || null,
                }));
              }}
            />
          </BlockField>
        </div>

        <div className="agenda-bloqueio-row agenda-bloqueio-row--compact">
          <BlockField label="Dia da semana:" className="agenda-bloqueio-field--day">
            <Select
              placeholder="Selecione"
              options={AGENDA_BLOQUEIO_DIA_OPTIONS.map((item) => ({ value: String(item.value), label: item.label }))}
              value={String(agendaBloqueioDiaValue(draft.dia_sem))}
              onChange={(value) => updateDraft({ dia_sem: Number(value || 1) || 1 })}
            />
          </BlockField>
          <BlockField label="Período de vigência:" className="agenda-bloqueio-field--date-range">
            <div className="agenda-bloqueio-range agenda-bloqueio-range--date">
              <DateEntry
                value={draft.vigencia_inicio}
                onChange={(value) => updateDraft({ vigencia_inicio: value })}
                onCommit={(value) => updateDraft({ vigencia_inicio: value })}
              />
              <span className="agenda-bloqueio-range-separator">a</span>
              <DateEntry
                value={draft.vigencia_fim}
                onChange={(value) => updateDraft({ vigencia_fim: value })}
                onCommit={(value) => updateDraft({ vigencia_fim: value })}
              />
            </div>
          </BlockField>
          <BlockField label="Intervalo de horários:" className="agenda-bloqueio-field--time-range">
            <div className="agenda-bloqueio-range agenda-bloqueio-range--time">
              <TimeEntry
                value={draft.hora_ini}
                onChange={(value) => updateDraft({ hora_ini: value })}
                onCommit={(value) => updateDraft({ hora_ini: value })}
                status={draft.hora_ini && !agendaBloqueioNormalizeTimeInput(draft.hora_ini) ? 'error' : ''}
              />
              <span className="agenda-bloqueio-range-separator">às</span>
              <TimeEntry
                value={draft.hora_fin}
                onChange={(value) => updateDraft({ hora_fin: value })}
                onCommit={(value) => updateDraft({ hora_fin: value })}
                status={draft.hora_fin && !agendaBloqueioNormalizeTimeInput(draft.hora_fin) ? 'error' : ''}
              />
            </div>
          </BlockField>
        </div>

        <BlockField label="Mensagem de alerta:" className="agenda-bloqueio-field--message">
          <Input.TextArea
            value={draft.msg_agenda}
            onChange={(event) => updateDraft({ msg_agenda: event.target.value })}
            autoSize={{ minRows: 3, maxRows: 4 }}
            placeholder="Mensagem de alerta"
          />
        </BlockField>

        <div className="agenda-bloqueio-footer">
          <Button onClick={onCancel}>Cancela</Button>
          <Button type="primary" loading={saving} disabled={!canSubmit || saving} onClick={handleConfirm}>
            Ok
          </Button>
        </div>
      </div>
    </BranaModal>
  );
}
