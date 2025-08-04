"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { type TAttendanceSession, type TAttendanceRecord } from "@/types/attendance"
import { cn } from "@/lib/utils"

type Student = { id: string; name: string };

interface AddAttendanceModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (newEntry: TAttendanceSession) => void
  students: Student[]
  editingSession: TAttendanceSession | null
}

export default function AddAttendanceModal({ isOpen, setIsOpen, onSave, students, editingSession }: AddAttendanceModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [studentRecords, setStudentRecords] = useState<TAttendanceRecord[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (editingSession) {
        setDate(editingSession.date)
        setStudentRecords(editingSession.records)
        setStep(2) 
      } else {
        setStep(1)
        setDate(format(new Date(), "yyyy-MM-dd"))
        setStudentRecords(students.map(s => ({ studentId: s.id, name: s.name, status: 'Present' })))
      }
    }
  }, [isOpen, students, editingSession])

  const handleNext = () => {
    setStep(2)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      const newEntry: TAttendanceSession = {
        id: editingSession?.id || `session-${Date.now()}`,
        date: date,
        records: studentRecords,
      }
      onSave(newEntry)
      setIsSaving(false)
    }, 1000)
  }

  const toggleStatus = (studentId: string) => {
    const statuses: Array<'Present' | 'Absent' | 'Tardy'> = ['Present', 'Absent', 'Tardy'];
    setStudentRecords(prev => prev.map(record => {
      if (record.studentId === studentId) {
        const currentIndex = statuses.indexOf(record.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...record, status: statuses[nextIndex] };
      }
      return record;
    }));
  };

  const markAllAsPresent = () => {
    setStudentRecords(prev => prev.map(record => ({ ...record, status: 'Present' })))
  }
  
  const getStatusBadgeVariant = (status: 'Present' | 'Absent' | 'Tardy') => {
    switch(status) {
        case 'Present': return 'default';
        case 'Absent': return 'destructive';
        case 'Tardy': return 'secondary';
        default: return 'outline';
    }
  };

  const getStatusBadgeClass = (status: 'Present' | 'Absent' | 'Tardy') => {
    switch(status) {
        case 'Present': return 'bg-green-100 text-green-800 border-green-200';
        case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
        case 'Tardy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  const step1Content = (
    <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="instructor-name">Instructor Name</Label>
          <TooltipProvider><Tooltip><TooltipTrigger asChild>
            <Input id="instructor-name" value={user?.name || ""} disabled className="cursor-not-allowed" />
          </TooltipTrigger><TooltipContent><p>Your name is pre-filled and cannot be edited.</p></TooltipContent></Tooltip></TooltipProvider>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
    </motion.div>
  )

  const step2Content = (
    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="flex flex-col">
        <div className="flex-shrink-0">
            <Alert className="mb-4 sticky top-0 bg-background z-20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <span className="font-semibold">Date:</span> {new Date(date + 'T00:00:00').toLocaleDateString()}
                </AlertDescription>
            </Alert>
            <div className="flex justify-end mb-2">
                <Button variant="link" size="sm" onClick={markAllAsPresent}>
                    <Check className="mr-2 h-4 w-4"/> Mark all as Present
                </Button>
            </div>
        </div>
        <div className="max-h-[40vh] overflow-y-auto border rounded-md">
            <Table>
                <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="w-1/3 text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentRecords.map((record) => (
                        <TableRow key={record.studentId}>
                            <TableCell className="font-medium">{record.name}</TableCell>
                            <TableCell className="text-center">
                                <Badge 
                                  variant={getStatusBadgeVariant(record.status)} 
                                  className={cn("cursor-pointer select-none", getStatusBadgeClass(record.status))}
                                  onClick={() => toggleStatus(record.studentId)}
                                >
                                    {record.status}
                                </Badge>
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
          <DialogTitle>{editingSession ? 'Edit Attendance' : 'New Attendance Entry'}</DialogTitle>
           <DialogDescription>
            {step === 1 ? "Step 1 of 2: Enter attendance details." : "Step 2 of 2: Mark student attendance."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">{step === 1 ? step1Content : step2Content}</AnimatePresence>

        <DialogFooter className="pt-4 border-t">
          {step === 1 && (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleNext}>Next: Mark Attendance</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => { if (!editingSession) setStep(1) }} disabled={!!editingSession}>Back</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : editingSession ? "Save Changes" : "Save Attendance"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}