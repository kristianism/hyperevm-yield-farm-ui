import { useCustomReadContract } from "./contracts-integration/useCustomReadContract";
import { formatEther } from "viem";

export function useTokenData() {
  const { 
    data: totalSupply, 
    isLoading: totalSupplyLoading, 
    error: totalSupplyError 
  }: { 
    data: bigint | undefined, 
    isLoading: boolean, 
    error: Error | null 
  } = useCustomReadContract({
    contractName: "Token",
    functionName: "totalSupply"
  }); 

  const { 
    data: name, 
    isLoading: nameLoading, 
    error: nameError 
  }: { 
    data: string, 
    isLoading: boolean, 
    error: Error | null 
  } = useCustomReadContract({
    contractName: "Token",
    functionName: "name"
  }); 

  const { 
    data: symbol, 
    isLoading: symbolLoading, 
    error: symbolError 
  }: { 
    data: string, 
    isLoading: boolean, 
    error: Error | null 
  } = useCustomReadContract({
    contractName: "Token",
    functionName: "symbol"
  });   

  const parsedTotalSupply = totalSupply ? formatEther(totalSupply as bigint) : "0";
  const isLoading = totalSupplyLoading || nameLoading || symbolLoading;
  const error = totalSupplyError || nameError || symbolError;

  return {
    parsedTotalSupply,
    name,
    symbol,
    isLoading,
    error,
  };
}