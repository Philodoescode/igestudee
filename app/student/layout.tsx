"use client"

import type React from "react"

import { PortalSidebar } from "@/components/portal-sidebar"
import { useRequireAuth } from "@/hooks/use-auth"
import { BookOpen, Calendar, MessageSquare, GraduationCap } from "lucide-react"

const navigation = [
  {
    title: "Learning",
    items: [
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
  {
    title: "Community",
    items: [
      {
        title: "Discussion Forum",
        href: "/student/forum",
        icon: MessageSquare,
      },
    ],
  },
]

const colorScheme = {
  primary: "from-gossamer-500",
  secondary: "to-gossamer-600",
  accent: "gossamer-400",
  gradient: "from-gossamer-500 to-gossamer-600",
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAuth(["student"])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gossamer-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PortalSidebar
        title="Student Portal"
        subtitle="Learning Dashboard"
        icon={GraduationCap}
        navigation={navigation}
        colorScheme={colorScheme}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
