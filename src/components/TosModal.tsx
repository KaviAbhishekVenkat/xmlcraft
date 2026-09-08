import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function TosModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('xmlcraft_tos_accepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        
        <div className="flex items-center space-x-3 text-amber-500 mb-5">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <h2 className="text-xl font-bold tracking-tight">Important Disclaimer</h2>
        </div>
        
        <div className="text-sm text-zinc-300 space-y-4 mb-8">
          <p>
            Welcome to XMLCraft. Before you begin using this zero-egress data studio, you must acknowledge our liability policies.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg space-y-3">
             <p className="flex items-start">
               <span className="text-amber-500 mr-2 mt-0.5">•</span>
               <span><strong>No Warranty:</strong> The tool is provided "AS IS". We accept absolutely no liability for data loss, financial loss, or parsing discrepancies.</span>
             </p>
             <p className="flex items-start">
               <span className="text-amber-500 mr-2 mt-0.5">•</span>
               <span><strong>Verify Conversions:</strong> Complex XML to JSON translations or XSLT manipulations can edge-case. Always manually verify output before deploying to production systems.</span>
             </p>
             <p className="flex items-start">
               <span className="text-emerald-500 mr-2 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5" /></span>
               <span><strong>100% Private:</strong> Your payloads never leave your browser. Zero tracking. Zero servers.</span>
             </p>
          </div>
          
          <p className="text-xs text-zinc-500 text-center">
            By proceeding, you agree to our <Link href="/terms" className="text-blue-400 hover:underline" target="_blank">Terms of Service</Link>.
          </p>
        </div>
        
        <button 
          onClick={() => {
            localStorage.setItem('xmlcraft_tos_accepted', 'true');
            setShow(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>I Understand & Accept</span>
        </button>
      </div>
    </div>
  );
}
