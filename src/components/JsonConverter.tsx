import { useState } from 'react';
import { useXmlStore } from '../store/useXmlStore';
import { xmlToJson } from '../utils/xmlToJson';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { X, ArrowRightLeft } from 'lucide-react';

export function JsonConverter({ onClose }: { onClose: () => void }) {
  const { rawXml } = useXmlStore();
  const [jsonOutput, setJsonOutput] = useState(() => {
    try {
      return JSON.stringify(xmlToJson(rawXml), null, 2);
    } catch(e) {
      return '{\n  "error": "Failed to parse XML"\n}';
    }
  });

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <h2 className="text-zinc-100 font-medium text-sm">XML to JSON Converter</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
           <CodeMirror
              value={jsonOutput}
              height="100%"
              theme={oneDark}
              extensions={[json()]}
              readOnly={true}
              className="h-full text-sm font-mono"
            />
        </div>
      </div>
    </div>
  );
}
