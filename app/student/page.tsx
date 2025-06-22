"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Bell, ArrowRight, TrendingUp } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  studentEnrolledCourses,
  studentUpcomingSessions,
  studentRecentAnnouncements,
} from "@/lib/database"

const performanceData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 85 },
  { month: "May", score: 82 },
  { month: "Jun", score: 90 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "Student"

  const totalProgress = Math.round(
    studentEnrolledCourses.reduce((acc, course) => acc + course.progress, 0) /
      studentEnrolledCourses.length,
  )
  const pieData = [{ value: totalProgress }, { value: 100 - totalProgress }]

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Here is your learning snapshot.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Overall Completion</CardTitle>
                <CardDescription>Across all courses</CardDescription>
              </CardHeader>
              <CardContent className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius="70%"
                      outerRadius="100%"
                      startAngle={90}
                      endAngle={450}
                      cornerRadius={5}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">
                    {totalProgress}%
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Monthly average score</CardDescription>
              </CardHeader>
              <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <XAxis dataKey="month" fontSize={12} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Your enrolled course progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentEnrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="group"
                  >
                    <div className="rounded-lg border p-3 transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 group-hover:text-blue-600">
                          {course.title}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="mt-2 h-2" />
                    </div>
                  </Link>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/student/courses">View All Courses</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {studentUpcomingSessions.slice(0, 3).map((session, i) => (
                    <li key={session.id}>
                      <div className="flex gap-4">
                        <Badge
                          variant={
                            session.type === "Q&A" ? "default" : "secondary"
                          }
                        >
                          {session.type}
                        </Badge>
                        <div>
                          <h4 className="font-medium text-sm text-gray-800">
                            {session.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {session.date} at {session.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/student/schedule">View Full Schedule</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {studentRecentAnnouncements
                    .slice(0, 2)
                    .map((announcement) => (
                      <li key={announcement.id}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm text-gray-800">
                            {announcement.title}
                          </h4>
                          {announcement.priority === "high" && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {announcement.date} · {announcement.course}
                        </p>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/student/announcements">
                    View All Announcements
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}