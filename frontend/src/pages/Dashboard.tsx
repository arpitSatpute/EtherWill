import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useInheritance } from "@/hooks/useInheritance";
import { 
  Shield, 
  UserPlus, 
  History, 
  Bell, 
  Clock,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Coins,
  Settings2,
  ArrowRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import { formatEther } from "viem";
import { toast } from "sonner";
import DefaultLayout from "@/layouts/default";
import { cn } from "@/lib/utils";
import { useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

const InheritanceDashboard = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { 
    useWillDetails, 
    createWill, 
    updateBeneficiary, 
    addFunds, 
    ping, 
    revoke,
    withdraw,
    useLastPing,
    useInactivityPeriod
  } = useInheritance();
  const config = useConfig();

  const account = isConnected ? { address: userAddress } : null;

  const [beneficiary, setBeneficiary] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const { data: details, refetch: refetchWill } = useWillDetails(account?.address || "");
  const { data: lastPingTimestamp } = useLastPing(account?.address || "");
  const { data: inactivityPeriod } = useInactivityPeriod();

  const willData = details && Array.isArray(details) ? (details[0] as any) : null;
  const hasWill = willData && willData.beneficiary !== "0x0000000000000000000000000000000000000000";

  // Calculate deadline: lastPing + inactivityPeriod
  const deadlineTimestamp = lastPingTimestamp && inactivityPeriod 
    ? Number(lastPingTimestamp) + Number(inactivityPeriod) 
    : null;

  const handleCreateWill = async () => {
    if (!beneficiary || !amount) {
      toast.error("Please fill beneficiary and initial amount");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Deploying your inheritance protocol...");
    try {
      const hash = await createWill(beneficiary, amount);
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Inheritance protocol initiated!");
      refetchWill();
      setAmount("");
      setBeneficiary("");
    } catch (error: any) {
      console.error("Error creating will:", error);
      toast.error(error.message || "Failed to create will");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeBeneficiary = async () => {
    if (!newBeneficiary) return;
    setIsLoading(true);
    setLoadingMessage("Updating beneficiary...");
    try {
      const hash = await updateBeneficiary(newBeneficiary);
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Beneficiary updated successfully!");
      refetchWill();
      setNewBeneficiary("");
    } catch (error: any) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!topUpAmount) return;
    setIsLoading(true);
    setLoadingMessage("Securing additional funds...");
    try {
      const hash = await addFunds(topUpAmount);
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Funds added to your will!");
      refetchWill();
      setTopUpAmount("");
    } catch (error: any) {
      toast.error("Top-up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePing = async () => {
    setIsLoading(true);
    setLoadingMessage("Recording activity pulse...");
    try {
      const hash = await ping();
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Activity confirmed!");
      refetchWill();
    } catch (error: any) {
      toast.error("Ping failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Processing withdrawal...");
    try {
      const hash = await withdraw(withdrawAmount);
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Withdrawal successful!");
      refetchWill();
      setWithdrawAmount("");
      setShowWithdrawModal(false);
    } catch (error: any) {
      toast.error("Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm("Are you sure? This will return all funds and close the protocol for your address.")) return;
    setIsLoading(true);
    setLoadingMessage("Revoking protocol...");
    try {
      const hash = await revoke();
      toast.info(`Transaction submitted: ${hash.substring(0, 10)}...`, {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
        }
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Will revoked and funds returned!");
      refetchWill();
    } catch (error: any) {
      toast.error("Revoke failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 shadow-2xl">
            <Wallet className="w-16 h-16 text-primary/40 mx-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Connect Your Identity</h2>
            <p className="text-white/40 max-w-xs mx-auto">Please connect your authorized Web3 wallet to manage your digital legacy.</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className={cn(
        "w-full space-y-20 animate-in fade-in duration-1000 transition-all",
        isLoading && "blur-xl saturate-50 pointer-events-none scale-[0.98]"
      )}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black orange-gradient-text tracking-tighter">Will Management</h1>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Real-time Protocol Sync</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handlePing}
               disabled={isLoading || !hasWill}
               className="px-8 py-3.5 rounded-2xl bg-white text-black font-black text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-xl disabled:opacity-30 disabled:hover:scale-100"
             >
               <Bell className="w-4 h-4" /> Confirm I'm Alive
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main Action Area */}
          <div className="xl:col-span-8 space-y-12">
            
            {!hasWill ? (
              /* CREATE WILL ZONE */
              <div className="glow-card border-white/5 bg-white/[0.02] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Initiate New Will</h2>
                    <p className="text-white/40 text-sm font-medium">Start your legacy by designating a beneficiary and locking initial funds.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Beneficiary Wallet Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={beneficiary}
                      onChange={(e) => setBeneficiary(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Initial Deposit (ETH)</label>
                    <div className="relative">
                        <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-mono text-sm"
                        />
                        <Coins className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateWill}
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl orange-button-solid text-lg flex items-center justify-center gap-3"
                >
                  {isLoading ? <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Deploy Inheritance Contract"}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              /* UPDATE WILL ZONE */
              <div className="space-y-10">
                
                {/* Active Status Banner */}
                <div className="glow-card border-green-500/20 bg-green-500/5 py-8 flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                         <Shield className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold">Active Inheritance Secured</h2>
                         <p className="text-green-500/60 text-sm font-medium">Your digital assets are protected by the protocol.</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Update Beneficiary */}
                    <div className="glow-card border-white/5 bg-white/5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Settings2 className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg">Update Recipient</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">New Beneficiary</label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    value={newBeneficiary}
                                    onChange={(e) => setNewBeneficiary(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500/40 transition-all text-white font-mono text-xs"
                                />
                            </div>
                            <button 
                                onClick={handleChangeBeneficiary}
                                disabled={isLoading || !newBeneficiary}
                                className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm hover:bg-blue-500 hover:text-white transition-all disabled:opacity-20"
                            >
                                Change Beneficiary
                            </button>
                        </div>
                    </div>

                    {/* Add Funds */}
                    <div className="glow-card border-white/5 bg-white/5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Coins className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-lg">Top-Up Legacy</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Amount to Add (ETH)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 px-4 outline-none focus:border-purple-500/40 transition-all text-white font-mono text-xs"
                                />
                            </div>
                            <button 
                                onClick={handleAddFunds}
                                disabled={isLoading || !topUpAmount}
                                className="w-full py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-sm hover:bg-purple-500 hover:text-white transition-all disabled:opacity-20"
                            >
                                Add Funds
                            </button>
                        </div>
                    </div>
                </div>

                {/* Revoke & Withdraw Zone */}
                <div className="pt-8 border-t border-white/5 mt-8 flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex-1 py-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <Coins className="w-5 h-5 text-primary" /> 
                        Withdraw Funds
                    </button>
                    <button 
                        onClick={handleRevoke}
                        className="flex-1 py-4 rounded-3xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <AlertCircle className="w-5 h-5" /> 
                        Revoke Protocol
                    </button>
                </div>

                {/* Withdraw Modal */}
                {showWithdrawModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tighter">Partial Withdrawal</h3>
                          <p className="text-white/40 text-sm font-medium">Specify the amount of ETH to reclaim from the protocol.</p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Withdraw Amount (ETH)</label>
                              <div className="relative">
                                  <input
                                      type="number"
                                      placeholder="0.00"
                                      value={withdrawAmount}
                                      onChange={(e) => setWithdrawAmount(e.target.value)}
                                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-primary/50 transition-all text-white font-mono text-sm"
                                  />
                                  <Coins className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                              </div>
                          </div>
                          
                          <div className="flex gap-4 pt-4">
                             <button 
                               onClick={() => setShowWithdrawModal(false)}
                               className="flex-1 py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 transition-all"
                             >
                               Cancel
                             </button>
                             <button 
                               onClick={handleWithdraw}
                               disabled={isLoading || !withdrawAmount}
                               className="flex-[2] py-4 rounded-2xl orange-button-solid font-black flex items-center justify-center gap-2 disabled:opacity-30"
                             >
                               {isLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Confirm Withdrawal"}
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Stats Overview */}
            {hasWill && (
                <div className="glow-card border-primary/20 bg-primary/5 space-y-10">
                    <h3 className="text-lg font-black uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-4">Live Protocol Stats</h3>
                    
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Total Funds Locked</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-white">{formatEther(willData.amount)}</p>
                                <p className="text-primary font-bold">ETH</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Current Beneficiary</p>
                            <p className="text-xs font-mono text-white/80 break-all bg-black/40 p-3 rounded-xl border border-white/5">
                                {willData.beneficiary}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Monitor */}
            <div className="glow-card border-white/5">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <History className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-lg font-bold">Protocol Pulse</h3>
               </div>
               
                <div className="space-y-6">
                 <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Last Pulse Recorded</p>
                      <p className="text-sm font-bold text-white">
                        {lastPingTimestamp ? new Date(Number(lastPingTimestamp) * 1000).toLocaleString() : "Syncing..."}
                      </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Automated Deadline</p>
                      <p className="text-sm font-bold text-white">
                        {deadlineTimestamp ? new Date(deadlineTimestamp * 1000).toLocaleDateString() : "Pending Registration"}
                      </p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Support Message */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-center gap-2 mb-3 text-primary">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Crucial Information</p>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-medium">
                    The inheritance execution is triggered precisely 180 days after your last "Pulse". Ensure you confirm your status regularly to prevent early execution.
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-2xl">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div className="space-y-1 text-center">
                 <p className="text-sm font-medium text-white">{loadingMessage}</p>
                 <p className="text-xs text-white/40">Waiting for block confirmation...</p>
              </div>
           </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default InheritanceDashboard;