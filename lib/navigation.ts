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
  UserPlus, // Added for admin
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

export const instructorNavigation = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
      },
      {
        title: "Courses & Groups",
        href: "/instructor/courses",
        icon: BookOpen,
      },
      {
        title: "My Students",
        href: "/instructor/students",
        icon: Users,
      },
    ],
  },
]

// NEW: Navigation for the Admin role
export const adminNavigation = [
    {
        title: "ADMINISTRATION",
        items: [
            {
                title: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
            },
            {
                title: "Register Staff",
                href: "/admin/register",
                icon: UserPlus,
            },
        ],
    },
]


// MODIFIED: Add 'admin' to the main navigation object
export const PORTAL_NAVIGATION = {
  student: studentNavigation,
  parent: parentNavigation,
  instructor: instructorNavigation,
  admin: adminNavigation,
}