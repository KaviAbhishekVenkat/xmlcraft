import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useXmlStore } from '../store/useXmlStore';

export function XPathBar() {
  const { evaluateXPath, xpathResult, activeXPath } = useXmlStore();
  const [query, setQuery] = useState(activeXPath);
  const [expanded, setExpanded] = useState(false);

  const handleQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      evaluateXPath(query);
      setExpanded(true);
    }
  };

  return (
    <div className="flex flex-col border-b border-zinc-800 bg-zinc-950 shrink-0">
      <div className="flex items-center px-3 py-1.5">
        <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleQuery}
          placeholder="XPath 1.0 (use 'ns:' for default namespace e.g., //ns:Document//ns:MsgId)"
          className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 font-mono placeholder:text-zinc-700"
        />
        
        {xpathResult && (
          <div className="flex items-center space-x-3 ml-4 text-xs">
            <span className={xpathResult.error ? 'text-red-400' : 'text-emerald-400'}>
              {xpathResult.error ? 'Error' : `${xpathResult.count} match${xpathResult.count !== 1 ? 'es' : ''}`}
            </span>
            {!xpathResult.error && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && xpathResult && !xpathResult.error && (
        <div className="bg-zinc-900 border-t border-zinc-800 max-h-48 overflow-auto p-2 text-xs font-mono">
          <div className="mb-2 flex items-center justify-between text-zinc-500">
            <span>Result Type: {xpathResult.type}</span>
          </div>
          {xpathResult.type === 'Node-set' ? (
            <div className="space-y-1">
              {xpathResult.nodes.map((n, i) => (
                <div key={i} className="p-1 hover:bg-zinc-800 rounded text-zinc-300 truncate">
                  {n.nodeType === Node.ELEMENT_NODE 
                    ? `<${n.nodeName}> ${n.textContent?.substring(0, 50)}...`
                    : n.nodeValue}
                </div>
              ))}
            </div>
          ) : (
             <div className="p-2 bg-zinc-950 rounded text-green-400 border border-zinc-800">
                {String(xpathResult.value)}
             </div>
          )}
        </div>
      )}
      
      {expanded && xpathResult?.error && (
        <div className="bg-red-950/20 text-red-400 p-2 text-xs border-t border-red-900/30 font-mono">
          {xpathResult.error}
        </div>
      )}
    </div>
  );
}
