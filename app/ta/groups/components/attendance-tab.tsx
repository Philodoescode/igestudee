"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Plus, Check, Edit, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { taAttendancePageData, type TAttendanceGroup, type TAttendanceSession, type TAttendanceRecord } from "@/lib/database"

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

export default function AttendanceTabContent({ groupId }: { groupId: string }) {
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