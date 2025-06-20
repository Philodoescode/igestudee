"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BookOpen, Clock, Play, Search, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

// Mock data
const courses = [
  {
    id: "ict-101",
    name: "ICT Fundamentals",
    instructor: "Dr. Sarah Johnson",
    description:
      "Learn the basics of Information and Communication Technology, including computer systems, networks, and digital literacy.",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    nextModule: "Database Design Principles",
    duration: "8 weeks",
    difficulty: "Beginner",
    color: "from-blue-500 to-cyan-500",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "math-201",
    name: "Advanced Mathematics",
    instructor: "Prof. Michael Chen",
    description: "Explore advanced mathematical concepts including calculus, linear algebra, and statistical analysis.",
    progress: 60,
    totalModules: 15,
    completedModules: 9,
    nextModule: "Calculus Applications",
    duration: "12 weeks",
    difficulty: "Advanced",
    color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "physics-101",
    name: "Physics Fundamentals",
    instructor: "Dr. Emily Rodriguez",
    description:
      "Understand the fundamental principles of physics including mechanics, thermodynamics, and electromagnetism.",
    progress: 40,
    totalModules: 10,
    completedModules: 4,
    nextModule: "Newton's Laws of Motion",
    duration: "10 weeks",
    difficulty: "Intermediate",
    color: "from-purple-500 to-pink-500",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "chemistry-101",
    name: "Chemistry Basics",
    instructor: "Dr. James Wilson",
    description: "Introduction to chemical principles, atomic structure, and molecular interactions.",
    progress: 20,
    totalModules: 8,
    completedModules: 2,
    nextModule: "Atomic Structure",
    duration: "6 weeks",
    difficulty: "Beginner",
    color: "from-green-500 to-emerald-500",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty.toLowerCase() === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">Manage and continue your enrolled courses</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-gossamer-600)]">{courses.length}</div>
            <div className="text-sm text-gray-500">Enrolled Courses</div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("all")}
          >
            All
          </Button>
          <Button
            variant={selectedDifficulty === "beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("intermediate")}
          >
            Intermediate
          </Button>
          <Button
            variant={selectedDifficulty === "advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("advanced")}
          >
            Advanced
          </Button>
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${course.color} text-white text-sm font-medium`}
                >
                  {course.progress}%
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <User className="mr-1 h-4 w-4" />
                      {course.instructor}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{course.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {course.completedModules}/{course.totalModules} modules
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4" />
                    {course.totalModules} modules
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Next:</strong> {course.nextModule}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/student/courses/${course.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Continue
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/forum/${course.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredCourses.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  )
}
