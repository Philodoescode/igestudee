"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, Video, Users, MapPin, Bell } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { studentScheduleSessions } from "@/lib/database"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2024-01-15"))
  const [selectedView, setSelectedView] = useState("week")

  const todaySessions = studentScheduleSessions.filter((session) => session.date === "2024-01-15")
  const weekSessions = studentScheduleSessions.filter((session) => {
    const sessionDate = new Date(session.date)
    const today = new Date("2024-01-15")
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return sessionDate >= today && sessionDate <= weekFromNow
  })

  const getSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return studentScheduleSessions.filter((session) => session.date === dateString)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Q&A":
        return "bg-blue-100 text-blue-800"
      case "Lab Help":
        return "bg-[var(--color-gossamer-100)] text-[var(--color-gossamer-800)]"
      case "Workshop":
        return "bg-purple-100 text-purple-800"
      case "Study Group":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your live sessions and study schedule</p>
          </div>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-[var(--color-gossamer-600)]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold">{todaySessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{weekSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Sessions</p>
                <p className="text-2xl font-bold">
                  {studentScheduleSessions.filter((s) => s.type === "Q&A" || s.type === "Workshop").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Groups</p>
                <p className="text-2xl font-bold">
                  {studentScheduleSessions.filter((s) => s.type === "Study Group").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar and Sessions */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="lg:col-span-2">
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="all">All Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>Sessions scheduled for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaySessions.length > 0 ? (
                    todaySessions.map((session) => (
                      <motion.div
                        key={session.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{session.title}</h3>
                            <p className="text-sm text-gray-600">{session.instructor}</p>
                          </div>
                          <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {session.time} ({session.duration})
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {session.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {session.attendees}/{session.maxAttendees} attending
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline">{session.course}</Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{session.description}</p>

                        <div className="flex items-center justify-between">
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Join Session
                          </Button>
                          <Button variant="outline" size="sm">
                            Add to Calendar
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions today</h3>
                      <p className="text-gray-600">Enjoy your free time or catch up on course materials!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="week" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>This Week's Sessions</CardTitle>
                  <CardDescription>All sessions for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weekSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-gray-600">{session.instructor}</p>
                        </div>
                        <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {session.time} ({session.duration})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {session.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {session.attendees}/{session.maxAttendees}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      <Badge variant="outline" className="mb-3">
                        {session.course}
                      </Badge>

                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline">
                          Set Reminder
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Upcoming Sessions</CardTitle>
                  <CardDescription>Complete list of scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentScheduleSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-gray-600">{session.instructor}</p>
                        </div>
                        <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {session.time} ({session.duration})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {session.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {session.attendees}/{session.maxAttendees}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      <Badge variant="outline" className="mb-3">
                        {session.course}
                      </Badge>

                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline">
                          Set Reminder
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}