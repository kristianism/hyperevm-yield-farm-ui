import { useReadContracts } from "wagmi";
import { getContractData } from "@/constants/contractsData";
import { useChainId } from "wagmi";
import { formatEther } from "viem";

export function useTokenData() {
  const chainId = useChainId();
  const tokenContract = getContractData(chainId, "Token");

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: tokenContract?.address,
        abi: tokenContract?.abi,
        functionName: "totalSupply",
      },
      {
        address: tokenContract?.address,
        abi: tokenContract?.abi,
        functionName: "name",
      },
      {
        address: tokenContract?.address,
        abi: tokenContract?.abi,
        functionName: "symbol",
      },
    ],
  });

  const totalSupply = data?.[0]?.result ? formatEther(data[0].result as bigint) : "0";
  const tokenName = data?.[1]?.result as string;
  const tokenSymbol = data?.[2]?.result as string;

  return {
    totalSupply,
    tokenName,
    tokenSymbol,
    isLoading,
    error,
  };
}