import { Braces, Code, Minimize2, ShieldAlert, CodeSquare, TableProperties, Upload, Download } from 'lucide-react';
import { useRef } from 'react';
import { useXmlStore } from '../store/useXmlStore';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG123456789</MsgId>
      <CreDtTm>2023-10-25T10:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>1500.00</CtrlSum>
      <InitgPty>
        <Nm>Acme Corp</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT98765</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <Dbtr>
        <Nm>Acme Corp</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>GB12ABCD34567890123456</IBAN>
        </Id>
      </DbtrAcct>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

export function Toolbar() {
  const { formatXml, minifyXml, maskData, setRawXml, setJsonOpen, setXsltOpen, rawXml } = useXmlStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setRawXml(content);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!rawXml) return;
    const blob = new Blob([rawXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xmlcraft_export.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-2 py-1 shrink-0">
      <div className="flex items-center space-x-1">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".xml,application/xml,text/xml" 
          className="hidden" 
        />
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-2 py-1 rounded transition-colors" title="Open XML File">
          <Upload className="w-3.5 h-3.5" />
          <span>Open</span>
        </button>
        <button onClick={handleDownload} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-2 py-1 rounded transition-colors" title="Save XML File">
          <Download className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-1"></div>
        <button onClick={formatXml} className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-2 py-1 rounded transition-colors" title="Format & Prettify">
          <Braces className="w-3.5 h-3.5" />
          <span>Format</span>
        </button>
        <button onClick={minifyXml} className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-2 py-1 rounded transition-colors" title="Minify / Compact">
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Minify</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-1"></div>
        <button onClick={maskData} className="flex items-center space-x-1 text-xs text-amber-400 hover:bg-amber-400/10 px-2 py-1 rounded transition-colors" title="Mask PII & Sensitive Tags">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Mask PII</span>
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <button onClick={() => setJsonOpen(true)} className="flex items-center space-x-1 text-xs text-emerald-400 hover:bg-emerald-400/10 px-2 py-1 rounded transition-colors" title="Convert XML to JSON">
          <TableProperties className="w-3.5 h-3.5" />
          <span>JSON</span>
        </button>
        <button onClick={() => setXsltOpen(true)} className="flex items-center space-x-1 text-xs text-blue-400 hover:bg-blue-400/10 px-2 py-1 rounded transition-colors" title="Live XSLT Sandbox">
          <Code className="w-3.5 h-3.5" />
          <span>XSLT</span>
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-1"></div>
        <button onClick={() => setRawXml(SAMPLE_XML)} className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-2 py-1 rounded transition-colors">
          <CodeSquare className="w-3.5 h-3.5" />
          <span>Sample ISO 20022</span>
        </button>
      </div>
    </div>
  );
}
