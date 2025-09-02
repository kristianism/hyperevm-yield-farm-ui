import { createConfig, http } from "@wagmi/core";
import { Chain } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  rabbyWallet,
  safepalWallet,
  trustWallet,
  ledgerWallet,
  braveWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const hyperEvmMainnet = {
  id: 999,
  name: "Hyperliquid EVM Mainnet",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.hyperliquid.xyz/evm"] } },
  blockExplorers: {
    default: { name: "HyperEVMScan", url: "https://hyperevmscan.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
} as const satisfies Chain;

export const hyperEvmTestnet = {
  id: 998,
  name: "Hyperliquid EVM Testnet",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] } },
  blockExplorers: {
    default: { name: "Purrscan", url: "https://testnet.purrsec.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
} as const satisfies Chain;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Supported wallets",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        coinbaseWallet,
        rabbyWallet,
        safepalWallet,
        trustWallet,
        ledgerWallet,
        braveWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: "HyperEVM Yield Farm",
    projectId: "hyperevm-yield-farm",
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [hyperEvmMainnet, hyperEvmTestnet],
  transports: {
    [hyperEvmMainnet.id]: http("https://rpc.hyperliquid.xyz/evm"),
    [hyperEvmTestnet.id]: http("https://rpc.hyperliquid-testnet.xyz/evm"),
  },
});