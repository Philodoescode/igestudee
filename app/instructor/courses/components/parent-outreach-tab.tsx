"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { Download, Loader2 } from "lucide-react"

type OutreachData = {
  student_id: string
  student_first_name: string
  parent_first_name: string | null
  parent_phone: string | null
  present_class_count: number
  attendance_status: "Present" | "Absent" | "Tardy" | null
  attendance_comment: string | null
  assignments: { title: string; status: string; comment: string | null }[]
  graded_items: { title: string; score: number | null; max_mark: number; comment: string | null }[]
  instructor_full_name: string
}

const buildMessage = (student: OutreachData, reportDate: Date): string => {
  const {
    parent_first_name,
    student_first_name,
    instructor_full_name,
    attendance_status,
    attendance_comment,
    present_class_count,
    assignments,
    graded_items,
  } = student

  const formattedDate = format(reportDate, "MMMM d, yyyy")

  // Template 2: Absent or no attendance record
  if (attendance_status === "Absent" || !attendance_status) {
    return `Hello ${parent_first_name || "Guardian"},

${student_first_name} was absent for today's class, ${formattedDate}.

Best regards,
${instructor_full_name}`
  }

  // Handle present/tardy case
  const hasAssignments = assignments && assignments.length > 0
  const hasGradedItems = graded_items && graded_items.length > 0

  let attendanceSection = `Attendance:
${student_first_name} was ${attendance_status === "Tardy" ? "tardy" : "present and on time"} for class today.`
  if (attendance_comment) {
    attendanceSection += `\n${attendance_comment}`
  }

  let assignmentsSection = ""
  if (hasAssignments) {
    assignmentsSection = `Assignments:\n`
    assignmentsSection += assignments
      .map(a => {
        let entry = `    ${a.title}: ${a.status}`
        if (a.comment) {
          entry += `\n    ${a.comment}`
        }
        return entry
      })
      .join("\n")
  }

  let gradedItemsSection = ""
  if (hasGradedItems) {
    gradedItemsSection = `Graded Items:\n`
    gradedItemsSection += graded_items
      .map(gi => {
        let entry = `    ${gi.title}: ${gi.score ?? "N/A"} / ${gi.max_mark}`
        if (gi.comment) {
          entry += `\n    ${gi.comment}`
        }
        return entry
      })
      .join("\n")
  }

  let middleSection = ""
  if (hasAssignments && hasGradedItems) {
    middleSection = `${assignmentsSection}\n\n${gradedItemsSection}`
  } else if (hasAssignments) {
    middleSection = `${assignmentsSection}\n\nThere were no graded items for today's session.`
  } else if (hasGradedItems) {
    middleSection = `There were no assignments due today's session.\n\n${gradedItemsSection}`
  } else {
    middleSection = `There were no assignments due or graded items for today's session.`
  }

  return `Hello ${parent_first_name || "Guardian"},

Here is a summary of ${student_first_name}'s progress in today's class:

Class: ${present_class_count}
Date: ${formattedDate}

${attendanceSection}

${middleSection}

We look forward to seeing ${student_first_name} in the next class!

Best regards,
${instructor_full_name}`
}

export default function ParentOutreachTab({ groupId }: { groupId: string }) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleGenerate = async () => {
    setIsLoading(true)

    const { data, error } = await supabase.rpc("get_parent_outreach_data", {
      p_group_id: Number(groupId),
      p_report_date: reportDate,
    })

    if (error) {
      toast.error(`Failed to generate report: ${error.message}`)
      setIsLoading(false)
      return
    }

    if (!data || data.length === 0) {
      toast.info("No student data found for this group.")
      setIsLoading(false)
      return
    }

    const exportData = data
      .filter((student: OutreachData) => student.parent_phone) // Only include students with a phone number
      .map((student: OutreachData) => ({
        Phone: `+2${student.parent_phone}`,
        Message: buildMessage(student, new Date(reportDate + 'T00:00:00')),
      }))
    
    if (exportData.length === 0) {
        toast.warning("No students with guardian phone numbers were found in this group.")
        setIsLoading(false)
        return
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parent Messages")
    XLSX.writeFile(workbook, `Group_${groupId}_ParentMessages_${reportDate}.xlsx`)
    toast.success("Excel file generated successfully!")
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Outreach Export</CardTitle>
        <CardDescription>
          Generate a two-column Excel file to easily contact parents via WhatsApp with a daily summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="space-y-1.5 flex-1 w-full sm:w-auto">
            <Label htmlFor="report-date">Report Date</Label>
            <Input
              id="report-date"
              type="date"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto mt-4 sm:mt-0">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Generate Excel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}