import { toLayoutConfig } from '../model/paginationState.js';

function measureContext() { const canvas = document.createElement('canvas'); const context = canvas.getContext('2d'); context.font = '16px Arial'; return context; }

export function buildPaginationLayoutState({ doc, pageConfig, documentVersion, configVersion, layoutVersion }) {
  const cfg = toLayoutConfig(pageConfig); const context = measureContext(); const usableWidth = Math.max(20, cfg.width - cfg.marginLeft - cfg.marginRight); const usableHeight = Math.max(20, cfg.height - cfg.marginTop - cfg.marginBottom); const lineHeight = 16; const pages = []; const lines = []; const diagnostics = []; let page = 0; let y = cfg.marginTop; let current = ''; let currentFrom = 1; let position = 1; let paragraphCount = 0; let unsupported = false;
  const pushLine = () => { if (!current) return; lines.push({ page, top: y, left: cfg.marginLeft, width: context.measureText(current).width, height: lineHeight, fromPmPos: currentFrom, toPmPos: position, text: current }); current = ''; currentFrom = position; y += lineHeight; };
  doc.descendants((node, nodePos) => {
    if (node.type.name === 'paragraph') { paragraphCount += 1; let offset = 0; const value = node.textContent || ''; for (const token of value.split(/(\s+)/)) { if (current && context.measureText(current + token).width > usableWidth) pushLine(); if (y + lineHeight > cfg.height - cfg.marginBottom) { pushLine(); page += 1; y = cfg.marginTop; } if (!current) currentFrom = nodePos + 1 + offset; current += token; offset += token.length; position = nodePos + 1 + offset; } if (!value && y + lineHeight > cfg.height - cfg.marginBottom) { page += 1; y = cfg.marginTop; } }
    else if (!node.isText && node.type.name !== 'doc' && node.type.name !== 'text' && node.type.name !== 'hardBreak') { unsupported = true; }
    return true;
  });
  pushLine(); if (unsupported) diagnostics.push('unsupported-node'); const pageCount = Math.max(1, page + 1); for (let i = 0; i < pageCount; i += 1) pages.push({ index: i + 1, top: i * (cfg.height + cfg.gap), left: 0, width: cfg.width, height: cfg.height, contentTop: cfg.marginTop, contentBottom: cfg.height - cfg.marginBottom, lines: lines.filter((line) => line.page === i) });
  const breaks = pages.slice(0, -1).map((item, index) => { const last = item.lines.at(-1); const next = pages[index + 1].lines[0]; return { afterPage: item.index, lastPmPos: last?.toPmPos ?? null, nextPageFirstPmPos: next?.fromPmPos ?? null, editorY: item.top + item.height }; });
  const pmPositionMap = lines.map((line) => ({ from: line.fromPmPos, to: line.toPmPos, page: line.page + 1, top: line.top, left: line.left }));
  return { documentVersion, configVersion, layoutVersion, pageConfig: cfg, pageCount, pages, breaks, pmPositionMap, currentPage: 1, selectionPageRange: [1, 1], accuracy: unsupported ? 'ESTIMATED' : 'EXACT', metrics: { paragraphCount, lineCount: lines.length, usableWidth, usableHeight }, diagnostics };
}
