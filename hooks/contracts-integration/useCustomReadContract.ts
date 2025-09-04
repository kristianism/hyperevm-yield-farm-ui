"use client";
import { useEffect } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { ExtractAbiFunctionNames } from "abitype";
import { ReadContractErrorType } from "viem";
import { useBlockNumber, useChainId, useReadContract } from "wagmi";
import { useDeployedContractInfo } from "@/hooks/contracts-integration/useDeployedContractInfo";
import {
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
  UseScaffoldReadConfig,
} from "@/utils/contracts-types";

/**
 * Wrapper around wagmi's useContractRead hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call
 */
export const useCustomReadContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<
    ContractAbi<TContractName>,
    "pure" | "view"
  >
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);

  const targetNetwork = useChainId();
  const { query: queryOptions, watch, ...readContractConfig } = readConfig;
  // set watch to true by default
  const defaultWatch = watch ?? true;

  const readContractHookRes = useReadContract({
    chainId: targetNetwork,
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    args,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(readContractConfig as any),
    query: {
      enabled: !Array.isArray(args) || !args.some((arg) => arg === undefined),
      ...queryOptions,
    },
  }) as Omit<ReturnType<typeof useReadContract>, "data" | "refetch"> & {
    data: AbiFunctionReturnType<ContractAbi, TFunctionName> | undefined;
    refetch: (
      options?: RefetchOptions | undefined
    ) => Promise<
      QueryObserverResult<
        AbiFunctionReturnType<ContractAbi, TFunctionName>,
        ReadContractErrorType
      >
    >;
  };

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: defaultWatch,
    chainId: targetNetwork,
    query: {
      enabled: defaultWatch,
    },
  });

  useEffect(() => {
    if (defaultWatch) {
      queryClient.invalidateQueries({ queryKey: readContractHookRes.queryKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return readContractHookRes;
};