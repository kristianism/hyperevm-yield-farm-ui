"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, Copy, ExternalLink, LogOut, Wallet } from "lucide-react"
import { useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'

export function RainbowNavUser() {
  const { isMobile } = useSidebar()
  const { address } = useAccount()
  const chain = useChainId()

  useEffect(() => {}, [address, chain])

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <SidebarMenu>
            <SidebarMenuItem>
              {!connected ? (
                <SidebarMenuButton
                  size="lg"
                  onClick={openConnectModal}
                  className="w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Wallet className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Connect Wallet</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Click to connect
                    </span>
                  </div>
                </SidebarMenuButton>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={account.ensAvatar} alt={account.displayName} />
                        <AvatarFallback className="rounded-lg">
                          {account.displayName?.slice(0, 2).toUpperCase() || 'WL'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {account.ensName || account.displayName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {chain.name}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={account.ensAvatar} alt={account.displayName} />
                          <AvatarFallback className="rounded-lg">
                            {account.displayName?.slice(0, 2).toUpperCase() || 'WL'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {account.ensName || account.displayName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {account.address}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigator.clipboard.writeText(account.address)}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={openChainModal}
                      className="cursor-pointer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Switch Network
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={openAccountModal}
                      className="cursor-pointer"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Account Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={openAccountModal}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        )
      }}
    </ConnectButton.Custom>
  )
}