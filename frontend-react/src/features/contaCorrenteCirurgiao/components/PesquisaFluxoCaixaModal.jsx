import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import { CriteriosAdicionaisTab } from './CriteriosAdicionaisTab.jsx';
import { CriteriosGeraisTab } from './CriteriosGeraisTab.jsx';
import { OpcoesRelatorioTab } from './OpcoesRelatorioTab.jsx';
import { RelatorioContaCorrentePreviewModal } from './RelatorioContaCorrentePreviewModal.jsx';
import {
  obterPreferenciasRelatorioContaCorrenteCirurgiao,
  salvarPreferenciasRelatorioContaCorrenteCirurgiao,
  consultarRelatorioContaCorrente,
} from '../contaCorrenteCirurgiaoApi.js';
import { exportarRelatorioContaCorrenteArquivo } from '../relatorioContaCorrenteExport.js';
import { abrirImpressaoRelatorioContaCorrente } from '../relatorioContaCorrentePrint.js';

const REPORT_OPTION_CATALOG = [
  { key: 'categoria', label: 'Categoria' },
  { key: 'cirurgiao', label: 'Cirurgião' },
  { key: 'complemento', label: 'Complemento' },
  { key: 'credito', label: 'Crédito' },
  { key: 'data', label: 'Data' },
  { key: 'debito', label: 'Débito' },
  { key: 'grupo', label: 'Grupo' },
  { key: 'historico', label: 'Histórico' },
  { key: 'lancamento', label: 'Lançamento' },
  { key: 'numero_documento', label: 'Nº Documento' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'referencia', label: 'Referência' },
  { key: 'saldo', label: 'Saldo' },
];

function normalizeReportOptionKey(value) {
  return String(value ?? '').trim().toLowerCase();
}

function findLabelByKey(key) {
  return REPORT_OPTION_CATALOG.find((item) => item.key === key)?.label || key;
}

function buildReportOptionsSnapshot(preferences) {
  const allowedKeys = new Set(REPORT_OPTION_CATALOG.map((item) => item.key));
  const selectedFields = Array.isArray(preferences?.selectedFields)
    ? preferences.selectedFields.map((field) => normalizeReportOptionKey(field)).filter((field) => allowedKeys.has(field))
    : [];
  const reportName = String(preferences?.reportName ?? 'Relatório de contas do cirurgião').trim() || 'Relatório de contas do cirurgião';
  const rawOutput = String(preferences?.output ?? '').trim().toLowerCase();
  const output = ['tela', 'pdf', 'html', 'rtf', 'xls', 'txt', 'csv', 'imprimir'].includes(rawOutput)
    ? rawOutput
    : (rawOutput === 'arquivo' ? 'pdf' : 'tela');
  const orientation = ['retrato', 'paisagem'].includes(normalizeReportOptionKey(preferences?.orientation))
    ? normalizeReportOptionKey(preferences.orientation)
    : 'retrato';

  return {
    selectedFields,
    selectedItems: selectedFields.map((field) => findLabelByKey(field)),
    orderField: selectedFields[0] || '',
    order: findLabelByKey(selectedFields[0] || ''),
    reportName,
    output,
    mode: orientation,
  };
}

function buildReportOptionsPayload(reportState = {}) {
  const allowedKeys = new Set(REPORT_OPTION_CATALOG.map((item) => item.key));
  const selectedFields = Array.isArray(reportState.selectedFields)
    ? reportState.selectedFields.map((field) => normalizeReportOptionKey(field)).filter((field) => allowedKeys.has(field))
    : [];
  const output = ['tela', 'pdf', 'html', 'rtf', 'xls', 'txt', 'csv', 'imprimir'].includes(normalizeReportOptionKey(reportState.output))
    ? normalizeReportOptionKey(reportState.output)
    : 'tela';
  const orientation = ['retrato', 'paisagem'].includes(normalizeReportOptionKey(reportState.orientation))
    ? normalizeReportOptionKey(reportState.orientation)
    : 'retrato';

  return {
    version: 1,
    selectedFields,
    reportName: String(reportState.reportName ?? '').trim(),
    output,
    orientation,
  };
}

function resolvePreviewOrientation(reportState = {}) {
  const explicitOrientation = normalizeReportOptionKey(reportState?.orientation || reportState?.mode);
  if (['retrato', 'paisagem'].includes(explicitOrientation)) {
    return explicitOrientation;
  }

  return 'retrato';
}

function PesquisaFluxoCaixaTab({ tabKey, surgeonOptions, surgeonId, onStateChange, initialPreferences, loadingPreferences }) {
  if (tabKey === 'geral') return <CriteriosGeraisTab surgeonOptions={surgeonOptions} initialSurgeonId={surgeonId} onStateChange={onStateChange} />;
  if (tabKey === 'adicionais') return <CriteriosAdicionaisTab onStateChange={onStateChange} />;
  if (tabKey === 'opcoes') return <OpcoesRelatorioTab onStateChange={onStateChange} initialPreferences={initialPreferences} loadingPreferences={loadingPreferences} />;
  return <div className="pesquisa-fluxo-caixa-modal-placeholder" data-tab-key={tabKey} />;
}

export function PesquisaFluxoCaixaModal({ open, activeKey, onTabChange, onClose, surgeonOptions, surgeonId }) {
  const [gerais, setGerais] = useState(null);
  const [adicionais, setAdicionais] = useState(null);
  const [opcoes, setOpcoes] = useState(null);
  const [reportOptionsPreferences, setReportOptionsPreferences] = useState(null);
  const [reportOptionsLoading, setReportOptionsLoading] = useState(false);
  const [ultimaConfiguracao, setUltimaConfiguracao] = useState(null);
  const [ultimoRelatorio, setUltimoRelatorio] = useState(null);
  const [erroRelatorio, setErroRelatorio] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const reportOptionsRef = useRef(null);

  const handleReportOptionsChange = (nextState) => {
    setOpcoes(nextState);
    reportOptionsRef.current = nextState;
  };

  useEffect(() => {
    if (!open) {
      setReportOptionsLoading(false);
      return;
    }

    let active = true;
    setOpcoes(null);
    setReportOptionsLoading(true);
    setReportOptionsPreferences(null);
    reportOptionsRef.current = null;

    obterPreferenciasRelatorioContaCorrenteCirurgiao()
      .then((preferences) => {
        if (!active) return;
        const snapshot = buildReportOptionsSnapshot(preferences);
        setReportOptionsPreferences(snapshot);
        reportOptionsRef.current = snapshot;
      })
      .catch(() => {
        if (!active) return;
        setReportOptionsPreferences(null);
        reportOptionsRef.current = null;
      })
      .finally(() => {
        if (!active) return;
        setReportOptionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const reportOptionsState = reportOptionsRef.current || opcoes || reportOptionsPreferences || null;

  const configuracaoConsolidada = useMemo(() => ({
    filters: {
      criteriosGerais: gerais,
      criteriosAdicionais: adicionais,
    },
    reportOptions: reportOptionsState,
  }), [adicionais, gerais, reportOptionsState]);

  const formatDate = (value) => {
    if (!value) return '';
    if (typeof value.format === 'function') return value.format('YYYY-MM-DD');
    return String(value);
  };

  const getOptionLabel = (options = [], rawValue) => {
    if (rawValue == null || rawValue === '') return '';
    const match = options.find((item) => String(item.value) === String(rawValue));
    return match?.label ?? String(rawValue);
  };

  const buildReportParams = () => {
    const filters = configuracaoConsolidada.filters || {};
    const geraisState = filters.criteriosGerais || {};
    const adicionaisState = filters.criteriosAdicionais || {};
    const reportState = configuracaoConsolidada.reportOptions || {};
    const contaCorrenteOption = Array.isArray(surgeonOptions)
      ? surgeonOptions.find((item) => String(item.value) === String(geraisState.contaCorrente))
      : null;
    const contaCorrenteLabel = String(contaCorrenteOption?.label || '').trim().toLowerCase();
    const contaCorrenteValue = contaCorrenteOption?.value ?? null;
    const conta = contaCorrenteLabel === 'clínica' ? 'CLINICA' : 'CIRURGIAO';

    const params = {
      conta,
      tipo_lancamento: geraisState.tipoLancamentoEnabled ? geraisState.tipoLancamento : '',
      grupo: geraisState.grupoEnabled ? getOptionLabel(geraisState.groupOptions, geraisState.grupo) : '',
      tipo_grupo: geraisState.tipoGrupoEnabled ? geraisState.tipoGrupo : '',
      categoria: geraisState.categoriaEnabled ? getOptionLabel(geraisState.categoryOptions, geraisState.categoria) : '',
      situacao: adicionaisState.situacaoEnabled ? adicionaisState.situacao : '',
      forma_pagamento: adicionaisState.formaPagamentoEnabled ? getOptionLabel(adicionaisState.paymentOptions, adicionaisState.formaPagamento) : '',
      referencia: adicionaisState.referenciaEnabled ? adicionaisState.referencia : '',
      complemento: adicionaisState.complementoEnabled ? adicionaisState.complemento : '',
      documento: adicionaisState.documentoEnabled ? adicionaisState.documento : '',
      data_venc_ini: geraisState.periodoVencimentoEnabled ? formatDate(geraisState.periodoVencimentoInicio) : '',
      data_venc_fim: geraisState.periodoVencimentoEnabled ? formatDate(geraisState.periodoVencimentoFim) : '',
      data_lanc_ini: geraisState.periodoLancamentoEnabled ? formatDate(geraisState.periodoLancamentoInicio) : '',
      data_lanc_fim: geraisState.periodoLancamentoEnabled ? formatDate(geraisState.periodoLancamentoFim) : '',
      ordem: reportState.order || '',
    };

    if (conta === 'CIRURGIAO' && contaCorrenteValue != null) {
      params.prestador_id = contaCorrenteValue;
    }

    if (adicionaisState.tributaveis && !adicionaisState.nTributaveis) {
      params.tributavel = '1';
    } else if (!adicionaisState.tributaveis && adicionaisState.nTributaveis) {
      params.tributavel = '0';
    } else {
      params.tributavel = 'todos';
    }

    return params;
  };

  const persistReportOptions = async (reportState) => {
    if (!reportState) {
      return null;
    }

    const payload = buildReportOptionsPayload(reportState);
    try {
      const saved = await salvarPreferenciasRelatorioContaCorrenteCirurgiao(payload);
      if (saved) {
        const snapshot = buildReportOptionsSnapshot(saved);
        setReportOptionsPreferences(snapshot);
        reportOptionsRef.current = snapshot;
      }
      return saved;
    } catch (error) {
      console.error('Falha ao salvar preferencias do relatorio da conta corrente do cirurgiao.', error);
      return null;
    }
  };

  const handleOk = async () => {
    const reportState = reportOptionsRef.current || opcoes || reportOptionsPreferences || null;
    const next = {
      ...configuracaoConsolidada,
      validation: {
        hasGeneral: Boolean(gerais),
        hasAdditional: Boolean(adicionais),
        hasReportOptions: Boolean(reportState),
      },
    };
    setUltimaConfiguracao(next);
    setErroRelatorio('');

    try {
      void persistReportOptions(reportState);
      const relatorio = await consultarRelatorioContaCorrente(buildReportParams());
      setUltimoRelatorio(relatorio);
      const saida = String(reportState?.output || 'tela').trim().toLowerCase();
      const resolvedOrientation = resolvePreviewOrientation(reportState);

      if (saida === 'tela') {
        setOverlayOpen(false);
        setPreviewOpen(true);
        return;
      }

      if (['pdf', 'html', 'rtf', 'xls', 'txt', 'csv'].includes(saida)) {
        exportarRelatorioContaCorrenteArquivo({
          reportData: relatorio,
          selectedItems: reportState?.selectedItems,
          reportName: reportState?.reportName,
          format: saida.toUpperCase(),
          orientation: resolvedOrientation,
          orderLabel: reportState?.order,
        });
        return;
      }

      if (saida === 'imprimir') {
        const result = abrirImpressaoRelatorioContaCorrente({
          reportData: relatorio,
          selectedItems: reportState?.selectedItems,
          reportName: reportState?.reportName,
          orderLabel: reportState?.order,
          orientation: resolvedOrientation,
          reportOutput: reportState?.output,
        });
        if (!result?.ok) {
          setErroRelatorio(result?.error || 'Nao foi possivel iniciar a impressao');
        }
        return;
      }
    } catch (error) {
      setUltimoRelatorio(null);
      setErroRelatorio(error?.message || 'Falha ao consultar relatorio');
    }
  };

  return (
    <>
      <Modal
        open={open || overlayOpen}
        title="Pesquisa fluxo de caixa"
        onCancel={() => {
          setOverlayOpen(false);
          onClose?.();
        }}
        zIndex={overlayOpen ? 1100 : 1000}
        footer={[
          <Button key="novo" onClick={() => {}}>
            Novo
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            Ok
          </Button>,
          <Button key="cancel" onClick={onClose}>
            Cancela
          </Button>,
        ]}
        width={712}
        destroyOnClose
        maskClosable={false}
        keyboard
        centered
        className="conta-corrente-cirurgiao-modal conta-corrente-cirurgiao-pesquisa-modal"
        styles={{
          body: {
            padding: '10px 12px 12px',
          },
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={onTabChange}
          type="card"
          className="conta-corrente-cirurgiao-classic-tabs conta-corrente-cirurgiao-pesquisa-tabs"
          items={[
            { key: 'geral', label: 'Critérios gerais', children: <PesquisaFluxoCaixaTab tabKey="geral" surgeonOptions={surgeonOptions} surgeonId={surgeonId} onStateChange={setGerais} /> },
            { key: 'adicionais', label: 'Critérios adicionais', children: <PesquisaFluxoCaixaTab tabKey="adicionais" surgeonOptions={surgeonOptions} surgeonId={surgeonId} onStateChange={setAdicionais} /> },
            { key: 'opcoes', label: 'Opções de relatório', children: <PesquisaFluxoCaixaTab tabKey="opcoes" surgeonOptions={surgeonOptions} surgeonId={surgeonId} onStateChange={handleReportOptionsChange} initialPreferences={reportOptionsPreferences} loadingPreferences={reportOptionsLoading} /> },
          ]}
        />
        {ultimaConfiguracao ? <pre className="pesquisa-fluxo-caixa-modal-placeholder" aria-hidden="true" style={{ display: 'none' }}>{JSON.stringify(ultimaConfiguracao)}</pre> : null}
        {ultimoRelatorio ? <pre className="pesquisa-fluxo-caixa-modal-placeholder" aria-hidden="true" style={{ display: 'none' }}>{JSON.stringify(ultimoRelatorio)}</pre> : null}
        {erroRelatorio ? <pre className="pesquisa-fluxo-caixa-modal-placeholder" aria-hidden="true" style={{ display: 'none' }}>{JSON.stringify(erroRelatorio)}</pre> : null}
      </Modal>
      <RelatorioContaCorrentePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onFilter={() => setOverlayOpen(true)}
        reportData={ultimoRelatorio}
        reportName={reportOptionsState?.reportName}
        selectedItems={reportOptionsState?.selectedItems}
        orderLabel={reportOptionsState?.order}
        reportOutput={reportOptionsState?.output}
        orientation={resolvePreviewOrientation(reportOptionsState)}
      />
    </>
  );
}
