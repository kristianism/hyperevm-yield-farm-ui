import { useReadContracts, useAccount, useWriteContract } from "wagmi";
import { useContext } from "react";
import { formatEther, parseEther } from "viem";
import type { Abi } from "abitype";
import { useCustomWriteContract } from "@/hooks/contracts-integration/useCustomWriteContract";
import { useDeployedContractInfo } from "@/hooks/contracts-integration/useDeployedContractInfo";
import { tokenAbi } from "@/config/abi";
import ContractsInteractionsContext from "@/contexts/ContractsInteractionsContext";

export function usePoolInteractions(poolId: number) {
  const { address: userAddress } = useAccount();
  const { data: masterchefContract } = useDeployedContractInfo("Masterchef");
  
  // Get pool info and user info
  const { data, isLoading } = useReadContracts({
    contracts: [
      // Pool info
      {
        address: masterchefContract?.address,
        abi: masterchefContract?.abi,
        functionName: "poolInfo",
        args: [poolId],
      },
      // User info
      {
        address: masterchefContract?.address,
        abi: masterchefContract?.abi,
        functionName: "userInfo",
        args: [poolId, userAddress],
      },
      // Pending rewards
      {
        address: masterchefContract?.address,
        abi: masterchefContract?.abi,
        functionName: "pendingToken",
        args: [poolId, userAddress],
      },
    ],
    query: {
      enabled: !!(userAddress && masterchefContract?.address && masterchefContract?.abi),
    },
  });

  const poolInfo = data?.[0]?.result as any[];
  const userInfo = data?.[1]?.result as any[];
  const pendingRewards = data?.[2]?.result as bigint;

  const lpTokenAddress = poolInfo?.[0];
  const userStakedAmount = userInfo?.[0] ? formatEther(userInfo[0] as bigint) : "0";
  const pendingRewardsFormatted = pendingRewards ? formatEther(pendingRewards) : "0";

  // Get LP token info and user balance
  const { data: tokenData, isLoading: isLoadingToken } = useReadContracts({
    contracts: [
      // LP token symbol
      {
        address: lpTokenAddress as `0x${string}`,
        abi: tokenAbi as Abi,
        functionName: "symbol",
      },
      // User LP token balance
      {
        address: lpTokenAddress as `0x${string}`,
        abi: tokenAbi as Abi,
        functionName: "balanceOf",
        args: [userAddress as `0x${string}`],
      },
      // User allowance
      {
        address: lpTokenAddress as `0x${string}`,
        abi: tokenAbi as Abi,
        functionName: "allowance",
        args: [userAddress as `0x${string}`, masterchefContract?.address as `0x${string}`],
      },
    ],
    query: {
      enabled: !!(lpTokenAddress && userAddress),
    },
  });

  const tokenSymbol = tokenData?.[0]?.result as string;
  const userBalance = tokenData?.[1]?.result ? formatEther(tokenData[1].result as bigint) : "0";
  const allowance = tokenData?.[2]?.result as bigint;

  // Write contract hooks
  const { writeToMasterchef } = useContext(ContractsInteractionsContext);
  const { writeContract } = useWriteContract();
  
  const approve = async (amount: string) => {
    if (!lpTokenAddress || !masterchefContract?.address) {
        throw new Error("Missing contract addresses");
    }
    
    return writeContract({
      address: lpTokenAddress as `0x${string}`,
      abi: tokenAbi as Abi,
      functionName: "approve",
      args: [masterchefContract?.address as `0x${string}`, parseEther(amount)],
    });
  };

  const deposit = async (amount: string) => {
    if (!masterchefContract?.address || !masterchefContract?.abi) {
        throw new Error("Missing masterchef contract data");
    }

    return writeToMasterchef({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "deposit",
      args: [poolId, parseEther(amount)],
    });
  };

  const withdraw = async (amount: string) => {
    return writeToMasterchef({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "withdraw",
      args: [poolId, parseEther(amount)],
    });
  };

  const harvest = async () => {
    return writeToMasterchef({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "deposit",
      args: [poolId, 0], // Deposit 0 to harvest rewards
    });
  };

  const needsApproval = (amount: string) => {
    if (!allowance) return true;
    return allowance < parseEther(amount);
  };

  return {
    // Pool data
    poolInfo: {
      lpTokenAddress,
      tokenSymbol: tokenSymbol || "Unknown",
      userStakedAmount,
      userBalance,
      pendingRewards: pendingRewardsFormatted,
      allowance: allowance ? formatEther(allowance) : "0",
    },
    // Actions
    approve,
    deposit,
    withdraw,
    harvest,
    needsApproval,
    // Loading states
    isLoading: isLoading || isLoadingToken,
  };
}