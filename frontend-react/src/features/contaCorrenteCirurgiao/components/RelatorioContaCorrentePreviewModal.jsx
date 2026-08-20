import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import { abrirImpressaoRelatorioContaCorrente } from '../relatorioContaCorrentePrint.js';
import {
  formatDateContaCorrente as formatDate,
  formatMoneyContaCorrente as formatMoney,
  getRelatorioContaCorrenteCellValue,
  getRelatorioContaCorrenteColumns,
  getRelatorioContaCorrenteOrientationConfig,
  getRelatorioContaCorrenteTotals,
} from '../relatorioContaCorrenteModel.js';

function clampPositiveInteger(value, fallback = 1) {
  const number = Math.trunc(Number(value) || 0);
  if (Number.isFinite(number) && number > 0) return number;
  const safeFallback = Math.trunc(Number(fallback) || 1);
  return safeFallback > 0 ? safeFallback : 1;
}

function measureElementHeight(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  if (rect.height > 0) return rect.height;
  return element.offsetHeight || 0;
}

function createPageSlices(items, rowsPerPage, rowsPerLastPage) {
  const slices = [];
  let start = 0;
  const bodyCapacity = clampPositiveInteger(rowsPerPage, 1);
  const lastCapacity = clampPositiveInteger(Math.min(rowsPerLastPage || bodyCapacity, bodyCapacity), bodyCapacity);

  while (start < items.length) {
    const remaining = items.length - start;
    const capacity = remaining <= lastCapacity ? lastCapacity : bodyCapacity;
    slices.push(items.slice(start, start + capacity));
    start += capacity;
  }

  if (!slices.length) slices.push([]);
  return slices;
}

export function RelatorioContaCorrentePreviewModal({
  open,
  onClose,
  onFilter,
  reportData,
  reportName,
  selectedItems,
  orderLabel,
  reportOutput,
  orientation,
}) {
  const items = useMemo(() => (Array.isArray(reportData?.itens) ? reportData.itens : []), [reportData]);
  const columns = useMemo(() => getRelatorioContaCorrenteColumns(selectedItems), [selectedItems]);
  const totals = useMemo(() => getRelatorioContaCorrenteTotals(reportData), [reportData]);
  const totalCredito = totals.totalCredito;
  const totalDebito = totals.totalDebito;
  const saldoFinal = totals.saldoFinal;
  const title = String(reportName || 'Relatório de contas do cirurgião').trim();
  const generatedAt = useMemo(() => new Date(), [open]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pageGeometry, setPageGeometry] = useState(null);

  const measureSheetRef = useRef(null);
  const measureHeadRef = useRef(null);
  const measureTheadRef = useRef(null);
  const measureRowRef = useRef(null);
  const measureFootRef = useRef(null);

  const orientationConfig = useMemo(() => getRelatorioContaCorrenteOrientationConfig(orientation), [orientation]);
  const zoomValue = Math.min(200, Math.max(50, Number(zoom || 100) || 100));
  const zoomFactor = zoomValue / 100;
  const fallbackBodyRows = Math.max(1, Math.floor(orientationConfig.width >= orientationConfig.height ? 34 : 26));
  const geometryReady = Boolean(pageGeometry && Number(pageGeometry.bodyRowsPerPage) > 0 && Number(pageGeometry.lastPageRows) > 0);
  const bodyRowsPerPage = clampPositiveInteger(pageGeometry?.bodyRowsPerPage, fallbackBodyRows);
  const lastPageRows = clampPositiveInteger(pageGeometry?.lastPageRows, bodyRowsPerPage);
  const pageSlices = useMemo(
    () => (geometryReady ? createPageSlices(items, bodyRowsPerPage, lastPageRows) : []),
    [bodyRowsPerPage, geometryReady, items, lastPageRows],
  );
  const totalPaginas = pageSlices.length;
  const paginaSegura = geometryReady ? Math.min(Math.max(1, Number(paginaAtual) || 1), totalPaginas) : 1;
  const itensPagina = geometryReady ? (pageSlices[paginaSegura - 1] || []) : [];
  const mostrarTotais = geometryReady && paginaSegura === totalPaginas;
  const viewportHeight = Math.max(1, Math.round(orientationConfig.height * zoomFactor));
  const viewportWidth = Math.max(1, Math.round(orientationConfig.width * zoomFactor));

  useEffect(() => {
    if (!open) return;
    setPaginaAtual(1);
    setZoom(100);
  }, [open, reportData, orientation, selectedItems, reportName, reportOutput, orderLabel]);

  useEffect(() => {
    if (!geometryReady) return;
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [geometryReady, paginaAtual, totalPaginas]);

  useEffect(() => {
    if (!open) return undefined;

    let frame = 0;
    let observer = null;
    let cancelled = false;
    let retryCount = 0;
    const maxMeasureRetries = 8;

    const scheduleMeasure = () => {
      if (cancelled) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    const measure = () => {
      if (cancelled) return;
      const sheet = measureSheetRef.current;
      const head = measureHeadRef.current;
      const thead = measureTheadRef.current;
      const row = measureRowRef.current;
      const foot = measureFootRef.current;

      if (!sheet || !head || !thead || !row) {
        if (retryCount < maxMeasureRetries) {
          retryCount += 1;
          scheduleMeasure();
        }
        return;
      }

      const sheetStyle = window.getComputedStyle(sheet);
      const headStyle = window.getComputedStyle(head);
      const theadStyle = window.getComputedStyle(thead);
      const footStyle = foot ? window.getComputedStyle(foot) : null;

      const padTop = Number.parseFloat(sheetStyle.paddingTop || '0') || 0;
      const padBottom = Number.parseFloat(sheetStyle.paddingBottom || '0') || 0;
      const headMarginBottom = Number.parseFloat(headStyle.marginBottom || '0') || 0;
      const theadMarginTop = Number.parseFloat(theadStyle.marginTop || '0') || 0;
      const theadMarginBottom = Number.parseFloat(theadStyle.marginBottom || '0') || 0;
      const footerMarginTop = Number.parseFloat(footStyle?.marginTop || '0') || 0;
      const footerMarginBottom = Number.parseFloat(footStyle?.marginBottom || '0') || 0;

      const sheetHeight = measureElementHeight(sheet) || orientationConfig.height;
      const headHeight = measureElementHeight(head);
      const theadHeight = measureElementHeight(thead);
      const rowHeight = Math.max(1, measureElementHeight(row));
      const footerReserve = foot ? Math.max(0, measureElementHeight(foot) + footerMarginTop + footerMarginBottom) : 0;

      const availableBodyHeight = Math.max(
        1,
        sheetHeight
          - padTop
          - padBottom
          - headHeight
          - headMarginBottom
          - theadHeight
          - theadMarginTop
          - theadMarginBottom,
      );

      const normalRows = Math.max(1, Math.floor(availableBodyHeight / rowHeight));
      const lastRows = Math.max(1, Math.floor(Math.max(1, availableBodyHeight - footerReserve) / rowHeight));

      setPageGeometry((current) => {
        const next = {
          bodyRowsPerPage: normalRows,
          lastPageRows: Math.min(normalRows, lastRows),
          rowHeight,
          sheetHeight,
          availableBodyHeight,
          footerReserve,
        };

        if (
          current
          && current.bodyRowsPerPage === next.bodyRowsPerPage
          && current.lastPageRows === next.lastPageRows
          && current.rowHeight === next.rowHeight
          && current.sheetHeight === next.sheetHeight
          && current.availableBodyHeight === next.availableBodyHeight
          && current.footerReserve === next.footerReserve
        ) {
          return current;
        }

        return next;
      });
    };

    frame = window.requestAnimationFrame(measure);

    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(() => {
        if (cancelled) return;
        retryCount = 0;
        scheduleMeasure();
      });

      [measureSheetRef.current, measureHeadRef.current, measureTheadRef.current, measureRowRef.current, measureFootRef.current]
        .filter(Boolean)
        .forEach((element) => observer.observe(element));
    }

    const onResize = () => {
      if (cancelled) return;
      retryCount = 0;
      scheduleMeasure();
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      if (observer) observer.disconnect();
    };
  }, [open, orientationConfig.height, orientationConfig.width, items.length, columns.length, totalCredito, totalDebito, saldoFinal, title, orderLabel, reportOutput, pageGeometry?.bodyRowsPerPage, pageGeometry?.lastPageRows]);

  const handleFilter = () => {
    onFilter?.();
  };

  const handlePrint = () => {
    const result = abrirImpressaoRelatorioContaCorrente({
      reportData,
      selectedItems,
      reportName,
      orderLabel,
      orientation,
      reportOutput,
    });

    if (result?.ok === false) {
      window.alert(result?.error || 'Nao foi possivel iniciar a impressao');
    }
  };

  const handlePaginaChange = (event) => {
    const value = Number(event.target.value || 0) || 1;
    const next = Math.min(Math.max(1, Math.trunc(value)), totalPaginas);
    setPaginaAtual(next);
  };

  const handleZoomChange = (event) => {
    const value = Number(event.target.value || 0) || 100;
    const next = Math.min(200, Math.max(50, Math.trunc(value)));
    setZoom(next);
  };

  const sampleRow = items[0] || {};

  return (
    <Modal
      open={open}
      title={null}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Fecha
        </Button>,
      ]}
      width="100%"
      centered
      destroyOnClose
      maskClosable={false}
      keyboard
      wrapClassName="conta-corrente-cirurgiao-preview-modal-wrap"
      className="conta-corrente-cirurgiao-modal conta-corrente-cirurgiao-preview-modal"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="conta-corrente-cirurgiao-preview-panel">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10000px auto auto -10000px',
            width: `${orientationConfig.width}px`,
            visibility: 'hidden',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            ref={measureSheetRef}
            className={`conta-corrente-cirurgiao-preview-sheet ${orientationConfig.className}`}
            style={{
              width: `${orientationConfig.width}px`,
              minHeight: `${orientationConfig.height}px`,
              transform: 'none',
              left: 0,
              top: 0,
            }}
          >
            <div ref={measureHeadRef} className="conta-corrente-cirurgiao-preview-head">
              <div className="conta-corrente-cirurgiao-preview-head-text">
                <div className="conta-corrente-cirurgiao-preview-head-caption">Conta corrente do cirurgião</div>
                <div className="conta-corrente-cirurgiao-preview-title">{title}</div>
                <div className="conta-corrente-cirurgiao-preview-user">{String(reportOutput || 'Tela')}</div>
              </div>
              <div className="conta-corrente-cirurgiao-preview-meta">
                <span>{generatedAt.toLocaleDateString('pt-BR')}</span>
                <span>{generatedAt.toLocaleTimeString('pt-BR')}</span>
                <span>{String(orderLabel || '').trim()}</span>
              </div>
            </div>

            <table className="conta-corrente-cirurgiao-preview-table">
              <thead ref={measureTheadRef}>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr ref={measureRowRef}>
                  {columns.map((column) => {
                    const normalized = String(column || '').trim().toLowerCase();
                    const isMoney = ['débito', 'debito', 'crédito', 'credito', 'saldo'].includes(normalized);
                    return (
                      <td key={column} className={isMoney ? 'money' : ''}>
                        {getRelatorioContaCorrenteCellValue(sampleRow, column) || (isMoney ? '-' : '')}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
              <tfoot ref={measureFootRef}>
                <tr>
                  <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                    Total crédito
                  </td>
                  <td className="money">{formatMoney(totalCredito)}</td>
                </tr>
                <tr>
                  <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                    Total débito
                  </td>
                  <td className="money">{formatMoney(totalDebito)}</td>
                </tr>
                <tr>
                  <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                    Saldo final
                  </td>
                  <td className="money">{formatMoney(saldoFinal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="conta-corrente-cirurgiao-preview-toolbar">
          <Button onClick={handleFilter}>Filtra</Button>
          <Button onClick={handlePrint}>Imprime</Button>
          <Button onClick={onClose}>Fecha</Button>
          <label>
            Página:
            <input type="number" min="1" max={Math.max(totalPaginas, 1)} step="1" value={paginaSegura} onChange={handlePaginaChange} disabled={!geometryReady} />
          </label>
          <span className="conta-corrente-cirurgiao-preview-total">de {geometryReady ? totalPaginas : '...'}</span>
          <label>
            Zoom:
            <input type="number" min="50" max="200" step="1" value={zoomValue} onChange={handleZoomChange} />
          </label>
          <span className="conta-corrente-cirurgiao-preview-scale-indicator">{zoomValue}%</span>
        </div>

        <div className="conta-corrente-cirurgiao-preview-scroll">
          <div className="conta-corrente-cirurgiao-preview-sheet-viewport" style={{ width: `${viewportWidth}px`, height: `${viewportHeight}px` }}>
            {geometryReady ? (
              <div
                className={`conta-corrente-cirurgiao-preview-sheet ${orientationConfig.className}`}
                style={{
                  width: `${orientationConfig.width}px`,
                  minHeight: `${orientationConfig.height}px`,
                  transform: `translateX(-50%) scale(${zoomFactor})`,
                }}
              >
                <div className="conta-corrente-cirurgiao-preview-head">
                  <div className="conta-corrente-cirurgiao-preview-head-text">
                    <div className="conta-corrente-cirurgiao-preview-head-caption">Conta corrente do cirurgião</div>
                    <div className="conta-corrente-cirurgiao-preview-title">{title}</div>
                    <div className="conta-corrente-cirurgiao-preview-user">{String(reportOutput || 'Tela')}</div>
                  </div>
                  <div className="conta-corrente-cirurgiao-preview-meta">
                    <span>{generatedAt.toLocaleDateString('pt-BR')}</span>
                    <span>{generatedAt.toLocaleTimeString('pt-BR')}</span>
                    <span>{String(orderLabel || '').trim()}</span>
                  </div>
                </div>

                <table className="conta-corrente-cirurgiao-preview-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {itensPagina.length ? itensPagina.map((row) => (
                      <tr key={row.id ?? `${row.data_lancamento}-${row.historico}-${row.valor}`}>
                        {columns.map((column) => {
                          const normalized = String(column || '').trim().toLowerCase();
                          const isMoney = ['débito', 'debito', 'crédito', 'credito', 'saldo'].includes(normalized);
                          return (
                            <td key={column} className={isMoney ? 'money' : ''}>
                              {getRelatorioContaCorrenteCellValue(row, column)}
                            </td>
                          );
                        })}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={columns.length || 1} className="conta-corrente-cirurgiao-preview-empty">
                          Nenhum lançamento encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {mostrarTotais ? (
                    <tfoot>
                      <tr>
                        <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                          Total crédito
                        </td>
                        <td className="money">{formatMoney(totalCredito)}</td>
                      </tr>
                      <tr>
                        <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                          Total débito
                        </td>
                        <td className="money">{formatMoney(totalDebito)}</td>
                      </tr>
                      <tr>
                        <td colSpan={Math.max(columns.length - 1, 0)} className="conta-corrente-cirurgiao-preview-total-label">
                          Saldo final
                        </td>
                        <td className="money">{formatMoney(saldoFinal)}</td>
                      </tr>
                    </tfoot>
                  ) : null}
                </table>
              </div>
            ) : (
              <div className="conta-corrente-cirurgiao-preview-loading">
                Calculando paginação do relatório...
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
