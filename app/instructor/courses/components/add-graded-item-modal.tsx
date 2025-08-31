"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Loader2 } from "lucide-react"
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

  const [studentScores, setStudentScores] = useState<StudentScoreRecord[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid: isFormValid },
  } = useForm<z.infer<typeof gradedItemSchema>>({
    resolver: zodResolver(gradedItemSchema),
    mode: "onChange",
  })

  const maxMark = watch("max_score")

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    if (isOpen) {
      if (isEditing) {
        reset({
          title: editingEntry.title,
          max_score: editingEntry.max_score,
          item_date: editingEntry.item_date,
        })
        setStudentScores(editingEntry.scores)
      } else {
        reset({ title: "", max_score: 100, item_date: today })
        setStudentScores(students.map(s => ({ studentId: s.id, name: s.name, score: "", comment: "" })))
      }
    }
  }, [isOpen, isEditing, editingEntry, students, reset])

  const todayDateString = useMemo(() => new Date().toISOString().split("T")[0], [])

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...studentScores]
    newScores[index].score = value
    setStudentScores(newScores)
  }
  
  const handleCommentChange = (index: number, value: string) => {
    const newScores = [...studentScores];
    newScores[index].comment = value;
    setStudentScores(newScores);
  };

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
    const errors: { [index: number]: string } = {}
    studentScores.forEach((s, i) => {
      if (s.score === "") return
      const scoreNum = parseFloat(s.score)
      if (isNaN(scoreNum)) errors[i] = "Invalid number"
      else if (scoreNum < 0) errors[i] = "Score cannot be negative"
      else if (scoreNum > maxMark) errors[i] = `Score cannot exceed ${maxMark}`
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
      setIsOpen(false)
    }
    setIsSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Graded Item" : "Add New Graded Item"}</DialogTitle>
          <DialogDescription>
             {isEditing ? "Update the details and scores for this item." : "Define the item and enter student scores."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8 pt-4">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    <Button type="button" variant="outline" size="sm" onClick={copyFirstToAll}>Copy First to All</Button>
                    <Button type="button" variant="outline" size="sm" onClick={clearAllScores}>Clear All Scores</Button>
                </div>
            </div>
          </div>

          {/* Right Column: Student Scores */}
          <div className="space-y-3">
            <Label>Student Scores</Label>
            <ScrollArea className="h-96 w-full rounded-md border p-2">
              <div className="space-y-3">
                {studentScores.map((record, index) => (
                  <div key={record.studentId} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{record.name}</span>
                       <div className="w-28">
                        <Input
                          type="number"
                          step="0.5"
                          placeholder={`/ ${maxMark || '...'}`}
                          value={record.score}
                          onChange={(e) => handleScoreChange(index, e.target.value)}
                          className={cn("text-right", scoreErrors[index] && "border-red-500 focus-visible:ring-red-500")}
                        />
                       </div>
                    </div>
                    {scoreErrors[index] && <p className="text-xs text-red-500 text-right">{scoreErrors[index]}</p>}
                    <Textarea 
                        placeholder="Optional comment..." 
                        className="text-sm"
                        value={record.comment}
                        onChange={(e) => handleCommentChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSaveDisabled}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}