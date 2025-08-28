"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function InstructorDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "Instructor"

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {firstName}!</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/instructor/courses">
            <Card className="hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses & Groups</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Course Management</div>
                <p className="text-xs text-muted-foreground">Manage course content, sessions, and student groups.</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/instructor/students">
            <Card className="hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Student Roster</div>
                <p className="text-xs text-muted-foreground">View and manage students assigned to you.</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}