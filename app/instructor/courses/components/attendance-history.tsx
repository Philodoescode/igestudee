"use client"

import { useState, useMemo } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Search, History, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import type { TAttendanceSession, TAttendanceRecord } from "@/types/attendance"
import { cn } from "@/lib/utils"

interface AttendanceHistoryProps {
  history: TAttendanceSession[]
  onEdit: (session: TAttendanceSession) => void
  onDelete: (sessionId: string) => void
}

const ITEMS_PER_PAGE = 5;

const getSessionSummary = (records: TAttendanceRecord[]) => {
    const summary = records.reduce((acc, record) => {
        if (record.status === 'Absent') acc.absent++;
        if (record.status === 'Tardy') acc.tardy++;
        return acc;
    }, { absent: 0, tardy: 0 });
    return `Absent: ${summary.absent}, Tardy: ${summary.tardy}`;
};

const getStatusBadgeClass = (status: 'Present' | 'Absent' | 'Tardy') => {
    switch(status) {
        case 'Present': return 'bg-green-100 text-green-800 border-green-200';
        case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
        case 'Tardy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function AttendanceHistory({ history, onEdit, onDelete }: AttendanceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [openAccordionId, setOpenAccordionId] = useState<string | undefined>(undefined)

  const filteredHistory = useMemo(() => {
    return history.filter(entry => 
      format(new Date(entry.date + 'T00:00:00'), 'MMMM d, yyyy').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [history, searchTerm])

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
        <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
                <History className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                Attendance History
            </h3>
            <p className="text-sm text-muted-foreground">Review and manage past attendance entries.</p>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="pl-10"
            />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
        {paginatedHistory.length > 0 ? (
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordionId} 
              onValueChange={setOpenAccordionId}
            >
            {paginatedHistory.map(entry => (
                <AccordionItem value={entry.id} key={entry.id} className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex flex-1 items-center justify-between gap-4 w-full pr-2">
                        <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold">{format(new Date(entry.date + 'T00:00:00'), 'MMMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground truncate">{getSessionSummary(entry.records)}</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Student</TableHead>
                                    <TableHead className="text-right pr-4">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entry.records.map(sg => (
                                    <TableRow key={sg.studentId}>
                                        <TableCell className="pl-4">{sg.name}</TableCell>
                                        <TableCell className="text-right pr-4">
                                            <Badge variant="outline" className={cn(getStatusBadgeClass(sg.status))}>{sg.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-2 p-4 flex justify-end space-x-2 border-t bg-slate-50 dark:bg-slate-800/50">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the attendance record for this session.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(entry.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        ) : (
            <div className="p-10 text-center text-muted-foreground">
            <p>No attendance history found.</p>
            <p className="text-sm">Try adjusting your search or adding a new attendance entry.</p>
            </div>
        )}
        </div>
        {totalPages > 1 && (
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p-1)); }} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink href="#" isActive={currentPage === i+1} onClick={(e) => { e.preventDefault(); setCurrentPage(i+1); }}>
                                {i+1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1)); }} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
    </motion.div>
  )
}