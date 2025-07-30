"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { studentDetailedCourses, courseDetailsData } from "@/lib/database"
import { Search, Calendar, Info } from "lucide-react"
import InstructorProfileModal from "@/components/modals/instructor-profile-modal"
import type { InstructorProfile } from "@/components/modals/instructor-profile-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock instructor profiles as needed
const MOCK_INSTRUCTOR_PROFILES: { [key: string]: InstructorProfile } = {
  "Dr. Sarah Johnson": {
    name: "Dr. Sarah Johnson",
    title: "Lead ICT Instructor",
    bio: "With over 10 years of experience in computer science education, Dr. Johnson specializes in web development and database management. She is passionate about making complex topics accessible and engaging for all students.",
    avatar: "/placeholder.svg",
    courses: ["ICT Fundamentals", "Web Development Basics", "Introduction to Python"],
  },
  "Prof. Michael Chen": {
    name: "Prof. Michael Chen",
    title: "Lead Mathematics Instructor",
    bio: "Prof. Chen holds a Ph.D. in Applied Mathematics and has been teaching for over 15 years. His research focuses on statistical modeling and he enjoys helping students build strong analytical skills.",
    avatar: "/placeholder.svg",
    courses: ["Advanced Mathematics", "Statistics and Probability"],
  },
}

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorProfile | null>(null)

  const handleViewInstructor = (instructorName: string) => {
    const profile = MOCK_INSTRUCTOR_PROFILES[instructorName]
    if (profile) {
      setSelectedInstructor(profile)
      setIsModalOpen(true)
    }
  }

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
              </div>

              {/* Right Panel */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-gossamer-500" />
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">{course.group}</span>
                  </div>
                  {courseDetailsData[course.id] && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gossamer-500" />
                      <span className="text-sm text-gray-600">{courseDetailsData[course.id].endMonth} session</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-4 items-center">
                  <button
                    onClick={() => handleViewInstructor(course.instructor)}
                    className="bg-transparent p-0 text-sm font-semibold text-gossamer-600 hover:text-gossamer-700 transition-colors duration-200"
                  >
                    {course.instructor}
                  </button>
                  <Button
                    asChild
                    className="bg-gossamer-800 hover:bg-gossamer-900 rounded-full px-8 text-base font-semibold"
                  >
                    <Link href={`/student/courses/${course.id}`}>Enter</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedInstructor && (
        <InstructorProfileModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          instructor={selectedInstructor}
        />
      )}
    </div>
  )
}
