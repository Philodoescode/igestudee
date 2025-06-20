// app/student/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Clock, MessageSquare, TrendingUp, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"

// Mock data
const enrolledCourses = [
  {
    id: "ict-101",
    name: "ICT Fundamentals",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    nextModule: "Database Design Principles",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "math-201",
    name: "Advanced Mathematics",
    instructor: "Prof. Michael Chen",
    progress: 60,
    totalModules: 15,
    completedModules: 9,
    nextModule: "Calculus Applications",
    color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]",
  },
  {
    id: "physics-101",
    name: "Physics Fundamentals",
    instructor: "Dr. Emily Rodriguez",
    progress: 40,
    totalModules: 10,
    completedModules: 4,
    nextModule: "Newton's Laws of Motion",
    color: "from-purple-500 to-pink-500",
  },
]

const upcomingSessions = [
  {
    id: "1",
    title: "ICT Q&A Session",
    instructor: "Dr. Sarah Johnson",
    date: "Today",
    time: "3:00 PM",
    type: "Q&A",
    course: "ICT Fundamentals",
  },
  {
    id: "2",
    title: "Math Lab Help",
    instructor: "Alex Smith (TA)",
    date: "Tomorrow",
    time: "2:00 PM",
    type: "Lab Help",
    course: "Advanced Mathematics",
  },
]

const recentAnnouncements = [
  {
    id: "1",
    title: "New ICT Module Released",
    content: "Module 10: Database Design Principles is now available with practical exercises.",
    date: "2 hours ago",
    course: "ICT Fundamentals",
    priority: "high",
  },
  {
    id: "2",
    title: "Math Assignment Due Reminder",
    content: "Don't forget to submit your calculus problem set by Friday 11:59 PM.",
    date: "1 day ago",
    course: "Advanced Mathematics",
    priority: "medium",
  },
]

export default function StudentDashboard() {
  const { user } = useAuth()

  const firstName = user?.name?.split(" ")[0] || "Student"
  const totalProgress = Math.round(
    enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length,
  )

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}! 👋</h1>
            <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-gossamer-600)]">{totalProgress}%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student/courses">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => (
                <motion.div
                  key={course.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.instructor}</p>
                    </div>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>

                  <div className="space-y-2">
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {course.completedModules} of {course.totalModules} modules completed
                      </span>
                      <span>Next: {course.nextModule}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/courses/${course.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/student/forum/${course.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Discussion
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Live Q&A and Lab Help sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{session.title}</h4>
                      <p className="text-xs text-gray-600">{session.instructor}</p>
                    </div>
                    <Badge variant={session.type === "Q&A" ? "default" : "secondary"} className="text-xs">
                      {session.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="mr-1 h-3 w-3" />
                      {session.date} at {session.time}
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/student/schedule">View Full Schedule</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Recent Announcements
              </CardTitle>
              <CardDescription>Stay updated with the latest news</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAnnouncements.slice(0, 2).map((announcement) => (
                <div key={announcement.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <Badge
                      variant={
                        announcement.priority === "high"
                          ? "destructive"
                          : announcement.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                    <span className="text-xs text-[var(--color-gossamer-600)]">{announcement.course}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/student/announcements">View All Announcements</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}