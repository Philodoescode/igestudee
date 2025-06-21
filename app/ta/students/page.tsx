"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Clock, BookOpen, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { taStudentManagementData } from "@/lib/database"

export default function TAStudentsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Active
          </Badge>
        )
      case "struggling":
        return <Badge variant="destructive">Needs Help</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">Monitor your student groups and track their progress.</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {taStudentManagementData.progressInsights.totalStudents} Total Students
          </Badge>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Students</p>
                <p className="text-3xl font-bold">{taStudentManagementData.progressInsights.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Average Progress</p>
                <p className="text-3xl font-bold">{taStudentManagementData.progressInsights.averageProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Need Help</p>
                <p className="text-3xl font-bold">{taStudentManagementData.progressInsights.strugglingStudents}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Active Students</p>
                <p className="text-3xl font-bold">{taStudentManagementData.progressInsights.activeStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Groups */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                My Student Groups
              </CardTitle>
              <CardDescription>Overview of all assigned student groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {taStudentManagementData.groups.map((group) => (
                <div key={group.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.course}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/ta/students/${group.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{group.studentCount}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getProgressColor(group.averageProgress)}`}>
                        {group.averageProgress}%
                      </p>
                      <p className="text-xs text-gray-600">Avg Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{group.strugglingStudents}</p>
                      <p className="text-xs text-gray-600">Need Help</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(group.nextSession).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">Next Session</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Group Progress</span>
                      <span className="text-sm text-gray-600">{group.averageProgress}%</span>
                    </div>
                    <Progress value={group.averageProgress} className="h-2" />
                  </div>

                  {/* Sample Students */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Recent Students</h4>
                    {group.students.slice(0, 3).map((student) => (
                      <div key={student.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-600">Last active: {student.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                            {student.progress}%
                          </span>
                          {getStatusBadge(student.status)}
                        </div>
                      </div>
                    ))}
                    {group.students.length > 3 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{group.students.length - 3} more students
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Common Struggling Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                Common Struggle Points
              </CardTitle>
              <CardDescription>Topics where students need the most help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {taStudentManagementData.progressInsights.commonStrugglingAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{area.topic}</h4>
                    <p className="text-sm text-gray-600">{area.studentCount} students struggling</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {area.studentCount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href="/ta/forum">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Check Forum Questions
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/ta/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/ta/students/progress">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}