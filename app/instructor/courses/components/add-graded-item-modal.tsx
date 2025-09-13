// courses/components/add-graded-item-modal.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  ArrowUpAZ,
  ArrowDownZA,
  MessageSquarePlus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
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
    trigger,
    formState: { errors },
  } = useForm<z.infer<typeof gradedItemSchema>>({
    resolver: zodResolver(gradedItemSchema),
    mode: "onChange",
  })

  const formValues = watch()
  const title = watch("title")
  const maxMark = watch("max_score")

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    if (isOpen) {
      let currentScores: StudentScoreRecord[]
      if (isEditing && editingEntry) {
        reset({
          title: editingEntry.title,
          max_score: editingEntry.max_score,
          item_date: editingEntry.item_date,
        })
        currentScores = editingEntry.scores
      } else {
        reset({ title: "", max_score: 100, item_date: today })
        currentScores = students.map(s => ({
          studentId: s.id,
          name: s.name,
          score: "",
          comment: "",
        }))
      }
      setStudentScores(currentScores)
      setVisibleComments(new Set())
      setInitialState(JSON.stringify({ ...watch(), scores: currentScores }))
      setIsDirty(false)
      setSearchTerm("")
      setSortOrder("asc")
      setStep(1)
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

  const handleNext = async () => {
    const isValid = await trigger(["title", "max_score", "item_date"])
    if (isValid) {
      setStep(2)
    }
  }

  const handleBack = () => setStep(1)

  const handleInteractOutside = useCallback((e: Event) => {
    if (isDirty) {
      e.preventDefault()
      setShowWarning(true)
    }
  }, [isDirty])

  const handleScoreChange = (studentId: string, value: string) => {
    const numericRegex = /^[0-9]*\.?[0-9]*$/
    if (numericRegex.test(value)) {
      setStudentScores(prev =>
        prev.map(s => (s.studentId === studentId ? { ...s, score: value } : s)),
      )
    }
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

  const displayedStudents = useMemo(() => {
    return studentScores
      .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
  }, [studentScores, searchTerm, sortOrder])

  const getVisibleStudentIds = useCallback(() => new Set(displayedStudents.map(s => s.studentId)), [displayedStudents])

  const copyFirstToAll = () => {
    if (displayedStudents.length > 0) {
      const firstScore = displayedStudents[0].score
      if (firstScore === "") {
        toast.warning("First visible student has no score to copy.")
        return
      }
      const visibleIds = getVisibleStudentIds()
      setStudentScores(prev =>
        prev.map(s => (visibleIds.has(s.studentId) ? { ...s, score: firstScore } : s)),
      )
      toast.success(`Copied "${firstScore}" to ${visibleIds.size} students.`)
    }
  }

  const clearAllScores = () => {
    const visibleIds = getVisibleStudentIds()
    if (visibleIds.size === 0) return toast.warning("No students visible to clear.")

    setStudentScores(prev =>
      prev.map(s => (visibleIds.has(s.studentId) ? { ...s, score: "", comment: "" } : s)),
    )
    toast.success(`Cleared scores for ${visibleIds.size} students.`)
    setVisibleComments(new Set())
  }

  const scoreErrors = useMemo(() => {
    const errors: { [studentId: string]: string } = {}
    studentScores.forEach(s => {
      if (s.score === "" || s.score === ".") return // Also ignore a lone decimal
      const scoreNum = parseFloat(s.score)
      if (isNaN(scoreNum)) errors[s.studentId] = "Invalid"
      else if (scoreNum < 0) errors[s.studentId] = ">= 0"
      else if (scoreNum > maxMark) errors[s.studentId] = `Max: ${maxMark}`
    })
    return errors
  }, [studentScores, maxMark])

  const isSaveDisabled = isSaving || Object.keys(errors).length > 0 || Object.keys(scoreErrors).length > 0

  const onSubmit = async (formData: z.infer<typeof gradedItemSchema>) => {
    if (Object.keys(scoreErrors).length > 0) return
    setIsSaving(true)
    const payload = {
      p_group_id: Number(groupId),
      p_item_id: isEditing && editingEntry ? editingEntry.id : null,
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

  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={open => !open && handleAttemptClose()}>
        <DialogContent
          className="w-[calc(100%-2rem)] sm:w-full max-w-xl p-0 rounded-lg"
          onPointerDownOutside={handleInteractOutside}
          onEscapeKeyDown={handleInteractOutside}
        >
          <div className="mx-auto w-full rounded-lg shadow-lg overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border">
            <div className="max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 border-b">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">{isEditing ? "Edit Graded Item" : "Add Graded Item"}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>
                      {step === 1
                        ? "Define the item's details."
                        : `Enter student scores for "${title || "this item"}" out of ${maxMark || 0}.`}
                    </span>
                    <span className="font-medium text-xs bg-muted py-1 px-2 rounded-md">Step {step} of 2</span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="flex-1 overflow-auto min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial="hidden" animate="visible" exit="exit"
                    variants={variants} transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {step === 1 && (
                      <div className="space-y-6 p-4 sm:p-6">
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
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col h-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 flex-shrink-0 px-4 sm:px-6 pt-4 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Bulk:</span>
                            <Button type="button" variant="outline" size="sm" onClick={copyFirstToAll}>Copy First</Button>
                            <Button type="button" variant="outline" size="sm" onClick={clearAllScores}>Clear All</Button>
                          </div>
                          <Button
                            type="button" variant="outline" size="sm"
                            onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
                          >
                            {sortOrder === "asc" ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownZA className="mr-2 h-4 w-4" />}
                            Sort
                          </Button>
                        </div>

                        <Command className="flex-1 min-h-0 rounded-none border-t bg-transparent">
                          <CommandInput placeholder="Search students..." value={searchTerm} onValueChange={setSearchTerm} />
                          <CommandList>
                            <CommandEmpty>No students found matching your search.</CommandEmpty>
                            <CommandGroup>
                              {displayedStudents.map(record => (
                                <div key={record.studentId} className="border-b last:border-b-0">
                                  <CommandItem
                                    className="flex items-center justify-between gap-4 !bg-transparent px-3 py-2"
                                    onSelect={() => { }} value={record.name}
                                  >
                                    <p className="font-medium truncate flex-1">{record.name}</p>
                                    <div className="flex items-start gap-2">
                                      <div className="w-24">
                                        <Input
                                          type="text"
                                          inputMode="decimal"
                                          placeholder={`/ ${maxMark}`}
                                          value={record.score}
                                          onClick={e => e.stopPropagation()}
                                          onChange={e => handleScoreChange(record.studentId, e.target.value)}
                                          className={cn("text-right h-9", scoreErrors[record.studentId] && "border-red-500 focus-visible:ring-red-500")}
                                        />
                                        {scoreErrors[record.studentId] && (
                                          <p className="text-xs text-red-500 text-right pt-1">{scoreErrors[record.studentId]}</p>
                                        )}
                                      </div>
                                      <Button
                                        type="button" size="icon"
                                        variant={record.comment ? "secondary" : "ghost"}
                                        onClick={(e) => { e.stopPropagation(); toggleCommentVisibility(record.studentId); }}
                                        title={record.comment ? "Edit Comment" : "Add Comment"}
                                        className="h-9 w-9 flex-shrink-0"
                                      >
                                        <MessageSquarePlus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CommandItem>
                                  <AnimatePresence>
                                    {visibleComments.has(record.studentId) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-3 pb-3 pt-1">
                                          <Textarea
                                            placeholder="Optional comment..." value={record.comment}
                                            onChange={e => handleCommentChange(record.studentId, e.target.value)}
                                          />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t">
                {/* FIX: Restructured the footer to isolate the form submission */}
                <DialogFooter className="w-full flex flex-col sm:flex-row items-stretch sm:justify-between gap-3 p-4">
                  {step === 2 ? (
                      <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    ) : (
                      // Empty div to keep the right button aligned to the right on step 1
                      <div className="hidden sm:block" />
                  )}
                  
                  {step === 1 ? (
                    <Button type="button" className="w-full sm:w-auto" onClick={handleNext}>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-auto">
                      <Button type="submit" className="w-full sm:w-auto" disabled={isSaveDisabled}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </form>
                  )}
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
            <AlertDialogDescription>You have unsaved changes. Are you sure you want to discard them?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose} className="bg-destructive hover:bg-destructive/90">Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}