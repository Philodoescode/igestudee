import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { ClientLayoutWrapper } from "./client-layout-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-inter antialiased">
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
