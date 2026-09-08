import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronRight, ChevronDown, Type, Search, X } from 'lucide-react';
import { useXmlStore } from '../store/useXmlStore';

interface TreeNode {
  id: string;
  type: 'element' | 'text' | 'cdata' | 'comment';
  name: string;
  value?: string;
  attributes: Array<{ name: string; value: string }>;
  depth: number;
  hasChildren: boolean;
  nodeRef: Node;
}

export function TreePane() {
  const { parsedDoc } = useXmlStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleNodes = useMemo(() => {
    if (!parsedDoc) return [];
    
    const root = parsedDoc.documentElement;
    if (!root) return [];
    
    const nodes: TreeNode[] = [];
    
    function traverse(node: Node, depth: number, parentId: string) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const id = parentId ? `${parentId}-${nodes.length}` : 'root';
        const attrs = Array.from(el.attributes).map(a => ({ name: a.name, value: a.value }));
        
        let hasChildren = false;
        if (el.children.length > 0) {
            hasChildren = true;
        } else {
            for (let i = 0; i < el.childNodes.length; i++) {
                const c = el.childNodes[i];
                if ((c.nodeType === Node.TEXT_NODE && c.textContent?.trim()) || c.nodeType === Node.CDATA_SECTION_NODE) {
                    hasChildren = true;
                    break;
                }
            }
        }
        
        nodes.push({
          id,
          type: 'element',
          name: el.tagName,
          attributes: attrs,
          depth,
          hasChildren,
          nodeRef: node
        });

        if (expandedNodes.has(id) && hasChildren) {
           for (let i = 0; i < el.childNodes.length; i++) {
               const child = el.childNodes[i];
               if (child.nodeType === Node.ELEMENT_NODE) {
                   traverse(child, depth + 1, id);
               } else if (child.nodeType === Node.TEXT_NODE) {
                   const txt = child.textContent?.trim();
                   if (txt) {
                       nodes.push({
                          id: `${id}-text-${i}`,
                          type: 'text',
                          name: '#text',
                          value: txt,
                          attributes: [],
                          depth: depth + 1,
                          hasChildren: false,
                          nodeRef: child
                       });
                   }
               } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
                   nodes.push({
                      id: `${id}-cdata-${i}`,
                      type: 'cdata',
                      name: '#cdata',
                      value: child.textContent || '',
                      attributes: [],
                      depth: depth + 1,
                      hasChildren: false,
                      nodeRef: child
                   });
               }
           }
        }
      }
    }
    
    traverse(root, 0, '');
    return nodes;
  }, [parsedDoc, expandedNodes]);

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return visibleNodes;
    const q = search.toLowerCase();
    return visibleNodes.filter(n => 
       n.name.toLowerCase().includes(q) || 
       (n.value && n.value.toLowerCase().includes(q)) ||
       n.attributes.some(a => a.name.toLowerCase().includes(q) || a.value.toLowerCase().includes(q))
    );
  }, [visibleNodes, search]);

  const virtualizer = useVirtualizer({
    count: filteredNodes.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 28,
  });

  if (!parsedDoc) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        No valid XML to display
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-800/50 text-xs text-zinc-400 font-medium shrink-0 border-b border-zinc-800 h-8">
        <span>Structural Explorer</span>
        <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5">
          <Search className="w-3 h-3 text-zinc-500 mr-1" />
          <input 
            type="text" 
            placeholder="Filter tree..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-zinc-200 w-32 placeholder:text-zinc-600"
          />
          {search && (
             <button onClick={() => setSearch('')} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-3 h-3" />
             </button>
          )}
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const node = filteredNodes[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                onClick={() => node.hasChildren && toggleExpand(node.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="flex items-center px-2 hover:bg-zinc-800/50 cursor-pointer text-[13px] font-mono group"
              >
                <div style={{ width: `${node.depth * 16}px` }} className="shrink-0" />
                
                {node.hasChildren ? (
                  <button 
                    className="w-4 h-4 flex items-center justify-center shrink-0 text-zinc-500 hover:text-zinc-300 mr-1"
                  >
                    {expandedNodes.has(node.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : (
                  <div className="w-4 mr-1 shrink-0" />
                )}
                
                {node.type === 'element' && (
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-blue-400">&lt;{node.name}&gt;</span>
                    {node.attributes.map((attr, i) => (
                      <span key={i} className="flex items-center text-xs">
                        <span className="text-purple-400">@{attr.name}</span>
                        <span className="text-zinc-500">=</span>
                        <span className="text-green-400">"{attr.value}"</span>
                      </span>
                    ))}
                  </div>
                )}
                
                {(node.type === 'text' || node.type === 'cdata') && (
                  <div className="flex items-center space-x-1 truncate text-zinc-300">
                    <span className="text-orange-400/80 mr-1 text-[10px] uppercase border border-orange-900/30 px-1 rounded">{node.type}</span>
                    <span className="truncate">{node.value}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
