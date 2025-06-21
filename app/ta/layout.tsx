"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { LayoutDashboard, MessageSquare, Users, Calendar, UserCheck, Settings } from "lucide-react"

const navigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        href: "/ta",
        icon: LayoutDashboard,
      },
      {
        title: "Discussion Forum",
        href: "/ta/forum",
        icon: MessageSquare,
      },
      {
        title: "Student Management",
        href: "/ta/students",
        icon: Users,
      },
    ],
  },
  {
    title: "GENERAL",
    items: [
      {
        title: "My Schedule",
        href: "/ta/schedule",
        icon: Calendar,
      },
      {
        title: "Settings",
        href: "/ta/settings",
        icon: Settings,
      },
    ],
  },
]

export default function TALayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAuth(["ta"])

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
        title="TA Portal"
        icon={UserCheck}
        navigation={navigation}
      />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}