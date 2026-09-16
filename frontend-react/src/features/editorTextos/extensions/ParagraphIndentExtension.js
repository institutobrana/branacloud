import { Extension } from '@tiptap/core';

export const INDENT_STEP_PX = 24;
export const MIN_TEXT_WIDTH_PX = 24;
export const MIN_INDENT = 0;
export const MAX_INDENT = 240;

function clampIndent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return MIN_INDENT;
  return Math.min(MAX_INDENT, Math.max(MIN_INDENT, Math.round(numeric / INDENT_STEP_PX) * INDENT_STEP_PX));
}

function finiteIndent(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}

function selectedParagraphPositions(state) {
  const positions = [];
  state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
    if (node.type.name === 'paragraph' && !positions.includes(pos)) positions.push(pos);
  });
  if (!positions.length) {
    const resolved = state.doc.resolve(state.selection.from);
    for (let depth = resolved.depth; depth > 0; depth -= 1) {
      if (resolved.node(depth).type.name === 'paragraph') { positions.push(resolved.before(depth)); break; }
    }
  }
  return positions;
}

function isSelectionInsideList(state) {
  const resolved = state.doc.resolve(state.selection.head);
  for (let depth = resolved.depth; depth > 0; depth -= 1) {
    if (['bulletList', 'orderedList', 'listItem'].includes(resolved.node(depth).type.name)) return true;
  }
  return false;
}

export const ParagraphIndentExtension = Extension.create({
  name: 'paragraphIndent',
  addGlobalAttributes() {
    return [{ types: ['paragraph'], attributes: {
      indent: { default: 0, parseHTML: (element) => clampIndent(element.style.marginLeft?.replace('px', '')), renderHTML: () => ({}) },
      leftIndentPx: { default: 0, parseHTML: (element) => finiteIndent(element.style.marginLeft?.replace('px', '')), renderHTML: (attrs) => attrs.leftIndentPx ? { style: `margin-left: ${finiteIndent(attrs.leftIndentPx)}px` } : {} },
      rightIndentPx: { default: 0, parseHTML: (element) => finiteIndent(element.style.marginRight?.replace('px', '')), renderHTML: (attrs) => attrs.rightIndentPx ? { style: `margin-right: ${finiteIndent(attrs.rightIndentPx)}px` } : {} },
      firstLineIndentPx: { default: 0, parseHTML: (element) => finiteIndent(element.style.textIndent?.replace('px', '')), renderHTML: (attrs) => attrs.firstLineIndentPx ? { style: `text-indent: ${finiteIndent(attrs.firstLineIndentPx)}px` } : {} },
    } }];
  },
  addCommands() {
    const setIndent = (delta) => ({ state, dispatch }) => {
      const positions = selectedParagraphPositions(state);
      if (!positions.length) return false;
      const transaction = state.tr;
      let changed = false;
      positions.forEach((pos) => {
        const node = transaction.doc.nodeAt(pos);
        if (!node || node.type.name !== 'paragraph') return;
        const current = node.attrs.leftIndentPx ?? node.attrs.indent ?? 0;
        const next = clampIndent(current + delta);
        if (next !== current || node.attrs.leftIndentPx !== next) { transaction.setNodeMarkup(pos, undefined, { ...node.attrs, indent: 0, leftIndentPx: next }); changed = true; }
      });
      if (changed && dispatch) dispatch(transaction);
      return changed;
    };
    const setRulerIndent = (side, value) => ({ state, dispatch }) => {
      if (isSelectionInsideList(state)) return false;
      const positions = selectedParagraphPositions(state);
      if (!positions.length) return false;
      const transaction = state.tr;
      let changed = false;
      positions.forEach((pos) => {
        const node = transaction.doc.nodeAt(pos);
        if (!node || node.type.name !== 'paragraph') return;
        const left = finiteIndent(node.attrs.leftIndentPx ?? node.attrs.indent);
        const right = finiteIndent(node.attrs.rightIndentPx);
        const max = 100000;
        const next = Math.max(0, Math.min(max, finiteIndent(value)));
        const key = side === 'left' ? 'leftIndentPx' : 'rightIndentPx';
        if (node.attrs[key] !== next || node.attrs.indent) { transaction.setNodeMarkup(pos, undefined, { ...node.attrs, indent: 0, [key]: next }); changed = true; }
      });
      if (changed && dispatch) dispatch(transaction);
      return changed;
    };
    return { increaseIndent: () => setIndent(INDENT_STEP_PX), decreaseIndent: () => setIndent(-INDENT_STEP_PX), setRulerLeftIndent: ({ value }) => setRulerIndent('left', value), setRulerRightIndent: ({ value }) => setRulerIndent('right', value) };
  },
});
