import { message, Spin, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CenarioAnualModal } from './CenarioAnualModal.jsx';
import { CenarioFinanceiroTab } from './components/CenarioFinanceiroTab.jsx';
import { PerfilHorarioFixoTab } from './components/PerfilHorarioFixoTab.jsx';
import { PerfilHorarioFlexivelTab } from './components/PerfilHorarioFlexivelTab.jsx';
import { useCenarioAnual } from './hooks/useCenarioAnual.js';
import { calcularFixosAnuais } from './cenarioAnualApi.js';
import { calculateFinancialSummary } from './utils/cenarioAnualCalculations.js';
import { parseBrazilianNumber } from './utils/cenarioAnualNormalizers.js';
import { CENARIO_ANUAL_PROFILE_FLEX, CENARIO_ANUAL_PROFILE_FIXED } from './constants/cenarioAnualDefaults.js';

const TAB_FIXED = 'fixo';
const TAB_FLEX = 'flexivel';
const TAB_FINANCEIRO = 'financeiro';

export function CenarioAnualPage({ openRequestId = 0 }) {
  const [activeTab, setActiveTab] = useState(TAB_FIXED);
  const { state, setState, summary, flexSummary, loading, saving, error, saveError, saveSuccess, canSave, save, reload, validationErrors } = useCenarioAnual();
  const [open, setOpen] = useState(true);
  const [calculatingFixos, setCalculatingFixos] = useState(false);
  const [financeError, setFinanceError] = useState('');
  const lastOpenRequestRef = useRef(openRequestId);

  useEffect(() => {
    if (lastOpenRequestRef.current === openRequestId) {
      return;
    }
    lastOpenRequestRef.current = openRequestId;
    setOpen(true);
    setActiveTab(TAB_FIXED);
    void reload();
  }, [openRequestId, reload]);

  const selectedHours = state.modo_horas === CENARIO_ANUAL_PROFILE_FLEX
    ? flexSummary.total_horas_flex
    : summary.total_horas_fixo;

  const financeSummary = useMemo(() => calculateFinancialSummary({
    ...state,
    horas_ano: selectedHours,
  }), [selectedHours, state]);

  useEffect(() => {
    if (state.horas_ano === selectedHours) return;
    setState({ horas_ano: selectedHours });
  }, [selectedHours, setState, state.horas_ano]);

  const onFixedValuesChange = (_, allValues) => {
    const patch = { ...allValues };
    if (Object.prototype.hasOwnProperty.call(patch, 'num_consultorios')) {
      patch.num_consultorios = patch.num_consultorios === '' || patch.num_consultorios === null || patch.num_consultorios === undefined
        ? 0
        : Number(patch.num_consultorios);
    }
    setState(patch);
  };

  const onFlexValuesChange = (_, allValues) => {
    const nextTurnos = { ...(state.turnos_flex || {}) };
    for (const index of [1, 2, 3, 4, 5, 6]) {
      const key = String(index);
      nextTurnos[key] = {
        manha: parseBrazilianNumber(allValues[`manha_${key}`], 0),
        tarde: parseBrazilianNumber(allValues[`tarde_${key}`], 0),
        noite: parseBrazilianNumber(allValues[`noite_${key}`], 0),
        dias: parseBrazilianNumber(allValues[`dias_${key}`], 0),
      };
    }

    setState({
      num_consultorios_flex: allValues.num_consultorios_flex === '' || allValues.num_consultorios_flex === null || allValues.num_consultorios_flex === undefined
        ? 0
        : parseBrazilianNumber(allValues.num_consultorios_flex, 0),
      turnos_flex: nextTurnos,
    });
  };

  const onFinancialValuesChange = (_, allValues) => {
    const nextMode = String(allValues.modo_horas || CENARIO_ANUAL_PROFILE_FIXED);
    const nextHours = nextMode === CENARIO_ANUAL_PROFILE_FLEX ? flexSummary.total_horas_flex : summary.total_horas_fixo;
    setFinanceError('');
    setState({
      ano_base: allValues.ano_base === '' || allValues.ano_base === null || allValues.ano_base === undefined
        ? ''
        : parseBrazilianNumber(allValues.ano_base, 0),
      gasto_anual_particular: parseBrazilianNumber(allValues.gasto_anual_particular, 0),
      gasto_anual_empresa: parseBrazilianNumber(allValues.gasto_anual_empresa, 0),
      modo_horas: nextMode,
      horas_ano: nextHours,
      ir: parseBrazilianNumber(allValues.ir, 0),
      cd: parseBrazilianNumber(allValues.cd, 0),
      cartao: parseBrazilianNumber(allValues.cartao, 0),
    });
  };

  useEffect(() => {
    if (saveSuccess) {
      message.success(saveSuccess);
    }
  }, [saveSuccess]);

  useEffect(() => {
    if (saveError) {
      message.error(saveError);
    }
  }, [saveError]);

  const handleCalculateFixos = async (anoValue) => {
    const ano = parseInt(String(anoValue || '').trim(), 10);
    if (!Number.isFinite(ano) || ano < 1900 || ano > 3000) {
      setFinanceError('Informe um ano válido.');
      return;
    }

    setCalculatingFixos(true);
    setFinanceError('');
    try {
      const result = await calcularFixosAnuais({ ano });
      setState({
        fixo_pessoal: result.fixo_pessoal,
        fixo_empresa: result.fixo_empresa,
        custo_anual_backend: result.custo_anual,
      });
    } catch (err) {
      setFinanceError(err?.message || 'Falha ao calcular fixos.');
    } finally {
      setCalculatingFixos(false);
    }
  };

  const items = useMemo(() => ([
    {
      key: TAB_FIXED,
      label: 'Perfil horário fixo',
      children: (
        <PerfilHorarioFixoTab
          initialValues={state}
          summary={summary}
          onValuesChange={onFixedValuesChange}
          validationErrors={validationErrors}
        />
      ),
    },
    {
      key: TAB_FLEX,
      label: 'Perfil horário flexível',
      children: (
        <PerfilHorarioFlexivelTab
          initialValues={state}
          summary={flexSummary}
          onValuesChange={onFlexValuesChange}
        />
      ),
    },
    {
      key: TAB_FINANCEIRO,
      label: 'Cenário financeiro',
      children: (
        <CenarioFinanceiroTab
          initialValues={state}
          activeHours={selectedHours}
          fixedHours={summary.total_horas_fixo}
          flexHours={flexSummary.total_horas_flex}
          calcSummary={financeSummary}
          onValuesChange={onFinancialValuesChange}
          onCalculate={handleCalculateFixos}
          calculating={calculatingFixos}
          calcError={financeError}
          validationErrors={validationErrors}
        />
      ),
    },
  ]), [calculatingFixos, financeError, financeSummary, flexSummary, onFinancialValuesChange, onFixedValuesChange, selectedHours, state, summary]);

  if (loading) {
    return (
      <div className="cenario-anual-page">
        <div className="cenario-anual-state">
          <Spin />
          <Typography.Text type="secondary">Carregando cenário anual...</Typography.Text>
        </div>
      </div>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <div className="cenario-anual-page">
      <CenarioAnualModal
        open={open}
        title="Configuração de cenário anual"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onSave={save}
        items={items}
        width={activeTab === TAB_FLEX ? 980 : 820}
        footerPrimaryDisabled={!canSave}
        footerPrimaryLoading={saving}
        error={error}
      />
    </div>
  );
}
