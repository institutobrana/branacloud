import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { connectOasisActiveTabApi, OASIS_TAB_CONNECTION_EVENT, OASIS_TAB_REQUEST_EVENT, OASIS_TAB_SET_EVENT, OASIS_TAB_STATE_EVENT } from '../src/features/editorTextos/oasis/oasisActiveTabBridge.js';

const root = path.resolve(import.meta.dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const primaryTabs = ['file', 'home', 'insert', 'design', 'layout', 'references', 'plugins'];

test('Brana tab bridge reads, writes and subscribes through the supplied Oasis API', () => {
  const listeners = new Map();
  const target = {
    addEventListener(type, callback) {
      const callbacks = listeners.get(type) || new Set();
      callbacks.add(callback);
      listeners.set(type, callbacks);
    },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
    dispatchEvent(event) {
      for (const callback of [...(listeners.get(event.type) || [])]) callback(event);
      return true;
    },
  };
  const emit = (type, detail = {}) => target.dispatchEvent(new CustomEvent(type, { detail }));
  const stateEvents = [];
  const connectionEvents = [];
  target.addEventListener(OASIS_TAB_STATE_EVENT, (event) => stateEvents.push(event.detail.tabId));
  target.addEventListener(OASIS_TAB_CONNECTION_EVENT, (event) => connectionEvents.push(event.detail.connected));

  let activeTab = 'home';
  const subscribers = new Set();
  const allowedTabs = new Set([...primaryTabs, 'tableDesign', 'tableLayout', 'imageFormat']);
  const ribbon = {
    getActiveTab: () => activeTab,
    setActiveTab(tabId) {
      if (!primaryTabs.includes(tabId)) return false;
      if (activeTab !== tabId) {
        activeTab = tabId;
        for (const callback of subscribers) callback(activeTab);
      }
      return true;
    },
    onActiveTabChange(callback) { subscribers.add(callback); return () => subscribers.delete(callback); },
  };
  const disconnect = connectOasisActiveTabApi({ ui: { ribbon } }, target);
  assert.equal(typeof disconnect, 'function');
  assert.deepEqual(stateEvents, ['home']);
  assert.deepEqual(connectionEvents, [true]);

  emit(OASIS_TAB_SET_EVENT, { tabId: 'insert' });
  assert.equal(ribbon.getActiveTab(), 'insert');
  assert.equal(stateEvents.at(-1), 'insert');

  // Simulates an internal/native Oasis tab change, including a contextual tab.
  activeTab = 'layout';
  for (const callback of subscribers) callback(activeTab);
  activeTab = 'tableDesign';
  for (const callback of subscribers) callback(activeTab);
  assert.deepEqual(stateEvents.slice(-2), ['layout', 'tableDesign']);

  emit(OASIS_TAB_SET_EVENT, { tabId: 'not-a-tab' });
  assert.equal(ribbon.getActiveTab(), 'tableDesign');
  disconnect();
  assert.deepEqual(connectionEvents, [true, false]);
  emit(OASIS_TAB_SET_EVENT, { tabId: 'file' });
  assert.equal(ribbon.getActiveTab(), 'tableDesign');
  assert.equal(subscribers.size, 0);
});

test('Oasis Brana tab bar binds to the ribbon API and keeps a seven-tab accessible projection', () => {
  const client = read('src/features/editorTextos/oasis/OasisEditorPilot.jsx');
  const bar = read('src/features/editorTextos/oasis/EditorTextosOasisTabBar.jsx');
  const app = read('src/app/App.jsx');

  assert.match(client, /client\.ui\?\.ribbon/);
  const bridge = read('src/features/editorTextos/oasis/oasisActiveTabBridge.js');
  assert.match(client, /connectOasisActiveTabApi\(client\)/);
  assert.match(bridge, /ribbon\.getActiveTab\(\)/);
  assert.match(bridge, /ribbon\.setActiveTab\(event\.detail\?\.tabId\)/);
  assert.match(bridge, /ribbon\.onActiveTabChange\(publishActiveTab\)/);
  assert.match(bridge, /unsubscribe\(\)/);
  assert.match(bar, /role="tablist"/);
  assert.match(bar, /role="tab"/);
  assert.match(bar, /aria-selected=\{activeTab === tab\.id\}/);
  assert.match(bar, /ArrowRight/);
  assert.match(bar, /ArrowLeft/);
  assert.match(bar, /PRIMARY_TAB_FOR_CONTEXT/);
  assert.match(app, /tiptapSelected[\s\S]*EditorTextosPrimaryToolbar[\s\S]*EditorTextosOasisTabBar/);
});

test('Oasis public active-tab API is backed by the same registry used by Toolbar', () => {
  const bundle = read('.runtime_tmp/r36f-oasis-edit/dist/index-K-7FcXvb.js');
  const clientTypes = read('.runtime_tmp/r36f-oasis-edit/dist/app/client/OasisEditorClient.d.ts');
  const client = bundle.slice(bundle.indexOf('function createOasisEditorClient()'), bundle.indexOf('function createOasisEditor(container'));
  const registry = bundle.slice(bundle.indexOf('class ToolbarRegistryImpl'), bundle.indexOf('function createToolbarRegistry'));
  const toolbarStart = bundle.indexOf('function Toolbar(props)');
  const toolbar = bundle.slice(toolbarStart, toolbarStart + 2500);
  assert.ok(client.includes('getActiveTab: () =>'));
  assert.ok(client.includes('setActiveTab: (tabId) =>'));
  assert.ok(client.includes('onActiveTabChange: (callback) =>'));
  assert.ok(client.includes('requireHost().toolbarRegistry'));
  assert.ok(client.includes('_a2.getActiveTab()'));
  assert.ok(client.includes('_a2.setActiveTab(tabId)'));
  assert.ok(client.includes('_a2.onActiveTabChange(callback)'));
  assert.match(toolbar, /const activeTab = \(\) => \{\s*version2\(\);\s*return props\.registry\.getActiveTab\(\);\s*\};\s*const setActiveTab = \(tabId\) => props\.registry\.setActiveTab\(tabId\)/);
  assert.match(client, /if \(!\["file", "home", "insert", "design", "layout", "references", "plugins"\]\.includes\(tabId\)\) return false/);
  assert.ok(registry.includes('__publicField(this, "activeTab", "home")'));
  assert.ok(registry.includes('this.activeTab = tabId'));
  assert.match(clientTypes, /getActiveTab\(\): RibbonTabId/);
  assert.match(clientTypes, /onActiveTabChange\(callback: \(tabId: RibbonTabId\) => void\): \(\) => void/);
});
