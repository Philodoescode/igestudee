// courses/components/add-graded-item-modal.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion" // Import for multi-step animation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Loader2,
  Search,
  ArrowUpAZ,
  ArrowDownZA,
  MessageSquarePlus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react" // Add ArrowLeft, ArrowRight for navigation
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Student = { id: string; name: string }
type StudentScoreRecord = {
  studentId: string
  name: string
  score: string
  comment: string
}

export type GradedItemEntry = {
  id: number | null
  title: string
  max_score: number
  item_date: string
  scores: StudentScoreRecord[]
}

const gradedItemSchema = z.object({
  title: z.string().min(1, "Title is required."),
  max_score: z.coerce
    .number({ invalid_type_error: "Max mark must be a number." })
    .positive("Max mark must be greater than 0."),
  item_date: z.string().min(1, "Date is required."),
})

interface AddGradedItemModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: () => void
  groupId: string
  students: Student[]
  editingEntry: GradedItemEntry | null
}

export default function AddGradedItemModal({
  isOpen,
  setIsOpen,
  onSave,
  groupId,
  students,
  editingEntry,
}: AddGradedItemModalProps) {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!editingEntry

  // State for multi-step form
  const [step, setStep] = useState(1)

  const [studentScores, setStudentScores] = useState<StudentScoreRecord[]>([])
  const [initialState, setInitialState] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger, // Get trigger function to validate fields on demand
    formState: { errors, isValid: isFormValid },
  } = useForm<z.infer<typeof gradedItemSchema>>({
    resolver: zodResolver(gradedItemSchema),
    mode: "onChange",
  })

  const formValues = watch()
  const maxMark = watch("max_score")

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    if (isOpen) {
      let currentScores: StudentScoreRecord[]
      if (isEditing) {
        reset({
          title: editingEntry.title,
          max_score: editingEntry.max_score,
          item_date: editingEntry.item_date,
        })
        currentScores = editingEntry.scores
      } else {
        reset({ title: "", max_score: 100, item_date: today })
        currentScores = students.map(s => ({ studentId: s.id, name: s.name, score: "", comment: "" }))
      }
      setStudentScores(currentScores)
      setVisibleComments(new Set(currentScores.filter(s => s.comment).map(s => s.studentId)))
      setInitialState(JSON.stringify({ ...watch(), scores: currentScores }))
      setIsDirty(false)
      setSearchTerm("")
      setSortOrder("asc")
      setStep(1) // Always reset to the first step when modal opens
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditing, editingEntry, students, reset])

  useEffect(() => {
    if (!isOpen || !initialState) return
    const currentState = JSON.stringify({ ...formValues, scores: studentScores })
    setIsDirty(currentState !== initialState)
  }, [formValues, studentScores, initialState, isOpen])

  const todayDateString = useMemo(() => new Date().toISOString().split("T")[0], [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setShowWarning(false)
    setIsDirty(false)
  }, [setIsOpen])

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowWarning(true)
    } else {
      handleClose()
    }
  }, [isDirty, handleClose])

  // Navigation handlers for multi-step form
  const handleNext = async () => {
    // Validate all fields in step 1
    const isValid = await trigger(["title", "max_score", "item_date"])
    if (isValid) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleInteractOutside = useCallback(
    (e: Event) => {
      if (isDirty) {
        e.preventDefault()
        setShowWarning(true)
      }
    },
    [isDirty],
  )

  const handleScoreChange = (studentId: string, value: string) => {
    setStudentScores(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, score: value } : s)),
    )
  }

  const handleCommentChange = (studentId: string, value: string) => {
    setStudentScores(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, comment: value } : s)),
    )
  }

  const toggleCommentVisibility = (studentId: string) => {
    setVisibleComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) newSet.delete(studentId)
      else newSet.add(studentId)
      return newSet
    })
  }

  const copyFirstToAll = () => {
    if (studentScores.length > 0) {
      const firstScore = studentScores[0].score
      setStudentScores(studentScores.map(s => ({ ...s, score: firstScore })))
    }
  }

  const clearAllScores = () => {
    setStudentScores(studentScores.map(s => ({ ...s, score: "", comment: "" })))
  }

  const scoreErrors = useMemo(() => {
    const errors: { [studentId: string]: string } = {}
    studentScores.forEach(s => {
      if (s.score === "") return
      const scoreNum = parseFloat(s.score)
      if (isNaN(scoreNum)) errors[s.studentId] = "Invalid number"
      else if (scoreNum < 0) errors[s.studentId] = "Score cannot be negative"
      else if (scoreNum > maxMark) errors[s.studentId] = `Score cannot exceed ${maxMark}`
    })
    return errors
  }, [studentScores, maxMark])

  const isSaveDisabled = isSaving || !isFormValid || Object.keys(scoreErrors).length > 0

  const onSubmit = async (formData: z.infer<typeof gradedItemSchema>) => {
    setIsSaving(true)
    const payload = {
      p_group_id: Number(groupId),
      p_item_id: isEditing ? editingEntry.id : null,
      p_title: formData.title,
      p_max_mark: formData.max_score,
      p_item_date: formData.item_date,
      p_scores: studentScores.map(({ studentId, score, comment }) => ({
        studentId,
        score: score === "" ? null : parseFloat(score),
        comment: comment || null,
      })),
    }

    const { error } = await supabase.rpc("upsert_graded_item_with_scores", payload)

    if (error) {
      toast.error(`Failed to save: ${error.message}`)
    } else {
      toast.success(`"${formData.title}" saved successfully!`)
      onSave()
      handleClose()
    }
    setIsSaving(false)
  }

  const displayedStudents = useMemo(() => {
    return studentScores
      .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "asc") return a.name.localeCompare(b.name)
        else return b.name.localeCompare(a.name)
      })
  }, [studentScores, searchTerm, sortOrder])

  // Animation variants for step transitions
  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) handleAttemptClose()
        }}
      >
        <DialogContent
          className="w-[calc(100%-2rem)] sm:w-full max-w-xl p-0 rounded-lg"
          onPointerDownOutside={handleInteractOutside}
          onEscapeKeyDown={handleInteractOutside}
        >
          <div className="mx-auto max-w-full w-full rounded-lg shadow-lg overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border">
            <div className="max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 border-b">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">
                    {isEditing ? "Edit Graded Item" : "Add New Graded Item"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>
                      {step === 1 ? "Define the item's details." : "Enter student scores and comments."}
                    </span>
                    <span className="font-medium text-xs bg-muted py-1 px-2 rounded-md">
                      Step {step} of 2
                    </span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" {...register("title")} />
                          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="max_score">Max Mark</Label>
                            <Input id="max_score" type="number" step="0.5" {...register("max_score")} />
                            {errors.max_score && <p className="text-sm text-red-500">{errors.max_score.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item_date">Date</Label>
                            <Input id="item_date" type="date" max={todayDateString} {...register("item_date")} />
                            {errors.item_date && <p className="text-sm text-red-500">{errors.item_date.message}</p>}
                          </div>
                        </div>
                        <div className="space-y-2 pt-4">
                          <h4 className="font-medium">Bulk Actions</h4>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={copyFirstToAll}>
                              Copy First to All
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={clearAllScores}>
                              Clear All Scores
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search students..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="pl-10 w-full"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
                          >
                            {sortOrder === "asc" ? (
                              <ArrowUpAZ className="mr-2 h-4 w-4" />
                            ) : (
                              <ArrowDownZA className="mr-2 h-4 w-4" />
                            )}
                            Sort
                          </Button>
                        </div>
                        <ScrollArea className="w-full rounded-md border p-2 flex-grow overflow-auto max-h-[50vh] md:max-h-96">
                          <div className="space-y-3">
                            {displayedStudents.map(record => (
                              <div key={record.studentId} className="space-y-2 rounded-md border p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-sm block truncate">
                                      {record.name}
                                    </span>
                                  </div>
                                  <div className="w-28">
                                    <Input
                                      type="number"
                                      step="0.5"
                                      placeholder={`/ ${maxMark || "..."}`}
                                      value={record.score}
                                      onChange={e => handleScoreChange(record.studentId, e.target.value)}
                                      className={cn(
                                        "text-right",
                                        scoreErrors[record.studentId] &&
                                          "border-red-500 focus-visible:ring-red-500",
                                      )}
                                    />
                                  </div>
                                </div>
                                {scoreErrors[record.studentId] && (
                                  <p className="text-xs text-red-500 text-right">
                                    {scoreErrors[record.studentId]}
                                  </p>
                                )}
                                {visibleComments.has(record.studentId) ? (
                                  <Textarea
                                    placeholder="Optional comment..."
                                    className="text-sm mt-2"
                                    value={record.comment}
                                    onChange={e => handleCommentChange(record.studentId, e.target.value)}
                                    rows={3}
                                  />
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 text-muted-foreground w-full justify-start px-2 h-8"
                                    onClick={() => toggleCommentVisibility(record.studentId)}
                                  >
                                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                                    {record.comment ? "Edit Comment" : "Add Comment"}
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t">
                <DialogFooter>
                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:justify-between gap-3 p-4">
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleAttemptClose}>
                      Cancel
                    </Button>

                    {step === 1 && (
                      <Button type="button" className="w-full sm:w-auto" onClick={handleNext}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={handleBack}>
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto" onClick={handleSubmit(onSubmit)} disabled={isSaveDisabled}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSaving ? "Saving..." : "Save Item"}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogFooter>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them and close the dialog?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose} className="bg-destructive hover:bg-destructive/90">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}