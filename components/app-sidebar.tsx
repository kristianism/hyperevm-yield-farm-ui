"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { RainbowNavUser } from "@/components/rainbow-nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "HyperYield",
      logo: GalleryVerticalEnd,
      plan: "Mainnet",
    },
  ],
  navMain: [
    {
      title: "Yield Farm",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Pools",
          url: "#",
        },
        {
          title: "My Positions",
          url: "#",
        }
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
    {
      title: "Socials",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Telegram",
          url: "#",
        },
        {
          title: "X (Twitter)",
          url: "https://x.com/YieldHyper",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <RainbowNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
