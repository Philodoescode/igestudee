// app/instructor/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { instructorNavigation } from "@/lib/navigation"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={instructorNavigation} allowedRoles={["instructor"]}>
      {children}
    </PortalLayout>
  )
}