"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  UserPlus,
  Megaphone,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Mock data for the dashboard
const dashboardStats = {
  totalStudents: 156,
  totalCourses: 8,
  monthlyRevenue: 12450,
  engagementRate: 87,
  newStudentsThisMonth: 23,
  activeDiscussions: 34,
}

const recentActivity = [
  {
    id: 1,
    type: "enrollment",
    user: "Emma Johnson",
    action: "enrolled in ICT Fundamentals",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    type: "completion",
    user: "Michael Chen",
    action: "completed Module 3 - Web Development",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    type: "question",
    user: "Sarah Williams",
    action: "posted a question in Mathematics Forum",
    time: "6 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    type: "payment",
    user: "David Brown",
    action: "completed payment for Q1 tuition",
    time: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    type: "assignment",
    user: "Alex Smith (TA)",
    action: "graded 15 assignments",
    time: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const upcomingSessions = [
  {
    id: 1,
    title: "ICT Q&A Session",
    time: "Today, 3:00 PM",
    participants: 12,
    type: "Q&A",
  },
  {
    id: 2,
    title: "Mathematics Workshop",
    time: "Tomorrow, 10:00 AM",
    participants: 8,
    type: "Workshop",
  },
  {
    id: 3,
    title: "Web Development Lab",
    time: "Friday, 2:00 PM",
    participants: 15,
    type: "Lab",
  },
]

const quickActions = [
  {
    title: "Create Announcement",
    description: "Send updates to students and parents",
    icon: Megaphone,
    href: "/instructor/announcements/create",
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Add Student",
    description: "Enroll new students in courses",
    icon: UserPlus,
    href: "/instructor/users/create",
    color: "from-green-600 to-emerald-600",
  },
  {
    title: "Create Course",
    description: "Set up new course content",
    icon: Plus,
    href: "/instructor/courses/create",
    color: "from-purple-600 to-pink-600",
  },
]

export default function InstructorDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalStudents}</p>
                  <p className="text-blue-100 text-sm">+{dashboardStats.newStudentsThisMonth} this month</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalCourses}</p>
                  <p className="text-green-100 text-sm">All courses running</p>
                </div>
                <BookOpen className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-purple-100 text-sm">+12% from last month</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Engagement Rate</p>
                  <p className="text-3xl font-bold">{dashboardStats.engagementRate}%</p>
                  <p className="text-orange-100 text-sm">+5% from last week</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}
                        >
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Recent Activity</CardTitle>
            <CardDescription>Latest platform activity and user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      activity.type === "enrollment"
                        ? "bg-green-100 text-green-800"
                        : activity.type === "completion"
                          ? "bg-blue-100 text-blue-800"
                          : activity.type === "question"
                            ? "bg-yellow-100 text-yellow-800"
                            : activity.type === "payment"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/instructor/analytics/engagement">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Upcoming Sessions</CardTitle>
            <CardDescription>Scheduled classes and Q&A sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {session.type}
                    </Badge>
                    <p className="text-xs text-gray-500">{session.participants} participants</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/instructor/schedule">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Schedule
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
