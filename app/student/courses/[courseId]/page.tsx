// app/student/courses/[courseId]/page.tsx
"use client"

import { notFound, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { courseDetailsData, type AssignmentDetail, type QuizDetail, type AttendanceDetail } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  PlayCircle,
  User,
  Bell,
  Lock,
  Percent,
  ChevronLeft,
  XCircle,
  Clock,
  Mail,
  Construction, // Added for under construction icon
} from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"

// A responsive circular progress bar.
const CircularProgress = ({ value }: { value: number }) => (
  <div className="relative h-24 w-24 md:h-32 md:w-32">
    <svg className="h-full w-full" viewBox="0 0 100 100">
      <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
      <motion.circle
        className="text-emerald-500"
        strokeWidth="8"
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="42"
        cx="50"
        cy="50"
        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - value / 100) }}
        transition={{ duration: 1.5, ease: "circOut" }}
        style={{ strokeDasharray: 2 * Math.PI * 42 }}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800 md:text-2xl">
      <AnimatedCounter end={value} suffix="%" />
    </div>
  </div>
)

// A shared icon component to display status.
const StatusIcon = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case "graded":
    case "submitted":
    case "passed":
    case "present":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "missing":
    case "failed":
    case "absent":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "late":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return null
  }
}

export default function StudentCoursePage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const course = courseDetailsData[params.courseId]

  if (!course) {
    notFound()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  // Component for "Under Construction" message
  const UnderConstructionMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <Construction className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Content Under Construction</h3>
      <p className="text-base">We're working hard to bring you this content. Please check back soon!</p>
    </div>
  );


  return (
    <motion.div className="space-y-6 md:space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="overflow-hidden rounded-t-2xl md:rounded-t-3xl">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-4 pb-20 text-white md:p-8 md:pb-24">
            <div className="flex items-center gap-x-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {course.group}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-base text-emerald-100 md:text-lg">
              Course progress until end of {course.endMonth}. Let's keep up the great work!
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </motion.div>

      {/* Progress Stats */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 -mt-16 grid grid-cols-1 gap-4 px-4 md:-mt-20 md:grid-cols-3 md:gap-6 lg:px-0"
      >
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Assignments</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-4 pt-0 md:p-6 md:pt-0">
            <CircularProgress value={course.progress.assignmentsCompleted} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Quizzes Passed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 pt-2 md:p-6 md:pt-4">
            <div className="text-4xl font-bold text-emerald-600 md:text-5xl">
              <AnimatedCounter end={course.progress.quizzesPassed[0]} /> / {course.progress.quizzesPassed[1]}
            </div>
            <p className="mt-2 text-sm text-gray-500 md:text-base">Total Quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 pt-2 md:p-6 md:pt-4">
            <div className="text-4xl font-bold text-emerald-600 md:text-5xl">
              <AnimatedCounter end={course.progress.attendanceRate} suffix="%" />
            </div>
            <p className="mt-2 text-sm text-gray-500 md:text-base">Attendance Rate</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-3 lg:gap-8 lg:px-0">
        <div className="lg:col-span-2">
          <Tabs defaultValue="syllabus">
            {/* Responsive tab list: 2x2 on mobile, 1x4 on larger screens */}
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            {/* SYLLABUS TAB - MODIFIED */}
            <TabsContent value="syllabus" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                    Course Syllabus & Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UnderConstructionMessage /> {/* Display under construction message */}
                  {/* Original Accordion content commented out for demonstration:
                  <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {course.videos.map((video, index) => (
                      <AccordionItem value={`item-${index}`} key={video.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-4 text-left">
                            <div
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                video.locked ? "bg-gray-100" : "bg-emerald-100"
                              }`}
                            >
                              {video.locked ? (
                                <Lock className="h-4 w-4 text-gray-400" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-emerald-500" />
                              )}
                            </div>
                            <span className={`font-medium ${video.locked ? "text-gray-500" : "text-gray-800"}`}>
                              {video.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pl-12">
                            <p className="text-gray-600">{video.description}</p>
                            <Button variant="default" size="sm" disabled={video.locked}>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Watch Video
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* REFACTOR: Assignments now uses a card list on mobile and a table on desktop */}
            <TabsContent value="assignments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  <div className="space-y-4 md:hidden">
                    {course.assignments.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-card p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                            <div className="flex items-center space-x-2 pt-1 text-sm font-medium">
                              <StatusIcon status={item.status} />
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-muted-foreground">Grade</p>
                            <p className="font-bold text-lg">{item.grade || "–"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.assignments.map((item: AssignmentDetail) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.dueDate}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                              <StatusIcon status={item.status} /> <span className="capitalize">{item.status}</span>
                            </TableCell>
                            <TableCell>{item.grade || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REFACTOR: Quizzes now uses a card list on mobile and a table on desktop */}
            <TabsContent value="quizzes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-emerald-600" />
                    Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  <div className="space-y-4 md:hidden">
                    {course.quizzes.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-card p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Date: {item.date}</p>
                            <div className="flex items-center space-x-2 pt-1 text-sm font-medium">
                              <StatusIcon status={item.status} />
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-bold text-lg">{item.score || "–"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.quizzes.map((item: QuizDetail) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                              <StatusIcon status={item.status} /> <span className="capitalize">{item.status}</span>
                            </TableCell>
                            <TableCell>{item.score || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REFACTOR: Attendance now uses a card list on mobile and a table on desktop */}
            <TabsContent value="attendance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                    Attendance Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  <div className="space-y-4 md:hidden">
                    {course.attendance.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-card p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{item.date}</p>
                          <div className="flex items-center space-x-2 text-sm font-medium">
                            <StatusIcon status={item.status} />
                            <span className="capitalize">{item.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.attendance.map((item: AttendanceDetail) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                              <StatusIcon status={item.status} /> <span className="capitalize">{item.status}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold">Instructor</p>
                    <p className="text-sm text-gray-600">{course.details.instructor}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold">Teaching Assistant (TA)</p>
                    <p className="text-sm text-gray-600">{course.details.ta}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-semibold">TA Contact</p>
                    <p className="text-sm text-gray-600">{course.details.contact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ANNOUNCEMENTS CARD - MODIFIED */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <UnderConstructionMessage /> {/* Display under construction message */}
                {/* Original Announcements list commented out for demonstration:
                <ul className="space-y-4">
                  {course.announcements.map((ann) => (
                    <li key={ann.id} className="flex items-start space-x-3">
                      <Bell className="h-4 w-4 mt-1 flex-shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-medium text-sm">{ann.title}</p>
                        <p className="text-xs text-gray-500">{ann.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}