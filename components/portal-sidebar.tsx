// components/portal-sidebar.tsx
"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  PanelLeftClose,
  PanelRightClose,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

interface PortalSidebarProps {
  navigation: NavigationGroup[]
  isCollapsed: boolean
  onToggle: () => void
}

export function PortalSidebar({ navigation, isCollapsed, onToggle }: PortalSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (isMobileOpen) setIsMobileOpen(false)
  }, [pathname])

  const initials = useMemo(() => {
    if (!user?.name) return "U"
    const parts = user.name.trim().split(/\s+/)
    return (
      parts[0]?.charAt(0) +
      (parts.length > 1 ? parts[parts.length - 1].charAt(0) : "")
    ).toUpperCase()
  }, [user?.name])

  const isActive = (href: string) => {
    if (!pathname) return false
    const portalRoot = `/${user?.role}`
    return href === portalRoot ? pathname === portalRoot : pathname.startsWith(href)
  }

  const handleLogout = async () => await logout()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-zinc-900/95">
      {/* MODIFIED: Header layout logic simplified */}
      <div className={cn(
        "flex h-14 shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6 dark:border-zinc-800",
        isCollapsed ? "lg:justify-center" : "lg:justify-between"
      )}>
        {/* Full logo, hidden when collapsed */}
        <Link href={`/${user?.role}`} className={cn("flex items-center gap-2 font-semibold", isCollapsed && "lg:hidden")}>
          <Image
            src="/igestudee-logo.png"
            alt="Igestudee Logo"
            width={120}
            height={30}
            priority
            className="object-contain dark:invert"
          />
        </Link>
        {/* Desktop Toggle Button */}
        <Button variant="ghost" size="icon" onClick={onToggle} className="hidden lg:inline-flex">
          {isCollapsed ? <PanelRightClose className="h-5 w-5"/> : <PanelLeftClose className="h-5 w-5"/>}
        </Button>
      </div>
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {navigation.map((group) => (
            <div key={group.title}>
              {/* MODIFIED: Group titles are now hidden when collapsed */}
              <h3 className={cn(
                "mb-2 px-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500",
                isCollapsed && "lg:hidden"
              )}>
                 {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                             // MODIFIED: Center icon when collapsed
                            isCollapsed && "lg:justify-center",
                            isActive(item.href)
                              ? "bg-emerald-100/60 font-semibold text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-gray-50",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive(item.href)
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300",
                            )}
                          />
                          <span className={cn(isCollapsed && "lg:hidden")}>{item.title}</span>
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                         <TooltipContent side="right" sideOffset={5}>
                           {item.title}
                         </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </TooltipProvider>

      <div className="mt-auto border-t border-gray-200/80 p-3 dark:border-zinc-800">
        <DropdownMenu>
          <Tooltip>
              <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                      <Button
                      variant="ghost"
                      className={cn(
                          "h-auto w-full flex justify-between items-center p-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-800",
                          isCollapsed && "lg:justify-center"
                      )}
                      >
                      <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                              {initials}
                          </AvatarFallback>
                          </Avatar>
                          <div className={cn("min-w-0 flex-1", isCollapsed && "lg:hidden")}>
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {user?.name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {user?.role?.charAt(0).toUpperCase() + (user.role?.slice(1) ?? '')}
                          </p>
                          </div>
                      </div>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-500", isCollapsed && "lg:hidden")} />
                      </Button>
                  </DropdownMenuTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right" sideOffset={5}>{user?.name}</TooltipContent>}
          </Tooltip>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href={`/${user?.role}/profile`}><User className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href={`/${user?.role}/settings`}><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/50 dark:focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden">
        <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 dark:bg-zinc-950 dark:border-zinc-800">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="rounded-lg">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
          <Link href={`/${user?.role}`} className="flex items-center gap-2 font-semibold">
            <Image
              src="/igestudee-logo.png"
              alt="Igestudee Logo"
              width={110}
              height={28}
              priority
              className="object-contain dark:invert"
            />
          </Link>
          <div className="w-8" />
        </header>

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-0 z-40 bg-black/60"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed left-0 top-0 z-50 h-screen w-72"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 h-screen border-r bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {sidebarContent}
      </aside>
    </TooltipProvider>
  )
}