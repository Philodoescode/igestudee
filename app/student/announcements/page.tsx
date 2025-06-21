"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bell, Search, Clock, BookOpen, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { studentAnnouncements } from "@/lib/database"

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const filteredAnnouncements = studentAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority
    const matchesCourse = selectedCourse === "all" || announcement.course === selectedCourse
    return matchesSearch && matchesPriority && matchesCourse
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course_update":
        return <BookOpen className="h-4 w-4" />
      case "assignment":
        return <Clock className="h-4 w-4" />
      case "schedule_change":
        return <Clock className="h-4 w-4" />
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const courses = ["all", ...Array.from(new Set(studentAnnouncements.map((a) => a.course)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest news and updates</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-gossamer-600)]">
              {studentAnnouncements.filter((a) => !a.read).length}
            </div>
            <div className="text-sm text-gray-500">Unread</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course === "all" ? "All Courses" : course}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Announcements List - Removed tags and share buttons */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card
              className={`${getPriorityColor(announcement.priority)} ${
                !announcement.read ? "ring-2 ring-[var(--color-gossamer-300)]" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        announcement.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : announcement.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <span>by {announcement.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(announcement.date)}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!announcement.read && (
                      <Badge variant="default" className="bg-[var(--color-gossamer-600)]">
                        New
                      </Badge>
                    )}
                    <Badge
                      variant={
                        announcement.priority === "high"
                          ? "destructive"
                          : announcement.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="flex items-center space-x-1"
                    >
                      {getPriorityIcon(announcement.priority)}
                      <span className="capitalize">{announcement.priority}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4">{announcement.content}</p>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">{announcement.course}</Badge>
                  <div className="flex items-center space-x-2">
                    {!announcement.read && (
                      <Button variant="outline" size="sm">
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredAnnouncements.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  )
}