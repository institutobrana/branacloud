export function isInTable(editor) {
  const selection = editor?.state?.selection;
  if (!selection) return false;
  const resolved = editor.state.doc.resolve(selection.head);
  for (let depth = resolved.depth; depth > 0; depth -= 1) {
    if (['tableCell', 'tableHeader'].includes(resolved.node(depth).type.name)) return true;
  }
  return false;
}

export function insertTable(editor, { rows, cols, borderVisible = true }) {
  if (!editor || !Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows > 999 || cols > 999) return false;
  return editor
    .chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: false })
    .updateAttributes('table', { borderVisible: Boolean(borderVisible) })
    .command(({ tr }) => {
      const { $from } = tr.selection;
      let tableDepth = -1;
      for (let depth = $from.depth; depth > 0; depth -= 1) {
        if ($from.node(depth).type.name === 'table') {
          tableDepth = depth;
          break;
        }
      }

      if (tableDepth < 1) return true;

      const parent = $from.node(tableDepth - 1);
      const tableIndex = $from.index(tableDepth - 1);
      if (parent.type.name !== 'doc' || tableIndex !== parent.childCount - 1) return true;

      const paragraph = editor.schema.nodes.paragraph.create();
      tr.insert($from.after(tableDepth), paragraph);
      return true;
    })
    .run();
}
