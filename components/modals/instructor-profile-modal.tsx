"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

export type InstructorProfile = {
  name: string
  title: string
  bio: string
  avatar: string
  courses: string[]
}

interface InstructorProfileModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  instructor: InstructorProfile | null
}

export default function InstructorProfileModal({ isOpen, setIsOpen, instructor }: InstructorProfileModalProps) {
  if (!instructor) return null

  const initials = instructor.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <Avatar className="h-20 w-20 mb-4">
            {/* NOTE: In a real app, you'd use AvatarImage here with instructor.avatar */}
            <AvatarFallback className="text-2xl bg-gossamer-100 text-gossamer-700">{initials}</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl">{instructor.name}</DialogTitle>
          <DialogDescription>{instructor.title}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <p className="text-sm text-center text-gray-600 leading-relaxed">{instructor.bio}</p>
          <div>
            <h4 className="font-semibold mb-3 flex items-center justify-center text-gray-800">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses Taught
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {instructor.courses.map((course) => (
                <Badge key={course} variant="secondary">
                  {course}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}