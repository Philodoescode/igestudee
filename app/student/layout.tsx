// app/student/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { studentNavigation } from "@/lib/navigation"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={studentNavigation} allowedRoles={["student"]}>
      {children}
    </PortalLayout>
  )
}