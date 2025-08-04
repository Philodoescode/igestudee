// app/admin/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { adminNavigation } from "@/lib/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={adminNavigation} allowedRoles={["admin"]}>
      {children}
    </PortalLayout>
  )
}