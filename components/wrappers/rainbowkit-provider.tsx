"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from '@/config/wagmiConfig'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function RainbowKitThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitProvider theme={darkTheme()} showRecentTransactions={true}>
      {children}
    </RainbowKitProvider>
  )
}

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitThemeProvider>
          {children}
        </RainbowKitThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}