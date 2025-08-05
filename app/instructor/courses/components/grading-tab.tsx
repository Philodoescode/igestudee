// app/ta/courses/components/grading-tab.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { GradingEntry } from "@/lib/database"
import type { Group } from "@/types/course"

import AddGradeModal from "./add-grade-modal"
import GradingHistory from "./grading-history"

// FIX: The component needs the full group object to get its ID for fetching data.
interface GradingTabContentProps {
  group: Group & { courseId: string };
}

export default function GradingTabContent({ group }: GradingTabContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // FIX: History state starts as undefined to indicate a loading state.
  const [history, setHistory] = useState<GradingEntry[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // FIX: Fetch data when the component mounts or the group ID changes.
  useEffect(() => {
    const fetchGrades = async () => {
      if (!group?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .rpc('get_group_attendance_and_grades', { p_group_id: Number(group.id) })
      
      if (error) {
        toast.error("Failed to load grades.")
        console.error(error)
        setHistory([]) // Set to empty array on error to avoid crashes
      } else if (data) {
        // Transform the RPC response to the GradingEntry[] format the UI expects.
        const transformedHistory: GradingEntry[] = (data.grades || []).map((assignment: any) => ({
          id: String(assignment.assignment_id),
          title: assignment.title,
          // NOTE: The RPC doesn't have a date for the assignment. Using a placeholder.
          // You might want to add `created_at` to your `assignments` table and RPC response.
          date: new Date().toISOString().split('T')[0],
          maxScore: assignment.max_score,
          studentGrades: (assignment.scores || []).map((score: any) => ({
            studentId: score.studentId,
            name: score.name,
            grade: score.score,
          })),
        }))
        setHistory(transformedHistory)
      }
      setIsLoading(false)
    }

    fetchGrades()
  }, [group?.id, supabase])

  const handleSaveNewGrade = (newEntry: GradingEntry) => {
    setHistory(prev => [newEntry, ...(prev || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setIsModalOpen(false)
    toast.success(`Grades for "${newEntry.title}" saved successfully!`)
  }

  // FIX: Add a loading indicator while fetching data.
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Click here to add a new set of grades for your students.</p>
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
        onSave={handleSaveNewGrade}
        courseId={group.courseId}
      />
    </div>
  )
}