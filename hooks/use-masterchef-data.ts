import { useReadContracts } from "wagmi";
import { getContractData } from "@/constants/contractsData";
import { useChainId } from "wagmi";
import { formatEther } from "viem";
import { useMemo } from "react";

export function useMasterchefData() {
  const chainId = useChainId();
  const masterchefContract = getContractData(chainId, "Masterchef");

  // First, get the number of pools
  const { data: poolCountData, isLoading: isLoadingPoolCount } = useReadContracts({
    contracts: [
      {
        address: masterchefContract?.address,
        abi: masterchefContract?.abi,
        functionName: "poolLength",
      },
    ],
  });

  const poolCount = poolCountData?.[0]?.result ? Number(poolCountData[0].result) : 0;

  // Create contracts to get all pool info
  const poolInfoContracts = useMemo(() => {
    if (poolCount === 0) return [];
    
    return Array.from({ length: poolCount }, (_, index) => ({
      address: masterchefContract?.address,
      abi: masterchefContract?.abi,
      functionName: "poolInfo",
      args: [index],
    }));
  }, [poolCount, masterchefContract]);

  // Get all pool information
  const { data: poolsData, isLoading: isLoadingPools } = useReadContracts({
    contracts: poolInfoContracts,
    query: {
      enabled: poolCount > 0,
    },
  });

  // Extract LP token addresses and create balance check contracts
  const lpTokenBalanceContracts = useMemo(() => {
    if (!poolsData || poolsData.length === 0) return [];

    const contracts: any[] = [];
    
    poolsData.forEach((poolResult, index) => {
      if (poolResult.result) {
        // poolInfo returns: [lpToken, allocPoint, lastRewardTime, accTokenPerShare, depositFeeBP, harvestInterval]
        const poolInfo = poolResult.result as any[];
        const lpTokenAddress = poolInfo[0];
        
        // Add contract to check LP token balance in masterchef
        contracts.push({
          address: lpTokenAddress,
          abi: [
            {
              "type": "function",
              "name": "balanceOf",
              "inputs": [{"name": "account", "type": "address"}],
              "outputs": [{"name": "", "type": "uint256"}],
              "stateMutability": "view"
            },
            {
              "type": "function",
              "name": "symbol",
              "inputs": [],
              "outputs": [{"name": "", "type": "string"}],
              "stateMutability": "view"
            },
            {
              "type": "function",
              "name": "decimals",
              "inputs": [],
              "outputs": [{"name": "", "type": "uint8"}],
              "stateMutability": "view"
            }
          ],
          functionName: "balanceOf",
          args: [masterchefContract?.address],
        });

        // Also get token symbol for display
        contracts.push({
          address: lpTokenAddress,
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
        });

        // Get decimals
        contracts.push({
          address: lpTokenAddress,
          abi: [
            {
              "type": "function",
              "name": "decimals",
              "inputs": [],
              "outputs": [{"name": "", "type": "uint8"}],
              "stateMutability": "view"
            }
          ],
          functionName: "decimals",
        });
      }
    });

    return contracts;
  }, [poolsData, masterchefContract]);

  // Get LP token balances
  const { data: lpBalancesData, isLoading: isLoadingBalances } = useReadContracts({
    contracts: lpTokenBalanceContracts,
    query: {
      enabled: lpTokenBalanceContracts.length > 0,
    },
  });

  // Process the data to calculate TVL
  const tvlData = useMemo(() => {
    if (!poolsData || !lpBalancesData || poolsData.length === 0) {
      return {
        totalTVL: "0",
        poolDetails: [],
        poolCount: 0,
      };
    }

    const poolDetails: Array<{
      poolId: number;
      tokenAddress: string;
      tokenSymbol: string;
      balance: string;
      formattedBalance: string;
    }> = [];

    let totalValueInTokens = 0;

    poolsData.forEach((poolResult, poolIndex) => {
      if (poolResult.result) {
        const poolInfo = poolResult.result as any[];
        const lpTokenAddress = poolInfo[0];
        
        // Calculate indices for this pool's data in lpBalancesData
        const balanceIndex = poolIndex * 3;
        const symbolIndex = poolIndex * 3 + 1;
        const decimalsIndex = poolIndex * 3 + 2;

        const balanceResult = lpBalancesData[balanceIndex];
        const symbolResult = lpBalancesData[symbolIndex];
        const decimalsResult = lpBalancesData[decimalsIndex];

        if (balanceResult?.result && symbolResult?.result && decimalsResult?.result) {
          const balance = balanceResult.result as bigint;
          const symbol = symbolResult.result as string;
          const decimals = decimalsResult.result as number;
          
          const formattedBalance = formatEther(balance); // This assumes 18 decimals, adjust if needed
          const balanceNumber = parseFloat(formattedBalance);
          
          poolDetails.push({
            poolId: poolIndex,
            tokenAddress: lpTokenAddress,
            tokenSymbol: symbol,
            balance: balance.toString(),
            formattedBalance: balanceNumber.toFixed(2),
          });

          // For now, we'll just sum up all token amounts (this would need price conversion for real USD TVL)
          totalValueInTokens += balanceNumber;
        }
      }
    });

    return {
      totalTVL: totalValueInTokens.toFixed(2),
      poolDetails,
      poolCount: poolDetails.length,
    };
  }, [poolsData, lpBalancesData]);

  return {
    ...tvlData,
    isLoading: isLoadingPoolCount || isLoadingPools || isLoadingBalances,
    error: null,
  };
}