import { useState } from 'react';
import { useXmlStore } from '../store/useXmlStore';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { X, Play } from 'lucide-react';

const DEFAULT_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body>
        <h2>Transformed Output</h2>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export function XSLTModal({ onClose }: { onClose: () => void }) {
  const { parsedDoc } = useXmlStore();
  const [xslt, setXslt] = useState(DEFAULT_XSLT);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const runTransform = () => {
    if (!parsedDoc) {
      setError('No source XML document to transform.');
      return;
    }
    
    try {
      const xsltParser = new DOMParser();
      const xsltDoc = xsltParser.parseFromString(xslt, 'text/xml');
      
      if (xsltDoc.querySelector('parsererror')) {
        setError('Syntax error in XSLT document.');
        return;
      }

      const processor = new XSLTProcessor();
      processor.importStylesheet(xsltDoc);
      
      const resultDoc = processor.transformToDocument(parsedDoc);
      if (!resultDoc) {
          setError('Transformation returned null document.');
          return;
      }
      
      const serializer = new XMLSerializer();
      setOutput(serializer.serializeToString(resultDoc));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error during transformation');
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-zinc-100 font-medium text-sm">XSLT 1.0 Transformation Sandbox</h2>
            <button onClick={runTransform} className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded transition-colors">
              <Play className="w-3 h-3" />
              <span>Run Transform</span>
            </button>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r border-zinc-800 flex flex-col">
             <div className="px-3 py-1 bg-zinc-800/50 text-xs text-zinc-400 font-medium shrink-0">XSLT Stylesheet</div>
             <div className="flex-1 overflow-auto">
               <CodeMirror
                  value={xslt}
                  height="100%"
                  theme={oneDark}
                  extensions={[xml()]}
                  onChange={setXslt}
                  className="h-full text-sm font-mono"
                />
             </div>
          </div>
          <div className="w-1/2 flex flex-col relative">
             <div className="px-3 py-1 bg-zinc-800/50 text-xs text-zinc-400 font-medium shrink-0">Result Output</div>
             <div className="flex-1 overflow-auto">
                <CodeMirror
                  value={output}
                  height="100%"
                  theme={oneDark}
                  extensions={[html()]}
                  readOnly={true}
                  className="h-full text-sm font-mono"
                />
             </div>
             {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-950 text-red-400 p-2 text-xs border-t border-red-900 font-mono">
                  {error}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
