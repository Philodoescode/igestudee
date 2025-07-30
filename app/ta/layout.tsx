// app/ta/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { taNavigation } from "@/lib/navigation"

export default function TALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={taNavigation} allowedRoles={["ta"]}>
      {children}
    </PortalLayout>
  )
}