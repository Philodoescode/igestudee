"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { LayoutDashboard, TrendingUp, Megaphone, CreditCard, Heart, Calendar } from "lucide-react"

const navigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        href: "/parent",
        icon: LayoutDashboard,
      },
      {
        title: "Progress Reports",
        href: "/parent/progress",
        icon: TrendingUp,
      },
      {
        title: "Attendance",
        href: "/parent/attendance",
        icon: Calendar,
      },
      {
        title: "Announcements",
        href: "/parent/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "GENERAL",
    items: [
      {
        title: "Billing",
        href: "/parent/billing",
        icon: CreditCard,
      },
    ],
  },
]

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useRequireAuth(["parent"])

  if (isLoading) {
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
        title="Parent Portal"
        icon={Heart}
        navigation={navigation}
      />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}