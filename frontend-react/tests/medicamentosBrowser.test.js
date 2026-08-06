import test from 'node:test';
import assert from 'node:assert/strict';

import { chromium } from 'playwright';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://192.168.3.41:5173';
const ROUTE_URL = `${BASE_URL}/app/tabelas/medicamentos`;
const LOGIN_URL = `${BASE_URL}/api/login`;

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

async function loginToken() {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: 'gleissontel@gmail.com',
      password: '152730',
    }),
  });

  assert.equal(response.ok, true, 'login real deve funcionar para o teste de navegador');
  const data = await response.json();
  const token = String(data?.access_token || '').trim();
  assert.ok(token, 'login deve retornar access_token');
  return token;
}

async function createMedicamentosPage() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const token = await loginToken();
  await context.addInitScript((value) => window.localStorage.setItem('brana_token', value), token);
  const page = await context.newPage();
  await page.goto(ROUTE_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th').length >= 4);
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-tbody > tr[data-row-key]').length > 0);
  return { browser, page };
}

async function openColumnMenu(page, index) {
  const keys = ['nome', 'grupo', 'apresentacao'];
  const key = keys[index];
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const clicked = await page.evaluate((columnKey) => {
      const candidates = Array.from(document.querySelectorAll('.medicamentos-table .auxiliary-filter-trigger')).filter(
        (button) => button.getAttribute('data-column-key') === columnKey,
      );
      const visible = candidates.find((button) => {
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      });
      if (!visible) {
        return false;
      }
      visible.click();
      return true;
    }, key);
    if (clicked) {
      await page.waitForTimeout(250);
      return;
    }
    await page.waitForTimeout(100);
  }
  const debug = await page.evaluate((columnKey) => ({
    headerTexts: Array.from(document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th')).map((th) => th.innerText),
    keys: Array.from(document.querySelectorAll('.medicamentos-table .auxiliary-filter-trigger')).map((button) => ({
      key: button.getAttribute('data-column-key'),
      visible: (() => {
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })(),
      aria: button.getAttribute('aria-label'),
    })),
    columnKey,
  }), key);
  throw new Error(`Filtro de ${key} nao encontrado: ${JSON.stringify(debug)}`);
}

async function toggleColumnInMenu(page, label) {
  const target = normalizeText(label);
  await page.evaluate((normalizedTarget) => {
    const menuItem = Array.from(document.querySelectorAll('.auxiliary-filter-menu-checkbox')).find((item) =>
      String(item.innerText || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toUpperCase()
        .includes(normalizedTarget),
    );
    if (!menuItem) {
      throw new Error(`Checkbox ${normalizedTarget} nao encontrado`);
    }
    const input = menuItem.querySelector('input[type="checkbox"]');
    if (!input) {
      throw new Error(`Checkbox ${normalizedTarget} sem input`);
    }
    input.click();
  }, target);
  await page.waitForTimeout(250);
}

async function headerSnapshot(page) {
  const headers = await page.locator('.medicamentos-table .ant-table-thead > tr > th').evaluateAll((ths) =>
    ths.map((th) => th.innerText),
  );
  const rowCellTexts = await page.locator('.medicamentos-table .ant-table-tbody > tr[data-row-key]').first().locator('td').evaluateAll((tds) =>
    tds.map((td) => td.innerText),
  );
  const checkboxes = await page.locator('.auxiliary-filter-menu input[type="checkbox"]').evaluateAll((inputs) =>
    inputs.map((input) => ({
      label: input.parentElement?.innerText?.trim() || '',
      checked: input.checked,
      disabled: input.disabled,
    })),
  ).catch(() => []);

  return {
    headers: headers.map(normalizeText).filter(Boolean),
    rowCellTexts: rowCellTexts.map((text) => String(text || '').trim()),
    checkboxes,
  };
}

async function getVisibleDataHeaders(page) {
  return page
    .locator('.medicamentos-table .ant-table-thead > tr > th')
    .evaluateAll((ths) => ths.map((th) => String(th.innerText || '').trim()).filter(Boolean));
}

async function getCheckboxStates(page) {
  return page.locator('.auxiliary-filter-menu input[type="checkbox"]').evaluateAll((inputs) =>
    inputs.map((input) => ({
      label: input.parentElement?.innerText?.trim() || '',
      checked: input.checked,
      disabled: input.disabled,
    })),
  ).catch(() => []);
}

test('Medicamentos conserva colunas ao ocultar e restaurar na UI real', async (t) => {
  const { browser, page } = await createMedicamentosPage();
  t.after(async () => {
    await browser.close();
  });

  const initial = await headerSnapshot(page);
  assert.deepEqual(initial.headers, ['NOME', 'GRUPO', 'APRESENTACAO']);
  assert.equal(initial.rowCellTexts.length, 4, 'primeira linha deve conter selecao + 3 colunas de dados');

  await openColumnMenu(page, 0);
  await toggleColumnInMenu(page, 'Grupo');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th').length === 3);
  await page.waitForTimeout(250);

  const hiddenGroup = await headerSnapshot(page);
  assert.deepEqual(hiddenGroup.headers, ['NOME', 'APRESENTACAO']);
  assert.equal(hiddenGroup.rowCellTexts.length, 3, 'ocultar Grupo deve manter selecao + 2 colunas de dados');

  await openColumnMenu(page, 0);
  await toggleColumnInMenu(page, 'Grupo');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th').length === 4);
  await page.waitForFunction(() => {
    const headers = Array.from(document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th'))
      .map((th) => String(th.innerText || '').trim())
      .filter(Boolean);
    return headers.length === 3 && headers.includes('APRESENTAÇÃO');
  });

  const restoredGroup = await headerSnapshot(page);
  assert.deepEqual(restoredGroup.headers, ['NOME', 'GRUPO', 'APRESENTACAO']);
  assert.equal(restoredGroup.rowCellTexts.length, 4, 'restaurar Grupo deve voltar a selecao + 3 colunas de dados');
  assert.deepEqual(await getVisibleDataHeaders(page), ['NOME', 'GRUPO', 'APRESENTAÇÃO']);
  assert.deepEqual(
    (await getCheckboxStates(page)).map((item) => ({ label: normalizeText(item.label), checked: item.checked })),
    [
      { label: 'NOME', checked: true },
      { label: 'GRUPO', checked: true },
      { label: 'APRESENTACAO', checked: true },
    ],
  );

  await openColumnMenu(page, 1);
  await toggleColumnInMenu(page, 'Apresentacao');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th').length === 3);

  const hiddenPresentation = await headerSnapshot(page);
  assert.deepEqual(hiddenPresentation.headers, ['NOME', 'GRUPO']);
  assert.equal(hiddenPresentation.rowCellTexts.length, 3, 'ocultar Apresentacao deve manter selecao + 2 colunas de dados');

  await openColumnMenu(page, 1);
  await toggleColumnInMenu(page, 'Apresentacao');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('.medicamentos-table .ant-table-thead > tr > th').length === 4);

  const restoredPresentation = await headerSnapshot(page);
  assert.deepEqual(restoredPresentation.headers, ['NOME', 'GRUPO', 'APRESENTACAO']);
  assert.equal(restoredPresentation.rowCellTexts.length, 4, 'restaurar Apresentacao deve voltar a selecao + 3 colunas de dados');
});
