import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const component = fs.readFileSync(path.join(here, '../src/features/menuPacientes/components/MenuPacientesModal.jsx'), 'utf8');
const api = fs.readFileSync(path.join(here, '../src/features/menuPacientes/api/menuPacientesApi.js'), 'utf8');

test('MenuPacientes usa opções e resultados canônicos sem writes', () => {
  assert.match(api, /\/cadastros\/pacientes\/menu-options/);
  assert.match(api, /\/cadastros\/pacientes\/menu\?/);
  assert.doesNotMatch(api, /menu-preferences/);
  assert.match(component, /listarMenuPacientesOptions/);
  assert.match(component, /cir_menu_pac/);
  assert.match(component, /status_menu_pac/);
  assert.match(component, /visualizacao_menu_pac/);
  assert.match(component, /active_ord_menu_pac/);
  assert.match(component, /coluna2_label/);
  assert.match(component, /result\.total/);
});

test('MenuPacientes mantém lazy mount e snapshot completo na seleção', () => {
  assert.match(component, /onDoubleClick/);
  assert.match(component, /obterMenuPaciente/);
  assert.match(component, /tip_fone1/);
  assert.match(component, /tip_fone2/);
  assert.match(component, /tip_fone3/);
  assert.match(component, /onCancel/);
});
