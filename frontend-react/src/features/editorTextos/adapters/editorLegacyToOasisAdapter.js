const BLOCK_TAGS = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DD', 'DIV', 'DL', 'DT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'OL', 'P', 'PRE', 'SECTION', 'UL']);
const DROP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH']);
const RICH_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'SUB', 'SUP', 'FONT', 'A', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

export const LEGACY_CONVERSION_VERSION = 'html-text-blocks-v1';

export function convertPlainTextToOasis(content, { createDocument, createParagraph, title = 'Documento convertido' } = {}) {
  assertFactory(createDocument, createParagraph);
  const text = String(content ?? '').replace(/\r\n?/g, '\n');
  const blocks = text.split('\n').map((line) => createParagraph(line));
  return { document: createDocument({ title, blocks: blocks.length ? blocks : [createParagraph('')] }), warnings: [], lostFeatures: [], editable: true };
}

export function convertLegacyHtmlToOasis(html, { createDocument, createParagraph, title = 'Documento convertido', Parser = globalThis.DOMParser } = {}) {
  assertFactory(createDocument, createParagraph);
  if (typeof Parser !== 'function') throw new Error('O navegador não oferece parser HTML inerte para a conversão segura.');
  const source = String(html ?? '');
  const parsed = new Parser().parseFromString(source, 'text/html');
  const lostFeatures = new Set();
  DROP_TAGS.forEach((tag) => {
    const nodes = parsed.querySelectorAll(tag.toLowerCase());
    if (nodes.length) lostFeatures.add(`conteúdo ativo/embutido removido: ${tag.toLowerCase()}`);
    nodes.forEach((node) => node.remove());
  });

  if (parsed.querySelector('img')) lostFeatures.add('imagens não convertidas para o modelo Oasis nesta versão');
  if (/\[\[IMGDATA:/i.test(source)) lostFeatures.add('imagem legada IMGDATA mantida como token textual para inspeção');
  if (parsed.querySelector('table')) lostFeatures.add('tabelas achatadas como texto de células');
  if (parsed.querySelector([...RICH_TAGS].map((tag) => tag.toLowerCase()).join(',')) || /\bstyle\s*=|<style\b/i.test(source)) {
    lostFeatures.add('formatação inline/blocos não preservada; conteúdo textual mantido');
  }
  if (parsed.querySelector('input,button,form,canvas,video,audio,object,embed,svg,math')) {
    lostFeatures.add('controles ou objetos incorporados não convertidos');
  }

  let text = '';
  const walk = (node) => {
    if (node.nodeType === 3) { text += node.nodeValue || ''; return; }
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) return;
    const element = node.nodeType === 1 ? node : null;
    if (element && DROP_TAGS.has(element.tagName)) return;
    const tag = element?.tagName || '';
    const block = BLOCK_TAGS.has(tag);
    if (block && text && !text.endsWith('\n')) text += '\n';
    if (tag === 'BR') { text += '\n'; return; }
    if (tag === 'IMG') { if (element.getAttribute('alt')) text += element.getAttribute('alt'); return; }
    if (tag === 'TD' || tag === 'TH') {
      if (text && !text.endsWith('\n') && !text.endsWith('\t')) text += '\t';
    }
    for (const child of node.childNodes || []) walk(child);
    if (tag === 'TR' && text && !text.endsWith('\n')) text += '\n';
    if (block && text && !text.endsWith('\n')) text += '\n';
  };
  walk(parsed.body);
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((line) => line.replace(/[\t \u00a0]+/g, ' ').trim());
  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines.at(-1) === '') lines.pop();
  const blocks = (lines.length ? lines : ['']).map((line) => createParagraph(line));
  return {
    document: createDocument({ title, blocks }),
    warnings: [...lostFeatures],
    lostFeatures: [...lostFeatures],
    editable: true,
    fidelity: lostFeatures.size ? 'partial' : 'pass',
  };
}

export function convertRtfHtmlToOasis(html, { createDocument, createParagraph, createTable, pageSettings, title = 'Documento RTF importado', Parser = globalThis.DOMParser } = {}) {
  assertFactory(createDocument, createParagraph);
  if (typeof Parser !== 'function') throw new Error('O navegador não oferece parser HTML inerte para a conversão RTF segura.');
  const parsed = new Parser().parseFromString(String(html ?? ''), 'text/html');
  DROP_TAGS.forEach((tag) => parsed.querySelectorAll(tag.toLowerCase()).forEach((node) => node.remove()));
  const blocks = [];
  const warnings = new Set();
  let listSequence = 0;
  let activeList = null;

  const readParagraph = (element) => {
    const segments = [];
    const walkInline = (node, style = {}) => {
      if (node.nodeType === 3) {
        if (node.nodeValue) segments.push({ text: node.nodeValue, style });
        return;
      }
      if (node.nodeType !== 1) return;
      const tag = node.tagName;
      if (DROP_TAGS.has(tag)) return;
      const next = { ...style };
      if (tag === 'B' || tag === 'STRONG') next.bold = true;
      if (tag === 'I' || tag === 'EM') next.italic = true;
      if (tag === 'U') next.underline = true;
      if (tag === 'SPAN') {
        const family = String(node.dataset?.rtfFontFamily || node.style?.fontFamily || '').replace(/["']/g, '').trim();
        if (family && /^[\p{L}\p{N} ,_-]{1,80}$/u.test(family)) next.fontFamily = family;
        const rtfSizePt = Number.parseFloat(node.dataset?.rtfFontSizePt || '');
        const size = Number.parseFloat(node.style?.fontSize || '');
        if (Number.isFinite(rtfSizePt) && rtfSizePt > 0 && rtfSizePt <= 200) next.fontSize = rtfSizePt * 96 / 72;
        else if (Number.isFinite(size) && size > 0 && size <= 200) next.fontSize = size * 96 / 72;
      }
      if (tag === 'BR') { segments.push({ text: '\n', style }); return; }
      for (const child of node.childNodes || []) walkInline(child, next);
    };
    for (const child of element.childNodes || []) walkInline(child);
    const text = segments.map((segment) => segment.text).join('');
    const paragraph = createParagraph(text);
    paragraph.runs = segments.length ? segments.map((segment) => {
      const run = createParagraph(segment.text).runs?.[0] || { kind: 'text', text: segment.text };
      const marks = Object.fromEntries(Object.entries(segment.style).filter(([, value]) => Boolean(value)));
      if (Object.keys(marks).length) run.styles = { ...(run.styles || {}), ...marks };
      return run;
    }) : (paragraph.runs || []);

    const align = String(element.style?.textAlign || '').toLowerCase();
    if (['left', 'center', 'right', 'justify'].includes(align)) paragraph.style = { ...(paragraph.style || {}), align };
    const left = Number.parseFloat(element.dataset?.rtfIndentLeftPt || '');
    const right = Number.parseFloat(element.dataset?.rtfIndentRightPt || '');
    const first = Number.parseFloat(element.dataset?.rtfIndentFirstPt || '');
    const indentStyle = {};
    if (Number.isFinite(left)) indentStyle.indentLeft = left * 96 / 72;
    if (Number.isFinite(right)) indentStyle.indentRight = right * 96 / 72;
    if (Number.isFinite(first)) indentStyle.indentFirstLine = first * 96 / 72;
    const before = Number.parseFloat(element.dataset?.rtfSpacingBeforePt || '');
    const after = Number.parseFloat(element.dataset?.rtfSpacingAfterPt || '');
    if (Number.isFinite(before)) indentStyle.spacingBefore = before * 96 / 72;
    if (Number.isFinite(after)) indentStyle.spacingAfter = after * 96 / 72;
    const lineSpacing = Number.parseFloat(element.dataset?.rtfLineSpacing || '');
    if (Number.isFinite(lineSpacing) && lineSpacing > 0) {
      const lineRule = element.dataset?.rtfLineRule;
      indentStyle.lineRule = ['auto', 'exact', 'atLeast'].includes(lineRule) ? lineRule : 'exact';
      indentStyle.lineHeight = indentStyle.lineRule === 'auto' ? lineSpacing : lineSpacing * 96 / 72;
    }
    try {
      const tabs = JSON.parse(element.dataset?.rtfTabs || '[]');
      if (Array.isArray(tabs) && tabs.length) {
        indentStyle.tabs = tabs
          .filter((tab) => Number.isFinite(tab?.positionPt) && ['left', 'center', 'right', 'decimal', 'bar'].includes(tab?.type))
          .map((tab) => ({ position: tab.positionPt * 96 / 72, type: tab.type }));
      }
      const borders = JSON.parse(element.dataset?.rtfBorders || '{}');
      for (const [side, border] of Object.entries(borders)) {
        if (!['top', 'right', 'bottom', 'left'].includes(side) || border?.style !== 'solid') continue;
        const widthPt = Number(border.widthPt);
        indentStyle[`border${side[0].toUpperCase()}${side.slice(1)}`] = {
          width: Number.isFinite(widthPt) && widthPt > 0 ? widthPt * 96 / 72 : 1,
          type: 'solid',
          color: '#000000',
        };
      }
    } catch {
      warnings.add('Metadados de tabulação/borda RTF inválidos foram ignorados.');
    }
    if (element.dataset?.rtfBorderBetween) warnings.add('Bordas entre parágrafos RTF não possuem equivalente direto no modelo Oasis e foram omitidas.');
    if (Object.keys(indentStyle).length) paragraph.style = { ...(paragraph.style || {}), ...indentStyle };

    const kind = element.dataset?.rtfListKind;
    if (kind === 'bullet' || kind === 'ordered') {
      const level = Math.max(0, Math.min(8, Number.parseInt(element.dataset?.rtfListLevel || '0', 10) || 0));
      if (!activeList || activeList.kind !== kind || activeList.level !== level) {
        listSequence += 1;
        activeList = { kind, level, instanceId: `rtf-list-${listSequence}` };
      }
      paragraph.list = { kind, level, instanceId: activeList.instanceId, ...(kind === 'bullet' ? { bulletGlyph: '•' } : {}) };
    } else {
      activeList = null;
    }
    return paragraph;
  };

  const appendCellBlocks = (cell, targetCell) => {
    const paragraphs = [...cell.querySelectorAll(':scope > p')];
    const cellParagraphs = paragraphs.length ? paragraphs.map(readParagraph) : [createParagraph(cell.textContent || '')];
    targetCell.blocks = cellParagraphs;
  };

  for (const node of [...parsed.body.childNodes]) {
    if (node.nodeType !== 1) continue;
    if (node.tagName === 'P' || /^H[1-6]$/.test(node.tagName)) {
      blocks.push(readParagraph(node));
      continue;
    }
    if (node.tagName === 'TABLE') {
      if (typeof createTable !== 'function') throw new Error('A API pública createTable do Oasis é necessária para preservar tabelas RTF.');
      const rows = [...node.querySelectorAll(':scope > tbody > tr, :scope > tr')];
      const cellsByRow = rows.map((row) => [...row.children].filter((cell) => ['TD', 'TH'].includes(cell.tagName)));
      if (!cellsByRow.length || cellsByRow.some((cells) => !cells.length)) throw new Error('A tabela RTF não possui uma grade simples e recuperável.');
      const table = createTable(cellsByRow.map((cells) => cells.map((cell) => cell.textContent || '')));
      cellsByRow.forEach((cells, rowIndex) => cells.forEach((cell, columnIndex) => {
        const targetCell = table.rows?.[rowIndex]?.cells?.[columnIndex];
        if (targetCell) appendCellBlocks(cell, targetCell);
      }));
      blocks.push(table);
      activeList = null;
      continue;
    }
    if (node.querySelector?.('table')) warnings.add('Tabelas RTF aninhadas não são suportadas nesta POC.');
    const content = node.textContent || '';
    if (content.trim()) blocks.push(createParagraph(content));
  }
  if (!blocks.length) blocks.push(createParagraph(''));
  const document = createDocument({ title, blocks });
  if (pageSettings && Number(pageSettings.width) > 0 && Number(pageSettings.height) > 0) {
    document.pageSettings = { ...(document.pageSettings || {}), ...pageSettings, margins: { ...(document.pageSettings?.margins || {}), ...(pageSettings.margins || {}) } };
    if (Array.isArray(document.sections)) {
      document.sections = document.sections.map((section, index) => index === 0
        ? { ...section, pageSettings: { ...(section.pageSettings || {}), ...document.pageSettings, margins: { ...(section.pageSettings?.margins || {}), ...(document.pageSettings.margins || {}) } } }
        : section);
    }
  }
  return { document, warnings: [...warnings], lostFeatures: [...warnings], editable: true, fidelity: warnings.size ? 'partial' : 'pass' };
}

export function createUnsupportedFormatDiagnostic(detection) {
  const raw = String(detection?.content ?? '');
  const safeText = raw.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '�');
  return {
    format: detection?.sourceFormat || detection?.extension || 'desconhecido',
    size: Number(detection?.size ?? raw.length),
    reason: detection?.reason || 'Não existe conversor seguro para este conteúdo.',
    preview: safeText.slice(0, 12000),
    truncated: detection?.previewTruncated === true || safeText.length > 12000,
    name: detection?.diagnosticName || '',
    extension: detection?.extension || '',
    fileExists: detection?.fileExists,
    readOnly: true,
    metadata: detection?.diagnosticMetadata || {},
  };
}

function assertFactory(createDocument, createParagraph) {
  if (typeof createDocument !== 'function' || typeof createParagraph !== 'function') {
    throw new Error('As fábricas públicas de documento/parágrafo Oasis são necessárias para converter este formato.');
  }
}
