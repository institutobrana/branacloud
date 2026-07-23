import { formatAdminAuditAction, formatAdminAuditActor, formatAdminAuditDate, formatAdminAuditTarget } from './adminAuditFormatters.js';

const SAFE_DETAIL_KEYS = new Set([
  'acao',
  'canal',
  'codigo',
  'contagem',
  'erro',
  'fase',
  'limite',
  'mensagem',
  'moeda',
  'motivo',
  'origem',
  'plano',
  'resultado',
  'status',
  'tipo',
  'total',
  'valor',
]);

const SENSITIVE_KEY_PATTERNS = /(senha|token|authorization|authorisation|hash|payload|before|after|document|conteudo|conteúdo|body|html|script|cookie|session|clinica|cl[ií]nica|paciente|usuario|usu[aá]rio|email|e-mail|ip)/i;

function normalizeValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  return null;
}

function isPlainObject(value) {
  return Boolean(value) && Object.prototype.toString.call(value) === '[object Object]';
}

function stringifySafeValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 'Sim' : 'Nao';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, 120) : null;
  }
  return null;
}

function formatDetailLabel(key) {
  const base = String(key || '')
    .replace(/[_-]+/g, ' ')
    .trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
}

function addSafeItem(items, label, value) {
  const resolved = stringifySafeValue(value);
  if (!label || resolved === null || resolved === '') return;
  items.push({ label, value: resolved });
}

function allowScalarKey(key, value) {
  if (!SAFE_DETAIL_KEYS.has(key)) return false;
  if (SENSITIVE_KEY_PATTERNS.test(key)) return false;
  return stringifySafeValue(value) !== null;
}

function collectSafeDetails(detailsJson) {
  const items = [];
  if (!isPlainObject(detailsJson)) return items;

  for (const [key, value] of Object.entries(detailsJson)) {
    if (!allowScalarKey(key, value)) continue;
    addSafeItem(items, formatDetailLabel(key), value);
  }

  return items;
}

export function buildAdminAuditDetailsSections(row = {}) {
  const sections = [
    {
      title: 'Evento',
      items: [
        { label: 'ID', value: row?.id ?? '-' },
        { label: 'Data', value: formatAdminAuditDate(row?.criadoEm) },
        { label: 'Ação', value: formatAdminAuditAction(row?.acao) },
      ],
    },
    {
      title: 'Autor',
      items: [
        { label: 'E-mail', value: formatAdminAuditActor(row?.actorEmail) },
        { label: 'ID do autor', value: row?.actorUserId ?? 'Nao informado' },
      ],
    },
    {
      title: 'Alvo',
      items: [
        { label: 'Tipo', value: row?.alvoTipo || 'Nao informado' },
        { label: 'Identificador', value: row?.alvoId ?? 'Nao informado' },
        { label: 'Resumo', value: formatAdminAuditTarget(row?.alvoTipo, row?.alvoId) },
      ],
    },
  ];

  const safeContextItems = collectSafeDetails(row?.detalhesJson);
  if (safeContextItems.length > 0) {
    sections.push({
      title: 'Contexto seguro',
      items: safeContextItems,
    });
  }

  return sections;
}
