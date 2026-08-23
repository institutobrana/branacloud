import { getRelatorioContaCorrenteCellValue, getRelatorioContaCorrenteColumns } from './relatorioContaCorrenteExport.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(value) {
  const number = Number(value ?? 0) || 0;
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split('-');
    return `${day}/${month}/${year}`;
  }
  return text;
}

function buildPrintRows(columns, rows) {
  return rows
    .map((row) => {
      const cells = columns.map((column) => {
        const normalized = String(column || '').trim().toLowerCase();
        const isMoney = ['débito', 'debito', 'crédito', 'credito', 'saldo'].includes(normalized);
        const value = getRelatorioContaCorrenteCellValue(row, column);
        return `<td class="${isMoney ? 'money' : ''}">${escapeHtml(value || (isMoney ? '-' : ''))}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');
}

function getOrientationSize(orientation) {
  return String(orientation || '').trim().toLowerCase() === 'paisagem' ? 'landscape' : 'portrait';
}

export function abrirImpressaoRelatorioContaCorrente({
  reportData,
  selectedItems,
  reportName,
  orderLabel,
  orientation,
  reportOutput,
}) {
  const columns = getRelatorioContaCorrenteColumns(selectedItems);
  const rows = Array.isArray(reportData?.itens) ? reportData.itens : [];
  const totalCredito = Number(reportData?.total_credito ?? 0) || 0;
  const totalDebito = Number(reportData?.total_debito ?? 0) || 0;
  const saldoFinal = Number(reportData?.saldo_final ?? 0) || 0;
  const title = String(reportName || 'Relatório de contas do cirurgião').trim();
  const printDate = new Date();
  const orientationSize = getOrientationSize(orientation);
  const bodyRows = rows.length ? buildPrintRows(columns, rows) : `<tr><td colspan="${columns.length || 1}" class="empty">Nenhum lançamento encontrado.</td></tr>`;

  const html = `<!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          :root { color-scheme: light; }
          @page { size: ${orientationSize}; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 16px;
            background: #fff;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .sheet {
            width: 100%;
          }
          .head {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .head h1 {
            margin: 0 0 4px;
            font-size: 20px;
            line-height: 1.2;
          }
          .head .caption {
            font-size: 12px;
            color: #4b5563;
            line-height: 1.4;
          }
          .meta {
            text-align: right;
            font-size: 11px;
            color: #374151;
            line-height: 1.5;
            white-space: nowrap;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 5px 7px;
            vertical-align: top;
          }
          th {
            background: #f3f4f6;
            text-align: left;
            font-weight: 700;
          }
          td.money, th.money {
            text-align: right;
            white-space: nowrap;
          }
          td.empty {
            text-align: center;
            padding: 14px 8px;
          }
          .totals {
            margin-top: 12px;
            display: grid;
            gap: 6px;
            justify-content: end;
            font-size: 10px;
          }
          .totals .line {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: flex-end;
          }
          .totals .label {
            color: #374151;
          }
          .totals .box {
            min-width: 120px;
            padding: 5px 8px;
            border: 1px solid #94a3b8;
            background: #e0fbff;
            text-align: right;
            font-weight: 700;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="head">
            <div>
              <h1>${escapeHtml(title)}</h1>
              <div class="caption">Conta corrente do cirurgião · Saída: ${escapeHtml(reportOutput || 'Imprimir')}</div>
              <div class="caption">Ordem de impressão: ${escapeHtml(orderLabel || '')}</div>
            </div>
            <div class="meta">
              <div>${escapeHtml(printDate.toLocaleDateString('pt-BR'))}</div>
              <div>${escapeHtml(printDate.toLocaleTimeString('pt-BR'))}</div>
              <div>${escapeHtml(String(orientation || 'retrato'))}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                ${columns.map((column) => `<th class="${['débito', 'debito', 'crédito', 'credito', 'saldo'].includes(String(column || '').trim().toLowerCase()) ? 'money' : ''}">${escapeHtml(column)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="${Math.max(columns.length - 1, 0)}" style="text-align:right;font-weight:700;background:#f8fafc">Total crédito</td>
                <td class="money" style="font-weight:700;background:#f8fafc">${escapeHtml(formatMoney(totalCredito))}</td>
              </tr>
              <tr>
                <td colspan="${Math.max(columns.length - 1, 0)}" style="text-align:right;font-weight:700;background:#f8fafc">Total débito</td>
                <td class="money" style="font-weight:700;background:#f8fafc">${escapeHtml(formatMoney(totalDebito))}</td>
              </tr>
              <tr>
                <td colspan="${Math.max(columns.length - 1, 0)}" style="text-align:right;font-weight:700;background:#f8fafc">Saldo final</td>
                <td class="money" style="font-weight:700;background:#f8fafc">${escapeHtml(formatMoney(saldoFinal))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </body>
    </html>`;

  const printWindow = window.open('', '_blank', 'width=980,height=720');
  if (!printWindow) {
    return { ok: false, error: 'O navegador bloqueou a janela de impressão.' };
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  const doPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      // Ignora falhas de impressão do navegador.
    }
  };

  printWindow.onload = doPrint;
  setTimeout(doPrint, 200);

  return { ok: true };
}
