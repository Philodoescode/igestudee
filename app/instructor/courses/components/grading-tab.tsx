"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { GradingEntry } from "@/lib/database"
import type { Group } from "@/types/course"

import AddGradeModal from "./add-grade-modal"
import GradingHistory from "./grading-history"

interface GradingTabContentProps {
  group: Group & { courseId: string }
}

export default function GradingTabContent({ group }: GradingTabContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [history, setHistory] = useState<GradingEntry[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchGrades = useCallback(async () => {
    if (!group?.id) return

    setIsLoading(true)
    const { data, error } = await supabase.rpc("get_group_attendance_and_grades", {
      p_group_id: Number(group.id),
    })

    if (error) {
      toast.error("Failed to load grades.")
      console.error(error)
      setHistory([])
    } else if (data) {
      // Normalize payload shape: RPC might return [{ grades: [...] }] or { grades: [...] }
      const payload: any = Array.isArray(data) ? data[0] : data
      const raw: any[] = Array.isArray(payload.grades) ? payload.grades : []

      // Determine if already nested under `scores`
      let transformedHistory: GradingEntry[]
      if (raw.length > 0 && Array.isArray(raw[0].scores)) {
        // Already nested
        transformedHistory = raw.map((assignment: any) => ({
          id: String(assignment.assignment_id),
          title: assignment.title,
          date: assignment.created_at
            ? new Date(assignment.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          maxScore: assignment.max_score,
          studentGrades: assignment.scores.map((s: any) => ({
            studentId: String(s.student_id ?? s.studentId),
            name: s.name,
            grade: s.score ?? s.grade,
          })),
        }))
      } else {
        // Flat rows: group by assignment_id
        const map: Record<string, { info: any; scores: any[] }> = {}
        raw.forEach(row => {
          const key = String(row.assignment_id)
          if (!map[key]) {
            map[key] = {
              info: {
                assignment_id: row.assignment_id,
                title: row.title,
                created_at: row.created_at,
                max_score: row.max_score,
              },
              scores: [],
            }
          }
          map[key].scores.push({
            studentId: String(row.student_id),
            name: row.name,
            grade: row.score,
          })
        })
        transformedHistory = Object.values(map).map(({ info, scores }) => ({
          id: String(info.assignment_id),
          title: info.title,
          date: info.created_at
            ? new Date(info.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          maxScore: info.max_score,
          studentGrades: scores,
        }))
      }

      setHistory(transformedHistory)
    }
    setIsLoading(false)
  }, [group?.id, supabase])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  const handleSaveSuccess = () => {
    setIsModalOpen(false)
    fetchGrades()
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">New Grading Entry</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click here to add a new set of grades for your students.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add New Grade
        </Button>
      </motion.div>

      <GradingHistory history={history} />

      <AddGradeModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        group={group}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  )
}
