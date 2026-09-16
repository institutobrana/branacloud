export const EDITOR_TEXTOS_FIXTURES = Object.freeze([
  { id: 'FIXTURE_01_SIMPLE', html: '<p>Texto sintético da fundação.</p>' },
  { id: 'FIXTURE_02_FORMATTED', html: '<p><strong>Forte</strong>, <em>ênfase</em> e <u>sublinhado</u>.</p>' },
  { id: 'FIXTURE_03_ALIGNMENT', html: '<p style="text-align: center">Conteúdo centralizado.</p>' },
  { id: 'FIXTURE_04_LIST', html: '<ul><li><p>Primeiro item</p></li><li><p>Segundo item</p></li></ul>' },
  { id: 'FIXTURE_05_MERGE_FIELD', html: '<p>Paciente: {{nome}}</p>' },
  { id: 'FIXTURE_06_COMBINED', html: '<p><strong>Documento {{tipo_documento}}</strong> — <span style="color: #2563eb">conteúdo sintético</span>.</p>' },
]);

export function getEditorTextosFixture(id) {
  return EDITOR_TEXTOS_FIXTURES.find((fixture) => fixture.id === id) || null;
}
