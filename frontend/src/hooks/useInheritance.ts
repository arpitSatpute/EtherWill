import { 
  useReadContract, 
  useWriteContract,
  useAccount,
  useWatchContractEvent,
  useWaitForTransactionReceipt
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { CONTRACT_ADDRESS } from "@/config/thirdwebConfig";
import inheritanceAbi from "@/abis/inheritance.json";
import { parseEther } from "viem";
import { useEffect, useState } from "react";

export const useInheritance = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const commonConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: inheritanceAbi,
    chainId: sepolia.id,
    gas: 5_000_000n,
  };

  /**
   * Queries
   */
  const useWillDetails = (heirAddress: string) => {
    const query = useReadContract({
      ...commonConfig,
      functionName: "getWillDetails",
      args: [heirAddress ? (heirAddress as `0x${string}`) : "0x0000000000000000000000000000000000000000"],
      query: {
        enabled: !!heirAddress || heirAddress === "",
        refetchInterval: 5000,
      }
    });

    // Real-time event watching
    useWatchContractEvent({
      ...commonConfig,
      onLogs() {
        query.refetch();
      },
    });

    return query;
  };

  const useOwner = () => {
    return useReadContract({
      ...commonConfig,
      functionName: "owner",
    });
  };

  const useLastPing = (heirAddress: string) => {
    return useReadContract({
      ...commonConfig,
      functionName: "lastPing",
      args: [heirAddress as `0x${string}`],
      query: {
        enabled: !!heirAddress,
        refetchInterval: 10000,
      }
    });
  };

  const useInactivityPeriod = () => {
    return useReadContract({
      ...commonConfig,
      functionName: "INACTIVITY_PERIOD",
    });
  };

  const useHeirOf = (beneficiaryAddress: string) => {
    return useReadContract({
      ...commonConfig,
      functionName: "heir",
      args: [beneficiaryAddress as `0x${string}`],
      query: {
        enabled: !!beneficiaryAddress,
      }
    });
  };

  /**
   * Actions - Wagmi Write Functionality
   */
  
  const createWill = async (beneficiary: string, amount: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "setWillAndBeneficiary",
      args: [beneficiary as `0x${string}`],
      value: parseEther(amount),
    });
  };

  const updateBeneficiary = async (newBeneficiary: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "updateBeneficiary",
      args: [newBeneficiary as `0x${string}`],
    });
  };

  const addFunds = async (amountToAdd: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "updateWillAmount",
      value: parseEther(amountToAdd),
    });
  };

  const ping = async () => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "ping",
    });
  };

  const revoke = async () => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "revokeWill",
    });
  };

  const claim = async () => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "claim",
    });
  };

  const withdraw = async (amount: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  const transferOwnership = async (newOwner: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "transferOwnership",
      args: [newOwner as `0x${string}`],
    });
  };

  const renounceOwnership = async () => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await writeContractAsync({
      ...commonConfig,
      functionName: "renounceOwnership",
    });
  };

  return {
    useWillDetails,
    useOwner,
    createWill,
    updateBeneficiary,
    addFunds,
    ping,
    revoke,
    withdraw,
    claim,
    transferOwnership,
    renounceOwnership,
    useLastPing,
    useInactivityPeriod,
    useHeirOf,
    isWritePending: isWritePending || isConfirming,
    isConfirmed,
    hash
  };
};
