"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Info, User, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type CourseInfo = {
  id: number
  name: string
  instructor: string
  group_name: string
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<CourseInfo[]>([])
  const [filteredCourses, setFilteredCourses] = useState<CourseInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.rpc('get_student_courses')
      
      if (error) {
        console.error("Error fetching student courses:", error)
      } else if (data) {
        setCourses(data)
        setFilteredCourses(data)
      }
      setIsLoading(false)
    }
    fetchCourses()
  }, [supabase])

  useEffect(() => {
    const results = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(results);
  }, [searchTerm, courses]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold font-poppins text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Continue your learning journey and track your progress.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative flex-1"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search courses or instructors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      <div className="space-y-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex flex-col md:flex-row overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gossamer-300 transition-colors duration-300">
                <div className="md:w-1/3 bg-gradient-to-br from-gossamer-800 to-gossamer-900 text-white p-6 flex flex-col">
                  <div className="flex-grow">
                    <p className="text-xs uppercase font-semibold text-gossamer-300 tracking-wider">Course</p>
                    <h2 className="text-2xl font-bold mt-2 leading-tight">{course.name}</h2>
                  </div>
                </div>

                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gossamer-500" />
                      <span className="text-sm text-gray-600">{course.group_name}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gossamer-500" />
                      <span className="text-sm text-gray-600">{course.instructor}</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 items-center">
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
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No courses found.</p>
          </div>
        )}
      </div>
    </div>
  )
}