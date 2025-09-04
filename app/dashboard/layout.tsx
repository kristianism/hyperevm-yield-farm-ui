"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FiberWaves } from "@/components/ui/fiber-waves"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <FiberWaves 
        color={[0.5, 0.5, 0.5]}
        amplitude={1.0}
        className="absolute"
        />
        <AppSidebar />
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  )
}