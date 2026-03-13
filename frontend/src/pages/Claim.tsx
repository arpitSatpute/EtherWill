import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useInheritance } from "@/hooks/useInheritance";
import { 
  ShieldCheck, 
  Timer, 
  ArrowRight, 
  AlertTriangle,
  Gift,
  Search,
  RefreshCcw,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { formatEther } from "viem";
import { toast } from "sonner";
import DefaultLayout from "@/layouts/default";

const ClaimInheritance = () => {
  const { address: userAddress, isConnected } = useAccount();
  const account = isConnected ? { address: userAddress } : null;
  const [heirAddress, setHeirAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { useWillDetails, claim, useInactivityPeriod } = useInheritance();
  const { data: inactivityPeriod } = useInactivityPeriod();

  const isAddress = heirAddress.startsWith("0x") && heirAddress.length === 42;
  const { data: details, refetch: refetchWill, isLoading: isDataLoading } = useWillDetails(isAddress ? heirAddress : "");

  const willData = details && Array.isArray(details) ? (details[0] as any) : null;
  const lastPing = details && Array.isArray(details) ? (details[1] as any) : null;
  const hasWill = willData && willData.beneficiary !== "0x0000000000000000000000000000000000000000";

  const canClaim = () => {
    if (!lastPing || Number(lastPing) === 0 || !inactivityPeriod) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > (Number(lastPing) + Number(inactivityPeriod));
  };

  const handleClaim = async () => {
    if (!account) {
        toast.error("Please connect your wallet first");
        return;
    }
    setIsSearching(true);
    try {
      await claim();
      toast.success("Inheritance claimed successfully!");
      refetchWill();
    } catch (error: any) {
      toast.error(error.message || "Claim failed. Requirements not met.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full space-y-20 animate-in fade-in duration-1000">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
             <Gift className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Beneficiary Portal</span>
          </div>
          <h1 className="text-6xl font-black orange-gradient-text tracking-tighter">Claim Legacy</h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Search for an inheritance plan where you are designated as the beneficiary. You can claim the assets once the original owner's inactivity period is verified.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto">
            <div className="glow-card border-white/10 bg-white/[0.02] shadow-2xl p-2 rounded-3xl">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Owner's Wallet Address (0x...)"
                        value={heirAddress}
                        onChange={(e) => setHeirAddress(e.target.value)}
                        className="w-full bg-transparent border-none rounded-2xl py-6 pl-16 pr-6 outline-none text-white font-mono text-lg placeholder:text-white/10"
                    />
                </div>
            </div>
            <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">180 Day Verification</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Atomic On-Chain Transfer</span>
                </div>
            </div>
        </div>

        {/* Result Area */}
        <div className="min-h-[400px]">
          {isDataLoading && isAddress && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCcw className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-black text-primary uppercase tracking-widest animate-pulse">Scanning Trustless Protocol...</p>
            </div>
          )}

          {!isAddress && heirAddress.length > 0 && (
             <div className="text-center py-24 bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem]">
                <AlertTriangle className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <p className="text-white/40 font-bold text-xl">Invalid Wallet Format</p>
                <p className="text-white/20 text-sm mt-1">Please enter a valid 42-character Ethereum address.</p>
             </div>
          )}

          {isAddress && !isDataLoading && !hasWill && (
            <div className="text-center py-24 bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem]">
              <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <p className="text-white/40 font-bold text-xl">No Inheritance Found</p>
              <p className="text-white/20 text-sm mt-1">The address "{heirAddress.slice(0,6)}...{heirAddress.slice(-4)}" has no active inheritance plan.</p>
            </div>
          )}

          {isAddress && !isDataLoading && hasWill && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-10 duration-700">
              
              {/* Will Status Card */}
              <div className="glow-card border-primary/30 bg-primary/5 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <Gift className="w-48 h-48" />
                </div>

                <div className="space-y-12 relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">Plan Found</h2>
                        <p className="text-primary/60 text-sm font-bold uppercase tracking-widest">Status: Verification Required</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total Value Locked</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black text-white">{formatEther(willData.amount)}</span>
                        <span className="text-2xl font-bold text-primary">ETH</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                     <Timer className="w-8 h-8 text-white/20" />
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Owner Last Pulse</p>
                        <p className="text-white font-mono font-bold">{new Date(Number(lastPing) * 1000).toLocaleString()}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 relative">
                  {account?.address?.toLowerCase() === willData.beneficiary.toLowerCase() ? (
                    canClaim() ? (
                      <button
                        onClick={handleClaim}
                        disabled={isSearching}
                        className="w-full py-5 rounded-2xl orange-button-solid text-xl flex items-center justify-center gap-4 group"
                      >
                        {isSearching ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <>Claim Inheritance Now <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    ) : (
                      <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex gap-5">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/20">
                            <Timer className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-orange-500 uppercase tracking-widest">Waiting Period Active</p>
                          <p className="text-xs text-white/50 leading-relaxed font-medium">
                            The protocol requires 180 days of owner inactivity. You will be eligible to claim this legacy after <strong>{lastPing && inactivityPeriod ? new Date((Number(lastPing) + Number(inactivityPeriod)) * 1000).toLocaleDateString() : "Syncing..."}</strong>.
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex gap-4">
                      <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-red-500 uppercase tracking-widest">Unauthorized Access</p>
                        <p className="text-xs text-white/50 leading-relaxed font-medium mt-1">
                          The connected wallet <strong>{account?.address?.slice(0,6)}...</strong> is not the designated recipient for this inheritance plan.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Protocol Details Sidebar */}
              <div className="space-y-8">
                <div className="glow-card border-white/5 space-y-10">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white/30 border-b border-white/5 pb-4">Verification Steps</h3>
                    
                    <div className="space-y-10">
                        {[
                          { 
                            icon: Search, 
                            title: "Plan Disclosure", 
                            desc: "The protocol identifies your designation through owner's wallet mapping." 
                          },
                          { 
                            icon: Timer, 
                            title: "Pulse Monitoring", 
                            desc: "180 days of absolute silence on-chain is required for the protocol to release funds." 
                          },
                          { 
                            icon: ExternalLink, 
                            title: "Smart Execution", 
                            desc: "Transactions are final and cannot be halted once the verification period passes." 
                          }
                        ].map((step, i) => (
                          <div key={i} className="flex gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                              <step.icon className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-base font-black text-white">{step.title}</h4>
                              <p className="text-xs text-white/40 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <p className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" /> Protocol Security Note
                    </p>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                        EtherWill operates on a trustless architecture. No admin, including the protocol creators, can bypass the inactivity period or redirect funds.
                    </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClaimInheritance;