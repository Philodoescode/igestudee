// components/portal-layout.tsx
"use client"

import React, { useState } from "react"
import { PortalSidebar, type NavigationGroup } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface PortalLayoutProps {
  children: React.ReactNode
  navigation: NavigationGroup[]
  allowedRoles: UserRole[]
}

export function PortalLayout({
  children,
  navigation,
  allowedRoles,
}: PortalLayoutProps) {
  const { user, isLoading } = useRequireAuth(allowedRoles)
  // NEW: State for sidebar collapse lives here now
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <PortalSidebar 
        navigation={navigation} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      
      <main 
        className={cn(
          "pt-14 transition-[padding] duration-300 ease-in-out lg:pt-0",
          isCollapsed ? "lg:pl-20" : "lg:pl-72" // Adjust padding based on state
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}