import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADMIN_BILLING_UNAVAILABLE_LABEL,
  buildAdminBillingDetailsSections,
} from '../src/features/admin/billing/utils/adminBillingDetails.js';
import { normalizeAdminBillingItem } from '../src/features/admin/billing/normalizers/adminBillingNormalizer.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin billing details uses selected row data and stable unavailable placeholders', () => {
  const billing = normalizeAdminBillingItem({
    id: 77,
    clinica_id: 15,
    clinica_nome: 'Clínica Brana Local',
    payment_id: 'pay_1234567890',
    external_reference: 'BRANA|15|MENSAL|20260722',
    plano: 'MENSAL',
    status: 'approved',
    valor: 129.9,
    moeda: 'BRL',
    origem: 'checkout',
    criado_em: '2026-07-22T12:00:00Z',
    atualizado_em: '2026-07-22T12:30:00Z',
  });

  const sections = buildAdminBillingDetailsSections(billing);
  const items = Object.fromEntries(sections.flatMap((section) => section.items.map((item) => [item.label, item.value])));

  assert.deepEqual(sections.map((section) => section.title), ['Identificação', 'Conta', 'Pagamento', 'Datas']);
  assert.equal(items.ID, '77');
  assert.equal(items.Status, 'approved');
  assert.equal(items.Origem, 'checkout');
  assert.equal(items.Clínica, 'Clínica Brana Local');
  assert.equal(items['ID da clínica'], '15');
  assert.equal(items.Plano, 'MENSAL');
  assert.equal(items['Payment ID'], 'pay_1234567890');
  assert.equal(items['Referência externa'], 'BRANA|15|MENSAL|20260722');
  assert.match(items.Valor, /129,90/);
  assert.equal(items.Moeda, 'BRL');
  assert.match(items['Data de criação'], /22\/07\/2026/);
  assert.match(items['Data de alteração'], /22\/07\/2026/);

  const emptySections = buildAdminBillingDetailsSections(normalizeAdminBillingItem({ id: 10, moeda: '' }));
  const emptyItems = Object.fromEntries(emptySections.flatMap((section) => section.items.map((item) => [item.label, item.value])));
  assert.equal(emptyItems.Clínica, ADMIN_BILLING_UNAVAILABLE_LABEL);
  assert.equal(emptyItems['ID da clínica'], ADMIN_BILLING_UNAVAILABLE_LABEL);
  assert.equal(emptyItems['Payment ID'], ADMIN_BILLING_UNAVAILABLE_LABEL);
  assert.equal(emptyItems['Referência externa'], ADMIN_BILLING_UNAVAILABLE_LABEL);
  assert.equal(emptyItems['Data de alteração'], ADMIN_BILLING_UNAVAILABLE_LABEL);
});

test('admin billing details modal is compact read-only and exposes only close action', () => {
  const modal = source('src/features/admin/billing/components/BillingDetailsModal.jsx');

  assert.match(modal, /title="Detalhes da cobrança"/);
  assert.match(modal, /centered/);
  assert.match(modal, /width=\{800\}/);
  assert.match(modal, /className="admin-billing-details-modal"/);
  assert.match(modal, /Fechar/);
  assert.match(modal, /<Button key="close" size="small" onClick=\{onClose\}>/);
  assert.match(modal, /Tooltip/);
  assert.match(modal, /admin-billing-details-grid/);
  assert.match(modal, /admin-billing-details-pair/);
  assert.doesNotMatch(modal, /Descriptions/);
  assert.doesNotMatch(modal, /Salvar|Editar|Confirmar|Excluir|Ativar|Pagar|Reprocessar|Cancelar|Dar baixa/);
  assert.doesNotMatch(modal, /fetch|method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
});

test('admin billing details modal layout follows the approved six-track grid', () => {
  const css = source('src/features/admin/admin.css');

  assert.match(css, /\.admin-billing-details-modal \{\s*width: min\(800px, calc\(100vw - 24px\)\);/);
  assert.match(css, /\.admin-billing-details-modal \.ant-modal-content[\s\S]*max-height: calc\(100vh - 24px\)/);
  assert.match(css, /\.admin-billing-details-modal \.ant-modal-body[\s\S]*overflow-y: visible/);
  assert.match(css, /\.admin-billing-details-modal \.ant-modal-footer \.ant-btn[\s\S]*height: 22px/);
  assert.match(css, /\.admin-billing-details-grid \{\s*display: grid/);
  assert.match(css, /grid-template-columns:[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.333%\)[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.333%\)[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.334%\)/);
  assert.match(css, /\.admin-billing-details-pair \{\s*display: contents/);
  assert.match(css, /\.admin-billing-details-label,[\s\S]*\.admin-billing-details-content \{[\s\S]*padding: 2px 4px/);
  assert.match(css, /\.admin-billing-details-content \{[\s\S]*overflow-wrap: normal/);
  assert.match(css, /\.admin-billing-details-value--long[\s\S]*text-overflow: ellipsis/);
  assert.match(css, /\.admin-billing-details-value--long[\s\S]*white-space: nowrap/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.admin-billing-details-modal \{\s*width: calc\(100vw - 16px\);/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.admin-billing-details-grid \{\s*grid-template-columns: minmax\(92px, 34%\) minmax\(0, 66%\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.admin-billing-details-modal \.ant-modal-body[\s\S]*overflow-y: auto/);
});

test('admin billing page opens details from selected row and closes stale modal on refresh', () => {
  const page = source('src/features/admin/billing/BillingPage.jsx');
  const toolbar = source('src/features/admin/billing/components/BillingToolbarContent.jsx');

  assert.match(toolbar, /Atualizar[\s\S]*Exportar CSV[\s\S]*Ver detalhes[\s\S]*Ver conta[\s\S]*Input\.Search/);
  assert.match(toolbar, /disabled=\{detailsDisabled\}/);
  assert.match(toolbar, /if \(!detailsDisabled\) onViewDetails\?\.\(\)/);
  assert.match(page, /const \[detailsOpen, setDetailsOpen\] = useState\(false\)/);
  assert.match(page, /billing\.rows\.find\(\(row\) => Number\(row\.id\) === Number\(billing\.selectedId\)\)/);
  assert.match(page, /detailsDisabled=\{!selectedBilling \|\| billing\.loading \|\| billing\.refreshing\}/);
  assert.match(page, /if \(selectedBilling && !billing\.loading && !billing\.refreshing\) setDetailsOpen\(true\)/);
  assert.match(page, /if \(!exists\) setDetailsOpen\(false\)/);
  assert.match(page, /if \(billing\.refreshing\) setDetailsOpen\(false\)/);
  assert.match(page, /<BillingDetailsModal open=\{detailsOpen && Boolean\(selectedBilling\)\} billing=\{selectedBilling\}/);
  assert.doesNotMatch(page, /paymentId.*selectedId|externalReference.*selectedId|clinicaNome.*selectedId/);
});

test('admin billing details adds no sensitive payload, detail request or mutating action', () => {
  const files = [
    'src/features/admin/billing/BillingPage.jsx',
    'src/features/admin/billing/components/BillingDetailsModal.jsx',
    'src/features/admin/billing/components/BillingToolbarContent.jsx',
    'src/features/admin/billing/utils/adminBillingDetails.js',
  ].map(source);
  const combined = files.join('\n');

  assert.doesNotMatch(combined, /payload_json|JSON\.stringify|segredo|credencial|cart[aã]o|stack trace/i);
  assert.doesNotMatch(combined, /details-endpoint|cobrancas\/\$\{|payment_id.*fetch|external_reference.*fetch/i);
  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /window\.(alert|confirm|prompt)|console\.log/);
  assert.doesNotMatch(combined, /Registrar pagamento|Alterar status|Alterar valor|Reprocessar|Reembolso|Checkout|Webhook|Mercado Pago/i);
});
