"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, History, Download } from "lucide-react"
import { motion } from "framer-motion"
import { type GradingEntry } from "@/lib/database"
import { Button } from "@/components/ui/button"

interface GradingHistoryProps {
  history: GradingEntry[]
}

export default function GradingHistory({ history }: GradingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredHistory = useMemo(() => {
    return history.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || entry.type.toLowerCase() === typeFilter.toLowerCase()
      return matchesSearch && matchesType
    })
  }, [history, searchTerm, typeFilter])

  const getBadgeVariant = (type: string) => {
    switch(type.toLowerCase()){
        case 'quiz': return 'default';
        case 'exam': return 'destructive';
        default: return 'secondary';
    }
  }

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
            Grading History
          </CardTitle>
          <CardDescription>Review and manage past grading entries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Quiz">Quiz</SelectItem>
                <SelectItem value="Exam">Exam</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-lg">
            {filteredHistory.length > 0 ? (
              <Accordion type="single" collapsible>
                {filteredHistory.map(entry => (
                  <AccordionItem value={entry.id} key={entry.id}>
                    <AccordionTrigger className="px-4 hover:bg-slate-50">
                      <div className="flex flex-1 items-center justify-between gap-4">
                          <div className="text-left">
                            <p className="font-semibold">{entry.title}</p>
                            <p className="text-sm text-gray-500">{new Date(entry.date + 'T00:00:00').toLocaleDateString()}</p>
                          </div>
                          <Badge variant={getBadgeVariant(entry.type)}>{entry.type}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                      <div className="max-h-60 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-right">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entry.studentGrades.map(sg => (
                                    <TableRow key={sg.studentId}>
                                        <TableCell>{sg.name}</TableCell>
                                        <TableCell className="text-right font-mono">{sg.grade || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-10 text-center text-gray-500">
                <p>No grading history found.</p>
                <p className="text-sm">Try adjusting your filters or adding a new grade entry.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}