// app/instructor/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  Megaphone,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react"

const navigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Admin Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
      },
      {
        title: "Course Management",
        href: "/instructor/courses",
        icon: BookOpen,
      },
      {
        title: "User Management",
        href: "/instructor/users",
        icon: Users,
      },
      {
        title: "TA Management",
        href: "/instructor/tas",
        icon: UserCheck,
      },
      {
        title: "Announcements",
        href: "/instructor/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "GENERAL",
    items: [
      {
        title: "Financials",
        href: "/instructor/financial",
        icon: DollarSign,
      },
      {
        title: "Analytics",
        href: "/instructor/analytics",
        icon: BarChart3,
      },
      {
        title: "Settings",
        href: "/instructor/settings",
        icon: Settings,
      },
    ],
  },
]

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={navigation} allowedRoles={["instructor"]}>
      {children}
    </PortalLayout>
  )
}