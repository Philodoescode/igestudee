"use client"

import type React from "react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Video,
  Megaphone,
} from "lucide-react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"

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
      <PortalSidebar navigation={navigation} />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}