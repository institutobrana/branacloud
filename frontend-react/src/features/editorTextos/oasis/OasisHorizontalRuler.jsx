import { useEffect, useState } from 'react';
import {
  applyRulerIndent,
  buildRulerGeometry,
  calculateIndentValue,
  getIndentBounds,
  getRulerDocumentModel,
  OASIS_RULER_PX_PER_CM,
  OASIS_RULER_SNAP_CM,
} from './oasisRulerAdapter.js';

const RULER_HEIGHT = 24;

export function OasisHorizontalRuler({ client, rootRef, hostRef }) {
  const [view, setView] = useState(null);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    if (!client || !rootRef.current || !hostRef.current) return undefined;
    const root = rootRef.current;
    const host = hostRef.current;
    let frame = 0;
    let observer;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const paper = host.querySelector('.oasis-editor-paper');
        const editorViewport = host.querySelector('.oasis-editor-editor');
        const model = getRulerDocumentModel(client);
        if (!paper || !editorViewport || !model) {
          setView(null);
          return;
        }
        const rootRect = root.getBoundingClientRect();
        const viewportRect = editorViewport.getBoundingClientRect();
        const pageRect = paper.getBoundingClientRect();
        if (!pageRect.width || !pageRect.height) {
          setView(null);
          return;
        }
        const scale = pageRect.width / model.pageSettings.width;
        const top = pageRect.top - rootRect.top - RULER_HEIGHT - 2;
        const viewportTop = viewportRect.top - rootRect.top;
        const viewportBottom = viewportRect.bottom - rootRect.top;
        const clipTop = Math.max(0, viewportTop - top);
        const clipBottom = Math.max(0, top + RULER_HEIGHT - viewportBottom);
        setView({
          left: pageRect.left - rootRect.left,
          top,
          width: pageRect.width,
          clipPath: `inset(${clipTop}px 0 ${clipBottom}px 0)`,
          visible: clipTop + clipBottom < RULER_HEIGHT,
          geometry: buildRulerGeometry(model.pageSettings, model.indents, scale),
          markerSource: model.markersDataSource,
          paragraphId: model.paragraphId,
          model,
          zoomPercent: model.zoomPercent,
          scale,
          pageWidth: model.pageSettings.width,
          pageLeftClient: pageRect.left,
        });
      });
    };
    const unsubscribe = ['selectionChange', 'change', 'documentChange', 'uiChange'].map((eventName) => client.on(eventName, update));
    const onScroll = () => update();
    root.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', update);
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update);
      observer.observe(root);
      const editorViewport = host.querySelector('.oasis-editor-editor');
      const paper = host.querySelector('.oasis-editor-paper');
      if (editorViewport) observer.observe(editorViewport);
      if (paper) observer.observe(paper);
    }
    update();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', update);
      observer?.disconnect();
      unsubscribe.forEach((off) => off?.());
    };
  }, [client, rootRef, hostRef]);

  if (!view) return null;
  const shownIndents = drag?.paragraphId === view.paragraphId
    ? { ...view.model.indents, [drag.kind === 'left' ? 'indentLeft' : drag.kind === 'right' ? 'indentRight' : 'indentFirstLine']: drag.value }
    : view.model.indents;
  const geometry = buildRulerGeometry(view.model.pageSettings, shownIndents, view.scale);
  const scaleLabel = Math.abs(view.scale - view.zoomPercent / 100) < 0.03 ? `${view.zoomPercent}%` : `${Math.round(view.scale * 100)}% visual`;
  const stepPx = OASIS_RULER_PX_PER_CM * OASIS_RULER_SNAP_CM;

  const valueForKind = (kind) => Number(view.model.indents[kind === 'left' ? 'indentLeft' : kind === 'right' ? 'indentRight' : 'indentFirstLine'] || 0);
  const previewFromClientX = (kind, clientX, startView = view) => calculateIndentValue(
    kind,
    (clientX - startView.pageLeftClient) / startView.scale,
    startView.model,
  );
  const formatCm = (value) => `${(Number(value || 0) / OASIS_RULER_PX_PER_CM).toFixed(1).replace('.', ',')} cm`;
  const moveByKeyboard = (kind, direction) => {
    const model = getRulerDocumentModel(client);
    if (!model?.paragraphId) return;
    const field = kind === 'left' ? 'indentLeft' : kind === 'right' ? 'indentRight' : 'indentFirstLine';
    const desired = Math.max(0, Number(model.indents[field] || 0) + direction * stepPx);
    const left = Number(model.pageSettings.margins.left || 0) + Number(model.pageSettings.margins.gutter || 0);
    const right = Number(model.pageSettings.width) - Number(model.pageSettings.margins.right || 0);
    const pageX = kind === 'left'
      ? left + desired
      : kind === 'right'
        ? right - desired
        : left + Number(model.indents.indentLeft || 0) + desired - Number(model.indents.indentHanging || 0);
    const value = calculateIndentValue(kind, pageX, model);
    if (value != null) applyRulerIndent(client, model.paragraphId, kind, value);
  };
  const beginDrag = (kind, event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const startView = view;
    const target = event.currentTarget;
    target.setPointerCapture?.(event.pointerId);
    setDrag({
      kind,
      value: valueForKind(kind),
      paragraphId: startView.paragraphId,
      model: startView.model,
      scale: startView.scale,
      pageLeftClient: startView.pageLeftClient,
      pointerId: event.pointerId,
      target,
    });
  };
  const updateDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    const value = previewFromClientX(drag.kind, event.clientX, drag);
    if (value != null) setDrag((current) => current ? { ...current, value } : current);
  };
  const finishDrag = (event, commit) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    const finalValue = previewFromClientX(drag.kind, event.clientX, drag);
    if (commit && finalValue != null && finalValue !== valueForKind(drag.kind)) {
      applyRulerIndent(client, drag.paragraphId, drag.kind, finalValue);
    }
    if (drag.target.hasPointerCapture?.(drag.pointerId)) drag.target.releasePointerCapture(drag.pointerId);
    setDrag(null);
  };

  const marker = (kind, position, classes) => {
    const field = kind === 'left' ? 'indentLeft' : kind === 'right' ? 'indentRight' : 'indentFirstLine';
    const value = drag?.paragraphId === view.paragraphId && drag.kind === kind ? drag.value : Number(view.model.indents[field] || 0);
    const valueCm = value / OASIS_RULER_PX_PER_CM;
    const maxCm = getIndentBounds(kind, view.model).max / OASIS_RULER_PX_PER_CM;
    const label = kind === 'left' ? 'Recuo esquerdo' : kind === 'right' ? 'Recuo direito' : 'Recuo da primeira linha';
    return <button
      key={kind}
      type="button"
      role="slider"
      className={`editor-textos-oasis-ruler__marker ${classes}`}
      style={{ left: position }}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Number(maxCm.toFixed(1))}
      aria-valuenow={Number(valueCm.toFixed(1))}
      aria-valuetext={formatCm(value)}
      title={`${label}: ${formatCm(value)}`}
      onPointerDown={(event) => beginDrag(kind, event)}
      onPointerMove={updateDrag}
      onPointerUp={(event) => finishDrag(event, true)}
      onPointerCancel={(event) => finishDrag(event, false)}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        moveByKeyboard(kind, event.key === 'ArrowRight' ? 1 : -1);
      }}
    ><span className="editor-textos-oasis-ruler__tooltip" role="tooltip">{formatCm(value)}</span></button>;
  };
  return <div
    className="editor-textos-oasis-ruler"
    data-ruler-model="public-paragraph-indent-commands"
    data-paragraph-id={view.paragraphId || ''}
    data-marker-source={view.markerSource}
    data-zoom={scaleLabel}
    style={{ left: view.left, top: view.top, width: view.width, clipPath: view.clipPath, visibility: view.visible ? 'visible' : 'hidden' }}
  >
    <div className="editor-textos-oasis-ruler__track" aria-hidden="true">
      <span className="editor-textos-oasis-ruler__margin" style={{ left: 0, width: geometry.leftMargin }} />
      <span className="editor-textos-oasis-ruler__content" style={{ left: geometry.leftMargin, width: geometry.contentRight - geometry.leftMargin }} />
      <span className="editor-textos-oasis-ruler__margin" style={{ left: geometry.rightMarginStart, width: geometry.pageWidth - geometry.rightMarginStart }} />
      {geometry.ticks.map((tick, index) => <span key={index} className={`editor-textos-oasis-ruler__tick is-${tick.kind}`} style={{ left: tick.x }}>
        {tick.label && <span>{tick.label}</span>}
      </span>)}
    </div>
    {marker('left', geometry.leftMarker, 'is-left')}
    {marker('firstLine', geometry.firstLineMarker, 'is-first-line')}
    {marker('right', geometry.rightMarker, 'is-right')}
    <span className="editor-textos-oasis-ruler__unit">cm</span>
  </div>;
}
