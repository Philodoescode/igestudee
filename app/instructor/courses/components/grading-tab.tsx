// app/ta/courses/components/grading-tab.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { taGradingHistory, type GradingEntry } from "@/lib/database"

import AddGradeModal from "./add-grade-modal"
import GradingHistory from "./grading-history"

export default function GradingTabContent({ courseId }: { courseId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [history, setHistory] = useState<GradingEntry[]>(taGradingHistory)

  const handleSaveNewGrade = (newEntry: GradingEntry) => {
    // Add new entry to the top of the history list
    setHistory(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setIsModalOpen(false)
    toast.success(`Grades for "${newEntry.title}" saved successfully!`)
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
        courseId={courseId}
      />
    </div>
  )
}