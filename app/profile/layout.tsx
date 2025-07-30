"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { useRequireAuth } from "@/hooks/use-auth"
import { PORTAL_NAVIGATION } from "@/lib/navigation"
import type { UserRole } from "@/lib/auth"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  // Require authentication and get user info
  const { user, isLoading } = useRequireAuth()

  // Determine which navigation to use based on user role
  const navigation = user ? PORTAL_NAVIGATION[user.role] : []

  if (isLoading || !user) {
    // Show a loader while session is being verified
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <PortalLayout navigation={navigation} allowedRoles={[user.role]}>
      {children}
    </PortalLayout>
  )
}