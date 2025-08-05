"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { TAttendanceSession, TAttendanceRecord } from "@/types/attendance"
import type { Group } from "@/types/course"
import AddAttendanceModal from "./add-attendance-modal"
import AttendanceHistory from "./attendance-history"

interface ParentGroup extends Group {
  courseName: string
}

export default function AttendanceTabContent({ group }: { group: ParentGroup }) {
  const [sessions, setSessions] = useState<TAttendanceSession[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<TAttendanceSession | null>(null)
  const supabase = createClient()

  const fetchAttendance = useCallback(async () => {
    if (!group?.id) return
    setIsLoading(true)

    const { data, error } = await supabase.rpc("get_group_attendance_and_grades", { p_group_id: Number(group.id) })

    if (error) {
      toast.error("Failed to load attendance data.")
      console.error(error)
      setSessions([])
    } else if (data) {
      // Determine whether the RPC returned nested sessions or flat rows
      const raw: any[] = Array.isArray(data.attendance) ? data.attendance : Array.isArray(data) ? data : []
      let transformedData: TAttendanceSession[]

      if (raw.length > 0 && raw[0].records !== undefined) {
        // Already nested
        transformedData = raw.map((att: any, idx: number) => ({
          id: `${att.date}-${idx}`,
          date: att.date,
          records: att.records as TAttendanceRecord[],
        }))
      } else {
        // Flat rows: group by date
        const sessionsMap = raw.reduce<Record<string, TAttendanceRecord[]>>((acc, row: any) => {
          const date = row.date
          if (!acc[date]) acc[date] = []
          acc[date].push({
            studentId: String(row.student_id),
            name:
              group.students.find(s => s.id === String(row.student_id))?.name ??
              "Unknown",
            status: row.status as "Present" | "Absent" | "Tardy",
          })
          return acc
        }, {})

        transformedData = Object.entries(sessionsMap).map(([date, records], idx) => ({
          id: `${date}-${idx}`,
          date,
          records,
        }))
      }

      // Sort descending by date
      setSessions(
        transformedData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      )
    }
    setIsLoading(false)
  }, [group?.id, group.students, supabase])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  const handleSaveSession = async (session: TAttendanceSession) => {
    const isEditing = sessions?.some(s => s.id === session.id)

    const { error } = await supabase.rpc("add_bulk_attendance", {
      p_group_id: Number(group.id),
      p_date: session.date,
      p_records: session.records.map(r => ({ student_id: r.studentId, status: r.status })),
    })

    if (error) {
      toast.error(`Failed to save attendance: ${error.message}`)
    } else {
      toast.success(
        `Attendance for ${new Date(
          session.date + "T00:00:00"
        ).toLocaleDateString()} ${isEditing ? "updated" : "saved"} successfully!`
      )
      await fetchAttendance()
    }

    setEditingSession(null)
    setIsModalOpen(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => (prev || []).filter(s => s.id !== sessionId))
    toast.error("Attendance record has been deleted.")
  }

  const handleEditSession = (session: TAttendanceSession) => {
    setEditingSession(session)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingSession(null)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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

      <AttendanceHistory history={sessions || []} onEdit={handleEditSession} onDelete={handleDeleteSession} />

      <AddAttendanceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={handleSaveSession}
        students={group.students}
        editingSession={editingSession}
      />
    </div>
  )
}
