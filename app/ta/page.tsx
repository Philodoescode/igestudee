"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Calendar, Clock, ArrowRight, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Mock data for TA dashboard
const mockData = {
  studentGroups: [
    {
      id: "group-1",
      name: "ICT Fundamentals - Group A",
      studentCount: 12,
      course: "ICT Fundamentals",
      nextSession: "2024-01-15T14:00:00Z",
      pendingQuestions: 3,
    },
    {
      id: "group-2",
      name: "Mathematics - Group B",
      studentCount: 8,
      course: "Mathematics",
      nextSession: "2024-01-16T10:00:00Z",
      pendingQuestions: 1,
    },
    {
      id: "group-3",
      name: "ICT Practical - Group C",
      studentCount: 15,
      course: "ICT Practical",
      nextSession: "2024-01-17T16:00:00Z",
      pendingQuestions: 5,
    },
  ],
  forumActivity: [
    {
      id: "q1",
      title: "Help with Python loops",
      course: "ICT Fundamentals",
      student: "Emma Johnson",
      timeAgo: "2 hours ago",
      priority: "high",
      replies: 0,
    },
    {
      id: "q2",
      title: "Algebra equation solving",
      course: "Mathematics",
      student: "Michael Chen",
      timeAgo: "4 hours ago",
      priority: "medium",
      replies: 1,
    },
    {
      id: "q3",
      title: "Database design question",
      course: "ICT Practical",
      student: "Sarah Wilson",
      timeAgo: "6 hours ago",
      priority: "low",
      replies: 2,
    },
  ],
  upcomingSessions: [
    {
      id: "session-1",
      title: "ICT Q&A Session",
      course: "ICT Fundamentals",
      time: "2024-01-15T14:00:00Z",
      duration: "1 hour",
      type: "Q&A",
      students: 12,
    },
    {
      id: "session-2",
      title: "Math Problem Solving",
      course: "Mathematics",
      time: "2024-01-16T10:00:00Z",
      duration: "45 minutes",
      type: "Tutorial",
      students: 8,
    },
    {
      id: "session-3",
      title: "Lab Help Session",
      course: "ICT Practical",
      time: "2024-01-17T16:00:00Z",
      duration: "2 hours",
      type: "Lab Help",
      students: 15,
    },
  ],
  announcements: [
    {
      id: "ann-1",
      title: "New Assessment Guidelines",
      content: "Updated guidelines for student assessments have been released.",
      priority: "high",
      timeAgo: "1 day ago",
      from: "Dr. Sarah Johnson",
    },
    {
      id: "ann-2",
      title: "Office Hours Update",
      content: "Office hours have been extended for the upcoming exam period.",
      priority: "medium",
      timeAgo: "2 days ago",
      from: "Dr. Sarah Johnson",
    },
  ],
}

export default function TADashboard() {
  const { user, isLoading } = useRequireAuth(["ta"])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const totalStudents = mockData.studentGroups.reduce((sum, group) => sum + group.studentCount, 0)
  const totalPendingQuestions = mockData.studentGroups.reduce((sum, group) => sum + group.pendingQuestions, 0)
  const todaySessions = mockData.upcomingSessions.filter((session) => {
    const sessionDate = new Date(session.time)
    const today = new Date()
    return sessionDate.toDateString() === today.toDateString()
  }).length

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your student groups today.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Teaching Assistant
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Pending Questions</p>
                <p className="text-3xl font-bold">{totalPendingQuestions}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Today's Sessions</p>
                <p className="text-3xl font-bold">{todaySessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Student Groups</p>
                <p className="text-3xl font-bold">{mockData.studentGroups.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Groups */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    My Student Groups
                  </CardTitle>
                  <CardDescription>Assigned student groups and their status</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/ta/students">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.studentGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-600">{group.studentCount} students</p>
                    <p className="text-xs text-gray-500">
                      Next session: {new Date(group.nextSession).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.pendingQuestions > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {group.pendingQuestions} pending
                      </Badge>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/ta/students/${group.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Forum Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Recent Forum Activity
                  </CardTitle>
                  <CardDescription>New and unanswered questions</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/ta/forum">
                    View Forum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.forumActivity.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{question.title}</h4>
                      <Badge
                        variant={
                          question.priority === "high"
                            ? "destructive"
                            : question.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {question.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {question.course} • {question.student}
                    </p>
                    <p className="text-xs text-gray-500">
                      {question.timeAgo} • {question.replies} replies
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/ta/forum/question/${question.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Upcoming Sessions
                  </CardTitle>
                  <CardDescription>Your scheduled Q&A and lab sessions</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/ta/schedule">
                    View Schedule
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.upcomingSessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.course}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.time).toLocaleDateString()} at{" "}
                        {new Date(session.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{session.type}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{session.students} students</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Announcements
              </CardTitle>
              <CardDescription>Latest updates from instructors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    <Badge variant={announcement.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>From: {announcement.from}</span>
                    <span>{announcement.timeAgo}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
