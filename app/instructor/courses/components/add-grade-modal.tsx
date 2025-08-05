// FILE: courses/components/add-grade-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { type Group } from "@/types/course"
import { type GradingEntry } from "@/lib/database"
import { cn } from "@/lib/utils"

type StudentScore = {
  student_id: string;
  name: string;
  score: number | null;
}

interface AddGradeModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  group: Group
  onSaveSuccess: () => void
  editingEntry: GradingEntry | null
}

export default function AddGradeModal({ isOpen, setIsOpen, group, onSaveSuccess, editingEntry }: AddGradeModalProps) {
  const supabase = createClient()
  const isEditing = !!editingEntry;

  const [step, setStep] = useState(1)
  
  // State for both create and edit
  const [title, setTitle] = useState("")
  const [maxScore, setMaxScore] = useState<number | ''>(100)
  const [errors, setErrors] = useState<{ title?: string; maxScore?: string }>({})
  const [studentScores, setStudentScores] = useState<StudentScore[]>([])
  const [assignmentId, setAssignmentId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(editingEntry.title)
        setMaxScore(editingEntry.maxScore)
        setAssignmentId(Number(editingEntry.id))
        setErrors({})
        
        const scoresMap = new Map(editingEntry.studentGrades.map(sg => [sg.studentId, sg.grade]));
        setStudentScores(group.students.map(s => ({
            student_id: s.id,
            name: s.name,
            score: scoresMap.has(s.id) ? scoresMap.get(s.id) : null,
        })));

      } else {
        // Reset for create mode
        setStep(1)
        setTitle("")
        setMaxScore(100)
        setErrors({})
        setAssignmentId(null)
        setStudentScores(group.students.map(s => ({ student_id: s.id, name: s.name, score: null })))
      }
    }
  }, [isOpen, group, editingEntry, isEditing])

  const validateStep1 = () => {
    const newErrors: { title?: string; maxScore?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required."
    if (maxScore === "" || Number(maxScore) <= 0) newErrors.maxScore = "Max score must be a positive number."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- CREATE FLOW ---
  const handleNext = async () => {
    if (!validateStep1()) return;

    setIsSaving(true)
    const { data, error } = await supabase.rpc('create_grading_assignment', {
      p_group_id: Number(group.id),
      p_title: title,
      p_max_score: Number(maxScore),
    })
    setIsSaving(false)

    if (error) {
      toast.error(`Failed to create assignment: ${error.message}`)
    } else {
      setAssignmentId(data)
      setStep(2)
    }
  }

  const handleCreate = async () => {
    if (!assignmentId) {
        toast.error("Cannot save grades without a valid assignment.");
        return;
    }

    const gradesToSubmit = studentScores.map(s => ({ student_id: s.student_id, score: s.score }));
    
    if (studentScores.some(s => s.score !== null && s.score > Number(maxScore))) {
        toast.error("One or more grades are higher than the max score.");
        return;
    }

    setIsSaving(true);
    const { error } = await supabase.rpc('submit_bulk_grades', {
      p_assignment_id: assignmentId,
      p_grades: gradesToSubmit,
    });
    setIsSaving(false);

    if (error) {
        toast.error(`Failed to save grades: ${error.message}`);
    } else {
        toast.success("Grades have been saved successfully!");
        onSaveSuccess();
    }
  }
  // --- END CREATE FLOW ---

  // --- EDIT FLOW ---
  const handleUpdate = async () => {
    if (!validateStep1()) return;
    if (!assignmentId) {
      toast.error("Assignment ID is missing. Cannot update.");
      return;
    }
    if (studentScores.some(s => s.score !== null && s.score > Number(maxScore))) {
        toast.error("One or more grades are higher than the max score.");
        return;
    }

    const gradesToSubmit = studentScores.map(s => ({ student_id: s.student_id, score: s.score }));
    
    setIsSaving(true);
    const { error } = await supabase.rpc('update_assignment_and_grades', {
      p_assignment_id: assignmentId,
      p_title: title,
      p_max_score: Number(maxScore),
      p_grades: gradesToSubmit,
    });
    setIsSaving(false);

    if (error) {
        toast.error(`Failed to update grades: ${error.message}`);
    } else {
        toast.success("Grades have been updated successfully!");
        onSaveSuccess();
    }
  }
  // --- END EDIT FLOW ---

  const handleGradeChange = (studentId: string, value: string) => {
    const grade = value === '' ? null : parseFloat(value);
    setStudentScores(prev => prev.map(sg => 
        sg.student_id === studentId 
        ? { ...sg, score: grade } 
        : sg
    ));
  };
  
  const step1Content = (
    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Assignment Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Midterm 1 Exam" />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="maxScore">Max Score (Out of)</Label>
            <Input id="maxScore" type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 100" />
            {errors.maxScore && <p className="text-xs text-red-500">{errors.maxScore}</p>}
        </div>
      </div>
    </motion.div>
  )

  const studentGradesTable = (
    <>
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Entering grades for <span className="font-semibold">{title}</span> (Out of {maxScore}).
        </AlertDescription>
      </Alert>
      <div className="max-h-[40vh] overflow-y-auto border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
            <TableRow><TableHead>Student Name</TableHead><TableHead className="w-1/3">Grade</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {studentScores.map((student) => {
              const isInvalid = student.score !== null && student.score > Number(maxScore);
              return (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Input type="number" value={student.score ?? ""} onChange={(e) => handleGradeChange(student.student_id, e.target.value)} 
                        placeholder={`0 - ${maxScore}`} className={cn(isInvalid && "border-red-500 focus-visible:ring-red-500")}
                        max={Number(maxScore)}
                    />
                    {isInvalid && <p className="text-xs text-red-500 mt-1">Grade cannot exceed max score.</p>}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );

  const createContent = (
      <AnimatePresence mode="wait">
        {step === 1 ? step1Content : (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {studentGradesTable}
            </motion.div>
        )}
      </AnimatePresence>
  );

  const editContent = (
      <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {step1Content}
        {studentGradesTable}
      </motion.div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modify Grading Entry" : "New Grading Entry"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Edit the assignment details and student scores." 
              : step === 1 ? "Step 1 of 2: Define the assignment." : "Step 2 of 2: Enter student scores."}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? editContent : createContent}

        <DialogFooter className="pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={isSaving || studentScores.some(s => s.score !== null && s.score > Number(maxScore))}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : step === 1 ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleNext} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next: Enter Grades
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleCreate} disabled={isSaving || studentScores.some(s => s.score !== null && s.score > Number(maxScore))}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Grades"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}