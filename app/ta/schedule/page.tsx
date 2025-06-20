"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Video, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

// Mock data for TA schedule
const mockScheduleData = {
  sessions: [
    {
      id: "session-1",
      title: "ICT Q&A Session",
      course: "ICT Fundamentals",
      type: "Q&A",
      date: "2024-01-15",
      time: "14:00",
      duration: "1 hour",
      students: 12,
      location: "Virtual - Zoom Room 1",
      status: "upcoming",
      description: "Weekly Q&A session for ICT Fundamentals students",
    },
    {
      id: "session-2",
      title: "Math Problem Solving",
      course: "Mathematics",
      type: "Tutorial",
      date: "2024-01-16",
      time: "10:00",
      duration: "45 minutes",
      students: 8,
      location: "Virtual - Zoom Room 2",
      status: "upcoming",
      description: "Help session for algebra and calculus problems",
    },
    {
      id: "session-3",
      title: "Lab Help Session",
      course: "ICT Practical",
      type: "Lab Help",
      date: "2024-01-17",
      time: "16:00",
      duration: "2 hours",
      students: 15,
      location: "Virtual - Zoom Room 3",
      status: "upcoming",
      description: "Hands-on help with practical assignments",
    },
    {
      id: "session-4",
      title: "Office Hours",
      course: "General",
      type: "Office Hours",
      date: "2024-01-18",
      time: "13:00",
      duration: "2 hours",
      students: 0,
      location: "Virtual - Personal Room",
      status: "upcoming",
      description: "Open office hours for any questions",
    },
    {
      id: "session-5",
      title: "ICT Review Session",
      course: "ICT Fundamentals",
      type: "Review",
      date: "2024-01-12",
      time: "15:00",
      duration: "1.5 hours",
      students: 10,
      location: "Virtual - Zoom Room 1",
      status: "completed",
      description: "Review session for Module 3 concepts",
    },
  ],
  weeklyHours: 8,
  totalSessions: 12,
  averageAttendance: 85,
}

export default function TASchedulePage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [viewMode, setViewMode] = useState("week")
  const [selectedWeek, setSelectedWeek] = useState(new Date())

  if (isLoading) {
    return <div>Loading...</div>
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Q&A":
        return "bg-blue-100 text-blue-700"
      case "Tutorial":
        return "bg-green-100 text-green-700"
      case "Lab Help":
        return "bg-purple-100 text-purple-700"
      case "Office Hours":
        return "bg-orange-100 text-orange-700"
      case "Review":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="default">Upcoming</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const upcomingSessions = mockScheduleData.sessions.filter((session) => session.status === "upcoming")
  const completedSessions = mockScheduleData.sessions.filter((session) => session.status === "completed")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">TA Schedule</h1>
            <p className="text-gray-600 mt-1">Manage your Q&A sessions, tutorials, and office hours.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Schedule Overview */}
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
                <p className="text-blue-100">Weekly Hours</p>
                <p className="text-3xl font-bold">{mockScheduleData.weeklyHours}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Sessions</p>
                <p className="text-3xl font-bold">{mockScheduleData.totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Attendance</p>
                <p className="text-3xl font-bold">{mockScheduleData.averageAttendance}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Upcoming</p>
                <p className="text-3xl font-bold">{upcomingSessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled sessions for this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session) => (
                <motion.div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.course}</p>
                    </div>
                    <Badge className={getSessionTypeColor(session.type)}>{session.type}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {session.time} ({session.duration})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{session.students} students</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>

                  <div className="flex items-center justify-between">
                    {getStatusBadge(session.status)}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent Sessions
              </CardTitle>
              <CardDescription>Completed sessions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.course}</p>
                    </div>
                    <Badge className={getSessionTypeColor(session.type)}>{session.type}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {session.time} ({session.duration})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{session.students} attended</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getStatusBadge(session.status)}
                    <Button size="sm" variant="ghost">
                      View Summary
                    </Button>
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
