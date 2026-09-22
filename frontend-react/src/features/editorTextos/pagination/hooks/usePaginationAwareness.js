import { useEffect, useRef, useState } from 'react';
import { buildPaginationLayoutState } from '../engine/paginationEngine.js';
import { emptyPaginationState, PAGINATION_AWARENESS_ENABLED } from '../model/paginationState.js';
import { createPaginationScheduler } from '../scheduler/paginationScheduler.js';
import { pageForPosition, selectionPageRange } from '../mapping/positionMapping.js';

export function usePaginationAwareness(editor, pageConfig) {
  const [layout, setLayout] = useState(emptyPaginationState); const versions = useRef({ documentVersion: 0, configVersion: 0, layoutVersion: 0 });
  useEffect(() => { if (!editor || !PAGINATION_AWARENESS_ENABLED) return undefined; const scheduler = createPaginationScheduler((task) => setLayout((current) => task.layoutVersion >= current.layoutVersion ? task : current)); versions.current.configVersion += 1; const schedule = (config = pageConfig) => { const v = versions.current; v.layoutVersion += 1; scheduler.schedule(() => buildPaginationLayoutState({ doc: editor.state.doc, pageConfig: config, documentVersion: v.documentVersion, configVersion: v.configVersion, layoutVersion: v.layoutVersion })); }; const onTransaction = ({ transaction }) => { if (transaction.docChanged) versions.current.documentVersion += 1; schedule(); }; const onSelection = () => setLayout((current) => ({ ...current, currentPage: pageForPosition(current, editor.state.selection.head), selectionPageRange: selectionPageRange(current, editor.state.selection) })); editor.on('transaction', onTransaction); editor.on('selectionUpdate', onSelection); schedule(); onSelection(); return () => { editor.off('transaction', onTransaction); editor.off('selectionUpdate', onSelection); scheduler.cancel(); }; }, [editor, pageConfig]);
  return { enabled: PAGINATION_AWARENESS_ENABLED, layout };
}
