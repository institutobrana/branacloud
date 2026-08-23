import { Checkbox, DatePicker, Input, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import dayjs from 'dayjs';

import { normalizeContaCorrenteDateInput } from '../../../contaCorrenteCirurgiao/dateParsing.js';
import {
  PRESTADOR_CBO_OPTIONS,
  PRESTADOR_ESTADO_CIVIL_OPTIONS,
  PRESTADOR_PREFIXO_OPTIONS,
  PRESTADOR_SEXO_OPTIONS,
  PRESTADOR_TIPO_DEFAULT,
  PRESTADOR_TIPO_OPTIONS,
  PRESTADOR_UF_CRO_OPTIONS,
  buildPrestadorPrincipalDefaults,
} from './prestadorPrincipalContracts.js';

function selectDatePickerText(event) {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) return;
  requestAnimationFrame(() => {
    input.select();
  });
}

function focusRelativeFocusable(control, direction) {
  const root = control?.closest?.('.ant-modal-content') ?? document;
  const focusableSelectors = [
    'input:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const focusables = Array.from(root.querySelectorAll?.(focusableSelectors) ?? []).filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element === control) return true;
    return element.offsetParent !== null || element === document.activeElement;
  });
  const index = focusables.indexOf(control);
  const target = focusables[index + direction];
  if (target instanceof HTMLElement) {
    target.focus();
  }
}

export function DatePickerEntry({ value, onChange }) {
  const containerRef = useRef(null);
  const draftValueRef = useRef('');
  const isEditingRef = useRef(false);
  const skipNextBlurCommitRef = useRef(false);

  useEffect(() => {
    if (isEditingRef.current) return;
    draftValueRef.current = dayjs.isDayjs(value) ? value.format('DD/MM/YYYY') : String(value || '');
  }, [value]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    const input = root.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return undefined;

    const handleInput = () => {
      draftValueRef.current = input.value;
    };

    input.addEventListener('input', handleInput);
    return () => {
      input.removeEventListener('input', handleInput);
    };
  }, [value]);

  const commitDraft = () => {
    if (skipNextBlurCommitRef.current) {
      skipNextBlurCommitRef.current = false;
      return;
    }
    const input = containerRef.current?.querySelector('input');
    const rawValue = input instanceof HTMLInputElement ? input.value : draftValueRef.current;
    const normalized = normalizeContaCorrenteDateInput(rawValue);
    isEditingRef.current = false;
    flushSync(() => {
      onChange(normalized || null);
    });
  };

  return (
    <div ref={containerRef}>
      <DatePicker
        value={value}
        onChange={(nextValue) => {
          if (nextValue == null) {
            draftValueRef.current = '';
            onChange(null);
            return;
          }
          if (!dayjs.isDayjs(nextValue)) return;
          draftValueRef.current = nextValue.format('DD/MM/YYYY');
          isEditingRef.current = false;
          onChange(nextValue);
        }}
        onFocus={(event) => {
          isEditingRef.current = true;
          selectDatePickerText(event);
        }}
        onClick={(event) => {
          isEditingRef.current = true;
          selectDatePickerText(event);
        }}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          skipNextBlurCommitRef.current = true;
          event.preventDefault();
          commitDraft();
          requestAnimationFrame(() => {
            focusRelativeFocusable(event.target, event.shiftKey ? -1 : 1);
          });
        }}
        format="DD/MM/YYYY"
      />
    </div>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`prestadores-modal-field ${className}`.trim()}>
      <span className="prestadores-modal-field-label">{label}</span>
      <div className="prestadores-modal-field-control">{children}</div>
    </label>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="prestadores-modal-field prestadores-modal-field--readonly">
      <span className="prestadores-modal-field-label">{label}</span>
      <div className="prestadores-modal-field-control">
        <span className="prestadores-modal-readonly-value">{value}</span>
      </div>
    </div>
  );
}

export function PrestadorPrincipalTab({ draft, updateDraft }) {
  const defaultsRef = useRef(buildPrestadorPrincipalDefaults());
  const [tipoPrestadorOptions] = useState(() => PRESTADOR_TIPO_OPTIONS.map((item) => ({ value: item.label, label: item.label })));
  const [ufCroOptions] = useState(() => PRESTADOR_UF_CRO_OPTIONS.map((item) => ({ value: item.value, label: item.label })));
  const [cbosOptions] = useState(() => PRESTADOR_CBO_OPTIONS.map((item) => ({ value: item.label, label: item.label })));
  const [sexoOptions] = useState(() => [{ value: '', label: '' }, ...PRESTADOR_SEXO_OPTIONS.map((item) => ({ value: item.label, label: item.label }))]);
  const [estadoCivilOptions] = useState(() => [{ value: '', label: '' }, ...PRESTADOR_ESTADO_CIVIL_OPTIONS.map((item) => ({ value: item.label, label: item.label }))]);
  const [prefixoOptions] = useState(() => [{ value: '', label: '' }, ...PRESTADOR_PREFIXO_OPTIONS.map((item) => ({ value: item.label, label: item.label }))]);
  const form = draft || {};

  return (
    <div className="prestadores-modal-tab prestadores-modal-tab--principal">
      <div className="prestadores-modal-grid prestadores-modal-grid--row1">
        <Field label="Código" className="prestadores-modal-field--code">
          <Input value={form.codigo ?? defaultsRef.current.codigo ?? ''} readOnly placeholder="Automático" />
        </Field>
        <Field label="Nome do prestador" className="prestadores-modal-field--main">
          <Input autoFocus value={form.nome ?? ''} onChange={(event) => updateDraft({ nome: event.target.value })} placeholder="Nome do prestador" />
        </Field>
        <Field label="Apelido" className="prestadores-modal-field--nickname">
          <Input value={form.apelido ?? ''} onChange={(event) => updateDraft({ apelido: event.target.value })} placeholder="Apelido" />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--row2">
        <Field label="Tipo do prestador" className="prestadores-modal-field--type">
          <Select
            placeholder="Selecione"
            value={form.tipo_prestador ?? PRESTADOR_TIPO_DEFAULT}
            onChange={(value) => updateDraft({ tipo_prestador: value })}
            options={tipoPrestadorOptions}
          />
        </Field>
        <Field label="Início" className="prestadores-modal-field--date">
          <DatePickerEntry value={form.inicio ?? dayjs()} onChange={(value) => updateDraft({ inicio: value })} />
        </Field>
        <Field label="Término" className="prestadores-modal-field--date">
          <DatePickerEntry value={form.termino ?? null} onChange={(value) => updateDraft({ termino: value })} />
        </Field>
      </div>

      <div className="prestadores-modal-check-row">
        <Checkbox checked={Boolean(form.inativo)} onChange={(event) => updateDraft({ inativo: event.target.checked })}>Inativar prestador</Checkbox>
        <Checkbox checked={Boolean(form.executa_procedimento)} onChange={(event) => updateDraft({ executa_procedimento: event.target.checked })}>Prestador executa procedimento</Checkbox>
      </div>

      <div className="prestadores-modal-separator" aria-hidden="true" />

      <div className="prestadores-modal-grid prestadores-modal-grid--row4">
        <Field label="CRO" className="prestadores-modal-field--cro">
          <Input value={form.cro ?? ''} onChange={(event) => updateDraft({ cro: event.target.value })} placeholder="CRO" />
        </Field>
        <Field label="UF CRO" className="prestadores-modal-field--ufcro">
          <Select
            placeholder="UF"
            value={form.uf_cro ?? ''}
            onChange={(value) => updateDraft({ uf_cro: value })}
            options={ufCroOptions}
          />
        </Field>
        <Field label="CPF" className="prestadores-modal-field--cpf">
          <Input value={form.cpf ?? ''} onChange={(event) => updateDraft({ cpf: event.target.value })} placeholder="CPF" />
        </Field>
        <Field label="RG" className="prestadores-modal-field--rg">
          <Input value={form.rg ?? ''} onChange={(event) => updateDraft({ rg: event.target.value })} placeholder="RG" />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--row5">
        <Field label="Nº INSS" className="prestadores-modal-field--doc">
          <Input value={form.inss ?? ''} onChange={(event) => updateDraft({ inss: event.target.value })} placeholder="Nº INSS" />
        </Field>
        <Field label="Nº CCM" className="prestadores-modal-field--doc">
          <Input value={form.ccm ?? ''} onChange={(event) => updateDraft({ ccm: event.target.value })} placeholder="Nº CCM" />
        </Field>
        <Field label="Nº contrato" className="prestadores-modal-field--doc">
          <Input value={form.contrato ?? ''} onChange={(event) => updateDraft({ contrato: event.target.value })} placeholder="Nº contrato" />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--row6">
        <Field label="Nº CNES" className="prestadores-modal-field--cnes">
          <Input value={form.cnes ?? ''} onChange={(event) => updateDraft({ cnes: event.target.value })} placeholder="Nº CNES" />
        </Field>
        <Field label="CBO-S" className="prestadores-modal-field--cbos">
          <Select
            placeholder="Selecione"
            value={form.cbos ?? PRESTADOR_CBO_DEFAULT}
            onChange={(value) => updateDraft({ cbos: value })}
            options={cbosOptions}
          />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--row7">
        <Field label="Nascimento" className="prestadores-modal-field--date">
          <DatePickerEntry value={form.nascimento ?? null} onChange={(value) => updateDraft({ nascimento: value })} />
        </Field>
        <Field label="Sexo" className="prestadores-modal-field--combo">
          <Select
            placeholder="Selecione"
            value={form.sexo ?? ''}
            onChange={(value) => updateDraft({ sexo: value })}
            options={sexoOptions}
          />
        </Field>
        <Field label="Estado civil" className="prestadores-modal-field--combo">
          <Select
            placeholder="Selecione"
            value={form.estado_civil ?? ''}
            onChange={(value) => updateDraft({ estado_civil: value })}
            options={estadoCivilOptions}
          />
        </Field>
        <Field label="Prefixo" className="prestadores-modal-field--combo">
          <Select
            placeholder="Selecione"
            value={form.prefixo ?? ''}
            onChange={(value) => updateDraft({ prefixo: value })}
            options={prefixoOptions}
          />
        </Field>
      </div>

      <div className="prestadores-modal-grid prestadores-modal-grid--meta">
        <ReadOnlyField label="Inclusão" value={form.inclusao ?? defaultsRef.current.inclusao} />
        <ReadOnlyField label="Alteração" value={form.alteracao ?? defaultsRef.current.alteracao} />
        <ReadOnlyField label="ID interno" value={form.id_interno ?? defaultsRef.current.id_interno} />
      </div>
    </div>
  );
}
