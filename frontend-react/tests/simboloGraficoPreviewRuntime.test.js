import test from 'node:test';
import assert from 'node:assert/strict';

import { chromium } from 'playwright';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = process.env.BRANA_TEST_BASE_URL || 'http://127.0.0.1:5173';
const ROUTE_URL = `${BASE_URL}/app/configuracoes/simbolos-graficos`;
const LOGIN_URL = `${BASE_URL}/api/login`;

async function loginToken() {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: 'gleissontel@gmail.com',
      password: '152730',
    }),
  });

  assert.equal(response.ok, true, 'login real deve funcionar');
  const data = await response.json();
  const token = String(data?.access_token || '').trim();
  assert.ok(token, 'login deve retornar access_token');
  return token;
}

async function openEditForSymbol(page, rowId) {
  await page.goto(ROUTE_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.simbolos-graficos-table .ant-table-tbody > tr[data-row-id]').length > 0);
  const row = page.locator(`.simbolos-graficos-table .ant-table-tbody > tr[data-row-id="${rowId}"]`);
  await row.click();
  await page.waitForFunction((id) => {
    const selectedRow = document.querySelector(`.simbolos-graficos-table .ant-table-tbody > tr[data-row-id="${id}"][aria-selected="true"]`);
    return Boolean(selectedRow);
  }, rowId);
  await page.getByRole('button', { name: 'Altera' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Altera' }).click();
  await page.waitForSelector('.simbolos-graficos-create-modal .ant-modal-content');
}

test('Preview real do modal Altera carrega a imagem correta de Aplicação de flúor', async (t) => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const token = await loginToken();
  await context.addInitScript((value) => window.localStorage.setItem('brana_token', value), token);
  const page = await context.newPage();
  const requests = [];
  const responses = [];
  const failures = [];

  page.on('request', (request) => {
    const url = request.url();
    if (/desktop-assets|\.bmp|\.png/i.test(url)) {
      requests.push({ url, method: request.method(), resourceType: request.resourceType() });
    }
  });
  page.on('response', async (responseEvent) => {
    const url = responseEvent.url();
    if (/desktop-assets|\.bmp|\.png/i.test(url)) {
      responses.push({
        url,
        status: responseEvent.status(),
        statusText: responseEvent.statusText(),
        contentType: responseEvent.headers()['content-type'] || '',
        contentLength: responseEvent.headers()['content-length'] || '',
      });
    }
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (/desktop-assets|\.bmp|\.png/i.test(url)) {
      failures.push({ url, failure: request.failure()?.errorText || '' });
    }
  });

  t.after(async () => {
    await browser.close();
  });

  await openEditForSymbol(page, 28);

  const img = page.locator('.simbolos-graficos-create-preview-image');
  await img.waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const el = document.querySelector('.simbolos-graficos-create-preview-image');
    return Boolean(el && el.complete && el.naturalWidth > 0 && el.naturalHeight > 0);
  });

  const snapshot = await page.evaluate(() => {
    const image = document.querySelector('.simbolos-graficos-create-preview-image');
    return {
      name: document.querySelector('.simbolos-graficos-create-input')?.value || '',
      specialidade: document.querySelector('.simbolos-graficos-create-right .simbolos-graficos-create-select')?.textContent || '',
      previewMode: image ? 'img' : document.querySelector('.simbolos-graficos-create-preview-empty') ? 'empty' : 'error',
      image: image ? {
        srcAttribute: image.getAttribute('src'),
        src: image.src,
        currentSrc: image.currentSrc,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        alt: image.alt,
        outerHTML: image.outerHTML,
      } : null,
    };
  });

  const imageResponse = responses.find((item) => item.url.includes('/desktop-assets/easy/int_fluor.bmp') || item.url.includes('/app/assets/easy/int_fluor.bmp'));
  const imageRequest = requests.find((item) => item.url.includes('/desktop-assets/easy/int_fluor.bmp') || item.url.includes('/app/assets/easy/int_fluor.bmp'));

  assert.equal(snapshot.previewMode, 'img');
  assert.equal(snapshot.image?.srcAttribute, '/app/assets/easy/int_fluor.bmp');
  assert.equal(snapshot.image?.naturalWidth > 0, true);
  assert.equal(snapshot.image?.naturalHeight > 0, true);
  assert.equal(Boolean(imageRequest), true, 'a imagem precisa ter gerado request real');
  assert.equal(imageResponse?.status, 200, 'a imagem precisa responder 200');
  assert.match(imageResponse?.contentType || '', /^image\//, 'a resposta precisa ser de imagem');
  assert.equal(failures.length, 0, 'a imagem não deve falhar na rede');
});
