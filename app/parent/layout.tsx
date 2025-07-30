// app/parent/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { parentNavigation } from "@/lib/navigation"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={parentNavigation} allowedRoles={["parent"]}>
      {children}
    </PortalLayout>
  )
}