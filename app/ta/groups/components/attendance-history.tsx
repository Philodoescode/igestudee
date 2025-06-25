// NEW FILE: components/attendance-history.tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Search, History, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { type TAttendanceSession, type TAttendanceRecord } from "@/lib/database"

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

const getStatusBadgeVariant = (status: 'Present' | 'Absent' | 'Tardy') => {
    switch(status) {
        case 'Present': return 'default';
        case 'Absent': return 'destructive';
        case 'Tardy': return 'secondary';
        default: return 'outline';
    }
};

export default function AttendanceHistory({ history, onEdit, onDelete }: AttendanceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredHistory = useMemo(() => {
    return history.filter(entry => 
      new Date(entry.date + 'T00:00:00').toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
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
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-700" />
            Attendance History
          </CardTitle>
          <CardDescription>Review and manage past attendance entries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
          
          <div className="border rounded-lg">
            {paginatedHistory.length > 0 ? (
              <Accordion type="single" collapsible>
                {paginatedHistory.map(entry => (
                  <AccordionItem value={entry.id} key={entry.id}>
                    <AccordionTrigger className="px-4 hover:bg-slate-50">
                      <div className="flex flex-1 items-center justify-between gap-4">
                          <div className="text-left">
                            <p className="font-semibold">{new Date(entry.date + 'T00:00:00').toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{getSessionSummary(entry.records)}</p>
                          </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                      <div className="max-h-60 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entry.records.map(sg => (
                                    <TableRow key={sg.studentId}>
                                        <TableCell>{sg.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getStatusBadgeVariant(sg.status)}>{sg.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
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
              <div className="p-10 text-center text-gray-500">
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
        </CardContent>
      </Card>
    </motion.div>
  )
}