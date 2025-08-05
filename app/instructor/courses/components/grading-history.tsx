// app/ta/courses/components/grading-history.tsx
"use client"

import { useState, useMemo } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Search, History, Download } from "lucide-react"
import { motion } from "framer-motion"
import { type GradingEntry } from "@/lib/database"

interface GradingHistoryProps {
  // FIX: Allow the history prop to be undefined while data is loading.
  history: GradingEntry[] | undefined
}

const ITEMS_PER_PAGE = 5;

// FIX: Set a default value for history to `[]`. This immediately prevents the crash.
export default function GradingHistory({ history = [] }: GradingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredHistory = useMemo(() => {
    // The default prop value ensures `history` is always an array here.
    return history.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(entry.date + 'T00:00:00').toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [history, searchTerm])

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const handleExportToCSV = (entry: GradingEntry) => {
    const headers = ["Student Name", "Grade", "Max Score"];
    const rows = entry.studentGrades.map(sg => [
        `"${sg.name}"`,
        sg.grade ?? "N/A",
        entry.maxScore
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${entry.title.replace(/\s+/g, '_')}_grades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
          Grading History
        </h3>
        <p className="text-sm text-muted-foreground">Review and manage past grading entries.</p>
      </div>

      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or date..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        {paginatedHistory.length > 0 ? (
          <Accordion type="single" collapsible>
            {paginatedHistory.map(entry => (
              <AccordionItem value={entry.id} key={entry.id} className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left">
                  <div className="flex flex-1 items-center justify-between gap-4 w-full pr-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{entry.title}</p>
                        <p className="text-sm text-muted-foreground">{new Date(entry.date + 'T00:00:00').toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 pr-2 flex-shrink-0">Out of {entry.maxScore}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Student</TableHead>
                                <TableHead className="text-right pr-4">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entry.studentGrades.map(sg => (
                                <TableRow key={sg.studentId}>
                                    <TableCell className="pl-4">{sg.name}</TableCell>
                                    <TableCell className="text-right pr-4 font-mono">{sg.grade ?? "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  </div>
                  <div className="mt-2 p-4 flex justify-end border-t bg-slate-50 dark:bg-slate-800/50">
                    <Button variant="outline" size="sm" onClick={() => handleExportToCSV(entry)}>
                        <Download className="mr-2 h-4 w-4" />Export CSV
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            <p>No grading history found.</p>
            <p className="text-sm">Try adjusting your search or adding a new grade entry.</p>
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