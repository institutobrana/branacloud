const UTF8_BOM = [0xef, 0xbb, 0xbf];

function asBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  throw new TypeError('O conteúdo TXT precisa ser fornecido como bytes.');
}

function hasUtf8Bom(bytes) {
  return bytes.length >= UTF8_BOM.length && UTF8_BOM.every((byte, index) => bytes[index] === byte);
}

export function decodeImportedTextBytes(input) {
  const bytes = asBytes(input);
  const bomPresent = hasUtf8Bom(bytes);
  const payload = bomPresent ? bytes.subarray(UTF8_BOM.length) : bytes;

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(payload);
    return { text, encoding: bomPresent ? 'utf-8-bom' : 'utf-8', warning: null };
  } catch {
    // ISO-8859-1 is an alias for Windows-1252 in the Encoding Standard and
    // browser TextDecoder implementations, so this covers the legacy ANSI case.
  }

  const text = new TextDecoder('windows-1252', { fatal: true }).decode(payload);
  // The Encoding Standard preserves undefined CP1252 slots as C1 control
  // characters. Keep them byte-faithful, but tell the user the source mapping
  // is uncertain instead of silently presenting them as ordinary text.
  const hasUndefinedWindows1252Byte = payload.some((byte) => [0x81, 0x8d, 0x8f, 0x90, 0x9d].includes(byte));
  return {
    text,
    encoding: 'windows-1252',
    warning: hasUndefinedWindows1252Byte
      ? 'O TXT contém bytes sem mapeamento definido em Windows-1252; eles foram preservados como caracteres de controle.'
      : null,
  };
}

export async function decodeImportedTextFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Não foi possível ler o arquivo TXT como bytes.');
  }
  return decodeImportedTextBytes(await file.arrayBuffer());
}
