import { useEffect, useRef, useState } from 'react';
import { OASIS_TAB_CONNECTION_EVENT, OASIS_TAB_REQUEST_EVENT, OASIS_TAB_SET_EVENT, OASIS_TAB_STATE_EVENT } from './oasisActiveTabBridge.js';

export const OASIS_PRIMARY_TABS = [
  { id: 'file', label: 'Arquivo' },
  { id: 'home', label: 'Início' },
  { id: 'insert', label: 'Inserir' },
  { id: 'design', label: 'Design' },
  { id: 'layout', label: 'Layout' },
  { id: 'references', label: 'Referências' },
  { id: 'plugins', label: 'Plugins' },
];

// Contextual Oasis tabs are projected onto their related primary section;
// the underlying active tab remains owned by Oasis.
const PRIMARY_TAB_FOR_CONTEXT = {
  tableDesign: 'insert',
  tableLayout: 'layout',
  imageFormat: 'insert',
};

function dispatch(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function EditorTextosOasisTabBar() {
  const [activeTab, setActiveTab] = useState('home');
  const [connected, setConnected] = useState(false);
  const tabRefs = useRef(new Map());

  useEffect(() => {
    const onState = (event) => {
      const tabId = event.detail?.tabId;
      const projectedTab = PRIMARY_TAB_FOR_CONTEXT[tabId] || tabId;
      if (OASIS_PRIMARY_TABS.some((tab) => tab.id === projectedTab)) setActiveTab(projectedTab);
    };
    const onConnection = (event) => setConnected(Boolean(event.detail?.connected));
    window.addEventListener(OASIS_TAB_STATE_EVENT, onState);
    window.addEventListener(OASIS_TAB_CONNECTION_EVENT, onConnection);
    dispatch(OASIS_TAB_REQUEST_EVENT);
    return () => {
      window.removeEventListener(OASIS_TAB_STATE_EVENT, onState);
      window.removeEventListener(OASIS_TAB_CONNECTION_EVENT, onConnection);
    };
  }, []);

  const chooseTab = (tabId, moveFocus = false) => {
    if (!connected) return;
    dispatch(OASIS_TAB_SET_EVENT, { tabId });
    if (moveFocus) tabRefs.current.get(tabId)?.focus();
  };

  const handleKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % OASIS_PRIMARY_TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (index + OASIS_PRIMARY_TABS.length - 1) % OASIS_PRIMARY_TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = OASIS_PRIMARY_TABS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    chooseTab(OASIS_PRIMARY_TABS[nextIndex].id, true);
  };

  return <div className="editor-textos-oasis-tabbar" aria-label="Comandos do Editor de Textos">
    <div className="editor-textos-oasis-tabbar__tabs" role="tablist" aria-label="Abas do Oasis">
      {OASIS_PRIMARY_TABS.map((tab, index) => <button
        key={tab.id}
        ref={(element) => {
          if (element) tabRefs.current.set(tab.id, element);
          else tabRefs.current.delete(tab.id);
        }}
        type="button"
        role="tab"
        id={`brana-oasis-tab-${tab.id}`}
        aria-controls={`oasis-editor-ribbon-panel-${tab.id}`}
        aria-selected={activeTab === tab.id}
        aria-disabled={!connected}
        tabIndex={activeTab === tab.id ? 0 : -1}
        disabled={!connected}
        className={`editor-textos-oasis-tab${activeTab === tab.id ? ' is-active' : ''}`}
        onMouseDown={(event) => { if (event.button === 0) event.preventDefault(); }}
        onClick={() => chooseTab(tab.id)}
        onKeyDown={(event) => handleKeyDown(event, index)}
      >{tab.label}</button>)}</div>
  </div>;
}
