import { hyperEvmMainnet, hyperEvmTestnet } from "@/config/wagmiConfig";
import { tokenAbi } from "@/config/abi";
import { Abi, zeroAddress } from "viem";

export const TOKEN_ABI = tokenAbi as Abi;

export const PoolData = {
  [hyperEvmTestnet.id]: {
    HYT: "0x74c33c558C71a5aB47A9ae3b0970f7edDf950b4B",
    HYT2: "0xE71c373a88017De7CAbCCBaaaA974183506a0499", 
    HYT3: "0xEEe6b553757f613336795b6AF4E831C3361d4961",
    HYT4: "0x500113D222522e11D02F65F08527793232FA3290",
  },
};