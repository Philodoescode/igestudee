// NEW FILE: app/parent/attendance/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarCheck, User, Check, X, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"
import { parentAttendanceData } from "@/lib/database"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentChild, setCurrentChild] = useState("Emma Johnson")

  const attendanceData = parentAttendanceData[currentChild as keyof typeof parentAttendanceData]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Present
          </Badge>
        )
      case "excused":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Check className="w-3 h-3 mr-1" />
            Excused
          </Badge>
        )
      case "unexcused":
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Unexcused
          </Badge>
        )
      case "tardy":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Tardy
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-poppins font-bold mb-2 flex items-center">
            <CalendarCheck className="h-8 w-8 mr-3" />
            Attendance Record
          </h1>
          <p className="text-orange-100 text-lg">
            Viewing attendance for <span className="font-semibold">{currentChild}</span>
          </p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-poppins">Attendance Summary</CardTitle>
            <CardDescription>Overview of attendance for the current school year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Days Present", value: attendanceData.summary.present, color: "text-green-600" },
                { label: "Excused Absences", value: attendanceData.summary.excused, color: "text-blue-600" },
                { label: "Unexcused Absences", value: attendanceData.summary.unexcused, color: "text-red-600" },
                { label: "Tardies", value: attendanceData.summary.tardy, color: "text-yellow-700" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">
                    <AnimatedCounter end={stat.value} />
                  </p>
                  <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Attendance Rate:{" "}
                <span className="font-bold text-emerald-600">
                  {Math.round(
                    ((attendanceData.summary.present + attendanceData.summary.excused) / attendanceData.summary.totalDays) *
                      100,
                  )}
                  %
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Events</CardTitle>
                <CardDescription>Detailed log of all absences and tardies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Period/Time</TableHead>
                        <TableHead>Course</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.events.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell>{event.period}</TableCell>
                          <TableCell>{event.course}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Visualize attendance patterns over the month</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    unexcused: new Date("2024-03-12"),
                    tardy: [new Date("2024-03-05"), new Date("2024-02-15")],
                    excused: [new Date("2024-02-28"), new Date("2024-02-27"), new Date("2024-02-01")],
                  }}
                  modifiersClassNames={{
                    unexcused: "bg-red-200 text-red-900",
                    tardy: "bg-yellow-200 text-yellow-900",
                    excused: "bg-blue-200 text-blue-900",
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}