"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { taStudentList, type GradingEntry, type StudentGrade } from "@/lib/database"
import { cn } from "@/lib/utils"

interface AddGradeModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (newEntry: GradingEntry) => void
  courseId: string
}

export default function AddGradeModal({ isOpen, setIsOpen, onSave }: AddGradeModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  
  // Step 1 State
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [title, setTitle] = useState("")
  const [maxScore, setMaxScore] = useState<number | string>("")
  const [errors, setErrors] = useState<{ title?: string; maxScore?: string }>({})

  // Step 2 State
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setDate(format(new Date(), "yyyy-MM-dd"))
      setTitle("")
      setMaxScore("")
      setErrors({})
      setStudentGrades(taStudentList.map(s => ({ studentId: s.id, name: s.name, grade: null })))
    }
  }, [isOpen])

  const validateStep1 = () => {
    const newErrors: { title?: string; maxScore?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required."
    if (maxScore === "" || Number(maxScore) <= 0) newErrors.maxScore = "Max score must be a positive number."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      const newEntry: GradingEntry = {
        id: `grading-${Date.now()}`,
        taName: user?.name || "TA",
        date: date,
        title,
        maxScore: Number(maxScore),
        studentGrades,
      }
      onSave(newEntry)
      setIsSaving(false)
    }, 1000)
  }

  const handleGradeChange = (studentId: string, value: string) => {
    const grade = value === '' ? null : parseFloat(value);
    
    setStudentGrades(prev => prev.map(sg => 
        sg.studentId === studentId 
        ? { ...sg, grade: grade } 
        : sg
    ));
  };
  
  const handleCopyGrade = (grade: number | null) => {
    if (grade === null) return;
    setStudentGrades(studentGrades.map(sg => ({ ...sg, grade })))
  }

  const firstGrade = studentGrades.find(sg => sg.grade !== null)?.grade ?? null;

  const step1Content = (
    <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="ta-name">TA Name</Label>
          <TooltipProvider><Tooltip><TooltipTrigger asChild>
            <Input id="ta-name" value={user?.name || ""} disabled className="cursor-not-allowed" />
          </TooltipTrigger><TooltipContent><p>Your name is pre-filled and cannot be edited.</p></TooltipContent></Tooltip></TooltipProvider>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="maxScore">Max Score (Out of)</Label>
                <Input id="maxScore" type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} placeholder="e.g., 100" />
                {errors.maxScore && <p className="text-xs text-red-500">{errors.maxScore}</p>}
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Grading Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Midterm 1 Exam, Project Submission" />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
      </div>
    </motion.div>
  )

  const step2Content = (
    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
        <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                <span className="font-semibold">Title:</span> {title} | <span className="font-semibold">Date:</span> {new Date(date + 'T00:00:00').toLocaleDateString()} | <span className="font-semibold">Max Score:</span> {maxScore}
            </AlertDescription>
        </Alert>
        <div className="flex justify-end mb-2">
            <Button variant="link" size="sm" onClick={() => handleCopyGrade(firstGrade)} disabled={firstGrade === null}>Copy first grade to all</Button>
        </div>
        <div className="max-h-[40vh] overflow-y-auto border rounded-md">
            <Table>
                <TableHeader className="sticky top-0 bg-slate-50 z-10">
                    <TableRow><TableHead>Student Name</TableHead><TableHead className="w-1/3">Grade</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                    {studentGrades.map((student) => {
                        const isInvalid = student.grade !== null && student.grade > Number(maxScore);
                        return (
                            <TableRow key={student.studentId}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>
                                    <Input type="number" value={student.grade ?? ""} onChange={(e) => handleGradeChange(student.studentId, e.target.value)} 
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
    </motion.div>
  )
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Grading Entry</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Step 1 of 2: Enter grading details." : "Step 2 of 2: Enter student grades."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">{step === 1 ? step1Content : step2Content}</AnimatePresence>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          {step === 1 && (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleNext}>Next: Enter Grades</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleSave} disabled={isSaving || studentGrades.some(s => s.grade !== null && s.grade > Number(maxScore))}>
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