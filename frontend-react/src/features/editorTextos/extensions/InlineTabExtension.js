import { Node, mergeAttributes } from '@tiptap/core';
import { closeHistory } from '@tiptap/pm/history';

export const DEFAULT_TAB_STOP_INTERVAL = 32;

function tabWidth(editor) {
  const current = editor.view.coordsAtPos(editor.state.selection.from).left;
  const origin = editor.view.dom.getBoundingClientRect().left;
  const remainder = Math.max(0, current - origin) % DEFAULT_TAB_STOP_INTERVAL;
  return Math.max(1, DEFAULT_TAB_STOP_INTERVAL - remainder);
}

function previousInlineTab(state) {
  const { from, empty } = state.selection;
  if (!empty || from <= 0) return null;
  return state.doc.nodeAt(from - 1)?.type.name === 'inlineTab' ? from - 1 : null;
}

function nextInlineTab(state) {
  const { from, empty } = state.selection;
  if (!empty) return null;
  const node = state.doc.resolve(from).nodeAfter;
  return node?.type.name === 'inlineTab' ? node : null;
}

function isInsideTable(state) {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if (['tableCell', 'tableHeader'].includes($from.node(depth).type.name)) return true;
  }
  return false;
}

export const InlineTabExtension = Node.create({
  name: 'inlineTab',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  addAttributes: () => ({ width: { default: DEFAULT_TAB_STOP_INTERVAL } }),
  parseHTML: () => [{ tag: 'span[data-et-tab-op="tab"]' }, { tag: 'span.editor-textos-inline-tab' }],
  renderHTML({ HTMLAttributes }) {
    const width = Math.max(1, Number(HTMLAttributes.width) || DEFAULT_TAB_STOP_INTERVAL);
    return ['span', mergeAttributes(HTMLAttributes, {
      'data-et-tab-op': 'tab', class: 'editor-textos-inline-tab',
      style: `display: inline-block; width: ${width}px`, 'aria-hidden': 'true',
    })];
  },
  addCommands() {
    return {
      insertInlineTab: () => ({ state, dispatch }) => {
        if (!dispatch) return true;
        const transaction = state.tr.replaceSelectionWith(this.type.create({ width: tabWidth(this.editor) })).scrollIntoView();
        dispatch(closeHistory(state.tr));
        dispatch(transaction);
        return true;
      },
      removePreviousInlineTab: () => ({ state, dispatch }) => {
        const position = previousInlineTab(state);
        if (position == null) return false;
        if (dispatch) {
          dispatch(closeHistory(state.tr));
          dispatch(state.tr.delete(position, position + 1).scrollIntoView());
        }
        return true;
      },
      removeNextInlineTab: () => ({ state, dispatch }) => {
        const node = nextInlineTab(state);
        if (!node) return false;
        if (dispatch) {
          dispatch(closeHistory(state.tr));
          dispatch(state.tr.delete(state.selection.from, state.selection.from + node.nodeSize).scrollIntoView());
        }
        return true;
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (!this.editor.isFocused) return false;
        if (isInsideTable(this.editor.state)) return false;
        if (this.editor.isActive('listItem')) {
          this.editor.commands.sinkListItem('listItem');
          return true;
        }
        return this.editor.commands.insertInlineTab();
      },
      'Shift-Tab': () => {
        if (!this.editor.isFocused) return false;
        if (isInsideTable(this.editor.state)) return false;
        if (this.editor.isActive('listItem')) {
          this.editor.commands.liftListItem('listItem');
          return true;
        }
        return this.editor.commands.removePreviousInlineTab();
      },
      Delete: () => {
        if (!this.editor.isFocused) return false;
        return this.editor.commands.removeNextInlineTab();
      },
    };
  },
});
