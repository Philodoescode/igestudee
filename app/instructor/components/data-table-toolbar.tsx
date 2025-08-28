"use client"

import type { Table } from "@tanstack/react-table"
import { ChevronDown, Download, Import, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { deleteStudents } from "../students/actions"
import { toast } from "sonner"
import type { StudentRoster } from "@/types/student"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {

  const handleExport = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast.error("No rows selected for export.")
      return
    }

    const dataToExport = selectedRows.map(row => row.original as StudentRoster)
    const headers = ["ID", "Full Name", "Email", "Phone", "Date of Birth", "Guardian Name", "Groups"]
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => [
        `"${item.id}"`,
        `"${item.fullName}"`,
        `"${item.email}"`,
        `"${item.phone || ''}"`,
        `"${item.dob}"`,
        `"${item.guardianName || ''}"`,
        `"${item.groups.join('; ')}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `student_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${selectedRows.length} students.`)
  }

  const handleDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const studentIds = selectedRows.map(row => (row.original as StudentRoster).id)
    
    const promise = deleteStudents(studentIds)

    toast.promise(promise, {
      loading: 'Deleting students...',
      success: (data) => {
        table.resetRowSelection()
        return data.message
      },
      error: (data) => data.message,
    })
  }
  
  const handleDownloadTemplate = () => {
    const headers = ["first_name", "last_name", "email", "password", "gender", "date_of_birth", "phone_number", "guardian1_full_name", "guardian1_job_title", "guardian1_relationship", "guardian1_phone_number"];
    const exampleRow = ["John", "Doe", "john.doe@example.com", "strongPassword123", "Male", "2008-05-15", "1234567890", "Jane Doe", "Doctor", "Mother", "0987654321"];
    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search students..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-9 w-[200px] lg:w-[300px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
            <Import className="mr-2 h-4 w-4" />
            Import
        </Button>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport} disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
                    <Download className="mr-2 h-4 w-4" /> Export Selected
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" /> Download Template
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onSelect={(e) => e.preventDefault()}
                            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the selected student profiles and all their associated data from the system. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}