import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRoundtripCheck } from '../src/features/editorTextos/models/LegacyDocumentFormatDetector.js';

const check = (sourceHtml, exportedHtml) => safeRoundtripCheck({ sourceHtml, exportedHtml }).safe;

test('F2D accepts semantic HTML equivalents and preserves tokens', () => {
  assert.equal(check('<p><b>ABC</b> &lt;&lt;Paciente.Nome&gt;&gt;</p>', '<p><strong>ABC</strong> &lt;&lt;Paciente.Nome&gt;&gt;</p>'), true);
  assert.equal(check('<p><i>ABC</i><u>DEF</u></p>', '<p><em>ABC</em><u>DEF</u></p>'), true);
});

test('F2D rejects loss of each material structure', () => {
  const cases = [
    ['<p>A<br>B</p>', '<p>A B</p>'],
    ['<p><strong>A</strong></p>', '<p>A</p>'],
    ['<p><em>A</em></p>', '<p>A</p>'],
    ['<p><u>A</u></p>', '<p>A</p>'],
    ['<p style="text-align:center">A</p>', '<p>A</p>'],
    ['<ul><li>A</li><li>B</li></ul>', '<p>A B</p>'],
    ['<h2>A</h2>', '<p>A</p>'],
    ['<blockquote><p>A</p></blockquote>', '<p>A</p>'],
    ['<table><tr><td>A</td></tr></table>', '<p>A</p>'],
    ['<table><tr><td colspan="2">A</td></tr></table>', '<table><tr><td>A</td></tr></table>'],
    ['<p><img src="data:image/png;base64,abc" /></p>', '<p>A</p>'],
    ['<p>&lt;&lt;Paciente.Nome&gt;&gt;</p>', '<p>&lt;&lt;Paciente.CPF&gt;&gt;</p>'],
  ];
  for (const [source, output] of cases) assert.equal(check(source, output), false, source);
});

test('F2D detects token removal, reordering and duplicate loss', () => {
  assert.equal(check('<p>&lt;&lt;Paciente.Nome&gt;&gt; &lt;&lt;Clínica.Nome&gt;&gt;</p>', '<p>&lt;&lt;Paciente.Nome&gt;&gt;</p>'), false);
  assert.equal(check('<p>&lt;&lt;Paciente.Nome&gt;&gt; &lt;&lt;Clínica.Nome&gt;&gt;</p>', '<p>&lt;&lt;Clínica.Nome&gt;&gt; &lt;&lt;Paciente.Nome&gt;&gt;</p>'), false);
  assert.equal(check('<p>&lt;&lt;Paciente.Nome&gt;&gt; &lt;&lt;Paciente.Nome&gt;&gt;</p>', '<p>&lt;&lt;Paciente.Nome&gt;&gt;</p>'), false);
});

