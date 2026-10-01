export const DEV_FAKE_BRIDGE_MARKER = 'brana-dev-fake-bridge-v1';

const sha256Hex = async (bytes) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const fakePdf = new TextEncoder().encode('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000068 00000 n \ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n126\n%%EOF\n');

export async function runDevFakeSignatureFlow({ pdfBlob, onTrace = () => {} } = {}) {
  if (typeof import.meta.env !== 'undefined' && !import.meta.env.DEV) throw new Error('DEV_FAKE_BRIDGE_DISABLED');
  if (!(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('DEV_FAKE_PDF_REQUIRED');
  const operationId = `dev-${crypto.randomUUID()}`;
  const trace = [];
  const emit = async (event, data = {}) => { const item = { event, operation_id: operationId, at: Date.now(), ...data }; trace.push(item); onTrace(item); };
  await emit('EXPORT_ONCE', { input_size: pdfBlob.size });
  await emit('PAIRING_APPROVED');
  await emit('OPERATION_CREATED');
  await emit('OPERATION_APPROVED');
  await emit('SIGN_FAKE_ONCE');
  const result = new Blob([fakePdf], { type: 'application/pdf' });
  const resultHash = await sha256Hex(fakePdf);
  await emit('RESULT_RECOVERED', { result_sha256: resultHash, result_size: fakePdf.length, cryptographic_signature: false });
  const downloadHash = await sha256Hex(fakePdf);
  await emit('DOWNLOAD_READY', { download_sha256: downloadHash, download_size: fakePdf.length, cryptographic_signature: false });
  return { marker: DEV_FAKE_BRIDGE_MARKER, operationId, signCalls: 1, result, trace, resultHash, downloadHash };
}
