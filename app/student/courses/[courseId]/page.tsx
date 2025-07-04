// app/student/courses/[courseId]/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// MODIFIED: Accordion components imported, Calendar icon removed
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Mail,
  Video,
  TrendingUp,
  Info,
  User,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseDetailsData, type CourseDetail, type AssignmentDetail, type QuizDetail } from "@/lib/database"
import { notFound } from "next/navigation"
// MODIFIED: Imported more hooks for media query
import { useMemo, useState, useRef, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// NEW: A simple hook to detect screen size for responsive rendering
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}


// Helper function to calculate overall grade
const calculateOverallGrade = (course: CourseDetail) => {
  const gradedAssignments = course.assignments.filter((a) => a.grade !== null)
  const gradedQuizzes = course.quizzes.filter((q) => q.score !== null)

  if (gradedAssignments.length === 0 && gradedQuizzes.length === 0) {
    return null
  }

  let totalAssignmentScore = 0
  gradedAssignments.forEach((a) => {
    const [score, max] = a.grade!.split("/").map(Number)
    totalAssignmentScore += (score / max) * 100
  })
  const avgAssignmentGrade = gradedAssignments.length > 0 ? totalAssignmentScore / gradedAssignments.length : 0

  let totalQuizScore = 0
  gradedQuizzes.forEach((q) => {
    totalQuizScore += (q.score! / q.maxScore) * 100
  })
  const avgQuizGrade = gradedQuizzes.length > 0 ? totalQuizScore / gradedQuizzes.length : 0

  if (gradedAssignments.length > 0 && gradedQuizzes.length > 0) {
    return Math.round(avgAssignmentGrade * 0.6 + avgQuizGrade * 0.4)
  }
  if (gradedAssignments.length > 0) return Math.round(avgAssignmentGrade)
  if (gradedQuizzes.length > 0) return Math.round(avgQuizGrade)

  return null
}

// Component for displaying grade/score or status
const GradeDisplay = ({
  item,
}: {
  item: (AssignmentDetail & { type: "Assignment" }) | (QuizDetail & { type: "Quiz" })
}) => {
  if (item.type === "Assignment") {
    if (item.grade) {
      return <span className="font-mono">{item.grade}</span>
    }
  } else {
    if (item.score !== null) {
      return (
        <span className="font-mono">
          {item.score} / {item.maxScore}
        </span>
      )
    }
  }

  switch (item.status) {
    case "Submitted":
    case "Needs Grading":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Pending
        </Badge>
      )
    case "Late":
      return <Badge variant="destructive">Late</Badge>
    case "Missing":
      return <Badge variant="destructive">Missing</Badge>
    case "Pending":
      return <Badge variant="outline">Not Taken</Badge>
    default:
      return <Badge variant="outline">Not Available</Badge>
  }
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = courseDetailsData[params.courseId]
  const isMobile = useMediaQuery("(max-width: 768px)")

  const tabsListRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkArrows = useCallback(() => {
    const el = tabsListRef.current
    if (el) {
      const isOverflowing = el.scrollWidth > el.clientWidth
      setShowLeftArrow(isOverflowing && el.scrollLeft > 5)
      setShowRightArrow(isOverflowing && el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
    }
  }, [])

  useEffect(() => {
    const el = tabsListRef.current
    if (el) {
      checkArrows()
      el.addEventListener("scroll", checkArrows, { passive: true })
      window.addEventListener("resize", checkArrows)

      return () => {
        el.removeEventListener("scroll", checkArrows)
        window.removeEventListener("resize", checkArrows)
      }
    }
  }, [checkArrows, course])

  const handleScroll = (direction: "left" | "right") => {
    const el = tabsListRef.current
    if (el) {
      const scrollAmount = direction === "left" ? -200 : 200
      el.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (!course) {
    notFound()
  }

  const overallGrade = useMemo(() => calculateOverallGrade(course), [course])

  const combinedGrades = useMemo(() => {
    const assignments = course.assignments.map((a) => ({ ...a, type: "Assignment" as const, date: new Date(a.dueDate) }))
    const quizzes = course.quizzes.map((q) => ({ ...q, type: "Quiz" as const, date: new Date(q.dueDate) }))
    return [...assignments, ...quizzes].sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [course])

  // REMOVED: upcomingDeadlines useMemo hook is no longer needed

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-1">Instructor: {course.details.instructor}</p>
      </motion.div>

      {/* MODIFIED: Grid changed to md:grid-cols-2 and Upcoming Deadlines card removed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white/90">
                <TrendingUp className="h-5 w-5" /> Overall Grade
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-5xl font-bold">{overallGrade !== null ? `${overallGrade}%` : "N/A"}</p>
              <p className="text-sm text-white/80 mt-1">
                {overallGrade !== null ? "Current calculated grade" : "No graded items yet"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5 text-purple-500" /> Teaching Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold">{course.details.ta}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${course.details.contact}`} className="hover:underline">
                  {course.details.contact}
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <div className="relative">
          {/* MODIFIED: Added 'hide-scrollbar' class */}
          <TabsList
            ref={tabsListRef}
            className="w-full justify-start overflow-x-auto border-b sm:justify-center hide-scrollbar"
          >
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <AnimatePresence>
            {showLeftArrow && (
              <motion.div
                key="left-arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-0 h-full flex items-center bg-gradient-to-r from-background from-50% to-transparent pointer-events-none"
              >
                <Button
                  variant="ghost"
                  className="h-full rounded-none px-2 pointer-events-auto"
                  onClick={() => handleScroll("left")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
            
            {showRightArrow && (
              <motion.div
                key="right-arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-background from-50% to-transparent pointer-events-none"
              >
                <Button
                  variant="ghost"
                  className="h-full rounded-none px-2 pointer-events-auto"
                  onClick={() => handleScroll("right")}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ... Other TabsContent ... */}

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grades Overview</CardTitle>
              <CardDescription>A combined list of your assignments and quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* MODIFIED: Conditionally render Table or Accordion */}
              {isMobile ? (
                <Accordion type="single" collapsible className="w-full">
                  {combinedGrades.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger>
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-medium text-left truncate">{item.title}</span>
                          <div className="flex-shrink-0 ml-4">
                            <GradeDisplay item={item} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm text-muted-foreground pl-2 border-l-2 ml-2">
                          <li className="flex justify-between">
                            <span className="font-semibold">Type:</span>
                            <Badge variant={item.type === "Assignment" ? "default" : "secondary"}>{item.type}</Badge>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-semibold">Due Date:</span>
                            <span>{format(item.date, "MMM dd, yyyy")}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-semibold">Graded By:</span>
                            <span>{item.gradedBy || 'N/A'}</span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Graded By</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combinedGrades.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === "Assignment" ? "default" : "secondary"}>{item.type}</Badge>
                        </TableCell>
                        <TableCell>{format(item.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{item.gradedBy}</TableCell>
                        <TableCell className="text-right">
                          <GradeDisplay item={item} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ... Other TabsContent ... */}
        <TabsContent value="videos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Lectures</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.videos.map((video) => (
                <Card key={video.id} className="flex items-center p-4 gap-4">
                  <div className={cn("p-2 rounded-lg", video.locked ? "bg-gray-200" : "bg-emerald-100")}>
                    {video.locked ? (
                      <Lock className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ExternalLink className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={cn("font-semibold", video.locked ? "text-gray-500" : "")}>{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.attendance.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>{format(new Date(att.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            att.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : att.status === "Absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {att.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="announcements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.announcements.map((ann) => (
                <div key={ann.id} className="p-4 border rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">{ann.title}</p>
                    <p className="text-sm text-gray-500">{format(new Date(ann.date), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Course details here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}