// app/admin/page.tsx
"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "Admin"

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
            Welcome back, {firstName}!
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Link href="/admin/register">
                <Card className="hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Register Staff
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">New User</div>
                        <p className="text-xs text-muted-foreground">
                            Create new accounts for Instructors and TAs.
                        </p>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
      </div>
    </div>
  )
}