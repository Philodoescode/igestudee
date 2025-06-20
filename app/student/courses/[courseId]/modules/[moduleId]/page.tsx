"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Download,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

// Mock data
const moduleData = {
  "ict-101": {
    10: {
      id: 10,
      title: "Database Design Principles",
      description:
        "Learn the fundamental concepts of database design, including entity-relationship modeling, normalization, and best practices for creating efficient database structures.",
      duration: "60 min",
      videoUrl: "https://example.com/video",
      practicalUrl: "https://youtube.com/watch?v=example",
      completed: false,
      resources: [
        { name: "Database Design Slides", type: "pdf", size: "2.5 MB" },
        { name: "ER Diagram Examples", type: "pdf", size: "1.8 MB" },
        { name: "Practice Problems", type: "pdf", size: "1.2 MB" },
      ],
      nextModule: 11,
      prevModule: 9,
    },
  },
}

export default function ModuleViewPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const moduleId = Number.parseInt(params.moduleId as string)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(3600) // 60 minutes in seconds
  const [showPractical, setShowPractical] = useState(false)

  const module = moduleData[courseId as keyof typeof moduleData]?.[moduleId]

  if (!module) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
        <p className="text-gray-600 mb-6">The module you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href={`/student/courses/${courseId}`}>Back to Course</Link>
        </Button>
      </div>
    )
  }

  const progressPercent = (currentTime / duration) * 100

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button variant="outline" asChild>
          <Link href={`/student/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          {module.prevModule && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/student/courses/${courseId}/modules/${module.prevModule}`}>
                <SkipBack className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {module.nextModule && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/student/courses/${courseId}/modules/${module.nextModule}`}>
                <SkipForward className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Module {module.id}: {module.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base">{module.description}</CardDescription>
              </div>
              <Badge variant={module.completed ? "default" : "secondary"}>
                {module.completed ? "Completed" : "In Progress"}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
              <span>Duration: {module.duration}</span>
              <span>•</span>
              <span>Video Lecture + Practical Tutorial</span>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  {showPractical ? "Practical Tutorial" : "Video Lecture"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={!showPractical ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPractical(false)}
                  >
                    Lecture
                  </Button>
                  <Button
                    variant={showPractical ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPractical(true)}
                  >
                    Practical
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Video Player Placeholder */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="mx-auto h-16 w-16 mb-4 opacity-80" />
                    <p className="text-lg font-medium">
                      {showPractical ? "Practical Tutorial Video" : "Lecture Video"}
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      {showPractical ? "Hands-on exercises and examples" : "Theoretical concepts and explanations"}
                    </p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-2">
                    <Progress value={progressPercent} className="h-1" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <span className="text-white text-sm">
                          {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")} /{" "}
                          {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {showPractical && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Practical Tutorial</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This tutorial includes hands-on exercises to practice database design concepts. Follow along
                        with the instructor to create your own database schemas.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href={module.practicalUrl} target="_blank" rel="noopener noreferrer">
                          Open in YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Module Completion */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Mark as Complete</h3>
                  <p className="text-sm text-gray-600 mt-1">Have you finished watching this module?</p>
                </div>
                <Button className="bg-[var(--color-gossamer-600)] hover:bg-[var(--color-gossamer-700)]">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Module
                </Button>
              </div>
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
          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Resources
              </CardTitle>
              <CardDescription>Downloadable materials for this module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {module.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{resource.name}</h4>
                    <p className="text-xs text-gray-600">
                      {resource.type.toUpperCase()} • {resource.size}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Discussion
              </CardTitle>
              <CardDescription>Ask questions and get help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Having trouble with this module? Join the discussion forum to ask questions and get help from
                  instructors and fellow students.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/student/forum/${courseId}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Discussion
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Module Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {module.prevModule && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/student/courses/${courseId}/modules/${module.prevModule}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Module
                  </Link>
                </Button>
              )}
              {module.nextModule && (
                <Button className="w-full justify-start" asChild>
                  <Link href={`/student/courses/${courseId}/modules/${module.nextModule}`}>
                    Next Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
