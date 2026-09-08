import { Shield, Trash2 } from 'lucide-react';
import { useXmlStore } from '../store/useXmlStore';

export function Header() {
  const purgeMemory = useXmlStore((s) => s.purgeMemory);

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-zinc-100 font-semibold">
          <span className="text-xl">XMLCraft</span>
          <span className="text-[10px] uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Air-Gapped</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
          <Shield className="w-3 h-3" />
          <span>100% Client-Side Sandbox. Zero Network Egress.</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={purgeMemory}
          className="flex items-center space-x-1.5 text-xs text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded transition-colors border border-red-900/50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge Memory</span>
        </button>
      </div>
    </header>
  );
}
