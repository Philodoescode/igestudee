"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Users, BookOpen, MessageSquare, Clock, Download, Eye, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
  instructorDashboardStats,
  instructorRecentActivity,
  instructorUpcomingSessions,
  instructorQuickActions,
  instructorEngagementStats,
  instructorCourseEngagement,
  instructorStudentActivity,
} from "@/lib/database"

export default function EngagementAnalyticsPage() {
  const engagementStats = instructorEngagementStats
  const courseEngagement = instructorCourseEngagement
  const studentActivity = instructorStudentActivity

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <Clock className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-gray-900">Student Engagement Report</h1>
          <p className="text-gray-600 mt-2">Monitor student activity, completion rates, and forum engagement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold">{engagementStats.activeStudents}</p>
                  <p className="text-blue-100 text-sm">
                    of {engagementStats.totalStudents} total (
                    {Math.round((engagementStats.activeStudents / engagementStats.totalStudents) * 100)}%)
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Avg. Completion Rate</p>
                  <p className="text-3xl font-bold">{engagementStats.completionRate}%</p>
                  <p className="text-green-100 text-sm">+5% from last month</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Session Time</p>
                  <p className="text-3xl font-bold">{engagementStats.avgSessionTime}</p>
                  <p className="text-purple-100 text-sm">+8 min from last week</p>
                </div>
                <Clock className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Forum Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{engagementStats.forumPosts}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Video Views</p>
                  <p className="text-2xl font-bold text-gray-900">{engagementStats.videoViews}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courseEngagement.length}</p>
                  <p className="text-sm text-gray-500">Currently running</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Course Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Course Engagement Overview</CardTitle>
          <CardDescription>Detailed engagement metrics for each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Avg. Time Spent</TableHead>
                  <TableHead>Forum Activity</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseEngagement.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell><div className="font-medium text-gray-900">{course.title}</div></TableCell>
                    <TableCell><div className="flex items-center"><Users className="h-4 w-4 mr-1 text-gray-400" />{course.students}</div></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${course.completionRate}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{course.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell><div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-gray-400" />{course.avgTimeSpent}</div></TableCell>
                    <TableCell><div className="flex items-center"><MessageSquare className="h-4 w-4 mr-1 text-gray-400" />{course.forumActivity} posts</div></TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(course.lastAccessed).toLocaleDateString()}</TableCell>
                    <TableCell><div className="flex items-center">{getTrendIcon(course.trend)}</div></TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Recent Student Activity</CardTitle>
          <CardDescription>Individual student engagement and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Forum Posts</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentActivity.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell><div className="font-medium text-gray-900">{student.name}</div></TableCell>
                    <TableCell><div className="text-sm text-gray-600">{student.course}</div></TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.completionRate}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{student.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell><div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-gray-400" />{student.timeSpent}</div></TableCell>
                    <TableCell><div className="flex items-center"><MessageSquare className="h-4 w-4 mr-1 text-gray-400" />{student.forumPosts}</div></TableCell>
                    <TableCell className="text-sm text-gray-500">{student.lastActive}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
