import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { useXmlStore } from '../store/useXmlStore';

export function EditorPane() {
  const { rawXml, setRawXml, parseError } = useXmlStore();
  
  // Local state to prevent cursor jumping on every keystroke if store updates are delayed
  // but for now directly binding to store should be fine if it's performant enough
  
  return (
    <div className="flex-1 flex flex-col h-full bg-[#282c34] relative overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-800/50 text-xs text-zinc-400 font-medium shrink-0 border-b border-zinc-800">
        <span>XML Source</span>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={rawXml}
          height="100%"
          theme={oneDark}
          extensions={[xml()]}
          onChange={(value) => setRawXml(value)}
          className="h-full text-sm font-mono"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
            foldGutter: true,
          }}
        />
      </div>
      
      {parseError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-950/90 border-t border-red-900 text-red-200 text-xs px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Syntax Error</span>
            <span>Line: {parseError.line}, Col: {parseError.col}</span>
            <span className="opacity-80 ml-2">- {parseError.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
