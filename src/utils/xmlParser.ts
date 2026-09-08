export interface ParseResult {
  doc: XMLDocument | null;
  error: { line: number; col: number; message: string } | null;
}

export function parseXml(xmlString: string): ParseResult {
  if (!xmlString.trim()) {
    return { doc: null, error: null };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // DOMParser returns an XMLDocument with a <parsererror> node if it fails
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const errorText = errorNode.textContent || 'Unknown syntax error';
    
    // Try to extract line and column from the error text
    // Typical format: "error on line 1 at column 2: ..."
    const lineMatch = errorText.match(/line\s+(\d+)/i);
    const colMatch = errorText.match(/column\s+(\d+)/i);
    
    return {
      doc: null,
      error: {
        line: lineMatch ? parseInt(lineMatch[1], 10) : 1,
        col: colMatch ? parseInt(colMatch[1], 10) : 1,
        message: errorText.split('\n')[0] // Keep it brief
      }
    };
  }

  return { doc, error: null };
}
