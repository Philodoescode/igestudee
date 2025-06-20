"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { usePathname } from "next/navigation"

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current path is a portal page
  const isPortalPage =
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/parent") ||
    pathname?.startsWith("/ta") ||
    pathname?.startsWith("/instructor")

  return (
    <div className="min-h-screen flex flex-col">
      {!isPortalPage && <Header />}
      <main className={isPortalPage ? "flex-1" : "flex-1"}>{children}</main>
      {!isPortalPage && <Footer />}
    </div>
  )
}
