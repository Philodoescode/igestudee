"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  Megaphone,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
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
  const { user, loading } = useRequireAuth(["instructor"])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-white">
      <PortalSidebar
        title="Instructor Portal"
        icon={Shield}
        navigation={navigation}
      />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}