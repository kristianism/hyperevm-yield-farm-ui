import { masterchefAbi, tokenAbi } from "@/config/abi";
import { hyperEvmMainnet } from "@/config/wagmiConfig";
import {
  GenericContractsDeclaration,
  TContractsKeys,
} from "@/utils/contracts-types";
import { Abi, zeroAddress } from "viem";

export const contractsData: GenericContractsDeclaration = {
  [hyperEvmMainnet.id]: {
    Masterchef: {
      address: zeroAddress, // TODO: Update when deployed"
      abi: masterchefAbi as Abi,
    },
    Token: {
      address: zeroAddress, // TODO: Update when deployed"
      abi: tokenAbi as Abi,
    }
  },

  // Add more chains as needed
  
};

export const getContractData = (
  chainId: number,
  contractName: TContractsKeys
) => {
  return contractsData[chainId]?.[contractName];
};