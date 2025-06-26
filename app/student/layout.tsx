"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { BookOpen, Calendar, GraduationCap, Settings, User , LayoutDashboard} from "lucide-react"

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
  const { user, loading } = useRequireAuth(["student"])

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
        title="Student Portal"
        icon={GraduationCap}
        navigation={navigation}
      />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}