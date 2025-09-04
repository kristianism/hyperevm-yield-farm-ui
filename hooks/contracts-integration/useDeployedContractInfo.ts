"use client";

import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { useChainId, usePublicClient } from "wagmi";
import {
  Contract,
  ContractCodeStatus,
  ContractName,
  contracts,
} from "@/utils/contracts-types";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedContractInfo = <TContractName extends ContractName>(
  contractName: TContractName
) => {
  const isMounted = useIsMounted();
  const targetNetwork = useChainId();
  const deployedContract = contracts?.[targetNetwork]?.[
    contractName as ContractName
  ] as Contract<TContractName>;
  const [status, setStatus] = useState<ContractCodeStatus>(
    ContractCodeStatus.LOADING
  );
  const publicClient = usePublicClient({ chainId: targetNetwork });

  useEffect(() => {
    const checkContractDeployment = async () => {
      try {
        if (!isMounted() || !publicClient) return;

        if (!deployedContract) {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

        const code = await publicClient.getCode({
          address: deployedContract.address,
        });

        // If contract code is `0x` => no contract deployed on that address
        if (!code || code === "0x") {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }
        setStatus(ContractCodeStatus.DEPLOYED);
      } catch (e) {
        console.error(e);
        setStatus(ContractCodeStatus.NOT_FOUND);
      }
    };

    checkContractDeployment();
  }, [isMounted, contractName, deployedContract, publicClient]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  };
};