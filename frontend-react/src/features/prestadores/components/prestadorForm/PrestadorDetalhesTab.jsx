import { Checkbox, Input, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { listarAuxiliares, listarEspecialidadesAtivas } from '../../../tabelasAuxiliares/auxiliaresApi.js';

const DEFAULT_BANK_OPTIONS = [
  'Banco do Brasil',
  'Caixa Econômica Federal',
  'Bradesco',
  'Itaú',
  'Santander',
];

const DEFAULT_PAYMENT_OPTIONS = [
  'Depósito',
  'PIX',
  'Transferência',
  'Cheque',
];

const DEFAULT_SPECIALITIES = [
  'Cirurgia',
  'Dentística',
  'Diagnóstico',
  'Endodontia',
  'Estética',
  'Gerais',
  'Harmonização Facial',
  'Implantodontia',
  'Odontopediatria',
  'Ortodontia',
  'Periodontia',
  'Prevenção',
  'Prótese',
  'Radiologia',
];

function normalizeOptions(items, fallback = []) {
  const normalized = (Array.isArray(items) ? items : [])
    .map((item) => {
      const label = String(item?.descricao || item?.name || item?.codigo || '').trim();
      if (!label) return null;
      const value = String(item?.codigo || label).trim();
      return { value, label };
    })
    .filter(Boolean);
  if (normalized.length) return normalized;
  return fallback.map((value) => ({ value, label: value }));
}

function normalizeSpeciality(item) {
  const label = String(item?.nome || item?.descricao || item?.codigo || '').trim();
  if (!label) return null;
  return { value: label, label };
}

function orderSpecialities(items) {
  const byLabel = new Map((Array.isArray(items) ? items : []).map((item) => [item.label, item]));
  const ordered = DEFAULT_SPECIALITIES.map((label) => byLabel.get(label)).filter(Boolean);
  if (ordered.length) return ordered;
  return DEFAULT_SPECIALITIES.map((value) => ({ value, label: value }));
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`prestadores-modal-field ${className}`.trim()}>
      <span className="prestadores-modal-field-label">{label}</span>
      <div className="prestadores-modal-field-control">{children}</div>
    </label>
  );
}

export function PrestadorDetalhesTab({ draft, updateDraft }) {
  const [bancoOptions, setBancoOptions] = useState(() => DEFAULT_BANK_OPTIONS.map((value) => ({ value, label: value })));
  const [modoPagamentoOptions, setModoPagamentoOptions] = useState(() => DEFAULT_PAYMENT_OPTIONS.map((value) => ({ value, label: value })));
  const [especialidadesOptions, setEspecialidadesOptions] = useState(() => DEFAULT_SPECIALITIES.map((value) => ({ value, label: value })));
  const form = draft || {};

  useEffect(() => {
    let alive = true;

    async function loadOptions() {
      try {
        const [bancos, pagamentos, especialidades] = await Promise.all([
          listarAuxiliares('Bancos'),
          listarAuxiliares('Tipos de pagamento'),
          listarEspecialidadesAtivas(),
        ]);
        if (!alive) return;
        setBancoOptions(normalizeOptions(bancos, DEFAULT_BANK_OPTIONS));
        setModoPagamentoOptions(normalizeOptions(pagamentos, DEFAULT_PAYMENT_OPTIONS));
        const specialities = (Array.isArray(especialidades) ? especialidades : [])
          .map(normalizeSpeciality)
          .filter(Boolean);
        setEspecialidadesOptions(orderSpecialities(specialities));
      } catch {
        if (!alive) return;
        setBancoOptions(DEFAULT_BANK_OPTIONS.map((value) => ({ value, label: value })));
        setModoPagamentoOptions(DEFAULT_PAYMENT_OPTIONS.map((value) => ({ value, label: value })));
        setEspecialidadesOptions(DEFAULT_SPECIALITIES.map((value) => ({ value, label: value })));
      }
    }

    loadOptions();
    return () => {
      alive = false;
    };
  }, []);

  const especialidadeValueSet = useMemo(
    () => new Set(Array.isArray(form.especialidades_exec) ? form.especialidades_exec : []),
    [form.especialidades_exec],
  );

  return (
    <div className="prestadores-modal-tab prestadores-modal-tab--detalhes">
      <div className="prestadores-modal-grid prestadores-modal-grid--row1 prestadores-modal-grid--detalhes-row1">
        <Field label="Banco" className="prestadores-modal-field--bank">
          <Select placeholder="Selecione" options={bancoOptions} value={form.banco ?? ''} onChange={(value) => updateDraft({ banco: value })} />
        </Field>
        <Field label="Agência" className="prestadores-modal-field--agency">
          <Input placeholder="Agência" value={form.agencia ?? ''} onChange={(event) => updateDraft({ agencia: event.target.value })} />
        </Field>
        <Field label="Nº Conta" className="prestadores-modal-field--account">
          <Input placeholder="Nº Conta" value={form.conta ?? ''} onChange={(event) => updateDraft({ conta: event.target.value })} />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--detalhes-row2">
        <Field label="Nome da conta" className="prestadores-modal-field--account-name">
          <Input placeholder="Nome da conta" value={form.nome_conta ?? ''} onChange={(event) => updateDraft({ nome_conta: event.target.value })} />
        </Field>
        <Field label="Modo de pagamento" className="prestadores-modal-field--payment">
          <Select placeholder="Selecione" options={modoPagamentoOptions} value={form.modo_pagamento ?? ''} onChange={(value) => updateDraft({ modo_pagamento: value })} />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--detalhes-row3">
        <Field label="Faculdade" className="prestadores-modal-field--faculty">
          <Input placeholder="Faculdade" value={form.faculdade ?? ''} onChange={(event) => updateDraft({ faculdade: event.target.value })} />
        </Field>
        <Field label="Formatura" className="prestadores-modal-field--graduation">
          <Input placeholder="Formatura" value={form.formatura ?? ''} onChange={(event) => updateDraft({ formatura: event.target.value })} />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--detalhes-row4">
        <Field label="Alerta para agendamentos" className="prestadores-modal-field--alert">
          <Input placeholder="Alerta para agendamentos" value={form.alerta_agendamentos ?? ''} onChange={(event) => updateDraft({ alerta_agendamentos: event.target.value })} />
        </Field>
      </div>

      <div className="prestadores-modal-specialities">
        <div className="prestadores-modal-specialities-title">Especialidades que executa</div>
        <div className="prestadores-modal-specialities-grid" role="group" aria-label="Especialidades que executa">
          {especialidadesOptions.map((item) => (
            <label key={item.value} className="prestadores-modal-speciality-item">
              <Checkbox
                checked={especialidadeValueSet.has(item.value)}
                onChange={(event) => {
                  const nextChecked = event.target.checked;
                  const current = Array.isArray(form.especialidades_exec) ? form.especialidades_exec : [];
                  const next = nextChecked
                    ? (current.includes(item.value) ? current : [...current, item.value])
                    : current.filter((value) => value !== item.value);
                  updateDraft({ especialidades_exec: next });
                }}
              >
                {item.label}
              </Checkbox>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
