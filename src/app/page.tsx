'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';

import { Header } from '../components/Header';
import { Toolbar } from '../components/Toolbar';
import { EditorPane } from '../components/EditorPane';
import { TreePane } from '../components/TreePane';
import { XPathBar } from '../components/XPathBar';
import { JsonConverter } from '../components/JsonConverter';
import { XSLTModal } from '../components/XSLTModal';
import { TosModal } from '../components/TosModal';
import { useXmlStore } from '../store/useXmlStore';

export default function Home() {
  const { isJsonOpen, setJsonOpen, isXsltOpen, setXsltOpen } = useXmlStore();

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <Toolbar />
      <XPathBar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Editor */}
        <div className="w-1/2 flex flex-col h-full">
          <EditorPane />
        </div>
        
        {/* Right Pane - Tree Explorer */}
        <div className="w-1/2 flex flex-col h-full">
          <TreePane />
        </div>
      </div>

      <footer className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-zinc-950 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
        <div>&copy; {new Date().getFullYear()} XMLCraft. Open-source and 100% zero data egress.</div>
        <div className="flex items-center space-x-2">
           <span>Built with 🤖 AI assistance (Google Antigravity)</span>
           <span className="text-zinc-700">|</span>
           <a href="https://github.com/KaviAbhishekVenkat/xmlcraft" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30">GitHub Repository</a>
           <span className="text-zinc-700">|</span>
           <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30">Terms of Service</Link>
           <span className="text-zinc-700">|</span>
           <a href="https://buymeacoffee.com/kaviabhishekvenkat" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
             <Coffee className="w-3 h-3" />
             <span>Buy me a book</span>
           </a>
        </div>
      </footer>

      {isJsonOpen && <JsonConverter onClose={() => setJsonOpen(false)} />}
      {isXsltOpen && <XSLTModal onClose={() => setXsltOpen(false)} />}
      <TosModal />
    </div>
  );
}
