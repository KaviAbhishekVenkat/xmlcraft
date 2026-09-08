export const DEFAULT_SENSITIVE_TAGS = [
  'iban', 'accountnumber', 'cardnumber', 'password', 'ssn', 'email', 'pan', 'cvv'
];

export function maskSensitiveData(xmlString: string, tagsToMask: string[] = DEFAULT_SENSITIVE_TAGS): string {
  if (!xmlString) return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  
  if (doc.querySelector('parsererror')) {
    // If invalid, fallback to basic regex replace or just return original
    return xmlString;
  }

  const tagNamesLower = tagsToMask.map(t => t.toLowerCase());

  // Recursively traverse and mask
  function traverse(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (tagNamesLower.includes(el.tagName.toLowerCase())) {
        // Mask its text content if it has only text
        if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
            const originalLength = el.textContent?.length || 8;
            el.textContent = '*'.repeat(originalLength);
        } else {
            // Mask all child text nodes
            el.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
                    child.textContent = '*'.repeat(child.textContent.trim().length);
                }
            })
        }
      }
    }
    
    node.childNodes.forEach(child => traverse(child));
  }

  traverse(doc);
  
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
