// app/ta/courses/components/attendance-tab.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { taAttendancePageData } from "@/lib/database"
import type { TAttendanceSession, TAttendanceGroup } from "@/types/attendance"
import type { TaGroup } from "@/types/course"
import AddAttendanceModal from "./add-attendance-modal"
import AttendanceHistory from "./attendance-history"

// The group object passed from the parent. We assume it has `courseName` based on its usage in the parent.
interface ParentGroup extends TaGroup {
  courseName: string
}

export default function AttendanceTabContent({ group }: { group: ParentGroup }) {
  // The state is now initialized with a function to handle new groups.
  // It is guaranteed to be a TAttendanceGroup object, not undefined.
  const [groupData, setGroupData] = useState<TAttendanceGroup>(() => {
    const existingData = taAttendancePageData.groups.find((g) => g.id === group.id)
    if (existingData) {
      return existingData
    }
    // For new groups, create a default structure. This is the fix.
    return {
      id: group.id,
      name: group.groupName,
      course: group.courseName,
      studentCount: group.students.length,
      students: group.students,
      sessions: [],
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<TAttendanceSession | null>(null)

  const handleSaveSession = (session: TAttendanceSession) => {
    setGroupData((prevGroup) => {
      // This logic now works because prevGroup is never undefined.
      const sessionExists = prevGroup.sessions.some((s) => s.id === session.id)
      let updatedSessions

      if (sessionExists) {
        updatedSessions = prevGroup.sessions.map((s) => (s.id === session.id ? session : s))
        toast.success(`Attendance for ${new Date(session.date + "T00:00:00").toLocaleDateString()} updated successfully!`)
      } else {
        updatedSessions = [session, ...prevGroup.sessions]
        toast.success(`Attendance for ${new Date(session.date + "T00:00:00").toLocaleDateString()} saved successfully!`)
      }

      updatedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return { ...prevGroup, sessions: updatedSessions }
    })
    setEditingSession(null)
    setIsModalOpen(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    setGroupData((prevGroup) => {
      const updatedSessions = prevGroup.sessions.filter((s) => s.id !== sessionId)
      toast.error("Attendance record has been deleted.")
      return { ...prevGroup, sessions: updatedSessions }
    })
  }

  const handleEditSession = (session: TAttendanceSession) => {
    setEditingSession(session)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingSession(null)
    setIsModalOpen(true)
  }

  // The `if (!groupData)` check is now removed because groupData is never undefined.
  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">New Attendance Entry</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click here to add a new attendance record for your students.
          </p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add New Attendance
        </Button>
      </motion.div>

      <AttendanceHistory history={groupData.sessions} onEdit={handleEditSession} onDelete={handleDeleteSession} />

      <AddAttendanceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={handleSaveSession}
        students={groupData.students}
        editingSession={editingSession}
      />
    </div>
  )
}