// app/parent/progress/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  BarChart3,
  FileText,
  Percent,
} from "lucide-react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { parentProgressData } from "@/lib/database"

export default function ChildProgressPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
      case "on time":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "missing":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const TrendGraph = () => (
    <div className="h-20 w-full bg-gray-50 rounded-lg flex items-end p-2">
      <div className="w-full h-full flex items-end space-x-2">
        {[4, 5, 5, 6, 7, 8, 7, 9].map((height, i) => (
          <div key={i} className="w-full bg-emerald-200 rounded-t-sm" style={{ height: `${height * 10}%` }}></div>
        ))}
      </div>
    </div>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Academic Progress</h1>
          <p className="text-blue-100 text-lg">Detailed view of grades, assignments, and reports for Emma Johnson</p>
        </div>
      </motion.div>

      <Tabs defaultValue="ict" className="space-y-6">
        <TabsList>
          {parentProgressData.courses.map((course) => (
            <TabsTrigger key={course.id} value={course.id}>
              {course.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {parentProgressData.courses.map((course) => (
          <TabsContent key={course.id} value={course.id} className="space-y-6">
            {/* Grade Overview */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                    Overall Grade & Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                    <p className="text-6xl font-bold text-emerald-600">{course.overallGrade}</p>
                    <p className="text-lg font-medium text-gray-700">Overall Grade</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-medium mb-2">Performance Trend (Semester)</p>
                    <TrendGraph />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Grade Breakdown */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-emerald-600" />
                    Grade Breakdown
                  </CardTitle>
                  <CardDescription>How the overall grade is calculated.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {course.gradeBreakdown.map((item) => (
                      <li key={item.category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">
                            {item.category} ({item.weight}%)
                          </span>
                          <span className="text-gray-600">Avg. Score: {item.score}%</span>
                        </div>
                        <Progress value={item.score} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Assignments & Assessments */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                    Assignments & Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Assignments</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.assignments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.grade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <h3 className="font-semibold mt-6 mb-2">Assessments</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Class Average</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.assessments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>
                            {item.score}/{item.total} ({Math.round((item.score / item.total) * 100)}%)
                          </TableCell>
                          <TableCell>{item.classAvg}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* Official Reports */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                    Official Reports
                  </CardTitle>
                  <CardDescription>Download official academic documents.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Term 1 Report Card (PDF)
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Mid-Term Progress Report (PDF)
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  )
}