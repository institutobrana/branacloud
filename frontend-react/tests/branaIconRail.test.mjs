import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const frontendRoot = resolve('frontend-react');
const railSource = resolve(frontendRoot, 'src/layout/BranaIconRail.jsx');

async function loadRailModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'brana-icon-rail-'));
  const outfile = join(tempDir, 'BranaIconRail.bundle.mjs');

  await build({
    entryPoints: [railSource],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    logLevel: 'silent',
    plugins: [
      {
        name: 'stub-rail-deps',
        setup(build) {
          build.onResolve({ filter: /^antd$/ }, () => ({ path: 'antd-stub', namespace: 'stub' }));
          build.onResolve({ filter: /^@ant-design\/icons$/ }, () => ({ path: 'icons-stub', namespace: 'stub' }));
          build.onResolve({ filter: /^\.\/ThemeToggleButton\.jsx$/ }, () => ({ path: 'theme-toggle-stub', namespace: 'stub' }));
          build.onLoad({ filter: /.*/, namespace: 'stub' }, (args) => {
            if (args.path === 'antd-stub') {
              return {
                contents: `
                  export const Tooltip = ({ children }) => children;
                `,
                loader: 'js',
              };
            }
            if (args.path === 'icons-stub') {
              return {
                contents: `
                  const icon = (name) => () => null;
                  export const MenuFoldOutlined = icon('MenuFoldOutlined');
                  export const MenuUnfoldOutlined = icon('MenuUnfoldOutlined');
                  export const DollarOutlined = icon('DollarOutlined');
                  export const FileTextOutlined = icon('FileTextOutlined');
                  export const CustomerServiceOutlined = icon('CustomerServiceOutlined');
                  export const SafetyCertificateOutlined = icon('SafetyCertificateOutlined');
                  export const SettingOutlined = icon('SettingOutlined');
                  export const TableOutlined = icon('TableOutlined');
                  export const TeamOutlined = icon('TeamOutlined');
                  export const ToolOutlined = icon('ToolOutlined');
                  export const UserOutlined = icon('UserOutlined');
                `,
                loader: 'js',
              };
            }
            return {
              contents: `
                export function ThemeToggleButton() {
                  return null;
                }
              `,
              loader: 'js',
            };
          });
        },
      },
    ],
  });

  return import(pathToFileURL(outfile).href).finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

async function renderRail(groups, overrides = {}) {
  const { BranaIconRail } = await loadRailModule();
  return renderToStaticMarkup(
    React.createElement(BranaIconRail, {
      activeKey: null,
      expanded: false,
      groups,
      activeGroupKey: null,
      panelOpen: false,
      onNavigate: () => {},
      onOpenGroup: () => {},
      onToggleExpand: () => {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      ...overrides,
    }),
  );
}

test('brana icon rail renders ADM for owner-capable groups and keeps support alongside it', async () => {
  const { branaMainGroups } = await loadRailModule();
  const html = await renderRail(branaMainGroups);
  assert.match(html, /aria-label="ADM"/);
  assert.match(html, /aria-label="Ajuda"/);
  assert.match(html, /brana-icon-rail-button/);
});

test('brana icon rail keeps ADM visible even with many groups and does not invent a hard cap', async () => {
  const groups = [
    { key: 'alpha', label: 'Alpha', icon: React.createElement('span', null, 'A') },
    { key: 'beta', label: 'Beta', icon: React.createElement('span', null, 'B') },
    { key: 'gamma', label: 'Gamma', icon: React.createElement('span', null, 'C') },
    { key: 'delta', label: 'Delta', icon: React.createElement('span', null, 'D') },
    { key: 'epsilon', label: 'Epsilon', icon: React.createElement('span', null, 'E') },
    { key: 'zeta', label: 'Zeta', icon: React.createElement('span', null, 'Z') },
    { key: 'eta', label: 'Eta', icon: React.createElement('span', null, 'H') },
    { key: 'theta', label: 'Theta', icon: React.createElement('span', null, 'T') },
    { key: 'adm', label: 'ADM', icon: React.createElement('span', null, 'M') },
  ];

  const html = await renderRail(groups);
  assert.match(html, /aria-label="ADM"/);
  assert.match(html, /aria-label="Theta"/);
});

test('brana icon rail source keeps the rail fully open vertically for all groups', () => {
  const css = readFileSync(resolve(frontendRoot, 'src/styles/globals.css'), 'utf8');
  assert.match(css, /\.brana-icon-rail \{[\s\S]*overflow-x:\s*hidden;[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /\.brana-icon-rail-nav,[\s\S]*\.brana-icon-rail-footer \{[\s\S]*gap:\s*5px;/);
});
