// courses/components/add-assignment-modal.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
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

  const [studentStatuses, setStudentStatuses] = useState<AssignmentRecord[]>([])
  const [initialState, setInitialState] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  })

  const formValues = watch()

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    if (isOpen) {
      let currentStatuses: AssignmentRecord[];
      if (isEditing) {
        reset({ title: editingEntry.title, item_date: editingEntry.item_date })
        currentStatuses = editingEntry.statuses
        setStudentStatuses(currentStatuses)
      } else {
        reset({ title: "", item_date: today })
        currentStatuses = students.map(s => ({
            studentId: s.id,
            name: s.name,
            status: "Done",
            comment: "",
          }))
        setStudentStatuses(currentStatuses)
      }
      setInitialState(JSON.stringify({ ...watch(), statuses: currentStatuses }))
      setIsDirty(false)
    }
  }, [isOpen, isEditing, editingEntry, students, reset, watch])
  
  useEffect(() => {
    if (!isOpen || !initialState) return;
    const currentState = JSON.stringify({ ...formValues, statuses: studentStatuses });
    setIsDirty(currentState !== initialState);
  }, [formValues, studentStatuses, initialState, isOpen])

  const todayDateString = useMemo(() => new Date().toISOString().split("T")[0], [])
  
  const handleClose = useCallback(() => {
      setIsOpen(false)
      setShowWarning(false)
      setIsDirty(false)
  }, [setIsOpen]);

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowWarning(true);
    } else {
      handleClose();
    }
  }, [isDirty, handleClose]);

  const handleInteractOutside = useCallback((e: Event) => {
    if (isDirty) {
      e.preventDefault();
      setShowWarning(true);
    }
  }, [isDirty]);


  const onSubmit = async (formData: z.infer<typeof assignmentSchema>) => {
    setIsSaving(true)

    const payload = {
      p_group_id: Number(groupId),
      p_item_id: isEditing ? editingEntry.id : null,
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

  const getStatusBadgeClass = (status: AssignmentStatus) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 border-green-200"
      case "Partially Done":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Not Done":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleAttemptClose()}>
      <DialogContent 
          className="max-w-3xl"
          onPointerDownOutside={handleInteractOutside}
          onEscapeKeyDown={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details and student statuses for this assignment." : "Enter assignment details and mark student completion status."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item_date">Date</Label>
              <Input
                id="item_date"
                type="date"
                max={todayDateString}
                {...register("item_date")}
              />
              {errors.item_date && (
                <p className="text-sm text-red-500">{errors.item_date.message}</p>
              )}
            </div>
          </div>

          {/* Right Column: Student Statuses */}
          <div className="space-y-3">
            <Label>Student Statuses</Label>
            <ScrollArea className="h-96 w-full rounded-md border p-2">
              <div className="space-y-3">
                {studentStatuses.map((record, index) => (
                  <div key={record.studentId} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{record.name}</span>
                      <Badge
                        variant="outline"
                        onClick={() => cycleStatus(record.studentId)}
                        className={cn("cursor-pointer select-none", getStatusBadgeClass(record.status))}
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <Textarea
                      placeholder="Optional comment..."
                      className="text-sm"
                      value={record.comment}
                      onChange={e =>
                        setStudentStatuses(prev => {
                          const newStatuses = [...prev]
                          newStatuses[index].comment = e.target.value
                          return newStatuses
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleAttemptClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Assignment"}
          </Button>
        </DialogFooter>
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
                <AlertDialogAction onClick={handleClose} className="bg-destructive hover:bg-destructive/90">Discard</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}