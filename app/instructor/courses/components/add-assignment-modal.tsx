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
  Command, // Import Command components
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowUpAZ, ArrowDownZA, MessageSquarePlus, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Student = { id: string; name: string }
type AssignmentStatus = "Done" | "Partially Done" | "Not Done"
const ASSIGNMENT_STATUSES: AssignmentStatus[] = ["Done", "Partially Done", "Not Done"]

type AssignmentRecord = {
  studentId: string
  name: string
  status: AssignmentStatus
  comment: string
}

export type AssignmentEntry = {
  id: number | null
  title: string
  item_date: string
  statuses: AssignmentRecord[]
}

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required."),
  item_date: z.string().min(1, "Date is required."),
})

interface AddAssignmentModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: () => void
  groupId: string
  students: Student[]
  editingEntry: AssignmentEntry | null
}

export default function AddAssignmentModal({
  isOpen,
  setIsOpen,
  onSave,
  groupId,
  students,
  editingEntry,
}: AddAssignmentModalProps) {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!editingEntry
  
  // State for multi-step form
  const [step, setStep] = useState(1)

  const [studentStatuses, setStudentStatuses] = useState<AssignmentRecord[]>([])
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
    formState: { errors },
  } = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    mode: "onChange"
  })

  const formValues = watch()
  const title = watch("title") // Watch for dynamic description

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    if (isOpen) {
      let currentStatuses: AssignmentRecord[]
      if (isEditing && editingEntry) {
        reset({ title: editingEntry.title, item_date: editingEntry.item_date })
        currentStatuses = editingEntry.statuses
      } else {
        reset({ title: "", item_date: today })
        currentStatuses = students.map(s => ({
          studentId: s.id,
          name: s.name,
          status: "Done",
          comment: "",
        }))
      }
      setStudentStatuses(currentStatuses)
      // Only set comments visible if they actually exist, otherwise hide by default
      setVisibleComments(new Set(currentStatuses.filter(s => s.comment).map(s => s.studentId)))
      setInitialState(JSON.stringify({ ...watch(), statuses: currentStatuses }))
      setIsDirty(false)
      setSearchTerm("")
      setSortOrder("asc")
      setStep(1) // Always reset to the first step when modal opens
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditing, editingEntry, students, reset])

  useEffect(() => {
    if (!isOpen || !initialState) return
    const currentState = JSON.stringify({ ...formValues, statuses: studentStatuses })
    setIsDirty(currentState !== initialState)
  }, [formValues, studentStatuses, initialState, isOpen])

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
    const isValid = await trigger(["title", "item_date"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };


  const handleInteractOutside = useCallback(
    (e: Event) => {
      if (isDirty) {
        e.preventDefault()
        setShowWarning(true)
      }
    },
    [isDirty],
  )

  const onSubmit = async (formData: z.infer<typeof assignmentSchema>) => {
    setIsSaving(true)
    const payload = {
      p_group_id: Number(groupId),
      p_item_id: isEditing && editingEntry ? editingEntry.id : null,
      p_title: formData.title,
      p_item_date: formData.item_date,
      p_statuses: studentStatuses.map(({ studentId, status, comment }) => ({
        studentId,
        status,
        comment: comment || null,
      })),
    }

    const { error } = await supabase.rpc("upsert_assignment_with_statuses", payload)

    if (error) {
      toast.error(`Failed to save assignment: ${error.message}`)
    } else {
      toast.success(`Assignment "${formData.title}" saved successfully!`)
      onSave()
      handleClose()
    }
    setIsSaving(false)
  }

  const cycleStatus = (studentId: string) => {
    setStudentStatuses(prev =>
      prev.map(s => {
        if (s.studentId === studentId) {
          const currentIndex = ASSIGNMENT_STATUSES.indexOf(s.status)
          const nextIndex = (currentIndex + 1) % ASSIGNMENT_STATUSES.length
          return { ...s, status: ASSIGNMENT_STATUSES[nextIndex] }
        }
        return s
      }),
    )
  }

  const handleCommentChange = (studentId: string, value: string) => {
    setStudentStatuses(prev =>
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
    return studentStatuses
      .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "asc") return a.name.localeCompare(b.name)
        else return b.name.localeCompare(a.name)
      })
  }, [studentStatuses, searchTerm, sortOrder])

  const getStatusBadgeClass = (status: AssignmentStatus) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-800 border-green-200"
      case "Partially Done": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Not Done": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={open => { if (!open) handleAttemptClose() }}>
        <DialogContent
          className="w-[calc(100%-2rem)] sm:w-full max-w-xl p-0 rounded-lg"
          onPointerDownOutside={handleInteractOutside}
          onEscapeKeyDown={handleInteractOutside}
        >
          <div className="mx-auto max-w-full w-full rounded-lg shadow-lg overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border">
            <div className="max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 border-b">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">{isEditing ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>
                      {step === 1 
                        ? "Enter assignment details." 
                        : `Mark student completion status for "${title || 'this assignment'}".`
                      }
                    </span>
                    <span className="font-medium text-xs bg-muted py-1 px-2 rounded-md">Step {step} of 2</span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Removed padding here to allow Command to be modal-wide */}
              <div className="flex-1 overflow-auto min-h-0">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.2 }}
                        className="h-full" // Ensure motion div takes full height
                    >
                        {step === 1 && (
                            // Added padding here for Step 1 content
                            <div className="space-y-6 p-4 sm:p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" {...register("title")} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="item_date">Date</Label>
                                    <Input id="item_date" type="date" max={todayDateString} {...register("item_date")} />
                                    {errors.item_date && <p className="text-sm text-red-500">{errors.item_date.message}</p>}
                                </div>
                            </div>
                        )}
                        
                        {step === 2 && (
                             <div className="flex flex-col h-full"> {/* h-full ensures command list takes remaining height */}
                                {/* Top actions with padding */}
                                <div className="flex flex-col sm:flex-row justify-end items-center gap-2 flex-shrink-0 px-4 sm:px-6 pt-4 pb-4">
                                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}>
                                    {sortOrder === "asc" ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownZA className="mr-2 h-4 w-4" />}
                                    Sort
                                </Button>
                                </div>
                                
                                {/* Command component for modal-wide list */}
                                <Command className="flex-1 min-h-0 rounded-none border-t bg-transparent">
                                  <CommandInput placeholder="Search students..." value={searchTerm} onValueChange={setSearchTerm}/>
                                  <CommandList>
                                    <CommandEmpty>No students found matching your search.</CommandEmpty>
                                    <CommandGroup>
                                        {displayedStudents.map(record => (
                                            <div key={record.studentId} className="border-b last:border-b-0">
                                                <CommandItem
                                                    className="flex items-center justify-between gap-4 !bg-transparent px-3 py-2"
                                                    onSelect={() => { /* This can be used for other actions if needed */ }}
                                                    value={record.name} // for Command's internal filtering, though we use our own
                                                >
                                                    <p className="font-medium truncate flex-1">{record.name}</p>
                                                    <div className="flex items-start gap-2">
                                                        <Badge 
                                                            variant="outline" 
                                                            onClick={(e) => { e.stopPropagation(); cycleStatus(record.studentId); }} 
                                                            className={cn("cursor-pointer select-none text-xs py-1 px-2 h-8 flex items-center", getStatusBadgeClass(record.status))}
                                                        >
                                                            {record.status}
                                                        </Badge>
                                                        <Button 
                                                          type="button" size="icon" 
                                                          variant={record.comment ? "secondary" : "ghost"}
                                                          onClick={(e) => { e.stopPropagation(); toggleCommentVisibility(record.studentId); }} 
                                                          title={record.comment ? "Edit Comment" : "Add Comment"}
                                                          className="h-8 w-8 flex-shrink-0"
                                                        >
                                                            <MessageSquarePlus className="h-4 w-4"/>
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

              <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t">
                 <DialogFooter className="w-full flex flex-col sm:flex-row items-stretch sm:justify-between gap-3 p-4">
                    {/* Back button visible only on step 2 */}
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
                        // Submit form wraps only the save button
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-auto">
                            <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? "Saving..." : "Save Assignment"}
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