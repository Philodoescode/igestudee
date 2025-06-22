"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { studentDetailedCourses } from "@/lib/database"
import { ArrowRight, ListFilter, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")

  const filteredCourses = studentDetailedCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "All" || course.instructor === filter
    return matchesSearch && matchesFilter
  })

  const instructors = ["All", ...Array.from(new Set(studentDetailedCourses.map((c) => c.instructor)))]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold font-poppins text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Continue your learning journey and track your progress.</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter by Instructor
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Instructors</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {instructors.map((instructor) => (
              <DropdownMenuItem key={instructor} onSelect={() => setFilter(instructor)}>
                {instructor}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Courses List */}
      <div className="space-y-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex flex-col md:flex-row overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gossamer-300 transition-colors duration-300">
              {/* Left Panel */}
              <div className="md:w-1/3 bg-gradient-to-br from-gossamer-800 to-gossamer-900 text-white p-6 flex flex-col">
                <div className="flex-grow">
                  <p className="text-xs uppercase font-semibold text-gossamer-300 tracking-wider">Course</p>
                  <h2 className="text-2xl font-bold mt-2 leading-tight">{course.name}</h2>
                </div>
                <Link
                  href="#"
                  className="text-sm text-gossamer-300 hover:text-white transition-colors flex items-center group mt-4"
                >
                  View all chapters
                  <ArrowRight className="h-4 w-4 ml-1.5 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Right Panel */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                {/* Chapter Title and Progress aligned */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                      Chapter {course.currentChapter}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mt-2">
                      {course.currentChapterTitle}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <Progress
                      value={(course.completedChallenges / course.totalChallenges) * 100}
                      className="w-24 sm:w-32 h-1.5 bg-gray-200 [&>div]:bg-gossamer-600"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      {course.completedChallenges}/{course.totalChallenges} Challenges
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    asChild
                    className="bg-gossamer-800 hover:bg-gossamer-900 rounded-full px-8 text-base font-semibold"
                  >
                    <Link href={`/student/courses/${course.id}`}>Continue</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
