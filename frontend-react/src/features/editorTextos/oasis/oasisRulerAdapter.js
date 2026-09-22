export const OASIS_RULER_PX_PER_CM = 96 / 2.54;
export const OASIS_RULER_SNAP_CM = 0.1;
export const OASIS_RULER_MIN_CONTENT_PX = 24;

function collectParagraphs(blocks = [], out = []) {
  for (const block of blocks) {
    if (block?.type === 'paragraph') out.push(block);
    if (Array.isArray(block?.blocks)) collectParagraphs(block.blocks, out);
    for (const row of block?.rows || []) {
      for (const cell of row?.cells || []) collectParagraphs(cell?.blocks, out);
    }
  }
  return out;
}

export function resolveCurrentParagraph(document, selection, activeSectionIndex = 0) {
  const paragraphId = selection?.focus?.paragraphId;
  if (!paragraphId) return null;
  const sections = document?.sections || [];
  const section = sections[activeSectionIndex] || sections[0];
  const stories = [section?.blocks, section?.header, section?.firstPageHeader, section?.evenPageHeader,
    section?.footer, section?.firstPageFooter, section?.evenPageFooter];
  for (const blocks of stories) {
    const match = collectParagraphs(blocks).find((paragraph) => paragraph.id === paragraphId);
    if (match) return match;
  }
  return null;
}

function resolveNamedParagraphStyle(document, styleId) {
  const styleMap = document?.styles || {};
  const styles = Object.values(styleMap);
  const byId = new Map(styles.map((style) => [style.id, style]));
  const chain = [];
  const visited = new Set();
  let current = byId.get(styleId) || styles.find((style) => style.name === styleId);
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    chain.unshift(current.paragraphStyle || {});
    current = current.basedOn ? byId.get(current.basedOn) : null;
  }
  return Object.assign({}, ...chain);
}

export function getRulerDocumentModel(client) {
  if (!client) return null;
  const state = client.getState?.();
  const document = state?.document || client.getDocument?.();
  if (!document) return null;
  const section = document.sections?.[state?.activeSectionIndex || 0] || document.sections?.[0];
  const pageSettings = section?.pageSettings || document.pageSettings;
  if (!pageSettings?.width || !pageSettings?.margins) return null;
  const paragraph = resolveCurrentParagraph(document, state?.selection || client.selection?.get?.(), state?.activeSectionIndex || 0);
  const inherited = resolveNamedParagraphStyle(document, paragraph?.style?.styleId);
  const paragraphStyle = { ...inherited, ...(paragraph?.style || {}) };
  const indentKeys = ['indentLeft', 'indentRight', 'indentFirstLine', 'indentHanging'];
  const hasParagraph = Boolean(paragraph);
  const markersDataSource = hasParagraph && indentKeys.every((key) => paragraphStyle[key] == null || Number.isFinite(Number(paragraphStyle[key])))
    ? 'REAL'
    : 'PLACEHOLDER';
  const indents = markersDataSource === 'REAL'
    ? Object.fromEntries(indentKeys.map((key) => [key, Number(paragraphStyle[key] || 0)]))
    : { indentLeft: 0, indentRight: 0, indentFirstLine: 0, indentHanging: 0 };
  return {
    pageSettings,
    activeSectionIndex: state?.activeSectionIndex || 0,
    paragraphId: paragraph?.id || null,
    indents,
    markersDataSource,
    zoomPercent: Number(client.ui?.zoom?.get?.()) || 100,
  };
}

export function snapRulerIndent(value, maximum = Number.POSITIVE_INFINITY) {
  const step = OASIS_RULER_PX_PER_CM * OASIS_RULER_SNAP_CM;
  const maxSnapped = Number.isFinite(maximum) ? Math.floor(Math.max(0, maximum) / step) * step : maximum;
  return Math.min(Math.round(Math.max(0, Number(value) || 0) / step) * step, maxSnapped);
}

export function getIndentBounds(kind, model) {
  const settings = model?.pageSettings;
  if (!settings?.width || !settings?.margins) return { min: 0, max: 0 };
  const left = Number(settings.margins.left || 0) + Number(settings.margins.gutter || 0);
  const right = Number(settings.width) - Number(settings.margins.right || 0);
  const contentWidth = Math.max(0, right - left);
  const indents = model.indents || {};
  const firstLineOffset = Math.max(0, Number(indents.indentFirstLine || 0) - Number(indents.indentHanging || 0));
  if (kind === 'left') return { min: 0, max: Math.max(0, contentWidth - Number(indents.indentRight || 0) - firstLineOffset - OASIS_RULER_MIN_CONTENT_PX) };
  if (kind === 'firstLine') return { min: 0, max: Math.max(0, contentWidth - Number(indents.indentLeft || 0) - Number(indents.indentRight || 0) - OASIS_RULER_MIN_CONTENT_PX) };
  if (kind === 'right') return { min: 0, max: Math.max(0, contentWidth - Number(indents.indentLeft || 0) - firstLineOffset - OASIS_RULER_MIN_CONTENT_PX) };
  return { min: 0, max: 0 };
}

export function calculateIndentValue(kind, pageX, model) {
  const settings = model?.pageSettings;
  if (!settings?.width || !settings?.margins || !model?.paragraphId) return null;
  const left = Number(settings.margins.left || 0) + Number(settings.margins.gutter || 0);
  const right = Number(settings.width) - Number(settings.margins.right || 0);
  const { max } = getIndentBounds(kind, model);
  const indents = model.indents || {};
  const leftIndent = Number(indents.indentLeft || 0);
  const hanging = Number(indents.indentHanging || 0);
  let value;
  if (kind === 'left') {
    value = Number(pageX) - left;
  } else if (kind === 'firstLine') {
    // Oasis defines first-line indent relative to the paragraph's left indent.
    // Keep a pre-existing hanging indent unchanged and do not create new hanging indents.
    value = Number(pageX) - left - leftIndent + hanging;
  } else if (kind === 'right') {
    value = right - Number(pageX);
  } else {
    return null;
  }
  return snapRulerIndent(value, max);
}

export function applyRulerIndent(client, paragraphId, kind, value) {
  const current = getRulerDocumentModel(client);
  if (!current || current.paragraphId !== paragraphId || !Number.isFinite(value)) return false;
  const commandByKind = { left: 'setIndentLeft', firstLine: 'setIndentFirstLine', right: 'setIndentRight' };
  const command = commandByKind[kind];
  if (!command || typeof client.commands?.execute !== 'function') return false;
  client.commands.execute(command, value);
  return true;
}

export function buildRulerTicks(pageWidth, scale) {
  const step = OASIS_RULER_PX_PER_CM * scale / 2;
  if (!Number.isFinite(step) || step <= 0 || !Number.isFinite(pageWidth)) return [];
  const ticks = [];
  for (let x = 0, index = 0; x <= pageWidth + 0.5; x += step, index += 1) {
    const wholeCentimeter = index % 2 === 0;
    ticks.push({ x: Math.min(x, pageWidth), kind: wholeCentimeter ? 'major' : 'half', label: wholeCentimeter ? String(index / 2) : '' });
  }
  return ticks;
}

export function buildRulerGeometry(pageSettings, indents, scale) {
  const pageWidth = Number(pageSettings?.width) * scale;
  const leftMargin = (Number(pageSettings?.margins?.left || 0) + Number(pageSettings?.margins?.gutter || 0)) * scale;
  const rightMargin = Number(pageSettings?.margins?.right || 0) * scale;
  const contentRight = Math.max(leftMargin, pageWidth - rightMargin);
  const leftIndent = Number(indents?.indentLeft || 0) * scale;
  const firstLine = Number(indents?.indentFirstLine || 0) * scale;
  const hanging = Number(indents?.indentHanging || 0) * scale;
  const rightIndent = Number(indents?.indentRight || 0) * scale;
  return {
    pageWidth,
    leftMargin,
    contentRight,
    rightMarginStart: contentRight,
    leftMarker: leftMargin + leftIndent,
    firstLineMarker: leftMargin + leftIndent + firstLine - hanging,
    rightMarker: contentRight - rightIndent,
    ticks: buildRulerTicks(pageWidth, scale),
  };
}
