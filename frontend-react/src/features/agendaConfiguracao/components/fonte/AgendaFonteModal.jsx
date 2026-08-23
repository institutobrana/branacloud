import { Button, Checkbox, Input } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BranaModal } from '../../../../components/BranaModal.jsx';
import {
  AGENDA_FONTE_COLOR_OPTIONS,
  AGENDA_FONTE_DEFAULTS,
  AGENDA_FONTE_FAMILIES,
  AGENDA_FONTE_SCRIPT_OPTIONS,
  AGENDA_FONTE_SIZE_OPTIONS,
  AGENDA_FONTE_STYLE_OPTIONS,
  buildAgendaFontePreviewStyle,
  getAgendaFonteColor,
  normalizeAgendaFonteValue,
} from '../../agendaConfiguracaoFonte.js';
import {
  filterAgendaFontFamilies,
  resolveAgendaFontFamilies,
  resolveAgendaFontFamilyFromQuery,
} from '../../utils/agendaFontResolver.js';

function useOnClickOutside(ref, handler, active) {
  useEffect(() => {
    if (!active) return undefined;
    const onPointerDown = (event) => {
      const node = ref.current;
      if (!node || node.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [active, handler, ref]);
}

function AgendaFonteColorDropdown({ value, onChange, className = '', ariaLabel = 'Cor' }) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => getAgendaFonteColor(value), [value]);

  useOnClickOutside(rootRef, () => setOpen(false), open);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`agenda-fonte-color-dropdown${open ? ' is-open' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        className="agenda-fonte-color-dropdown__button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="agenda-fonte-color-dropdown__swatch" style={{ background: selected.value }} />
        <span className="agenda-fonte-color-dropdown__label">{selected.label}</span>
        <span className="agenda-fonte-color-dropdown__arrow" aria-hidden="true">▼</span>
      </button>
      <div
        className={`agenda-fonte-color-dropdown__list${open ? ' is-open' : ''}`}
        role="listbox"
        aria-hidden={!open}
      >
        {AGENDA_FONTE_COLOR_OPTIONS.map((item) => {
          const active = item.value.toLowerCase() === String(selected.value || '').toLowerCase();
          return (
            <button
              key={item.value}
              type="button"
              className={`agenda-fonte-color-dropdown__option${active ? ' is-active' : ''}`}
              onClick={() => handleSelect(item.value)}
              role="option"
              aria-selected={active}
            >
              <span className="agenda-fonte-color-dropdown__swatch" style={{ background: item.value }} />
              <span className="agenda-fonte-color-dropdown__option-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function normalizeSizeInput(value) {
  const raw = String(value || '').trim().replace(',', '.');
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  const nearest = Math.round(parsed / 2) * 2;
  return Math.max(8, Math.min(74, nearest));
}

export function AgendaFonteModal({ open, value, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(() => normalizeAgendaFonteValue(value));
  const [selectedFamily, setSelectedFamily] = useState(() => normalizeAgendaFonteValue(value).family);
  const [familySearch, setFamilySearch] = useState('');
  const [familyOptions, setFamilyOptions] = useState(() => AGENDA_FONTE_FAMILIES.slice());
  const [familyLoading, setFamilyLoading] = useState(false);
  const [sizeDraft, setSizeDraft] = useState(() => String(normalizeAgendaFonteValue(value).size || 8));

  useEffect(() => {
    if (!open) return;
    const next = normalizeAgendaFonteValue(value);
    setDraft(next);
    setSelectedFamily(next.family);
    setFamilySearch('');
    setSizeDraft(String(next.size || 8));
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setFamilyLoading(true);
    resolveAgendaFontFamilies()
      .then((families) => {
        if (!active) return;
        const normalized = Array.isArray(families) && families.length ? families.slice() : AGENDA_FONTE_FAMILIES.slice();
        setFamilyOptions(normalized);
      })
      .finally(() => {
        if (active) {
          setFamilyLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [open]);

  const styleOption = useMemo(() => {
    return AGENDA_FONTE_STYLE_OPTIONS.find((item) => item.bold === draft.bold && item.italic === draft.italic) || AGENDA_FONTE_STYLE_OPTIONS[0];
  }, [draft.bold, draft.italic]);

  const previewStyle = useMemo(() => buildAgendaFontePreviewStyle(draft), [draft]);
  const visibleFamilyOptions = useMemo(() => {
    const base = Array.isArray(familyOptions) && familyOptions.length ? familyOptions : AGENDA_FONTE_FAMILIES;
    const withSelected = base.some((family) => String(family).toLowerCase() === String(selectedFamily || '').toLowerCase())
      ? base
      : [selectedFamily, ...base].filter(Boolean);
    return filterAgendaFontFamilies(familySearch, withSelected);
  }, [familyOptions, familySearch, selectedFamily]);
  const familyInputValue = familySearch || selectedFamily;

  const updateDraft = (patch) => {
    setDraft((current) => {
      const nextPatch = typeof patch === 'function' ? patch(current) : patch;
      return normalizeAgendaFonteValue({ ...current, ...nextPatch });
    });
  };

  const handleFamilyChange = (event) => {
    const raw = String(event.target.value || '');
    setFamilySearch(raw);
  };

  const commitFamily = () => {
    const nextFamily = resolveAgendaFontFamilyFromQuery(familySearch, familyOptions, selectedFamily);
    setSelectedFamily(nextFamily);
    setFamilySearch('');
    updateDraft({ family: nextFamily });
  };

  const handleSizeChange = (event) => {
    setSizeDraft(event.target.value);
  };

  const commitSize = () => {
    const normalized = normalizeSizeInput(sizeDraft);
    if (normalized == null) {
      setSizeDraft(String(draft.size || 8));
      return;
    }
    setSizeDraft(String(normalized));
    updateDraft({ size: normalized });
  };

  const handleStyleChange = (event) => {
    const next = AGENDA_FONTE_STYLE_OPTIONS.find((item) => item.value === event.target.value) || AGENDA_FONTE_STYLE_OPTIONS[0];
    updateDraft({ bold: next.bold, italic: next.italic });
  };

  const handleConfirm = () => {
    onConfirm?.(normalizeAgendaFonteValue(draft));
  };

  return (
    <BranaModal
      open={open}
      title="Fonte"
      centered
      width={560}
      destroyOnClose
      maskClosable={false}
      keyboard
      onCancel={onCancel}
      styles={{ body: { padding: '6px 8px 8px' } }}
      footer={(
        <>
          <Button type="primary" onClick={handleConfirm}>
            Ok
          </Button>
          <Button onClick={onCancel}>Cancela</Button>
        </>
      )}
      className="agenda-fonte-modal"
    >
      <div className="agenda-fonte-shell" aria-label="Fonte">
        <div className="agenda-fonte-grid">
          <div className="agenda-fonte-column">
            <label className="agenda-fonte-label" htmlFor="agenda-fonte-family-input">Fonte:</label>
            <Input
              id="agenda-fonte-family-input"
              value={familyInputValue}
              onChange={handleFamilyChange}
              onBlur={commitFamily}
              onPressEnter={commitFamily}
              className="agenda-fonte-input"
              suffix={familyLoading ? <span className="agenda-fonte-loading" aria-hidden="true" /> : null}
            />
            <select
              className="agenda-fonte-select"
              size={8}
              value={selectedFamily}
              onChange={(event) => {
                const nextFamily = String(event.target.value || AGENDA_FONTE_DEFAULTS.family);
                setSelectedFamily(nextFamily);
                setFamilySearch('');
                updateDraft({ family: nextFamily });
              }}
            >
              {visibleFamilyOptions.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </div>

          <div className="agenda-fonte-column">
            <label className="agenda-fonte-label" htmlFor="agenda-fonte-style-input">Estilo da fonte:</label>
            <Input
              id="agenda-fonte-style-input"
              value={styleOption.label}
              readOnly
              className="agenda-fonte-input"
            />
            <select
              className="agenda-fonte-select"
              size={8}
              value={styleOption.value}
              onChange={handleStyleChange}
            >
              {AGENDA_FONTE_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="agenda-fonte-column agenda-fonte-column--size">
            <label className="agenda-fonte-label" htmlFor="agenda-fonte-size-input">Tamanho:</label>
            <Input
              id="agenda-fonte-size-input"
              value={sizeDraft}
              onChange={handleSizeChange}
              onBlur={commitSize}
              onPressEnter={commitSize}
              inputMode="numeric"
              className="agenda-fonte-input agenda-fonte-input--size"
            />
            <select
              className="agenda-fonte-select"
              size={8}
              value={String(draft.size || 8)}
              onChange={(event) => {
                const nextSize = Number(event.target.value || 8) || 8;
                setSizeDraft(String(nextSize));
                updateDraft({ size: nextSize });
              }}
            >
              {AGENDA_FONTE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="agenda-fonte-actions-top">
            <Button type="primary" onClick={handleConfirm}>Ok</Button>
            <Button onClick={onCancel}>Cancela</Button>
          </div>
        </div>

        <div className="agenda-fonte-bottom">
          <div className="agenda-fonte-effects-box">
            <div className="agenda-fonte-box-title">Efeitos</div>
            <label className="agenda-fonte-check">
              <Checkbox
                checked={draft.strike}
                onChange={(event) => updateDraft({ strike: event.target.checked })}
              />
              <span>Riscado</span>
            </label>
            <label className="agenda-fonte-check">
              <Checkbox
                checked={draft.underline}
                onChange={(event) => updateDraft({ underline: event.target.checked })}
              />
              <span>Sublinhado</span>
            </label>
            <div className="agenda-fonte-color-row">
              <span className="agenda-fonte-label agenda-fonte-label--inline">Cor:</span>
              <AgendaFonteColorDropdown
                value={draft.color}
                onChange={(nextColor) => updateDraft({ color: String(nextColor || AGENDA_FONTE_DEFAULTS.color).toLowerCase() })}
                ariaLabel="Cor"
              />
            </div>
          </div>

          <div className="agenda-fonte-preview-column">
            <div className="agenda-fonte-preview-box">
              <div className="agenda-fonte-box-title">Exemplo</div>
              <div className="agenda-fonte-sample" style={previewStyle}>
                AaBbYyZz
              </div>
            </div>
            <div className="agenda-fonte-script">
              <label className="agenda-fonte-label" htmlFor="agenda-fonte-script">Script:</label>
              <select
                id="agenda-fonte-script"
                className="agenda-fonte-select agenda-fonte-select--script"
                value={draft.script}
                onChange={(event) => updateDraft({ script: String(event.target.value || AGENDA_FONTE_DEFAULTS.script) })}
              >
                {AGENDA_FONTE_SCRIPT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </BranaModal>
  );
}
