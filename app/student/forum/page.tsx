"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Plus, TrendingUp, Pin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { studentCourseForums, studentRecentForumTopics } from "@/lib/database"

export default function ForumHomePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredForums = studentCourseForums.filter(
    (forum) =>
      forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
            <p className="text-gray-600 mt-1">Connect with classmates and instructors</p>
          </div>
          <Button asChild>
            <Link href="/student/forum/create">
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search forums and topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Forums */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Course Forums</CardTitle>
              <CardDescription>Join discussions for your enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredForums.map((forum, index) => (
                <motion.div
                  key={forum.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${forum.color} flex items-center justify-center`}
                          >
                            <MessageSquare className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{forum.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{forum.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/student/forum/${forum.id}`}>
                            View Forum
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-[var(--color-gossamer-600)]">{forum.totalTopics}</div>
                          <div className="text-xs text-gray-600">Topics</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{forum.totalPosts}</div>
                          <div className="text-xs text-gray-600">Posts</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{forum.participants}</div>
                          <div className="text-xs text-gray-600">Members</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{forum.lastActivity}</div>
                          <div className="text-xs text-gray-600">Last Activity</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Recent Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Recent Topics
              </CardTitle>
              <CardDescription>Latest discussions across all forums</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentRecentForumTopics.map((topic) => (
                <div key={topic.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {topic.isPinned && <Pin className="h-3 w-3 text-[var(--color-gossamer-600)]" />}
                      {topic.isHot && (
                        <Badge variant="destructive" className="text-xs">
                          Hot
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{topic.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>by {topic.author}</span>
                    <span>{topic.replies} replies</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {topic.course}
                    </Badge>
                    <span className="text-xs text-gray-500">{topic.lastReply}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Forum Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Forum Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-gossamer-600)]">144</div>
                <div className="text-sm text-gray-600">Total Topics</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">835</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">85</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}