export const OASIS_TAB_SET_EVENT = 'brana-editor-textos-oasis-tab-set';
export const OASIS_TAB_STATE_EVENT = 'brana-editor-textos-oasis-tab-state';
export const OASIS_TAB_REQUEST_EVENT = 'brana-editor-textos-oasis-tab-request';
export const OASIS_TAB_CONNECTION_EVENT = 'brana-editor-textos-oasis-tab-connection';

export function connectOasisActiveTabApi(client, eventTarget = window) {
  const ribbon = client?.ui?.ribbon;
  if (!ribbon?.getActiveTab || !ribbon?.setActiveTab || !ribbon?.onActiveTabChange) return null;

  const publishActiveTab = (tabId) => eventTarget.dispatchEvent(new CustomEvent(OASIS_TAB_STATE_EVENT, { detail: { tabId } }));
  const publishCurrentTab = () => publishActiveTab(ribbon.getActiveTab());
  const onSetActiveTab = (event) => ribbon.setActiveTab(event.detail?.tabId);
  const onRequestActiveTab = () => publishCurrentTab();
  eventTarget.addEventListener(OASIS_TAB_SET_EVENT, onSetActiveTab);
  eventTarget.addEventListener(OASIS_TAB_REQUEST_EVENT, onRequestActiveTab);
  const unsubscribe = ribbon.onActiveTabChange(publishActiveTab);
  eventTarget.dispatchEvent(new CustomEvent(OASIS_TAB_CONNECTION_EVENT, { detail: { connected: true } }));
  publishCurrentTab();

  return () => {
    unsubscribe();
    eventTarget.removeEventListener(OASIS_TAB_SET_EVENT, onSetActiveTab);
    eventTarget.removeEventListener(OASIS_TAB_REQUEST_EVENT, onRequestActiveTab);
    eventTarget.dispatchEvent(new CustomEvent(OASIS_TAB_CONNECTION_EVENT, { detail: { connected: false } }));
  };
}
