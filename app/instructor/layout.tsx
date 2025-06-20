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
    title: "Overview",
    items: [
      {
        title: "Admin Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
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
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Announcement Management",
        href: "/instructor/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Financial Management",
        href: "/instructor/financial",
        icon: DollarSign,
      },
      {
        title: "Analytics & Reporting",
        href: "/instructor/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Platform Settings",
        href: "/instructor/settings",
        icon: Settings,
      },
    ],
  },
]

const colorScheme = {
  primary: "from-blue-600",
  secondary: "to-indigo-700",
  accent: "blue-500",
  gradient: "from-blue-600 to-indigo-700",
}

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAuth(["instructor"])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PortalSidebar
        title="Instructor Portal"
        subtitle="Admin Dashboard"
        icon={Shield}
        navigation={navigation}
        colorScheme={colorScheme}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
