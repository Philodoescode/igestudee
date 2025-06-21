// app/parent/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  CheckCircle,
  TrendingUp,
  BookOpen,
  CalendarCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedCounter } from "@/components/animated-counter"
import { parentDashboardChildren, parentDashboardData } from "@/lib/database"

export default function ParentDashboard() {
  const [currentChild, setCurrentChild] = useState("Emma Johnson")

  const selectedChildData = parentDashboardData[currentChild as keyof typeof parentDashboardData]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <div className="h-1 w-4 bg-gray-400 rounded-full" />
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header & Child Switcher */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Viewing dashboard for <span className="font-semibold">{currentChild}</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select value={currentChild} onValueChange={setCurrentChild}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {parentDashboardChildren.map((child) => (
                  <SelectItem key={child} value={child}>
                    {child}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Overall Grade",
            value: selectedChildData.keyMetrics.overallGrade,
            suffix: "%",
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-500",
          },
          {
            title: "Attendance Rate",
            value: selectedChildData.keyMetrics.attendanceRate,
            suffix: "%",
            icon: CalendarCheck,
            color: "from-blue-500 to-cyan-500",
          },
          {
            title: "Upcoming Deadlines",
            value: selectedChildData.keyMetrics.upcomingDeadlines,
            icon: FileText,
            color: "from-purple-500 to-pink-500",
          },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Course Overview */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>Summary of {currentChild}'s current courses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedChildData.courses.map((course) => (
                  <div key={course.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          Current Grade: <span className="font-semibold text-gray-700 ml-1">{course.grade}%</span>
                          <span className="ml-2">{getTrendIcon(course.trend)}</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/parent/progress">
                      <Button variant="outline" size="sm">
                        View Progress <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Work */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines (Next 7 Days)</CardTitle>
                <CardDescription>Upcoming assignments, quizzes, and exams.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedChildData.upcoming.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedChildData.upcoming.map((item) => (
                      <li key={item.title} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">Due in {item.due}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No deadlines in the next week.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          {/* Attendance Alerts */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedChildData.attendanceAlerts.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedChildData.attendanceAlerts.map((alert, index) => (
                      <li key={index} className="flex items-center space-x-3 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">{alert.type}</p>
                          <p className="text-sm">{alert.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center space-x-3 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <p>No attendance issues.</p>
                  </div>
                )}
                <Link href="/parent/attendance" className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    View Full Record
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Announcements */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedChildData.recentAnnouncements.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedChildData.recentAnnouncements.map((ann) => (
                      <li key={ann.id} className="flex items-start space-x-3">
                        <div className="mt-1">
                          <Bell className="h-4 w-4 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium">{ann.title}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No new announcements.</p>
                )}
                <Link href="/parent/announcements" className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}