import { useReadContracts, useAccount } from "wagmi";
import { getContractData } from "@/constants/contractsData";
import { useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useCustomWriteContract } from "@/hooks/contracts-integration/useCustomWriteContract";

export function usePoolInteractions(poolId: number) {
  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  const masterchefContract = getContractData(chainId, "Masterchef");
  
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
      enabled: !!userAddress,
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
        abi: [
          {
            "type": "function",
            "name": "symbol",
            "inputs": [],
            "outputs": [{"name": "", "type": "string"}],
            "stateMutability": "view"
          }
        ],
        functionName: "symbol",
      },
      // User LP token balance
      {
        address: lpTokenAddress as `0x${string}`,
        abi: [
          {
            "type": "function",
            "name": "balanceOf",
            "inputs": [{"name": "account", "type": "address"}],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
          }
        ],
        functionName: "balanceOf",
        args: [userAddress as `0x${string}`],
      },
      // User allowance
      {
        address: lpTokenAddress as `0x${string}`,
        abi: [
          {
            "type": "function",
            "name": "allowance",
            "inputs": [
              {"name": "owner", "type": "address"},
              {"name": "spender", "type": "address"}
            ],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
          }
        ],
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
  const { writeContractAsync: approveToken } = useCustomWriteContract();
  const { writeContractAsync: depositTokens } = useCustomWriteContract();
  const { writeContractAsync: withdrawTokens } = useCustomWriteContract();
  const { writeContractAsync: harvestRewards } = useCustomWriteContract();

  const approve = async (amount: string) => {
    if (!lpTokenAddress || !masterchefContract?.address) {
        throw new Error("Missing contract addresses");
    }
    
    return approveToken({
      address: lpTokenAddress as `0x${string}`,
      abi: [
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {"name": "spender", "type": "address"},
            {"name": "value", "type": "uint256"}
          ],
          "outputs": [{"name": "", "type": "bool"}],
          "stateMutability": "nonpayable"
        }
      ],
      functionName: "approve",
      args: [masterchefContract?.address as `0x${string}`, parseEther(amount)],
    });
  };

  const deposit = async (amount: string) => {
    if (!masterchefContract?.address || !masterchefContract?.abi) {
        throw new Error("Missing masterchef contract data");
    }

    return depositTokens({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "deposit",
      args: [poolId, parseEther(amount)],
    });
  };

  const withdraw = async (amount: string) => {
    return withdrawTokens({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "withdraw",
      args: [poolId, parseEther(amount)],
    });
  };

  const harvest = async () => {
    return harvestRewards({
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