// app/parent/layout.tsx
"use client"

import type React from "react"
import { PortalLayout } from "@/components/portal-layout"
import { LayoutDashboard, TrendingUp, Megaphone, CreditCard, Calendar } from "lucide-react"

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
  return (
    <PortalLayout navigation={navigation} allowedRoles={["parent"]}>
      {children}
    </PortalLayout>
  )
}