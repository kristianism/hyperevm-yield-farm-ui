import { masterchefAbi, tokenAbi } from "@/config/abi";
import { hyperEvmMainnet, hyperEvmTestnet } from "@/config/wagmiConfig";
import {
  GenericContractsDeclaration,
  TContractsKeys,
} from "@/utils/contracts-types";
import { Abi, zeroAddress } from "viem";

export const contractsData: GenericContractsDeclaration = {
  [hyperEvmMainnet.id]: {
    Masterchef: {
      address: zeroAddress, // TODO: Update when deployed
      abi: masterchefAbi as Abi,
    },
    Token: {
      address: zeroAddress, // TODO: Update when deployed
      abi: tokenAbi as Abi,
    },
    Presale: {
      address: zeroAddress, // TODO: Update when deployed
      abi: [] as Abi, // TODO: Add Presale ABI
    },
  },
  
  [hyperEvmTestnet.id]: {
    Masterchef: {
      address: "0x929c054F1F8a1A33F3ee24A17eA8216a5c2f2bE0",
      abi: masterchefAbi as Abi,
    },
    Token: {
      address: "0x74c33c558C71a5aB47A9ae3b0970f7edDf950b4B",
      abi: tokenAbi as Abi,
    },
    Presale: {
      address: zeroAddress, // TODO: Update when deployed
      abi: [] as Abi, // TODO: Add Presale ABI
    },
  },

  // Add more chains as needed
  
};

export const getContractData = (
  chainId: number,
  contractName: TContractsKeys
) => {
  return contractsData[chainId]?.[contractName];
};