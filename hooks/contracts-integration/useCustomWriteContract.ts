"use client";
import { useState } from "react";
import { MutateOptions } from "@tanstack/react-query";
import { Abi, ExtractAbiFunctionNames } from "abitype";
import {
  Config,
  useAccount,
  useChainId,
  useWriteContract,
  UseWriteContractParameters,
} from "wagmi";
import { WriteContractErrorType, WriteContractReturnType } from "wagmi/actions";
import { WriteContractVariables } from "wagmi/query";
import { useTransactor } from "@/hooks/contracts-integration/useTransactor";
import { useDeployedContractInfo } from "@/hooks/contracts-integration/useDeployedContractInfo";
import {
  ContractAbi,
  ContractName,
  ScaffoldWriteContractOptions,
  ScaffoldWriteContractVariables,
} from "@/utils/contracts-types";
import { notification } from "@/components/common/Notification";

/**
 * Wrapper around wagmi's useWriteContract hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param contractName - name of the contract to be written to
 * @param writeContractParams - wagmi's useWriteContract parameters
 */
export const useCustomWriteContract = <TContractName extends ContractName>(
  contractName: TContractName,
  writeContractParams?: UseWriteContractParameters
) => {
  const { chain } = useAccount();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const targetNetwork = useChainId();

  const wagmiContractWrite = useWriteContract(writeContractParams);

  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const sendContractWriteAsyncTx = async <
    TFunctionName extends ExtractAbiFunctionNames<
      ContractAbi<TContractName>,
      "nonpayable" | "payable"
    >
  >(
    _variables: ScaffoldWriteContractVariables<TContractName, TFunctionName> & {
      txMessage?: string;
    },
    options?: ScaffoldWriteContractOptions
  ) => {
    if (!deployedContractData) {
      notification.error(
        "Target Contract is not deployed, did you forget to run `yarn deploy`?"
      );
      return;
    }

    if (!chain?.id) {
      notification.error("Please connect your wallet");
      return;
    }
    if (chain?.id !== targetNetwork) {
      notification.error("You are on the wrong network");
      return;
    }

    const { txMessage, ...variables } = _variables;

    try {
      setIsMining(true);
      const { blockConfirmations, onBlockConfirmation, ...mutateOptions } =
        options || {};
      const makeWriteWithParams = () =>
        wagmiContractWrite.writeContractAsync(
          {
            abi: deployedContractData.abi as Abi,
            address: deployedContractData.address,
            ...variables,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as WriteContractVariables<Abi, string, any[], Config, number>,
          mutateOptions as
            | MutateOptions<
                WriteContractReturnType,
                WriteContractErrorType,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                WriteContractVariables<Abi, string, any[], Config, number>,
                unknown
              >
            | undefined
        );
      const writeTxResult = await writeTx({
        tx: makeWriteWithParams,
        options: {
          blockConfirmations,
          onBlockConfirmation,
        },
        txMessage,
      });

      return writeTxResult;
      // eslint-disable-next-line no-useless-catch, @typescript-eslint/no-explicit-any
    } catch (e: any) {
      throw e;
    } finally {
      setIsMining(false);
    }
  };

  const sendContractWriteTx = <
    TContractName extends ContractName,
    TFunctionName extends ExtractAbiFunctionNames<
      ContractAbi<TContractName>,
      "nonpayable" | "payable"
    >
  >(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: Omit<
      ScaffoldWriteContractOptions,
      "onBlockConfirmation" | "blockConfirmations"
    >
  ) => {
    if (!deployedContractData) {
      notification.error(
        "Target Contract is not deployed, did you forget to run `yarn deploy`?"
      );
      return;
    }
    if (!chain?.id) {
      notification.error("Please connect your wallet");
      return;
    }
    if (chain?.id !== targetNetwork) {
      notification.error("You are on the wrong network");
      return;
    }

    wagmiContractWrite.writeContract(
      {
        abi: deployedContractData.abi as Abi,
        address: deployedContractData.address,
        ...variables,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as WriteContractVariables<Abi, string, any[], Config, number>,
      options as
        | MutateOptions<
            WriteContractReturnType,
            WriteContractErrorType,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            WriteContractVariables<Abi, string, any[], Config, number>,
            unknown
          >
        | undefined
    );
  };

  return {
    ...wagmiContractWrite,
    isMining,
    // Overwrite wagmi's writeContactAsync
    writeContractAsync: sendContractWriteAsyncTx,
    // Overwrite wagmi's writeContract
    writeContract: sendContractWriteTx,
  };
};