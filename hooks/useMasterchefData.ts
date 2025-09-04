import { useCustomReadContract } from "@/hooks/contracts-integration/useCustomReadContract";
import { useDeployedContractInfo } from "@/hooks/contracts-integration/useDeployedContractInfo";
import { useMemo } from "react";
import { useReadContracts } from "wagmi";

export function useMasterchefData() {
  const { data: masterchefContract } = useDeployedContractInfo("Masterchef");

  const { data: poolLength }: { data: bigint } = useCustomReadContract({
    contractName: "Masterchef",
    functionName: "poolLength"
  });

  // Create contracts to get all pool info and LP token data
  const poolContracts = useMemo(() => {

    if (poolLength == null || !masterchefContract?.address) return [];
    if (poolLength <= BigInt(0)) return [];

    const count = Number(poolLength);
    if (!Number.isFinite(count) || count <= 0) return [];

    return Array.from({ length: count }, (_, i) => ({
      address: masterchefContract.address,
      abi: masterchefContract.abi,
      functionName: "poolInfo",
      args: [i],
    }));
  }, [poolLength, masterchefContract]);

  // Get all pool information
  const { data: poolsData, isLoading: isLoadingPools } = useReadContracts({
    contracts: poolContracts,
    query: {
      enabled:
        !!masterchefContract &&
        poolLength != null &&
        poolLength > BigInt(0) &&
        poolContracts.length > 0,
    },
  });

  // Create contracts for LP token data (balances, symbols, decimals)
  const lpTokenContracts = useMemo(() => {
    if (!poolsData || poolsData.length === 0 || !masterchefContract?.address) {
      return [];
    }

    const contracts: any[] = [];
    const erc20Abi = [
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
    ];
    
    poolsData.forEach((poolResult: any) => {
      if (!poolResult?.result) return; 
        // poolInfo returns: [lpToken, allocPoint, lastRewardTime, accTokenPerShare, depositFeeBP, lpSupply, isNative]
        const poolInfo = poolResult.result as any[];
        const lpTokenAddress = poolInfo[0];
        if (!lpTokenAddress) return;
        
        // Add balance check
        contracts.push({
          address: lpTokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [masterchefContract.address],
        });

        // Add symbol check
        contracts.push({
          address: lpTokenAddress,
          abi: erc20Abi,
          functionName: "symbol",
        });

        // Add decimals check
        contracts.push({
          address: lpTokenAddress,
          abi: erc20Abi,
          functionName: "decimals",
        });
      }
    );

    return contracts;
  }, [poolsData, masterchefContract]);

  // Get LP token data
  const { data: lpTokenData, isLoading: isLoadingTokenData } = useReadContracts({
    contracts: lpTokenContracts,
    query: {
      enabled: lpTokenContracts.length > 0,
    },
  });

  const result = useMemo(() => {
    const poolDetails: Array<{
      poolId: number;
      tokenAddress: string;
      tokenSymbol?: string;
      balance?: string;
      formattedBalance?: string;
      allocPoint?: number;
      decimals?: number;
    }> = [];

    if (!poolsData || poolsData.length === 0) {
      return {
        poolCount: 0,
        poolDetails,
        isLoading: isLoadingPools || isLoadingTokenData,
      };
    }

    for (let poolIndex = 0; poolIndex < poolsData.length; poolIndex++) {
      const poolResult = poolsData[poolIndex];
      if (!poolResult?.result) continue;

      const poolInfo = poolResult.result as any[];
      const lpTokenAddress = poolInfo[0];
      const allocPoint = poolInfo[1];

      // Each pool adds 3 entries to lpTokenData: balance, symbol, decimals
      const balanceIndex = poolIndex * 3;
      const symbolIndex = balanceIndex + 1;
      const decimalsIndex = balanceIndex + 2;

      const balanceResult = lpTokenData?.[balanceIndex];
      const symbolResult = lpTokenData?.[symbolIndex];
      const decimalsResult = lpTokenData?.[decimalsIndex];

      let balanceStr: string | undefined = undefined;
      let formattedBalance: string | undefined = undefined;
      let symbol: string | undefined = undefined;
      let decimals: number | undefined = undefined;

      if (balanceResult?.result) {
        const balance = balanceResult.result as bigint;
        balanceStr = balance.toString();
        // format if decimals available
        if (decimalsResult?.result != null) {
          // decimals may come as bigint or number
          const dec = Number(decimalsResult.result);
          decimals = Number.isFinite(dec) ? dec : undefined;
          if (decimals != null) {
            // use bigint exponentiation for divisor
            const divisor = BigInt(10) ** BigInt(decimals);
            // avoid converting huge bigint directly to Number if possible; but for UI show reasonable precision
            formattedBalance = (Number(balance) / Number(divisor)).toFixed(6);
          }
        }
      }

      if (symbolResult?.result) {
        symbol = String(symbolResult.result);
      }

      poolDetails.push({
        poolId: poolIndex,
        tokenAddress: lpTokenAddress,
        tokenSymbol: symbol,
        balance: balanceStr,
        formattedBalance,
        allocPoint: allocPoint != null ? Number(allocPoint) : undefined,
        decimals,
      });
    }

    return {
      poolCount: poolDetails.length,
      poolDetails,
      isLoading: isLoadingPools || isLoadingTokenData,
    };
  }, [poolsData, lpTokenData, isLoadingPools, isLoadingTokenData]);

  return result;
}