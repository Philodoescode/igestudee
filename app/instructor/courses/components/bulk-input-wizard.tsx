// app/instructor/courses/components/bulk-input-wizard.tsx
"use client"

import { useState, useEffect, useId, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Group } from "@/types/course"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  PlusCircle,
  X,
  MessageSquarePlus,
  CalendarDays,
  ListTodo,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Type Definitions
type AttendanceStatus = "Present" | "Absent" | "Tardy"
const ATTENDANCE_STATUSES: AttendanceStatus[] = ["Present", "Absent", "Tardy"]

type AssignmentStatus = "Done" | "Partially Done" | "Not Done"
const ASSIGNMENT_STATUSES: AssignmentStatus[] = ["Done", "Partially Done", "Not Done"]

type NewAssignment = { id: string; title: string }
type NewGradedItem = { id: string; title: string; maxScore: string }

type StudentEntry = {
  studentId: string
  studentName: string
  attendance: AttendanceStatus
  assignments: Record<string, AssignmentStatus>
  grades: Record<string, string>
  comments: Record<string, string> // key can be 'attendance', assignmentId, or gradedItemId
}

interface BulkInputWizardProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  group: Group
  onSave: () => void
}

export default function BulkInputWizard({ isOpen, setIsOpen, group, onSave }: BulkInputWizardProps) {
  const supabase = createClient()
  const uniqueId = useId()
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Step 1 State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [takeAttendance, setTakeAttendance] = useState(true)
  const [newAssignments, setNewAssignments] = useState<NewAssignment[]>([])
  const [newGradedItems, setNewGradedItems] = useState<NewGradedItem[]>([])

  // Step 2 State
  const [studentData, setStudentData] = useState<StudentEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStep(1)
      setDate(new Date().toISOString().split("T")[0])
      setTakeAttendance(true)
      setNewAssignments([])
      setNewGradedItems([])
      setSearchTerm("")
      
      // Initialize student data based on the group
      const initialStudentData = (group.students || []).map(student => ({
        studentId: student.id,
        studentName: student.name,
        attendance: "Present",
        assignments: {},
        grades: {},
        comments: {},
      }))
      setStudentData(initialStudentData)
    }
  }, [isOpen, group])

  const handleNext = () => {
    // Validation before moving from Step 1 to 2
    if (newAssignments.some(a => !a.title.trim())) {
      toast.error("All new assignments must have a title.")
      return
    }
    if (newGradedItems.some(g => !g.title.trim() || !g.maxScore.trim() || Number(g.maxScore) <= 0)) {
      toast.error("All new graded items must have a title and a valid max score (> 0).")
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => setStep(prev => prev - 1)

  const handleSaveData = async () => {
    setIsSaving(true);
  
    // Validate scores
    for (const student of studentData) {
      for (const item of newGradedItems) {
        const score = student.grades[item.id];
        if (score && (isNaN(Number(score)) || Number(score) > Number(item.maxScore))) {
          toast.error(`Invalid score for ${student.studentName} in "${item.title}".`);
          setIsSaving(false);
          return;
        }
      }
    }
  
    const payload = {
      p_group_id: Number(group.id),
      p_item_date: date,
      p_attendance_data: takeAttendance ? studentData.map(s => ({
        studentId: s.studentId,
        status: s.attendance,
        comment: s.comments['attendance'] || null
      })) : [],
      p_assignments_data: newAssignments.map(assign => ({
        title: assign.title,
        statuses: studentData.map(s => ({
          studentId: s.studentId,
          status: s.assignments[assign.id] || 'Done',
          comment: s.comments[assign.id] || null
        }))
      })),
      p_graded_items_data: newGradedItems.map(item => ({
        title: item.title,
        maxScore: Number(item.maxScore),
        scores: studentData.map(s => ({
          studentId: s.studentId,
          score: s.grades[item.id] ? Number(s.grades[item.id]) : null,
          comment: s.comments[item.id] || null
        }))
      }))
    };
  
    const { error } = await supabase.rpc('bulk_input_daily_records', payload);
  
    if (error) {
      toast.error(`Failed to save data: ${error.message}`);
    } else {
      toast.success("All records saved successfully!");
      onSave(); // Refresh data on the main page
      setIsOpen(false);
    }
    setIsSaving(false);
  };
  
  const filteredStudents = useMemo(() => 
      studentData.filter(s => s.studentName.toLowerCase().includes(searchTerm.toLowerCase())),
      [studentData, searchTerm]
  );

  const Step1 = () => (
    <div className="p-6 space-y-8">
        <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-base"><CalendarDays className="w-5 h-5" /> Select Date</Label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="text-base" />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center space-x-3">
                <Checkbox id="takeAttendance" checked={takeAttendance} onCheckedChange={checked => setTakeAttendance(Boolean(checked))} />
                <Label htmlFor="takeAttendance" className="text-base font-medium">Take Attendance</Label>
            </div>
        </div>

        {/* Assignments Section */}
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="flex items-center gap-2 text-base font-medium"><ListTodo className="w-5 h-5" /> Assignments</h3>
            {newAssignments.map((assignment, index) => (
                <div key={assignment.id} className="flex items-center gap-2">
                    <Input placeholder={`Assignment ${index + 1} Title`} value={assignment.title} onChange={e => setNewAssignments(current => current.map(a => a.id === assignment.id ? { ...a, title: e.target.value } : a))} />
                    <Button variant="ghost" size="icon" onClick={() => setNewAssignments(current => current.filter(a => a.id !== assignment.id))}><X className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setNewAssignments(current => [...current, { id: `${uniqueId}-a-${current.length}`, title: '' }])}><PlusCircle className="w-4 h-4 mr-2" />Add New Assignment</Button>
        </div>

        {/* Graded Items Section */}
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="flex items-center gap-2 text-base font-medium"><GraduationCap className="w-5 h-5" /> Graded Items</h3>
            {newGradedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                    <Input placeholder={`Item ${index + 1} Title`} value={item.title} onChange={e => setNewGradedItems(current => current.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))} />
                    <Input type="number" placeholder="Max Score" value={item.maxScore} onChange={e => setNewGradedItems(current => current.map(i => i.id === item.id ? { ...i, maxScore: e.target.value } : i))} className="w-32" />
                    <Button variant="ghost" size="icon" onClick={() => setNewGradedItems(current => current.filter(i => i.id !== item.id))}><X className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setNewGradedItems(current => [...current, { id: `${uniqueId}-g-${current.length}`, title: '', maxScore: '100' }])}><PlusCircle className="w-4 h-4 mr-2" />Add New Graded Item</Button>
        </div>
    </div>
  );
  
  const Step2 = () => {
    const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());
    const toggleComment = (key: string) => setVisibleComments(prev => {
        const newSet = new Set(prev);
        newSet.has(key) ? newSet.delete(key) : newSet.add(key);
        return newSet;
    });

    const cycleStatus = (studentId: string, type: 'attendance' | 'assignment', key: string) => {
        setStudentData(prev => prev.map(s => {
            if (s.studentId !== studentId) return s;
            const newStudent = { ...s, assignments: { ...s.assignments } };
            if (type === 'attendance') {
                const currentIndex = ATTENDANCE_STATUSES.indexOf(s.attendance);
                newStudent.attendance = ATTENDANCE_STATUSES[(currentIndex + 1) % ATTENDANCE_STATUSES.length];
            } else {
                const currentStatus = s.assignments[key] || 'Done';
                const currentIndex = ASSIGNMENT_STATUSES.indexOf(currentStatus);
                newStudent.assignments[key] = ASSIGNMENT_STATUSES[(currentIndex + 1) % ASSIGNMENT_STATUSES.length];
            }
            return newStudent;
        }));
    };

    const handleDataChange = (studentId: string, type: 'grade' | 'comment', key: string, value: string) => {
        setStudentData(prev => prev.map(s => {
            if (s.studentId !== studentId) return s;
            const newStudent = { ...s, grades: { ...s.grades }, comments: { ...s.comments } };
            if (type === 'grade') newStudent.grades[key] = value;
            else newStudent.comments[key] = value;
            return newStudent;
        }));
    };
    
    const columns = [
        ...(takeAttendance ? [{ id: 'attendance', title: 'Attendance' }] : []),
        ...newAssignments.map(a => ({ id: a.id, title: `Asg: ${a.title}` })),
        ...newGradedItems.map(g => ({ id: g.id, title: `${g.title} (/ ${g.maxScore})` }))
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <Command>
                    <CommandInput placeholder="Search students..." value={searchTerm} onValueChange={setSearchTerm}/>
                </Command>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <Card key={student.studentId}>
                            <CardHeader className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-t-lg">
                                <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4"/>{student.studentName}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {columns.map(col => {
                                    const commentKey = `${student.studentId}-${col.id}`;
                                    return (
                                        <div key={col.id} className="space-y-2">
                                            <Label>{col.title}</Label>
                                            <div className="flex items-center gap-2">
                                                {col.id === 'attendance' && 
                                                    <Badge variant="outline" onClick={() => cycleStatus(student.studentId, 'attendance', col.id)} className="cursor-pointer select-none">{student.attendance}</Badge>}
                                                {newAssignments.some(a => a.id === col.id) && 
                                                    <Badge variant="outline" onClick={() => cycleStatus(student.studentId, 'assignment', col.id)} className="cursor-pointer select-none">{student.assignments[col.id] || 'Done'}</Badge>}
                                                {newGradedItems.some(g => g.id === col.id) &&
                                                    <Input type="number" placeholder="Score" value={student.grades[col.id] || ''} onChange={e => handleDataChange(student.studentId, 'grade', col.id, e.target.value)} className="w-28" />}
                                                <Button size="icon" variant="ghost" onClick={() => toggleComment(commentKey)}><MessageSquarePlus className="w-4 h-4"/></Button>
                                            </div>
                                            <AnimatePresence>
                                                {visibleComments.has(commentKey) && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                                        <Textarea placeholder="Optional comment..." value={student.comments[col.id] || ''} onChange={e => handleDataChange(student.studentId, 'comment', col.id, e.target.value)} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )) : <CommandEmpty className="py-10 text-center">No students found.</CommandEmpty>}
                </div>
            </ScrollArea>
        </div>
    );
  };
  
  const Step3 = () => {
    const summary = useMemo(() => {
        let attSummary = { Present: 0, Absent: 0, Tardy: 0 };
        let asgSummary: Record<string, { Done: number, 'Partially Done': number, 'Not Done': number }> = {};
        
        if(takeAttendance) studentData.forEach(s => attSummary[s.attendance]++);

        newAssignments.forEach(a => {
            asgSummary[a.title] = { Done: 0, 'Partially Done': 0, 'Not Done': 0 };
            studentData.forEach(s => asgSummary[a.title][s.assignments[a.id] || 'Done']++);
        });

        return { attSummary, asgSummary };
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-500" />Review and Confirm</h3>
            {takeAttendance && (
                <Card>
                    <CardHeader><CardTitle className="text-base">Attendance Summary</CardTitle></CardHeader>
                    <CardContent className="flex gap-4">
                        <p>Present: <strong>{summary.attSummary.Present}</strong></p>
                        <p>Absent: <strong>{summary.attSummary.Absent}</strong></p>
                        <p>Tardy: <strong>{summary.attSummary.Tardy}</strong></p>
                    </CardContent>
                </Card>
            )}
             {newAssignments.map(a => (
                <Card key={a.id}>
                    <CardHeader><CardTitle className="text-base">Assignment: {a.title}</CardTitle></CardHeader>
                    <CardContent className="flex gap-4">
                        <p>Done: <strong>{summary.asgSummary[a.title].Done}</strong></p>
                        <p>Partially Done: <strong>{summary.asgSummary[a.title]['Partially Done']}</strong></p>
                        <p>Not Done: <strong>{summary.asgSummary[a.title]['Not Done']}</strong></p>
                    </CardContent>
                </Card>
            ))}
            {newGradedItems.length > 0 && <p className="text-sm text-muted-foreground">Graded items will be saved as entered.</p>}
        </div>
    );
  };

  const stepTitles = ["Define Items", "Enter Data", "Review & Save"];
  const currentTitle = stepTitles[step - 1] || "Bulk Input";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg">Bulk Input for {group.groupName}</DialogTitle>
          <DialogDescription>Step {step} of 3: {currentTitle}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ x: step === 1 ? 0 : 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {step === 1 && <ScrollArea className="h-full"><Step1 /></ScrollArea>}
                    {step === 2 && <Step2 />}
                    {step === 3 && <ScrollArea className="h-full"><Step3 /></ScrollArea>}
                </motion.div>
            </AnimatePresence>
        </div>
        <DialogFooter className="p-4 border-t flex justify-between w-full">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={handleNext}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={handleSaveData} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Entry
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}