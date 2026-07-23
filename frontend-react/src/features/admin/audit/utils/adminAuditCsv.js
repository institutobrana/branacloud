import { formatAdminAuditAction, formatAdminAuditActor, formatAdminAuditDate, formatAdminAuditTarget } from './adminAuditFormatters.js';

export const ADMIN_AUDIT_CSV_HEADERS = ['ID', 'Data', 'Ação', 'Autor', 'Alvo'];

function escapeCsvValue(value) {
  const text = String(value ?? '');
  if (/[";\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildAdminAuditCsv(rows = []) {
  const lines = [ADMIN_AUDIT_CSV_HEADERS.join(';')];

  for (const row of rows) {
    lines.push(
      [
        row?.id ?? '',
        formatAdminAuditDate(row?.criadoEm),
        formatAdminAuditAction(row?.acao),
        formatAdminAuditActor(row?.actorEmail),
        formatAdminAuditTarget(row?.alvoTipo, row?.alvoId),
      ]
        .map(escapeCsvValue)
        .join(';'),
    );
  }

  return `\ufeff${lines.join('\r\n')}`;
}
