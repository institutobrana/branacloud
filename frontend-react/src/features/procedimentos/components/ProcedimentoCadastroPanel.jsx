import { useEffect, useState } from 'react';
import { Checkbox, Input, Select } from 'antd';
import {
  resolveProcedimentoSymbolPreviewCandidates,
  resolveProcedimentoSymbolSelectValue,
  resolveProcedimentoSymbolSelection,
  parseMoneyInput,
  toMoneyInputValue,
} from '../procedimentosEditorMappers.js';
import { PROCEDIMENTO_FORMA_COBRANCA_OPTIONS } from '../procedimentosEditorConstants.js';

const symbolPreviewPlaceholderStyle = {
  display: 'grid',
  placeItems: 'center',
  color: 'rgba(75, 85, 99, 0.78)',
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1.1,
  textAlign: 'center',
};

function ProcedimentoEditorSymbolPreview({ candidates, label }) {
  const sources = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sources.join('|')]);

  const src = sources[index] || '';
  if (src) {
    return (
      <img
        className="procedimento-editor-symbol-preview"
        src={src}
        alt={label ? `Símbolo gráfico: ${label}` : 'Símbolo gráfico'}
        onError={() => setIndex((current) => (current < sources.length - 1 ? current + 1 : sources.length))}
      />
    );
  }

  return (
    <div
      className="procedimento-editor-symbol-preview"
      role="img"
      aria-label="Símbolo gráfico sem imagem"
      style={symbolPreviewPlaceholderStyle}
    >
      <span>Sem imagem</span>
    </div>
  );
}

export function ProcedimentoCadastroPanel({
  form,
  disabled = false,
  loading = false,
  especialidadeOptions,
  procedimentoGenericoOptions,
  simboloOptions,
  onChange,
}) {
  const values = form || {};
  const symbolValue = resolveProcedimentoSymbolSelectValue(simboloOptions, values) || undefined;
  const { option: selectedSymbol, ambiguous } = resolveProcedimentoSymbolSelection(simboloOptions, values);
  const previewCandidates = resolveProcedimentoSymbolPreviewCandidates(simboloOptions, values);

  const update = (field, value) => {
    onChange?.(field, value);
  };

  const updateMoney = (field, value) => {
    update(field, String(value ?? ''));
  };

  const normalizeMoney = (field) => {
    const current = String(values?.[field] ?? '');
    if (!current.trim()) {
      update(field, '');
      return;
    }
    update(field, toMoneyInputValue(parseMoneyInput(current)));
  };

  return (
    <section className="procedimento-editor-panel procedimento-editor-panel-cadastro">
      <div className="procedimento-editor-panel-title">Painel de Cadastro</div>
      <div className="procedimento-editor-grid">
        <div className="procedimento-editor-cadastro-top">
          <ProcedimentoEditorSymbolPreview candidates={previewCandidates} label={selectedSymbol?.descricao || selectedSymbol?.codigo || values?.simbolo_grafico || ''} />
          <label className="procedimento-editor-field procedimento-editor-name-block">
            <span>Nome da intervenção / procedimento</span>
            <Input value={values.nome || ''} disabled={disabled || loading} onChange={(event) => update('nome', event.target.value)} />
          </label>
        </div>

        <label className="procedimento-editor-field procedimento-editor-field-wide">
          <span>Procedimento genérico</span>
          <Select
            showSearch
            allowClear
            placeholder="Selecione..."
            value={values.procedimento_generico_id ?? undefined}
            options={procedimentoGenericoOptions}
            disabled={disabled || loading}
            onChange={(value) => update('procedimento_generico_id', value || null)}
            filterOption={(input, option) => String(option?.label || '').toLowerCase().includes(String(input || '').toLowerCase())}
          />
        </label>

        <div className="procedimento-editor-row procedimento-editor-row-two">
          <label className="procedimento-editor-field">
            <span>Código</span>
            <Input value={values.codigo || ''} disabled={disabled || loading} onChange={(event) => update('codigo', event.target.value)} />
          </label>

          <label className="procedimento-editor-field">
            <span>Especialidade</span>
            <Select
              allowClear
              placeholder="Selecione..."
              value={values.especialidade || undefined}
              options={especialidadeOptions}
              disabled={disabled || loading}
              onChange={(value) => update('especialidade', value || '')}
            />
          </label>
        </div>

        <div className="procedimento-editor-row procedimento-editor-row-two">
          <label className="procedimento-editor-field">
            <span>Símbolo gráfico</span>
            <Select
              allowClear
              placeholder="Selecione..."
              value={symbolValue}
              options={simboloOptions}
              showSearch
              optionFilterProp="label"
              disabled={disabled || loading}
              onChange={(value) => {
                const nextOption = (Array.isArray(simboloOptions) ? simboloOptions : []).find(
                  (item) => Number(item.catalogId || item.value || 0) === Number(value || 0),
                );
                update('simbolo_catalogo_id', nextOption?.catalogId ?? null);
                update('simbolo_grafico_legacy_id', nextOption?.legacyId ?? null);
                update('simbolo_grafico', nextOption?.codigo || '');
                update('mostrar_simbolo', !!nextOption);
              }}
            />
            {ambiguous ? <span className="procedimento-editor-field-hint">Símbolo com ambiguidade no contrato persistido.</span> : null}
          </label>

          <label className="procedimento-editor-field">
            <span>Garantia em meses</span>
            <Input value={values.garantia_meses ?? 0} disabled={disabled || loading} onChange={(event) => update('garantia_meses', event.target.value)} />
          </label>
        </div>

        <div className="procedimento-editor-row procedimento-editor-row-three">
          <label className="procedimento-editor-field">
            <span>Forma de cobrança</span>
            <Select
              allowClear
              placeholder="Selecione..."
              value={values.forma_cobranca || undefined}
              options={PROCEDIMENTO_FORMA_COBRANCA_OPTIONS}
              disabled={disabled || loading}
              onChange={(value) => update('forma_cobranca', value || '')}
            />
          </label>

          <label className="procedimento-editor-field">
            <span>Valor de repasse</span>
            <Input
              value={values.valor_repasse ?? ''}
              inputMode="decimal"
              disabled={disabled || loading}
              onChange={(event) => updateMoney('valor_repasse', event.target.value)}
              onBlur={() => normalizeMoney('valor_repasse')}
            />
          </label>

          <label className="procedimento-editor-field">
            <span>Valor do paciente</span>
            <Input
              value={values.valor_paciente ?? ''}
              inputMode="decimal"
              disabled={disabled || loading}
              onChange={(event) => updateMoney('valor_paciente', event.target.value)}
              onBlur={() => normalizeMoney('valor_paciente')}
            />
          </label>
        </div>

        <div className="procedimento-editor-row procedimento-editor-row-two">
          <label className="procedimento-editor-field">
            <span>Custo de laboratório</span>
            <Input
              value={values.custo_lab ?? ''}
              inputMode="decimal"
              disabled={disabled || loading}
              onChange={(event) => updateMoney('custo_lab', event.target.value)}
              onBlur={() => normalizeMoney('custo_lab')}
            />
          </label>

          <label className="procedimento-editor-field">
            <span>Tempo de execução</span>
            <Input value={values.tempo ?? 0} disabled={disabled || loading} onChange={(event) => update('tempo', event.target.value)} />
          </label>
        </div>

        <div className="procedimento-editor-checks">
          <Checkbox checked={!!values.inativo} disabled={disabled || loading} onChange={(event) => update('inativo', event.target.checked)}>
            Inativar intervenção
          </Checkbox>
          <Checkbox checked={!!values.preferido} disabled={disabled || loading} onChange={(event) => update('preferido', event.target.checked)}>
            Incluir na lista de preferidos
          </Checkbox>
        </div>

        <label className="procedimento-editor-field procedimento-editor-field-wide">
          <span>Observações</span>
          <Input.TextArea
            value={values.observacoes || ''}
            disabled={disabled || loading}
            rows={3}
            style={{ height: 68, minHeight: 68, maxHeight: 72, resize: 'none' }}
            onChange={(event) => update('observacoes', event.target.value)}
          />
        </label>

        <div className="procedimento-editor-row procedimento-editor-row-two">
          <label className="procedimento-editor-field">
            <span>Inclusão</span>
            <Input value={values.data_inclusao || ''} disabled />
          </label>

          <label className="procedimento-editor-field">
            <span>Alteração</span>
            <Input value={values.data_alteracao || ''} disabled />
          </label>
        </div>
      </div>
    </section>
  );
}
