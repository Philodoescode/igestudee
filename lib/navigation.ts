// lib/navigation.ts
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  Megaphone,
  DollarSign,
  BarChart3,
  TrendingUp,
  CreditCard,
  Calendar,
  Video,
} from "lucide-react"

export const studentNavigation = [
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

export const parentNavigation = [
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

export const taNavigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        href: "/ta",
        icon: LayoutDashboard,
      },
      {
        title: "Courses & Groups",
        href: "/ta/courses",
        icon: BookOpen,
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

export const instructorNavigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Admin Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
      },
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
      {
        title: "Announcements",
        href: "/instructor/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "GENERAL",
    items: [
      {
        title: "Financials",
        href: "/instructor/financial",
        icon: DollarSign,
      },
      {
        title: "Analytics",
        href: "/instructor/analytics",
        icon: BarChart3,
      },
    ],
  },
]

export const PORTAL_NAVIGATION = {
  student: studentNavigation,
  parent: parentNavigation,
  ta: taNavigation,
  instructor: instructorNavigation,
}