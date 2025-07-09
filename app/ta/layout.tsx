// app/ta/layout.tsx
"use client"

import type React from "react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Video,
  Megaphone,
} from "lucide-react"
import { PortalLayout } from "@/components/portal-layout"

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
        title: "Groups",
        href: "/ta/groups",
        icon: Users,
      },
      {
        title: "Announcements",
        href: "/ta/announcements",
        icon: Megaphone,
      },
      {
        title: "Schedule & Meetings",
        href: "/ta/schedule",
        icon: Calendar,
      },
      {
        title: "Video Resources",
        href: "/ta/resources",
        icon: Video,
      },
    ],
  },
]

export default function TALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout navigation={navigation} allowedRoles={["ta"]}>
      {children}
    </PortalLayout>
  )
}