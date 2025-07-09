// app/student/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { BookOpen, Calendar, LayoutDashboard } from "lucide-react"

const navigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
      },
      {
        title: "My Courses",
        href: "/student/courses",
        icon: BookOpen,
      },
      {
        title: "Schedule",
        href: "/student/schedule",
        icon: Calendar,
      },
    ],
  },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={navigation} allowedRoles={["student"]}>
      {children}
    </PortalLayout>
  )
}