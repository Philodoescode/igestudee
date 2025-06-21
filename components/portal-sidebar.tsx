"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  User,
  LogOut,
  type LucideIcon,
  LayoutDashboard,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"

interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
}

interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

interface PortalSidebarProps {
  title: string
  icon: LucideIcon
  navigation: NavigationGroup[]
}

export function PortalSidebar({ title, icon: PortalIcon, navigation }: PortalSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Compute initials from first and last name
  const initials = useMemo(() => {
    if (!user?.name) return "U"
    const parts = user.name.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    const first = parts[0].charAt(0).toUpperCase()
    const last = parts[parts.length - 1].charAt(0).toUpperCase()
    return first + last
  }, [user?.name])

  // Refined isActive check for better route matching
  const isActive = (href: string) => {
    const portalRoot = `/${user?.role}`
    if (href === portalRoot) {
      return pathname === portalRoot
    }
    return pathname?.startsWith(href)
  }

  const handleLogout = async () => {
    await logout()
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#F7F8FA]">
      {/* Sidebar Header */}
      <div className="flex h-20 items-center gap-3 px-6">
        <Link href={`/${user?.role}`} className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500 p-2 text-white shadow-md shadow-emerald-500/30">
            <PortalIcon className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-gray-800">{title}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-4 py-4">
        {navigation.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">{group.title}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActive(item.href)
                        ? "font-bold text-gray-900"
                        : "text-gray-600 hover:bg-white hover:text-gray-900",
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 inset-y-0 my-auto h-6 w-1 rounded-r-full bg-emerald-500"
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive(item.href) ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Dropdown */}
      <div className="mt-auto border-t border-gray-200/80 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 p-2 text-left hover:bg-white"
            >
              <Avatar className="h-10 w-10">
                {/* If you want to keep image, you can leave AvatarImage; fallback shows initials */}
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name || "User"} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${user?.role}/profile`}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${user?.role}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-[60] bg-white/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-72 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden w-72 shrink-0 border-r border-gray-200/80 shadow-sm lg:block">
        {sidebarContent}
      </aside>
    </>
  )
}
