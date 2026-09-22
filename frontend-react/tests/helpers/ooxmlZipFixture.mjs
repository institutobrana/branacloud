import { deflateRawSync } from 'node:zlib';

const encoder = new TextEncoder();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function put16(view, offset, value) { view.setUint16(offset, value, true); }
function put32(view, offset, value) { view.setUint32(offset, value, true); }

export function makeOoxmlDocxBytes({ compression = 'stored' } = {}) {
  const entries = [
    ['[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body/></w:document>'],
  ];
  const locals = [];
  const centrals = [];
  let localOffset = 0;
  let centralSize = 0;

  for (const [name, text] of entries) {
    const nameBytes = encoder.encode(name);
    const rawBytes = encoder.encode(text);
    const method = compression === 'deflate' ? 8 : 0;
    const payload = method === 8 ? deflateRawSync(rawBytes) : rawBytes;
    const checksum = crc32(rawBytes);
    const local = new Uint8Array(30 + nameBytes.length + payload.length);
    const localView = new DataView(local.buffer);
    put32(localView, 0, 0x04034b50); put16(localView, 4, 20); put16(localView, 8, method);
    put32(localView, 14, checksum); put32(localView, 18, payload.length); put32(localView, 22, rawBytes.length);
    put16(localView, 26, nameBytes.length);
    local.set(nameBytes, 30); local.set(payload, 30 + nameBytes.length);
    locals.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    put32(centralView, 0, 0x02014b50); put16(centralView, 4, 20); put16(centralView, 6, 20);
    put16(centralView, 10, method); put32(centralView, 16, checksum);
    put32(centralView, 20, payload.length); put32(centralView, 24, rawBytes.length);
    put16(centralView, 28, nameBytes.length); put32(centralView, 42, localOffset);
    central.set(nameBytes, 46); centrals.push(central);
    localOffset += local.length;
    centralSize += central.length;
  }

  const directoryOffset = localOffset;
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  put32(endView, 0, 0x06054b50); put16(endView, 8, entries.length); put16(endView, 10, entries.length);
  put32(endView, 12, centralSize); put32(endView, 16, directoryOffset);
  const length = directoryOffset + centralSize + end.length;
  const output = new Uint8Array(length);
  let cursor = 0;
  for (const part of [...locals, ...centrals, end]) { output.set(part, cursor); cursor += part.length; }
  return output;
}
