import { useState, useEffect } from 'react';
import { useChainId, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { PoolData, TOKEN_ABI } from '@/constants/poolData';

interface PoolInfo {
  address: string;
  logo: string;
  priceFeed: string;
}

interface PoolTvlData {
  totalTvl: number;
  poolTvls: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export const usePoolTvl = (masterChefAddress?: string): PoolTvlData => {
  const chainId = useChainId();
  const [totalTvl, setTotalTvl] = useState<number>(0);
  const [poolTvls, setPoolTvls] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentChainPools = PoolData[chainId as keyof typeof PoolData] || {};
  const poolTokens = Object.keys(currentChainPools);

  // Prepare contracts for reading LP token total supply
  const contracts = poolTokens.map(tokenSymbol => {
    const poolData = currentChainPools[tokenSymbol as keyof typeof currentChainPools] as PoolInfo;
    return {
      address: poolData?.address as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: 'totalSupply' as const,
    };
  }).filter(contract => contract.address);

  // Read all LP token total supplies
  const { data: supplies, isError, isLoading: contractsLoading } = useReadContracts({
    contracts,
    query: {
      enabled: poolTokens.length > 0,
    },
  });

  useEffect(() => {
    const calculateTvl = async () => {
      if (!supplies || contractsLoading) {
        setIsLoading(true);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const poolTvlCalculations: Record<string, number> = {};
        let total = 0;

        for (let i = 0; i < poolTokens.length; i++) {
          const tokenSymbol = poolTokens[i];
          const pool = currentChainPools[tokenSymbol as keyof typeof currentChainPools] as PoolInfo;
          const supplyResult = supplies[i];

          if (supplyResult.status === 'success' && supplyResult.result && pool) {
            // Convert supply from wei to readable format (assuming 18 decimals)
            const lpSupply = parseFloat(formatUnits(supplyResult.result as bigint, 18));
            
            // Get token price from price feed or use $1 as placeholder
            let tokenPrice = 1; // Default placeholder price
            
            if (pool.priceFeed && pool.priceFeed !== '') {
              // TODO: Implement price feed reading when price feed addresses are available
              // For now, using placeholder value
              tokenPrice = 1;
            }

            const poolTvl = lpSupply * tokenPrice;
            poolTvlCalculations[tokenSymbol] = poolTvl;
            total += poolTvl;
          } else {
            poolTvlCalculations[tokenSymbol] = 0;
          }
        }

        setPoolTvls(poolTvlCalculations);
        setTotalTvl(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to calculate TVL');
      } finally {
        setIsLoading(false);
      }
    };

    calculateTvl();
  }, [supplies, contractsLoading, chainId]);

  useEffect(() => {
    if (isError) {
      setError('Failed to fetch LP token supplies');
      setIsLoading(false);
    }
  }, [isError]);

  return {
    totalTvl,
    poolTvls,
    isLoading,
    error,
  };
};