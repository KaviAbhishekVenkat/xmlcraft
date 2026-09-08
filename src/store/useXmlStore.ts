import { create } from 'zustand';
import { parseXml } from '../utils/xmlParser';
import { evaluateXPath, XPathResultInfo } from '../utils/xpathEvaluator';
import { maskSensitiveData } from '../utils/sanitizer';
import { formatXml, minifyXml } from '../utils/xmlFormatter';

interface XmlState {
  rawXml: string;
  parsedDoc: XMLDocument | null;
  parseError: { line: number; col: number; message: string } | null;
  
  activeXPath: string;
  xpathResult: XPathResultInfo | null;
  
  isJsonOpen: boolean;
  isXsltOpen: boolean;
  
  // Actions
  setRawXml: (xml: string) => void;
  evaluateXPath: (xpath: string) => void;
  formatXml: () => void;
  minifyXml: () => void;
  maskData: () => void;
  purgeMemory: () => void;
  setJsonOpen: (open: boolean) => void;
  setXsltOpen: (open: boolean) => void;
}

export const useXmlStore = create<XmlState>((set, get) => ({
  rawXml: '',
  parsedDoc: null,
  parseError: null,
  activeXPath: '',
  xpathResult: null,
  isJsonOpen: false,
  isXsltOpen: false,

  setRawXml: (xml: string) => {
    const { doc, error } = parseXml(xml);
    set({ rawXml: xml, parsedDoc: doc, parseError: error });
    
    // Re-evaluate XPath if it exists
    const currentXPath = get().activeXPath;
    if (currentXPath && doc) {
      set({ xpathResult: evaluateXPath(doc, currentXPath) });
    }
  },

  evaluateXPath: (xpath: string) => {
    const doc = get().parsedDoc;
    set({ activeXPath: xpath, xpathResult: evaluateXPath(doc, xpath) });
  },

  formatXml: () => {
    const current = get().rawXml;
    get().setRawXml(formatXml(current));
  },

  minifyXml: () => {
    const current = get().rawXml;
    get().setRawXml(minifyXml(current));
  },

  maskData: () => {
    const current = get().rawXml;
    get().setRawXml(maskSensitiveData(current));
  },

  purgeMemory: () => {
    set({
      rawXml: '',
      parsedDoc: null,
      parseError: null,
      activeXPath: '',
      xpathResult: null
    });
  },
  
  setJsonOpen: (open: boolean) => set({ isJsonOpen: open }),
  setXsltOpen: (open: boolean) => set({ isXsltOpen: open }),
}));
