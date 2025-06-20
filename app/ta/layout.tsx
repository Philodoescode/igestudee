"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { LayoutDashboard, MessageSquare, Users, Calendar, UserCheck } from "lucide-react"

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/ta",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Teaching",
    items: [
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
      {
        title: "TA Schedule",
        href: "/ta/schedule",
        icon: Calendar,
      },
    ],
  },
]

const colorScheme = {
  primary: "from-purple-500",
  secondary: "to-pink-600",
  accent: "purple-400",
  gradient: "from-purple-500 to-pink-600",
}

export default function TALayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAuth(["ta"])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PortalSidebar
        title="TA Portal"
        subtitle="Teaching Assistant"
        icon={UserCheck}
        navigation={navigation}
        colorScheme={colorScheme}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
