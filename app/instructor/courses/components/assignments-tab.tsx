"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Download, History, Search, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import AddAssignmentModal, { type AssignmentEntry } from "./add-assignment-modal"

type Student = { id: string; name: string }

interface AssignmentsTabProps {
  groupId: string
  students: Student[]
}

export default function AssignmentsTab({ groupId, students }: AssignmentsTabProps) {
  const supabase = createClient()
  const [history, setHistory] = useState<AssignmentEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<AssignmentEntry | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("assignments")
      .select("*, student_assignments(*, students:student_id(first_name, last_name))")
      .eq("group_id", groupId)
      .order("item_date", { ascending: false })

    if (error) {
      toast.error("Failed to fetch assignment history.")
    } else {
      const formattedHistory = data.map(item => ({
        id: item.id,
        title: item.title,
        item_date: item.item_date,
        statuses: students.map(student => {
          const record = item.student_assignments.find(sa => sa.student_id === student.id)
          return {
            studentId: student.id,
            name: student.name,
            status: record?.status || "Not Done",
            comment: record?.comment || "",
          }
        }),
      }))
      setHistory(formattedHistory)
    }
    setIsLoading(false)
  }, [groupId, supabase, students])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleAddNew = () => {
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  const handleEdit = (entry: AssignmentEntry) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleDelete = async (itemId: number) => {
    const { error } = await supabase.rpc("delete_assignment", { p_item_id: itemId })
    if (error) {
      toast.error(`Failed to delete assignment: ${error.message}`)
    } else {
      toast.success("Assignment deleted successfully.")
      fetchHistory()
    }
  }

  const handleExport = async (itemId: number) => {
    toast.info("Preparing your export...")
    const { data, error } = await supabase.rpc('export_data', { p_item_id: itemId, p_item_type: 'assignment' });
    if (error) {
        toast.error(`Export failed: ${error.message}`);
        return;
    }
    const headers = ["Student Name", "Status", "Comment", "Assignment Title", "Date"];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            `"${row.student_name}"`,
            `"${row.score_or_status}"`,
            `"${row.comment || ''}"`,
            `"${row.item_title}"`,
            `"${row.date}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `assignment_${itemId}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export complete!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Assignment History</h3>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No assignments have been created for this group yet.</p>
              <p className="text-sm">Click "Add Assignment" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="font-semibold">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(entry.item_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4 mr-1" /> View/Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExport(entry.id!)}>
                        <Download className="h-4 w-4 mr-1" /> Export
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the assignment "{entry.title}". This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(entry.id!)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddAssignmentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={fetchHistory}
        groupId={groupId}
        students={students}
        editingEntry={editingEntry}
      />
    </div>
  )
}