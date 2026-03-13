import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ChevronDown, Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const WagmiConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = React.useState(false);

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleConnect = () => {
    const connector = connectors.find((c) => c.id === "metaMask") || connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="px-6 py-2 rounded-full font-bold text-sm bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,153,0,0.1)]"
      >
        Connect
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        <span className="text-sm font-bold text-white/90 font-mono">{truncatedAddress}</span>
        <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-64 z-50 bg-[#0D0804] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Wallet</span>
                <span className="text-[10px] font-bold text-green-500 uppercase">Connected</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Wallet className="w-5 h-5 text-primary" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white/40 mb-0.5">Sepolia Network</p>
                    <p className="text-sm font-bold text-white truncate font-mono">{truncatedAddress}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={copyAddress}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-[11px] font-bold text-white/60 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <a 
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-[11px] font-bold text-white/60 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Scan
                </a>
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all group"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
