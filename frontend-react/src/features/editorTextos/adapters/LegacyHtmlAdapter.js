export const LegacyHtmlAdapter = {
  deserializeLegacyHtml(html = '') {
    return this.normalizeLegacyHtml(html).replace(/\[\[IMGDATA:([^\]]+)\]\]/gi, (_match, payload) => {
      const parts = String(payload || '').split('|').map((part) => part.trim());
      const src = parts.shift() || '';
      if (!/^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(src)) return _match;
      const attrs = [`src="${escapeAttribute(src)}"`];
      parts.forEach((part) => { const match = /^(w|h)=(\d+)$/i.exec(part); if (match) attrs.push(`${match[1].toLowerCase() === 'w' ? 'width' : 'height'}="${match[2]}"`); });
      return `<img ${attrs.join(' ')} alt="Imagem">`;
    });
  },
  normalizeLegacyHtml(html = '') {
    return String(html || '<p></p>').trim() || '<p></p>';
  },
  serializeToLegacyHtml(html = '') {
    return this.normalizeLegacyHtml(html).replace(/<img\b([^>]*)>/gi, (match, rawAttrs) => {
      const attrs = Object.fromEntries([...String(rawAttrs || '').matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/gi)].map((item) => [item[1].toLowerCase(), item[2]]));
      const src = attrs['data-editor-img-data'] || attrs.src || '';
      if (!/^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(src)) return match;
      const width = attrs.width || (String(attrs.style || '').match(/(?:^|;)\s*width\s*:\s*(\d+)px/i)?.[1]);
      const height = attrs.height || (String(attrs.style || '').match(/(?:^|;)\s*height\s*:\s*(\d+)px/i)?.[1]);
      return `[[IMGDATA:${src}${width ? `|w=${width}` : ''}${height ? `|h=${height}` : ''}]]`;
    });
  },
};

function escapeAttribute(value) { return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
