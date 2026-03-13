import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useInheritance } from "@/hooks/useInheritance";
import { 
  Search, 
  User, 
  Coins, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  AlertCircle,
  Gift,
  ArrowRight
} from "lucide-react";
import { formatEther } from "viem";
import DefaultLayout from "@/layouts/default";
import { cn } from "@/lib/utils";

const WillDetailsPage = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { useWillDetails, useHeirOf, useLastPing, useInactivityPeriod } = useInheritance();
  
  // 1. Check if the connected user is a beneficiary of anyone
  const { data: discoveredHeir, isLoading: isHeirLoading } = useHeirOf(userAddress || "");
  
  // 2. Fetch details for the discovered owner (heir)
  const effectiveSearchAddress = discoveredHeir as string || "";
  const isAddress = typeof effectiveSearchAddress === "string" && effectiveSearchAddress.startsWith("0x") && effectiveSearchAddress.length === 42 && effectiveSearchAddress !== "0x0000000000000000000000000000000000000000";
  
  const { data: details, isLoading: isDetailsLoading } = useWillDetails(isAddress ? effectiveSearchAddress : "");
  const { data: lastPingTimestamp } = useLastPing(isAddress ? effectiveSearchAddress : "");
  const { data: inactivityPeriod } = useInactivityPeriod();

  const willData = details && Array.isArray(details) ? (details[0] as any) : null;
  const remainingSeconds = details && Array.isArray(details) ? (details[1] as any) : null;
  const hasWill = willData && willData.beneficiary !== "0x0000000000000000000000000000000000000000";

  return (
    <DefaultLayout>
      <div className="w-full space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
             <Gift className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Designation Overview</span>
          </div>
          <h1 className="text-6xl font-black orange-gradient-text tracking-tighter">My Inheritance</h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {isConnected 
              ? "Detailed breakdown of the inheritance assets currently allocated to your wallet address."
              : "Connect your wallet to verify your status as a designated beneficiary."}
          </p>
        </div>

        {/* Status Area */}
        <div className="min-h-[400px]">
          {!isConnected && (
            <div className="text-center py-24 bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem]">
              <User className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <p className="text-white/40 font-bold text-xl">Wallet Not Connected</p>
              <p className="text-white/20 text-sm mt-1">Please connect your wallet to scan the protocol registry.</p>
            </div>
          )}

          {isConnected && (isDetailsLoading || isHeirLoading) && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-black text-primary uppercase tracking-[0.3em] animate-pulse">Scanning On-Chain Registry</p>
            </div>
          )}

          {isConnected && !isDetailsLoading && !isHeirLoading && !hasWill && (
            <div className="text-center py-24 bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem]">
              <AlertCircle className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <p className="text-white/40 font-bold text-xl">No Designation Found</p>
              <p className="text-white/20 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                Your wallet address is not currently registered as a beneficiary in any active inheritance protocol.
              </p>
            </div>
          )}

          {isConnected && isAddress && !isDetailsLoading && !isHeirLoading && hasWill && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-10 duration-700">
              {/* Main Info Card */}
              <div className="glow-card border-primary/30 bg-primary/5 space-y-10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <ShieldCheck className="w-48 h-48" />
                </div>
                
                <div className="space-y-10 relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">Designation Details</h2>
                        <p className="text-primary/60 text-sm font-bold uppercase tracking-widest">Protocol Active</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Legacy Owner (Heir)</p>
                        <p className="text-sm font-mono text-white/90 break-all leading-relaxed">
                            {effectiveSearchAddress}
                        </p>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between group">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Secured Allocation</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-white">{formatEther(willData.amount)}</p>
                                <p className="text-xl font-bold text-primary">ETH</p>
                            </div>
                        </div>
                        <Coins className="w-12 h-12 text-primary/20 group-hover:scale-110 group-hover:text-primary/40 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Security Card */}
              <div className="space-y-8">
                <div className="glow-card border-white/10 space-y-8 h-full flex flex-col justify-between">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <Clock className="w-8 h-8 text-white/40" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-white/90">Protocol Status</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-primary/20 transition-all cursor-default">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                    <ExternalLink className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Last Protocol Ping</p>
                                    <p className="text-white font-mono font-bold">
                                        {lastPingTimestamp && Number(lastPingTimestamp) > 0 
                                            ? new Date(Number(lastPingTimestamp) * 1000).toLocaleString() 
                                            : "No activity recorded"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-5 rounded-2xl bg-primary/5 border border-primary/20 group cursor-default">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Estimated Eligibility Date</p>
                                    <p className="text-white font-mono font-bold">
                                        {lastPingTimestamp && inactivityPeriod
                                            ? new Date((Number(lastPingTimestamp) + Number(inactivityPeriod)) * 1000).toLocaleDateString()
                                            : "Protocol Pending"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                                    <ShieldCheck className="w-24 h-24" />
                                </div>
                                <p className="text-sm text-white/40 leading-relaxed font-medium relative z-10">
                                    Current Status: <span className="text-white/80">{remainingSeconds === 0n ? "Eligible for Retrieval" : `Awaiting protocol trigger (${Math.ceil(Number(remainingSeconds) / 86400)} days remaining)`}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default WillDetailsPage;
