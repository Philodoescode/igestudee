"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Search, Filter, Clock, User, Pin, Lock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { taForumData } from "@/lib/database"

export default function TAForumPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  if (isLoading) {
    return <div>Loading...</div>
  }

  const filteredQuestions = taForumData.recentQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.student.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || question.course === selectedCourse
    const matchesStatus = statusFilter === "all" || question.status === statusFilter

    return matchesSearch && matchesCourse && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unanswered":
        return "destructive"
      case "answered":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">Discussion Forum</h1>
            <p className="text-gray-600 mt-1">Moderate discussions and help students with their questions.</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Moderator Access
          </Badge>
        </div>
      </motion.div>

      {/* Course Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {taForumData.courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{course.name}</span>
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Topics</span>
                  <Badge variant="outline">{course.totalTopics}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unanswered</span>
                  <Badge variant={course.unansweredQuestions > 0 ? "destructive" : "secondary"}>
                    {course.unansweredQuestions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-xs text-gray-500">{course.recentActivity}</span>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href={`/ta/forum/${course.id}`}>View Forum</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search questions or students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {taForumData.courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {question.isPinned && <Pin className="h-4 w-4 text-purple-600" />}
                      {question.isLocked && <Lock className="h-4 w-4 text-gray-600" />}
                      <h4 className="font-medium text-gray-900">{question.title}</h4>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {question.course}
                      </Badge>
                      <Badge variant={getStatusColor(question.status)} className="text-xs">
                        {question.status}
                      </Badge>
                      <Badge variant={getPriorityColor(question.priority)} className="text-xs">
                        {question.priority} priority
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{question.student}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{question.timeAgo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{question.replies} replies</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {question.status === "unanswered" && (
                      <Button size="sm" variant="outline">
                        Answer
                      </Button>
                    )}
                    {question.status === "answered" && (
                      <Button size="sm" variant="outline">
                        Mark Resolved
                      </Button>
                    )}
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/ta/forum/question/${question.id}`}>View</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}