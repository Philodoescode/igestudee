// START OF app\layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { ClientLayoutWrapper } from "./client-layout-wrapper"

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "EduTech Academy - ICT & Mathematics Tutoring Program",
  description:
    "Transform your understanding of ICT and Mathematics with our comprehensive online tutoring program. Expert instruction, interactive learning, and personalized support.",
  keywords: "ICT tutoring, Mathematics tutoring, online education, IG courses, programming, web development",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lexend.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}