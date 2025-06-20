// app/student/courses/[courseId]/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Download,
  MessageSquare,
  Calendar,
  User,
  Lock,
  ArrowRight,
  Percent,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

// Mock data
const courseData = {
  "ict-101": {
    id: "ict-101",
    name: "ICT Fundamentals",
    instructor: "Dr. Sarah Johnson",
    description:
      "Learn the basics of Information and Communication Technology, including computer systems, networks, and digital literacy.",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    duration: "8 weeks",
    difficulty: "Beginner",
    color: "from-blue-500 to-cyan-500",
    gradeBreakdown: [
      { category: "Homework", weight: 20, score: 85 },
      { category: "Quizzes", weight: 30, score: 78 },
      { category: "Mid-term Exam", weight: 20, score: 80 },
      { category: "Final Project", weight: 30, score: 72 },
    ],
    modules: [
      { id: 1, title: "Introduction to ICT", duration: "45 min", completed: true, type: "video" },
      { id: 2, title: "Computer Hardware Basics", duration: "60 min", completed: true, type: "video" },
      { id: 3, title: "Operating Systems Overview", duration: "50 min", completed: true, type: "video" },
      { id: 4, title: "Introduction to Networks", duration: "55 min", completed: true, type: "video" },
      { id: 5, title: "Internet and Web Technologies", duration: "40 min", completed: true, type: "video" },
      { id: 6, title: "Digital Communication Tools", duration: "35 min", completed: true, type: "video" },
      { id: 7, title: "Data Management Principles", duration: "50 min", completed: true, type: "video" },
      { id: 8, title: "Cybersecurity Fundamentals", duration: "45 min", completed: true, type: "video" },
      { id: 9, title: "Software Applications", duration: "40 min", completed: true, type: "video" },
      {
        id: 10,
        title: "Database Design Principles",
        duration: "60 min",
        completed: false,
        type: "video",
        current: true,
      },
      { id: 11, title: "Web Development Basics", duration: "55 min", completed: false, type: "video" },
      { id: 12, title: "ICT Project Management", duration: "50 min", completed: false, type: "video" },
    ],
  },
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId as keyof typeof courseData]

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/student/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  const currentModule = course.modules.find((m) => m.current)

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-10`} />
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{course.name}</CardTitle>
                <CardDescription className="flex items-center mt-2 text-base">
                  <User className="mr-2 h-4 w-4" />
                  {course.instructor}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[var(--color-gossamer-600)]">{course.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center"><Clock className="mr-1 h-4 w-4" />{course.duration}</div>
                <div className="flex items-center"><BookOpen className="mr-1 h-4 w-4" />{course.totalModules} modules</div>
                <Badge variant="outline">{course.difficulty}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Progress</span>
                  <span className="font-medium">{course.completedModules}/{course.totalModules} modules completed</span>
                </div>
                <Progress value={course.progress} className="h-3" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Course Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid gap-4">
              {course.modules.map((module, index) => (
                <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                  <Card className={`${module.current ? "ring-2 ring-[var(--color-gossamer-500)]" : ""} ${module.completed ? "bg-green-50" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${module.completed ? "bg-green-100 text-green-600" : module.current ? "bg-[var(--color-gossamer-100)] text-[var(--color-gossamer-600)]" : "bg-gray-100 text-gray-400"}`}>
                            {module.completed ? <CheckCircle className="h-5 w-5" /> : module.current ? <Play className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${module.current ? "text-[var(--color-gossamer-700)]" : "text-gray-900"}`}>Module {module.id}: {module.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="mr-1 h-4 w-4" />{module.duration}
                              {module.current && <Badge variant="secondary" className="ml-2">Current</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {module.completed && <Button variant="outline" size="sm" asChild><Link href={`/student/courses/${courseId}/modules/${module.id}`}>Review</Link></Button>}
                          {module.current && <Button size="sm" asChild><Link href={`/student/courses/${courseId}/modules/${module.id}`}><Play className="mr-2 h-4 w-4" />Continue</Link></Button>}
                          {!module.completed && !module.current && <Button variant="outline" size="sm" disabled><Lock className="mr-2 h-4 w-4" />Locked</Button>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Percent className="mr-2 h-5 w-5" />Grade Breakdown</CardTitle>
                <CardDescription>See how your overall grade is calculated.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {course.gradeBreakdown.map((item) => (
                    <li key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category} ({item.weight}%)</span>
                        <span className="text-gray-600">Your Avg: {item.score}%</span>
                      </div>
                      <Progress value={item.score} />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t text-right">
                  <p className="text-sm text-gray-600">Overall Grade</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {course.gradeBreakdown.reduce((acc, item) => acc + (item.score * item.weight) / 100, 0).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs Content (Progress, Resources) would be here */}
          <TabsContent value="progress">...</TabsContent>
          <TabsContent value="resources">...</TabsContent>
        </Tabs>
      </motion.div>

      {/* Next Module CTA */}
      {currentModule && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="bg-gradient-to-r from-[var(--color-gossamer-50)] to-[var(--color-gossamer-100)] border-[var(--color-gossamer-200)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--color-gossamer-800)]">Ready to continue?</h3>
                  <p className="text-[var(--color-gossamer-600)] mt-1">Next up: {currentModule.title}</p>
                </div>
                <Button asChild>
                  <Link href={`/student/courses/${courseId}/modules/${currentModule.id}`}>
                    Continue Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}