export function formatXml(xml: string, indentString = '  '): string {
  if (!xml) return '';
  
  let formatted = '';
  const reg = /(>)(<)(\/*)/g;
  let xmlFormatted = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;

  const lines = xmlFormatted.split('\r\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    
    let indent = 0;
    if (line.match(/.+<\/\w[^>]*>$/)) {
      // Node with text content and closing tag on same line
      indent = 0;
    } else if (line.match(/^<\/\w/)) {
      // Closing tag
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      // Opening tag
      indent = 1;
    } else {
      indent = 0; // Empty tag or text
    }

    formatted += indentString.repeat(pad) + line + '\r\n';
    pad += indent;
  }

  return formatted.trim();
}

export function minifyXml(xml: string): string {
  // Remove whitespace between tags
  return xml.replace(/>\s+</g, '><').trim();
}
