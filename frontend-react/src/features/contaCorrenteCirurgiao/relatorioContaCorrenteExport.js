import {
  formatDateContaCorrente as formatDate,
  formatMoneyContaCorrente as formatMoney,
  getRelatorioContaCorrenteCellValue,
  getRelatorioContaCorrenteColumns,
  getRelatorioContaCorrenteTotals,
} from './relatorioContaCorrenteModel.js';

export {
  formatDateContaCorrente,
  formatMoneyContaCorrente,
  getRelatorioContaCorrenteCellValue,
  getRelatorioContaCorrenteColumns,
  getRelatorioContaCorrenteTotals,
} from './relatorioContaCorrenteModel.js';

function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function sanitizeFilenamePart(text) {
  return String(text || 'Relatório de contas do cirurgião')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '') || 'Relatorio de contas do cirurgiao';
}

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rtfEscapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/[^\x20-\x7e]/g, (char) => {
      const code = char.codePointAt(0) || 0;
      return `\\u${code > 32767 ? code - 65536 : code}?`;
    });
}

function pdfEscapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ');
}

function latin1ByteLength(value) {
  return String(value ?? '').length;
}

function latin1Bytes(value) {
  const text = String(value ?? '');
  const bytes = new Uint8Array(text.length);
  for (let index = 0; index < text.length; index += 1) {
    bytes[index] = text.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function pdfSafeWidthText(value) {
  return String(value ?? '').replace(/\r/g, ' ').replace(/\n/g, ' ');
}

function pdfApproxTextWidth(text, fontSize = 8) {
  const value = String(text ?? '');
  let total = 0;
  for (const char of value) {
    if (char === ' ') {
      total += fontSize * 0.28;
    } else if (/[0-9]/.test(char)) {
      total += fontSize * 0.52;
    } else if (/[A-ZÁÀÂÃÉÈÊÍÌÓÒÔÕÚÙÇ]/.test(char)) {
      total += fontSize * 0.66;
    } else if (/[a-záàâãéèêíìóòôõúùç]/.test(char)) {
      total += fontSize * 0.55;
    } else if (/[.,;:]/.test(char)) {
      total += fontSize * 0.22;
    } else if (/[|]/.test(char)) {
      total += fontSize * 0.18;
    } else {
      total += fontSize * 0.5;
    }
  }
  return total;
}

function truncatePdfText(text, maxWidth, fontSize = 8) {
  const value = String(text ?? '');
  if (!value) return '';
  if (pdfApproxTextWidth(value, fontSize) <= maxWidth) return value;
  let result = '';
  for (const char of value) {
    const next = `${result}${char}`;
    if (pdfApproxTextWidth(next, fontSize) > maxWidth) break;
    result = next;
  }
  return result.trimEnd();
}

function isMoneyColumn(column) {
  const normalized = normalizeText(column);
  return ['débito', 'debito', 'crédito', 'credito', 'saldo'].includes(normalized);
}

function isDateColumn(column) {
  return normalizeText(column) === 'data';
}

function isTextColumn(column) {
  const normalized = normalizeText(column);
  return ['histórico', 'historico', 'lançamento', 'lancamento', 'pagamento', 'categoria', 'grupo', 'complemento', 'referência', 'referencia', 'conta corrente', 'conta corrente do cirurgião', 'conta corrente do cirurgiao', 'nº documento', 'n° documento', 'no documento', 'numero documento', 'n documento'].includes(normalized);
}

function resolvePdfColumnRatios(columns) {
  const normalized = columns.map((column) => normalizeText(column));
  const baseRatios = {
    data: 0.15,
    historico: 0.45,
    lancamento: 0.25,
    dinheiro: 0.15,
    text: 0.2,
  };

  const ratioMap = normalized.map((name) => {
    if (name === 'data') return baseRatios.data;
    if (name === 'historico' || name === 'histórico') return baseRatios.historico;
    if (name === 'lancamento' || name === 'lançamento') return baseRatios.lancamento;
    if (['debito', 'débito', 'credito', 'crédito', 'saldo'].includes(name)) return baseRatios.dinheiro;
    return baseRatios.text;
  });

  let total = ratioMap.reduce((sum, value) => sum + value, 0);
  if (!total) total = 1;
  return ratioMap.map((value) => value / total);
}

function buildCsvBlob(columns, rows, totals) {
  const lines = [];
  lines.push(columns.map(csvEscape).join(';'));
  rows.forEach((row) => {
    lines.push(columns.map((column) => csvEscape(getRelatorioContaCorrenteCellValue(row, column))).join(';'));
  });
  if (totals) {
    const labelIndex = columns.findIndex((column) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(column));
    const totalRow = columns.map((column, index) => {
      if (normalizeText(column) === 'débito' || normalizeText(column) === 'debito') return formatMoney(totals.totalDebito);
      if (normalizeText(column) === 'crédito' || normalizeText(column) === 'credito') return formatMoney(totals.totalCredito);
      if (index === labelIndex) return 'TOTAL';
      return '';
    });
    lines.push(totalRow.map(csvEscape).join(';'));
  }
  return new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
}

function buildHtmlBlob(columns, rows, totals, title) {
  const header = columns.map((column) => `<th>${xmlEscape(column)}</th>`).join('');
  const bodyRows = rows.map((row) => {
    const cells = columns.map((column) => `<td>${xmlEscape(getRelatorioContaCorrenteCellValue(row, column))}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  const totalRow = totals ? `<tr>${columns.map((column, index) => {
    const normalized = normalizeText(column);
    if (normalized === 'débito' || normalized === 'debito') return `<td>${xmlEscape(formatMoney(totals.totalDebito))}</td>`;
    if (normalized === 'crédito' || normalized === 'credito') return `<td>${xmlEscape(formatMoney(totals.totalCredito))}</td>`;
    const labelIndex = columns.findIndex((item) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(item));
    if (index === labelIndex) return '<td>TOTAL</td>';
    return '<td></td>';
  }).join('')}</tr>` : '';
  const emptyRow = `<tr><td colspan="${Math.max(1, columns.length)}">Sem dados.</td></tr>`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${xmlEscape(title || 'Relatório de contas do cirurgião')}</title>
  <style>
    body{font-family:Tahoma,Arial,sans-serif;font-size:12px;color:#000;margin:24px}
    h1{font-size:16px;margin:0 0 16px 0}
    table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #999;padding:4px 6px;vertical-align:top}
    th{text-align:left;background:#f3f3f3}
    td:nth-child(1){white-space:nowrap}
    tfoot td{font-weight:700}
  </style>
</head>
<body>
  <h1>${xmlEscape(title || 'Relatório de contas do cirurgião')}</h1>
  <table>
    <thead><tr>${header}</tr></thead>
    <tbody>${bodyRows || emptyRow}</tbody>
    ${totalRow ? `<tfoot>${totalRow}</tfoot>` : ''}
  </table>
</body>
</html>`;
  return new Blob([`\ufeff${html}`], { type: 'text/html;charset=utf-8;' });
}

function buildRtfBlob(columns, rows, totals, title) {
  const header = columns.map((column) => rtfEscapeText(column)).join('\\tab ');
  const bodyRows = rows.map((row) => columns.map((column) => rtfEscapeText(getRelatorioContaCorrenteCellValue(row, column))).join('\\tab '));
  const totalRow = totals ? columns.map((column, index) => {
    const normalized = normalizeText(column);
    const labelIndex = columns.findIndex((item) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(item));
    if (normalized === 'débito' || normalized === 'debito') return rtfEscapeText(formatMoney(totals.totalDebito));
    if (normalized === 'crédito' || normalized === 'credito') return rtfEscapeText(formatMoney(totals.totalCredito));
    if (index === labelIndex) return 'TOTAL';
    return '';
  }).join('\\tab ') : '';

  const lines = [
    '{\\rtf1\\ansi\\deff0',
    '{\\fonttbl{\\f0\\fnil Tahoma;}}',
    '\\viewkind4\\uc1\\pard\\f0\\fs20',
    `\\b ${rtfEscapeText(title || 'Relatório de contas do cirurgião')}\\b0\\par`,
    `${header}\\par`,
    ...bodyRows.map((line) => `${line}\\par`),
    totalRow ? `${totalRow}\\par` : '',
    '}',
  ].filter(Boolean);
  return new Blob([lines.join('\n')], { type: 'application/rtf;charset=utf-8;' });
}

function buildSimplePdfBlob(columns, rows, title, totals, orientation = 'retrato', orderLabel = '') {
  const normalizedOrientation = String(orientation || 'retrato').trim().toLowerCase() === 'paisagem' ? 'paisagem' : 'retrato';
  const pageSpec = normalizedOrientation === 'paisagem'
    ? { width: 842, height: 595, top: 21, right: 24, bottom: 20, left: 24 }
    : { width: 595, height: 842, top: 27, right: 30, bottom: 24, left: 30 };

  const captionText = 'Conta corrente do cirurgião';
  const titleText = String(title || 'Relatório de contas do cirurgião').trim();
  const printDate = new Date();
  const metaText = [
    printDate.toLocaleDateString('pt-BR'),
    printDate.toLocaleTimeString('pt-BR'),
    String(orderLabel || '').trim(),
  ].filter(Boolean).join('  ');

  const header = columns.map((column) => String(column || ''));
  const rowsData = rows.map((row) => columns.map((column) => String(getRelatorioContaCorrenteCellValue(row, column) || '')));
  const totalsRow = totals ? columns.map((column, index) => {
    const normalized = normalizeText(column);
    const labelIndex = columns.findIndex((item) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(item));
    if (normalized === 'débito' || normalized === 'debito') return formatMoney(totals.totalDebito);
    if (normalized === 'crédito' || normalized === 'credito') return formatMoney(totals.totalCredito);
    if (index === labelIndex) return 'TOTAL';
    return '';
  }) : null;

  const ratios = resolvePdfColumnRatios(header);
  const usableWidth = pageSpec.width - pageSpec.left - pageSpec.right;
  const columnWidthsBase = ratios.map((ratio, index) => {
    const column = header[index] || '';
    const minWidth = isMoneyColumn(column) ? 54 : (isDateColumn(column) ? 48 : 60);
    return Math.max(minWidth, Math.floor(usableWidth * ratio));
  });
  const widthTotal = columnWidthsBase.reduce((sum, value) => sum + value, 0) || 1;
  const columnWidths = columnWidthsBase.map((value) => Math.max(32, Math.floor(value * usableWidth / widthTotal)));
  let widthRemainder = usableWidth - columnWidths.reduce((sum, value) => sum + value, 0);
  for (let index = 0; widthRemainder > 0 && index < columnWidths.length; index += 1, widthRemainder -= 1) {
    columnWidths[index] += 1;
  }

  const columnsX = [];
  let cursorX = pageSpec.left;
  for (const width of columnWidths) {
    columnsX.push(cursorX);
    cursorX += width;
  }

  const headerFontSize = 7;
  const bodyFontSize = 6.75;
  const cellPaddingX = 3;
  const rowHeight = 11;
  const headerHeight = 12;
  const captionY = pageSpec.height - pageSpec.top - 4;
  const titleY = captionY - 11;
  const metaY = titleY - 10;
  const tableHeaderTopY = metaY - 16;
  const bodyStartY = tableHeaderTopY - headerHeight;
  const totalsHeight = totals ? 34 : 0;
  const pageNumberReserve = 12;
  const usableRowsHeight = bodyStartY - pageSpec.bottom - totalsHeight - pageNumberReserve - 4;
  const rowsPerPage = Math.max(1, Math.floor(usableRowsHeight / rowHeight));
  const pageRows = [];
  for (let index = 0; index < rowsData.length; index += rowsPerPage) {
    pageRows.push(rowsData.slice(index, index + rowsPerPage));
  }

  const pages = pageRows.length ? pageRows : [[]];
  const totalPages = pages.length;

  const objects = [];
  const addObject = (id, body) => objects.push({ id, body });
  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  addObject(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  let nextId = 5;
  const kids = [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const currentRows = pages[pageIndex];
    const contentId = nextId++;
    const pageId = nextId++;
    const isLastPage = pageIndex === pages.length - 1;
    const streamParts = [];
    const drawText = (font, size, x, y, text) => {
      streamParts.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${pdfEscapeText(text)}) Tj ET`);
    };
    const drawBox = (x, y, width, height, fill, stroke = '0.72 0.78 0.82') => {
      streamParts.push(`q ${fill} rg ${stroke} RG ${x} ${y} ${width} ${height} re B Q`);
    };

    drawText('F2', 8.5, pageSpec.left, captionY, captionText);
    drawText('F2', 9, pageSpec.left, titleY, titleText);
    drawText('F2', 8, pageSpec.left, metaY, metaText);

    header.forEach((column, index) => {
      const x = columnsX[index];
      const width = columnWidths[index];
      const title = truncatePdfText(column, width - (cellPaddingX * 2), headerFontSize);
      streamParts.push(`q 0.94 0.95 0.97 rg 0 0 0 RG ${x} ${tableHeaderTopY} ${width} ${headerHeight} re B Q`);
      drawText('F2', 7, x + cellPaddingX, tableHeaderTopY + 3.4, title);
    });

    const rowBaseTop = bodyStartY;
    currentRows.forEach((row, rowIndex) => {
      const topY = rowBaseTop - (rowIndex * rowHeight);
      const bottomY = topY - rowHeight + 1;
      row.forEach((value, index) => {
        const column = header[index];
        const width = columnWidths[index];
        const x = columnsX[index];
        const rectY = bottomY;
        streamParts.push(`q 1 1 1 rg 0.86 0.86 0.86 RG ${x} ${rectY} ${width} ${rowHeight} re B Q`);
        const available = width - (cellPaddingX * 2);
        const rendered = truncatePdfText(pdfSafeWidthText(value), available, bodyFontSize) || (isMoneyColumn(column) ? '-' : '');
        const textWidth = pdfApproxTextWidth(rendered, bodyFontSize);
        const textX = isMoneyColumn(column)
          ? x + width - cellPaddingX - textWidth
          : x + cellPaddingX;
        drawText('F1', 6.75, textX, rectY + 3.2, rendered);
      });
    });

    if (isLastPage && totals && totalsRow) {
      const totalsTop = Math.max(pageSpec.bottom + pageNumberReserve + 8, rowBaseTop - (currentRows.length * rowHeight) - 6);
      const blockHeight = 30;
      const blockX = pageSpec.left;
      const blockWidth = usableWidth;
      streamParts.push(`q 0.96 0.99 1 rg 0.72 0.80 0.84 RG ${blockX} ${totalsTop} ${blockWidth} ${blockHeight} re B Q`);
      const totalLabels = ['Total crédito', 'Total débito', 'Saldo final'];
      const totalValues = [formatMoney(totals.totalCredito), formatMoney(totals.totalDebito), formatMoney(totals.saldoFinal)];
      const segmentWidth = Math.floor(blockWidth / 3);
      totalLabels.forEach((label, index) => {
        const segX = blockX + (index * segmentWidth);
        const segWidth = index === 2 ? blockWidth - (segmentWidth * 2) : segmentWidth;
        drawText('F2', 7.5, segX + 4, totalsTop + 18, label);
        streamParts.push(`q 0.85 0.96 0.98 rg 0.56 0.72 0.76 RG ${segX + 2} ${totalsTop + 4} ${segWidth - 4} 10 re B Q`);
        const value = totalValues[index];
        const valueWidth = pdfApproxTextWidth(value, 7);
        drawText('F2', 7, segX + segWidth - valueWidth - 6, totalsTop + 7.2, value);
      });
    }

    drawText('F1', 7, pageSpec.width - pageSpec.right - 58, pageSpec.bottom - 2 + 9, `Página ${pageIndex + 1} de ${totalPages}`);

    const stream = streamParts.join('\n');
    addObject(contentId, `<< /Length ${latin1ByteLength(stream)} >>\nstream\n${stream}\nendstream`);
    addObject(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageSpec.width} ${pageSpec.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    kids.push(`${pageId} 0 R`);
  }
  addObject(2, `<< /Type /Pages /Count ${kids.length || 1} /Kids [${kids.join(' ')}] >>`);

  objects.sort((a, b) => a.id - b.id);
  let pdf = '%PDF-1.4\n';
  const offsets = {};
  for (const object of objects) {
    offsets[object.id] = latin1ByteLength(pdf);
    pdf += `${object.id} 0 obj\n${object.body}\nendobj\n`;
  }
  const xref = latin1ByteLength(pdf);
  const maxId = Math.max(...objects.map((object) => object.id));
  pdf += `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= maxId; index += 1) {
    const offset = offsets[index] || 0;
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([latin1Bytes(pdf)], { type: 'application/pdf' });
}

function buildSpreadsheetXmlBlob(columns, rows, totals, title) {
  const rowXml = [];
  rowXml.push(`<Row>${columns.map((column) => `<Cell><Data ss:Type="String">${xmlEscape(column)}</Data></Cell>`).join('')}</Row>`);
  rows.forEach((row) => {
    rowXml.push(`<Row>${columns.map((column) => {
      const value = getRelatorioContaCorrenteCellValue(row, column);
      const normalized = normalizeText(column);
      if (normalized === 'débito' || normalized === 'debito' || normalized === 'crédito' || normalized === 'credito' || normalized === 'saldo') {
        const numeric = Number(String(value).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
        return `<Cell><Data ss:Type="Number">${numeric}</Data></Cell>`;
      }
      return `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
    }).join('')}</Row>`);
  });
  if (totals) {
    const labelIndex = columns.findIndex((column) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(column));
    rowXml.push(`<Row>${columns.map((column, index) => {
      const normalized = normalizeText(column);
      if (normalized === 'débito' || normalized === 'debito') {
        return `<Cell><Data ss:Type="Number">${Number(totals.totalDebito || 0)}</Data></Cell>`;
      }
      if (normalized === 'crédito' || normalized === 'credito') {
        return `<Cell><Data ss:Type="Number">${Number(totals.totalCredito || 0)}</Data></Cell>`;
      }
      if (index === labelIndex) {
        return '<Cell><Data ss:Type="String">TOTAL</Data></Cell>';
      }
      return '<Cell><Data ss:Type="String"></Data></Cell>';
    }).join('')}</Row>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${xmlEscape(title || 'Relatório de contas do cirurgião')}</Title>
 </DocumentProperties>
 <Worksheet ss:Name="Relatório">
  <Table>
${rowXml.map((line) => `   ${line}`).join('\n')}
  </Table>
 </Worksheet>
</Workbook>`;
  return new Blob(['\ufeff' + xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
}

function buildTextBlob(columns, rows, totals, title) {
  const lines = [];
  lines.push(String(title || 'Relatório de contas do cirurgião'));
  lines.push(columns.join('\t'));
  rows.forEach((row) => {
    lines.push(columns.map((column) => String(getRelatorioContaCorrenteCellValue(row, column) || '')).join('\t'));
  });
  if (totals) {
    const labelIndex = columns.findIndex((column) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(column));
    lines.push(columns.map((column, index) => {
      const normalized = normalizeText(column);
      if (normalized === 'débito' || normalized === 'debito') return formatMoney(totals.totalDebito);
      if (normalized === 'crédito' || normalized === 'credito') return formatMoney(totals.totalCredito);
      if (index === labelIndex) return 'TOTAL';
      return '';
    }).join('\t'));
  }
  return new Blob([`\ufeff${lines.join('\r\n')}`], { type: 'text/plain;charset=utf-8;' });
}

function buildFileFromFormat(format, columns, rows, title, totals, orientation, orderLabel) {
  switch (format) {
    case 'PDF':
      return { blob: buildSimplePdfBlob(columns, rows, title, totals, orientation, orderLabel), extension: 'pdf', mimeType: 'application/pdf' };
    case 'HTML':
      return { blob: buildHtmlBlob(columns, rows, totals, title), extension: 'html', mimeType: 'text/html;charset=utf-8;' };
    case 'RTF':
      return { blob: buildRtfBlob(columns, rows, totals, title), extension: 'rtf', mimeType: 'application/rtf;charset=utf-8;' };
    case 'XLS':
      return { blob: buildSpreadsheetXmlBlob(columns, rows, totals, title), extension: 'xls', mimeType: 'application/vnd.ms-excel;charset=utf-8;' };
    case 'TXT':
      return { blob: buildTextBlob(columns, rows, totals, title), extension: 'txt', mimeType: 'text/plain;charset=utf-8;' };
    case 'CSV':
    default:
      return { blob: buildCsvBlob(columns, rows, totals), extension: 'csv', mimeType: 'text/csv;charset=utf-8;' };
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function suggestFileName(reportName, extension) {
  const base = sanitizeFilenamePart(reportName || 'Relatório de contas do cirurgião');
  return `${base}.${extension}`;
}

export function exportarRelatorioContaCorrenteArquivo({ reportData, selectedItems, reportName, format, orientation, orderLabel }) {
  const rows = Array.isArray(reportData?.itens) ? reportData.itens : [];
  const columns = getRelatorioContaCorrenteColumns(selectedItems);
  const totals = getRelatorioContaCorrenteTotals(reportData);

  const normalizedFormat = String(format || '').trim().toUpperCase();
  if (!normalizedFormat) {
    return { cancelled: true, error: 'Formato não informado' };
  }

  if (!['CSV', 'PDF', 'HTML', 'RTF', 'XLS', 'TXT'].includes(normalizedFormat)) {
    window.alert('Formato inválido. Use PDF, HTML, RTF, XLS, TXT ou CSV.');
    return { cancelled: true, error: 'Formato inválido' };
  }

  const { blob, extension } = buildFileFromFormat(normalizedFormat, columns, rows, reportName, totals, orientation, orderLabel);
  const filename = suggestFileName(reportName, extension);
  triggerDownload(blob, filename);

  return {
    cancelled: false,
    format: normalizedFormat,
    filename,
    extension,
    rows: rows.length,
    columns,
    totals,
  };
}
