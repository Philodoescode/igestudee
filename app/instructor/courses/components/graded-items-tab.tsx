"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Download, History, Loader2 } from "lucide-react"
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
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import AddGradedItemModal, { type GradedItemEntry } from "./add-graded-item-modal"

type Student = { id: string; name: string }

interface GradedItemsTabProps {
  groupId: string
  students: Student[]
}

export default function GradedItemsTab({ groupId, students }: GradedItemsTabProps) {
  const supabase = createClient()
  const [history, setHistory] = useState<GradedItemEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<GradedItemEntry | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("graded_items")
      .select("*, student_scores(*, students:student_id(first_name, last_name))")
      .eq("group_id", groupId)
      .order("item_date", { ascending: false })

    if (error) {
      toast.error("Failed to fetch graded items history.")
    } else {
      const formattedHistory = data.map(item => ({
        id: item.id,
        title: item.title,
        max_score: item.max_score,
        item_date: item.item_date,
        scores: students.map(student => {
            const record = item.student_scores.find(ss => ss.student_id === student.id);
            return {
                studentId: student.id,
                name: student.name,
                score: record?.score?.toString() ?? "",
                comment: record?.comment || "",
            }
        }),
      }));
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

  const handleEdit = (entry: GradedItemEntry) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleDelete = async (itemId: number) => {
    const { error } = await supabase.rpc("delete_graded_item", { p_item_id: itemId })
    if (error) {
      toast.error(`Failed to delete item: ${error.message}`)
    } else {
      toast.success("Graded item deleted successfully.")
      fetchHistory()
    }
  }

   const handleExport = async (itemId: number) => {
    toast.info("Preparing your export...")
    const { data, error } = await supabase.rpc('export_data', { p_item_id: itemId, p_item_type: 'graded_item' });
     if (error) {
        toast.error(`Export failed: ${error.message}`);
        return;
    }
    const headers = ["Student Name", "Score", "Max Mark", "Comment", "Item Title", "Date"];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            `"${row.student_name}"`,
            `"${row.score_or_status}"`,
            `"${row.max_mark}"`,
            `"${row.comment || ''}"`,
            `"${row.item_title}"`,
            `"${row.date}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `graded_item_${itemId}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export complete!");
  }
  
  const getAverageScore = (scores: GradedItemEntry['scores']) => {
      const validScores = scores.map(s => parseFloat(s.score)).filter(s => !isNaN(s));
      if(validScores.length === 0) return 'N/A';
      const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
      return avg.toFixed(2);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Graded Item History</h3>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Graded Item
        </Button>
      </div>

       <Card>
        <CardContent className="p-4">
          {isLoading ? (
             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No graded items have been created for this group yet.</p>
              <p className="text-sm">Click "Add Graded Item" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="font-semibold">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(entry.item_date), "MMMM d, yyyy")} &middot; Average: {getAverageScore(entry.scores)} / {entry.max_score}
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
                          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the graded item "{entry.title}" and all its scores. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
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

      <AddGradedItemModal
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