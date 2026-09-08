export interface XmlToJsonOptions {
  attributePrefix?: string;
  textKey?: string;
  alwaysArray?: boolean;
}

export function xmlToJson(xml: string, options: XmlToJsonOptions = { attributePrefix: '@', textKey: '#text', alwaysArray: false }): any {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  if (doc.querySelector('parsererror')) {
    return { error: 'Invalid XML' };
  }

  function parseNode(node: Node): any {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim();
    }
    if (node.nodeType === Node.CDATA_SECTION_NODE) {
      return node.nodeValue;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const obj: any = {};

      // Handle attributes
      if (el.attributes.length > 0) {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes.item(i);
          if (attr) {
            obj[`${options.attributePrefix}${attr.name}`] = attr.value;
          }
        }
      }

      // Handle children
      if (el.childNodes.length === 0) {
        return Object.keys(obj).length === 0 ? "" : obj;
      }

      if (el.childNodes.length === 1 && (el.childNodes[0].nodeType === Node.TEXT_NODE || el.childNodes[0].nodeType === Node.CDATA_SECTION_NODE)) {
         const text = el.childNodes[0].nodeValue?.trim();
         if (Object.keys(obj).length === 0) {
             return text;
         } else {
             obj[options.textKey!] = text;
             return obj;
         }
      }

      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && !child.nodeValue?.trim()) {
           continue; // skip whitespace
        }
        
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = (child as Element).nodeName;
          const childParsed = parseNode(child);
          
          if (obj[childName] !== undefined) {
             if (!Array.isArray(obj[childName])) {
                 obj[childName] = [obj[childName]];
             }
             obj[childName].push(childParsed);
          } else {
             obj[childName] = options.alwaysArray ? [childParsed] : childParsed;
          }
        } else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
            obj[options.textKey!] = (obj[options.textKey!] || '') + child.nodeValue;
        }
      }
      
      return obj;
    }
    return null;
  }

  const root = doc.documentElement;
  const result: any = {};
  result[root.nodeName] = parseNode(root);
  return result;
}
