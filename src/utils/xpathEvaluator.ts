export interface XPathResultInfo {
  type: string;
  count: number;
  nodes: Node[];
  value: string | number | boolean | null;
  error: string | null;
}

export function evaluateXPath(doc: XMLDocument | null, expression: string): XPathResultInfo {
  if (!doc) {
    return { type: 'None', count: 0, nodes: [], value: null, error: 'No XML document parsed' };
  }
  if (!expression.trim()) {
    return { type: 'None', count: 0, nodes: [], value: null, error: null };
  }

  try {
    const result = doc.evaluate(
      expression,
      doc,
      (prefix) => {
        // Map 'ns' to the default document namespace
        if (prefix === 'ns' && doc.documentElement.namespaceURI) {
           return doc.documentElement.namespaceURI;
        }
        return doc.lookupNamespaceURI(prefix);
      },
      XPathResult.ANY_TYPE,
      null
    );

    const nodes: Node[] = [];
    let type = 'Unknown';
    let count = 0;
    let value: string | number | boolean | null = null;

    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        type = 'Number';
        value = result.numberValue;
        break;
      case XPathResult.STRING_TYPE:
        type = 'String';
        value = result.stringValue;
        break;
      case XPathResult.BOOLEAN_TYPE:
        type = 'Boolean';
        value = result.booleanValue;
        break;
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
        type = 'Node-set';
        let node = result.iterateNext();
        while (node) {
          nodes.push(node);
          node = result.iterateNext();
        }
        count = nodes.length;
        break;
      case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
      case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
        type = 'Node-set';
        for (let i = 0; i < result.snapshotLength; i++) {
          const item = result.snapshotItem(i);
          if (item) nodes.push(item);
        }
        count = nodes.length;
        break;
    }

    // Default to handling ANY_TYPE which usually maps to ITERATOR for node-sets
    if (result.resultType === XPathResult.ANY_TYPE) {
         type = 'Node-set';
         try {
             let node = result.iterateNext();
             while (node) {
                 nodes.push(node);
                 node = result.iterateNext();
             }
             count = nodes.length;
         } catch(e) {
            // Might be a scalar if iterateNext throws
         }
    }

    return { type, count, nodes, value, error: null };
  } catch (err: any) {
    return { type: 'Error', count: 0, nodes: [], value: null, error: err.message || 'Invalid XPath' };
  }
}
