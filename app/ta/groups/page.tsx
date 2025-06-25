"use client"

import { useState, useEffect, useMemo } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Users, Calendar, ArrowLeft, Plus, Check, Edit, Trash2, ClipboardEdit, Save, BookOpen, User, Table } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { taGroupsData, taAttendancePageData, taGradingData, type TaGroup, type TAttendanceGroup, type TAttendanceSession, type TAttendanceRecord } from "@/lib/database"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GroupsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [selectedGroup, setSelectedGroup] = useState<TaGroup | null>(null)

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const handleSelectGroup = (group: TaGroup) => {
    setSelectedGroup(group)
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null)
  }

  return (
    <div className="p-6 space-y-6">
      <AnimatePresence mode="wait">
        {selectedGroup ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupDetailView group={selectedGroup} onBack={handleBackToGroups} />
          </motion.div>
        ) : (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupsLandingView onSelectGroup={handleSelectGroup} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GroupsLandingView({ onSelectGroup }: { onSelectGroup: (group: TaGroup) => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-poppins font-bold text-gray-900">Groups</h1>
        <p className="text-gray-600 mt-1">Select a group to manage.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {taGroupsData.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            className="cursor-pointer"
            onClick={() => onSelectGroup(group)}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{group.groupName}</CardTitle>
                <CardDescription>{group.courseName}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{group.studentCount} Students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{group.instructorName}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function GroupDetailView({ group, onBack }: { group: TaGroup; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-emerald-600">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{group.groupName}</CardTitle>
          <CardDescription>{group.courseName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grading">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grading">Grading</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="grading" className="mt-4">
              <GradingTabContent courseId={group.courseId} />
            </TabsContent>
            <TabsContent value="attendance" className="mt-4">
              <AttendanceTabContent groupId={group.id} groupName={group.groupName}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function GradingTabContent({ courseId }: { courseId: string }) {
  const course = useMemo(() => taGradingData.courses.find(c => c.id === courseId), [courseId]);
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(course?.assignments[0]?.id || "");
  const [submissions, setSubmissions] = useState(course?.assignments[0]?.submissions || []);

  useEffect(() => {
    if (course) {
      const firstAssignmentId = course.assignments[0]?.id || "";
      setSelectedAssignmentId(firstAssignmentId);
      setSubmissions(course.assignments.find(a => a.id === firstAssignmentId)?.submissions || []);
    } else {
      setSelectedAssignmentId("");
      setSubmissions([]);
    }
  }, [course]);
  
  const handleAssignmentChange = (id: string) => {
    setSelectedAssignmentId(id);
    setSubmissions(course?.assignments.find(a => a.id === id)?.submissions || []);
  };

  const handleGradeChange = (studentId: string, grade: string) => {
    setSubmissions(submissions.map(s => s.studentId === studentId ? { ...s, grade } : s));
  };

  const handleMarkAsGraded = (studentId: string) => {
    setSubmissions(submissions.map(s => s.studentId === studentId ? { ...s, status: "Graded" } : s));
  };
  
  const handleSaveGrades = () => {
    console.log("Saving grades:", submissions);
    // In a real app, this would send a request to the backend.
  };

  if (!course) {
    return <div className="text-center py-10">No grading information available for this course.</div>;
  }

  const selectedAssignment = course.assignments.find(a => a.id === selectedAssignmentId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Graded": return <Badge variant="default">Graded</Badge>;
      case "Needs Grading": return <Badge variant="destructive">Needs Grading</Badge>;
      case "Late": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Late</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardEdit className="h-5 w-5 text-purple-600" />
                Select Assignment to Grade
            </CardTitle>
            <Button onClick={handleSaveGrades} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <Select value={selectedAssignmentId} onValueChange={handleAssignmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment" />
              </SelectTrigger>
              <SelectContent>
                {course.assignments.map(assignment => (
                  <SelectItem key={assignment.id} value={assignment.id}>{assignment.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {selectedAssignment ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedAssignment.title}</CardTitle>
            <CardDescription>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map(submission => (
                    <TableRow key={submission.studentId}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        <Input 
                          className="w-32" 
                          placeholder="e.g., 95/100" 
                          value={submission.grade || ""}
                          onChange={(e) => handleGradeChange(submission.studentId, e.target.value)}
                          disabled={submission.status === 'Graded'}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsGraded(submission.studentId)}
                          disabled={!submission.grade || submission.status === 'Graded'}
                        >
                          Mark as Graded
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-10">No assignments found for this course.</div>
      )}
    </div>
  );
}


function AttendanceTabContent({ groupId, groupName }: { groupId: string, groupName: string }) {
    const [groupData, setGroupData] = useState<TAttendanceGroup | undefined>(
        taAttendancePageData.groups.find(g => g.id === groupId)
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<TAttendanceSession | null>(null);

    const handleSaveSession = (newSession: TAttendanceSession) => {
        setGroupData(prevGroup => {
            if (!prevGroup) return undefined;
            const sessionExists = prevGroup.sessions.some(s => s.id === newSession.id);
            let updatedSessions;
            if (sessionExists) {
                updatedSessions = prevGroup.sessions.map(s => s.id === newSession.id ? newSession : s);
            } else {
                updatedSessions = [newSession, ...prevGroup.sessions];
            }
            updatedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return { ...prevGroup, sessions: updatedSessions };
        });
    };

    const handleDeleteSession = (sessionId: string) => {
        setGroupData(prevGroup => {
            if (!prevGroup) return undefined;
            const updatedSessions = prevGroup.sessions.filter(s => s.id !== sessionId);
            return { ...prevGroup, sessions: updatedSessions };
        });
    };

    const handleOpenModal = (session: TAttendanceSession | null) => {
        setEditingSession(session);
        setIsModalOpen(true);
    };

    const getSessionSummary = (records: TAttendanceRecord[]) => {
        const summary = records.reduce((acc, record) => {
            if (record.status === 'Absent') acc.absent++;
            if (record.status === 'Tardy') acc.tardy++;
            return acc;
        }, { absent: 0, tardy: 0 });
        return `Absent: ${summary.absent}, Tardy: ${summary.tardy}`;
    };

    if (!groupData) {
        return <div className="text-center py-10">No attendance data for this group.</div>;
    }

    return (
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <UserCheck className="h-5 w-5 text-purple-600" />
                            Attendance History
                        </CardTitle>
                        <Button onClick={() => handleOpenModal(null)} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Record
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {groupData.sessions.map(session => (
                            <AccordionItem value={session.id} key={session.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                    <span>{new Date(session.date).toDateString()}</span>
                                    <span className="text-sm text-gray-500">{getSessionSummary(session.records)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                    {session.records.map(record => (
                                        <div key={record.studentId} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                                        <span>{record.name}</span>
                                        <Badge variant={record.status === 'Present' ? 'default' : record.status === 'Absent' ? 'destructive' : 'secondary'}>
                                            {record.status}
                                        </Badge>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(session)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the attendance record for this session.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSession(session.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    {groupData.sessions.length === 0 && <p className="text-center text-gray-500 py-4">No attendance records found for this group.</p>}
                </CardContent>
            </Card>
            <AttendanceModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                session={editingSession}
                group={groupData}
                onSave={handleSaveSession}
            />
        </div>
    );
}

function AttendanceModal({ isOpen, setIsOpen, session, group, onSave }: {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    session: TAttendanceSession | null,
    group: TAttendanceGroup | null,
    onSave: (session: TAttendanceSession) => void,
}) {
    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({ date: new Date().toISOString().split('T')[0] });
    const [records, setRecords] = useState<TAttendanceRecord[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (session) {
                setDetails({ date: session.date });
                setRecords(session.records);
                setStep(2);
            } else {
                setDetails({ date: new Date().toISOString().split('T')[0] });
                setRecords([]);
                setStep(1);
            }
        }
    }, [isOpen, session]);

    const handleNext = () => {
        if (!details.date) { alert("Please provide a date."); return; }
        if (group) {
            const initialRecords = group.students.map(student => ({ studentId: student.id, name: student.name, status: 'Present' as 'Present' | 'Absent' | 'Tardy' }));
            setRecords(initialRecords);
        }
        setStep(2);
    };
    
    const toggleStatus = (studentId: string) => {
        const statuses = ['Present', 'Absent', 'Tardy'];
        setRecords(records.map(r => r.studentId === studentId ? { ...r, status: statuses[(statuses.indexOf(r.status) + 1) % statuses.length] as 'Present' | 'Absent' | 'Tardy' } : r));
    };

    const markAllPresent = () => setRecords(records.map(r => ({ ...r, status: 'Present' })));

    const handleConfirm = () => {
        const finalSession: TAttendanceSession = { id: session?.id || `session-${Date.now()}`, ...details, records };
        onSave(finalSession);
        setIsOpen(false);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch(status) {
            case 'Present': return 'default';
            case 'Absent': return 'destructive';
            case 'Tardy': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{session ? 'Edit Attendance' : 'Add Attendance'}</DialogTitle>
                    <DialogDescription>{step === 1 ? "Provide session details." : `Mark attendance for ${group?.name}`}</DialogDescription>
                </DialogHeader>
                <AnimatePresence mode="wait">
                    {step === 1 && !session ? (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 space-y-4">
                            <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} /></div>
                        </motion.div>
                    ) : (
                        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 space-y-4">
                            <div className="flex justify-between items-center"><p className="text-sm font-medium">{new Date(details.date + 'T00:00:00').toDateString()}</p><Button size="sm" variant="outline" onClick={markAllPresent}><Check className="h-4 w-4 mr-2" /> Mark All Present</Button></div>
                            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                                {records.map(record => (
                                    <div key={record.studentId} className="flex items-center justify-between p-2 rounded-md border cursor-pointer hover:bg-gray-50" onClick={() => toggleStatus(record.studentId)}>
                                        <p>{record.name}</p><Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <DialogFooter>
                    {step === 2 && !session && <Button variant="outline" onClick={() => setStep(1)}>Back</Button>}
                    {step === 1 && !session ? <Button onClick={handleNext}>Next</Button> : <Button onClick={handleConfirm} className="bg-gradient-to-r from-emerald-500 to-teal-500">Confirm</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}