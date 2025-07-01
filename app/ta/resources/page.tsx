"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { taResourceData } from "@/lib/database"
import { redirect } from "next/navigation"

export default function TAResourcesPage() {
  redirect('/under-construction');
  const { user, isLoading } = useRequireAuth(["ta"])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-600 mt-1">Access video links and other resources to assist students.</p>
        </div>
      </motion.div>

      {/* Resource List */}
      <div className="space-y-8">
        {taResourceData.subjects.map((subject, subjectIndex) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (subjectIndex + 1) }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  {subject.name}
                </CardTitle>
                <CardDescription>A collection of helpful videos for {subject.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.videos.map(video => (
                    <Card key={video.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div>
                          <div className="aspect-video bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                            <Video className="h-10 w-10 text-gray-400" />
                          </div>
                          <h4 className="font-semibold text-gray-800">{video.title}</h4>
                        </div>
                        <Button asChild variant="outline" size="sm" className="w-full mt-4">
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            Watch Video <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}