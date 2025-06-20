// app/parent/layout.tsx
"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { LayoutDashboard, TrendingUp, Megaphone, CreditCard, Heart, Calendar } from "lucide-react"

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/parent",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
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
    title: "Account",
    items: [
      {
        title: "Billing",
        href: "/parent/billing",
        icon: CreditCard,
      },
    ],
  },
]

const colorScheme = {
  primary: "from-emerald-500",
  secondary: "to-teal-600",
  accent: "emerald-400",
  gradient: "from-emerald-500 to-teal-600",
}

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
    <div className="flex h-screen bg-gray-50">
      <PortalSidebar
        title="Parent Portal"
        subtitle="Family Dashboard"
        icon={Heart}
        navigation={navigation}
        colorScheme={colorScheme}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}