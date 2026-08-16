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

function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function getRelatorioContaCorrenteColumns(selectedItems = []) {
  const fallback = ['Data', 'Histórico', 'Débito'];
  const items = Array.isArray(selectedItems) && selectedItems.length ? selectedItems : fallback;
  return items;
}

export function getRelatorioContaCorrenteCellValue(row, column) {
  const normalized = normalizeText(column);
  if (normalized === 'data') return formatDate(row.data_lancamento || row.data_vencimento || row.data_pagamento);
  if (normalized === 'lançamento' || normalized === 'lancamento') return row.historico || '';
  if (normalized === 'histórico' || normalized === 'historico') return row.historico || '';
  if (normalized === 'débito' || normalized === 'debito') return Number(row.debito ?? 0) ? formatMoney(row.debito) : '-';
  if (normalized === 'crédito' || normalized === 'credito') return Number(row.credito ?? 0) ? formatMoney(row.credito) : '-';
  if (normalized === 'categoria') return row.categoria_nome || '';
  if (normalized === 'grupo') return row.grupo_nome || '';
  if (normalized === 'complemento') return row.complemento || '';
  if (normalized === 'pagamento') return row.forma_pagamento || '';
  if (normalized === 'referência' || normalized === 'referencia') return row.referencia || '';
  if (normalized === 'saldo') return formatMoney(row.saldo);
  if (normalized === 'conta corrente' || normalized === 'conta corrente do cirurgião' || normalized === 'conta corrente do cirurgiao') return row.conta || '';
  if (normalized === 'nº documento' || normalized === 'n° documento' || normalized === 'no documento' || normalized === 'numero documento' || normalized === 'n documento') return row.documento || '';
  return row[column] ?? '';
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

function buildSimplePdfBlob(columns, rows, title, totals) {
  const header = columns.map((column) => String(column || ''));
  const bodyRows = rows.map((row) => columns.map((column) => String(getRelatorioContaCorrenteCellValue(row, column) || '')));
  if (totals) {
    const labelIndex = columns.findIndex((column) => !['Débito', 'Crédito', 'Débito', 'Credito', 'Crédito'].includes(column));
    bodyRows.push(columns.map((column, index) => {
      const normalized = normalizeText(column);
      if (normalized === 'débito' || normalized === 'debito') return formatMoney(totals.totalDebito);
      if (normalized === 'crédito' || normalized === 'credito') return formatMoney(totals.totalCredito);
      if (index === labelIndex) return 'TOTAL';
      return '';
    }));
  }

  const widths = header.map((column, index) => Math.min(24, Math.max(column.length, ...bodyRows.map((line) => (line[index] || '').length), 6)));
  const toLine = (arr) => arr.map((value, index) => String(value || '').padEnd(widths[index], ' ').slice(0, widths[index])).join(' | ');
  const separator = widths.map((size) => '-'.repeat(size)).join('-+-');
  const lines = [String(title || 'Relatório'), '', toLine(header), separator, ...bodyRows.map(toLine)];

  const pageHeight = 842;
  const startY = 800;
  const lineHeight = 13;
  const bottom = 40;
  const perPage = Math.max(20, Math.floor((startY - bottom) / lineHeight));
  const pages = [];
  for (let index = 0; index < lines.length; index += perPage) {
    pages.push(lines.slice(index, index + perPage));
  }

  const objects = [];
  const addObject = (id, body) => objects.push({ id, body });
  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  let nextId = 4;
  const kids = [];
  for (const page of pages) {
    const contentId = nextId++;
    const pageId = nextId++;
    const stream = [
      'BT',
      '/F1 10 Tf',
      '13 TL',
      `40 ${startY} Td`,
      ...page.map((line, idx) => `${idx === 0 ? '' : 'T* '}(${String(line).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj`),
      'ET',
    ].join('\n');
    addObject(contentId, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    addObject(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    kids.push(`${pageId} 0 R`);
  }
  addObject(2, `<< /Type /Pages /Count ${kids.length || 1} /Kids [${kids.join(' ')}] >>`);

  objects.sort((a, b) => a.id - b.id);
  let pdf = '%PDF-1.4\n';
  const encoder = new TextEncoder();
  const offsets = {};
  for (const object of objects) {
    offsets[object.id] = encoder.encode(pdf).length;
    pdf += `${object.id} 0 obj\n${object.body}\nendobj\n`;
  }
  const xref = encoder.encode(pdf).length;
  const maxId = Math.max(...objects.map((object) => object.id));
  pdf += `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= maxId; index += 1) {
    const offset = offsets[index] || 0;
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
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

function buildFileFromFormat(format, columns, rows, title, totals) {
  if (format === 'PDF') return { blob: buildSimplePdfBlob(columns, rows, title, totals), extension: 'pdf', mimeType: 'application/pdf' };
  if (format === 'EXCEL') return { blob: buildSpreadsheetXmlBlob(columns, rows, totals, title), extension: 'xls', mimeType: 'application/vnd.ms-excel;charset=utf-8;' };
  return { blob: buildCsvBlob(columns, rows, totals), extension: 'csv', mimeType: 'text/csv;charset=utf-8;' };
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

export function exportarRelatorioContaCorrenteArquivo({ reportData, selectedItems, reportName }) {
  const rows = Array.isArray(reportData?.itens) ? reportData.itens : [];
  const columns = getRelatorioContaCorrenteColumns(selectedItems);
  const totals = {
    totalCredito: Number(reportData?.total_credito ?? 0) || 0,
    totalDebito: Number(reportData?.total_debito ?? 0) || 0,
    saldoFinal: Number(reportData?.saldo_final ?? 0) || 0,
  };

  const response = window.prompt('Escolha o formato para exportar: CSV, PDF ou EXCEL.', 'CSV');
  const format = String(response || '').trim().toUpperCase();
  if (!format) return { cancelled: true };

  if (!['CSV', 'PDF', 'EXCEL', 'XLS', 'XLSX', 'XLSM', 'XLMS'].includes(format)) {
    window.alert('Formato inválido. Use CSV, PDF ou EXCEL.');
    return { cancelled: true, error: 'Formato inválido' };
  }

  const normalizedFormat = format === 'CSV' ? 'CSV' : (format === 'PDF' ? 'PDF' : 'EXCEL');
  const { blob, extension } = buildFileFromFormat(normalizedFormat, columns, rows, reportName, totals);
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
