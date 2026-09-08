'use client';

import { Header } from '../components/Header';
import { Toolbar } from '../components/Toolbar';
import { EditorPane } from '../components/EditorPane';
import { TreePane } from '../components/TreePane';
import { XPathBar } from '../components/XPathBar';
import { JsonConverter } from '../components/JsonConverter';
import { XSLTModal } from '../components/XSLTModal';
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

      {isJsonOpen && <JsonConverter onClose={() => setJsonOpen(false)} />}
      {isXsltOpen && <XSLTModal onClose={() => setXsltOpen(false)} />}
    </div>
  );
}
