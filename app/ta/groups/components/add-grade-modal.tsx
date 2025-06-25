"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { taStudentList, type GradingEntry, type StudentGrade } from "@/lib/database"

interface AddGradeModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (newEntry: GradingEntry) => void
  courseId: string
}

export default function AddGradeModal({ isOpen, setIsOpen, onSave, courseId }: AddGradeModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  
  // Step 1 State
  const [date, setDate] = useState<Date>(new Date())
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"Quiz" | "Exam" | "Other">("Quiz")
  const [otherType, setOtherType] = useState("")
  const [errors, setErrors] = useState<{ title?: string; otherType?: string }>({})

  // Step 2 State
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setDate(new Date())
      setTitle("")
      setType("Quiz")
      setOtherType("")
      setErrors({})
      setStudentGrades(taStudentList.map(s => ({ studentId: s.id, name: s.name, grade: "" })))
    }
  }, [isOpen])

  const validateStep1 = () => {
    const newErrors: { title?: string; otherType?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required."
    if (type === "Other" && !otherType.trim()) newErrors.otherType = "Please specify the type."
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
    // Simulate API call
    setTimeout(() => {
      const finalType = type === 'Other' ? otherType : type
      const newEntry: GradingEntry = {
        id: `grading-${Date.now()}`,
        taName: user?.name || "TA",
        date: format(date, "yyyy-MM-dd"),
        title,
        type: finalType,
        studentGrades,
      }
      onSave(newEntry)
      setIsSaving(false)
    }, 1000)
  }

  const handleCopyGrade = (grade: string) => {
    setStudentGrades(studentGrades.map(sg => ({ ...sg, grade: grade })))
  }
  
  const firstGrade = studentGrades.find(sg => sg.grade)?.grade || ""

  const step1Content = (
    <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="ta-name">TA Name</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input id="ta-name" value={user?.name || ""} disabled className="cursor-not-allowed" />
              </TooltipTrigger>
              <TooltipContent><p>Your name is pre-filled and cannot be edited.</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
           <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={(d) => setDate(d || new Date())} initialFocus /></PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Midterm 1, Project Submission" />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="grid gap-2">
          <Label>Type</Label>
          <RadioGroup defaultValue="Quiz" value={type} onValueChange={(v) => setType(v as any)} className="flex space-x-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="Quiz" id="r1" /><Label htmlFor="r1">Quiz</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Exam" id="r2" /><Label htmlFor="r2">Exam</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Other" id="r3" /><Label htmlFor="r3">Other</Label></div>
          </RadioGroup>
        </div>
        <AnimatePresence>
        {type === "Other" && (
          <motion.div className="grid gap-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Label htmlFor="other-type">Specify Type</Label>
            <Input id="other-type" value={otherType} onChange={(e) => setOtherType(e.target.value)} placeholder="e.g., Homework 3" />
            {errors.otherType && <p className="text-xs text-red-500">{errors.otherType}</p>}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  const step2Content = (
    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
        <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                <span className="font-semibold">Title:</span> {title} | <span className="font-semibold">Date:</span> {format(date, "PPP")} | <span className="font-semibold">Type:</span> {type === 'Other' ? otherType : type}
            </AlertDescription>
        </Alert>
        <div className="flex justify-end mb-2">
            <Button variant="link" size="sm" onClick={() => handleCopyGrade(firstGrade)} disabled={!firstGrade}>Copy first grade to all</Button>
        </div>
        <div className="max-h-[40vh] overflow-y-auto border rounded-md">
            <Table>
                <TableHeader className="sticky top-0 bg-slate-50">
                    <TableRow><TableHead>Student Name</TableHead><TableHead className="w-1/3">Grade</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                    {studentGrades.map((student) => (
                        <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                                <Input value={student.grade} onChange={(e) => {
                                    const newGrades = studentGrades.map(sg => sg.studentId === student.studentId ? {...sg, grade: e.target.value} : sg);
                                    setStudentGrades(newGrades);
                                }} placeholder="e.g., 95 or A+" />
                            </TableCell>
                        </TableRow>
                    ))}
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
              <Button onClick={handleSave} disabled={isSaving}>
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