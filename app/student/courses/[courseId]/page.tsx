"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Percent, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"
import {
  courseDetailsData,
  type CourseDetail,
  type AssignmentDetail,
  type QuizDetail,
} from "@/lib/database"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Custom hook to check for media queries
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)
      if (media.matches !== matches) {
        setMatches(media.matches)
      }
      const listener = () => setMatches(media.matches)
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }
  }, [matches, query])

  return matches
}

// This function returns an object with score, maxScore, and percentage for flexible use.
const parseScore = (item: AssignmentDetail | QuizDetail): {
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
} => {
  let score: number | null = null;
  let maxScore: number | null = null;

  if ("grade" in item && item.grade) {
    const parts = item.grade.split("/");
    if (parts.length === 2) {
      const parsedScore = parseFloat(parts[0]);
      const parsedMaxScore = parseFloat(parts[1]);
      if (!isNaN(parsedScore) && !isNaN(parsedMaxScore)) {
        score = parsedScore;
        maxScore = parsedMaxScore;
      }
    }
  } else if ("score" in item && typeof item.score === 'number' && typeof item.maxScore === 'number') {
    score = item.score;
    maxScore = item.maxScore;
  }

  if (score !== null && maxScore !== null && maxScore > 0) {
    const percentage = (score / maxScore) * 100;
    return { score, maxScore, percentage };
  }

  return { score, maxScore, percentage: null };
};

// Main Component
export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course: CourseDetail | undefined = courseDetailsData[params.courseId]
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
        <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link href="/student/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    )
  }

  const allGradedItems = [
    ...course.assignments.map((a) => ({ ...a, itemType: "Assignment" })),
    ...course.quizzes.map((q) => ({ ...q, itemType: "Quiz" })),
  ].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

  const formatScoreForTable = (item: AssignmentDetail | QuizDetail): string => {
    const { score, maxScore } = parseScore(item)
    if (score !== null && maxScore !== null) {
      return `${score.toFixed(1)} / ${maxScore.toFixed(1)}`
    }
    return "-"
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          href="/student/courses"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Instructor: {course.details.instructor}
        </p>
      </motion.div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="grades">
            <Percent className="w-4 h-4 mr-2" /> Grades
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <CalendarCheck className="w-4 h-4 mr-2" /> Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grades Overview</CardTitle>
              <CardDescription>A summary of your grades for all assignments and quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <Accordion type="single" collapsible className="w-full">
                  {allGradedItems.map((item) => {
                    const { score, maxScore, percentage } = parseScore(item);
                    return (
                      <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger className="py-2 px-1 text-left hover:no-underline">
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-left font-medium">
                              {item.title}
                            </span>
                            <span className="flex-shrink-0 font-semibold text-right">
                              {score !== null ? score.toFixed(1) : "-"}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pr-1 text-sm border-l-2 border-slate-200 pl-4 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                              <p className="text-muted-foreground">Score</p>
                              <p className="font-medium text-foreground">
                                {score !== null && maxScore !== null
                                  ? `${score.toFixed(1)} / ${maxScore.toFixed(1)}`
                                  : "-"}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-muted-foreground">Percentage</p>
                              <p className="font-medium text-foreground">
                                {percentage !== null ? `${percentage.toFixed(1)}%` : "-"}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-muted-foreground">Due Date</p>
                              <p className="font-medium text-foreground">
                                {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allGradedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell
                            className="font-medium max-w-sm truncate"
                            title={item.title}
                          >
                            {item.title}
                          </TableCell>
                          <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">{formatScoreForTable(item)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>Your attendance for this course.</CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                // FIX START: Replaced the accordion with a clean, readable list.
                // The `divide-y` utility adds a border between each list item automatically.
                <div className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                  {course.attendance.map((att) => (
                    // Each record is a flex container, pushing the date and badge to opposite ends.
                    <div key={att.id} className="flex items-center justify-between py-3">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(att.date).toLocaleDateString()}
                      </p>
                      <Badge
                        variant={
                          att.status === "Present"
                            ? "default"
                            : att.status === "Tardy"
                              ? "secondary"
                              : "destructive"
                        }
                        className={att.status === 'Present' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {att.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                // FIX END
              ) : (
                <div className="overflow-x-auto rounded-md border">
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
                          <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                att.status === "Present"
                                  ? "default"
                                  : att.status === "Tardy"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={att.status === 'Present' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {att.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}