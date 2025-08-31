"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { Download, Loader2 } from "lucide-react"

type Language = "ar" | "en"

type OutreachData = {
  student_id: string
  student_first_name: string
  parent_first_name: string | null
  parent_phone: string | null
  present_class_count: number
  attendance_status: "Present" | "Absent" | "Tardy" | null
  attendance_comment: string | null
  assignments: { title: string; status: "Done" | "Partially Done" | "Not Done"; comment: string | null }[]
  graded_items: { title: string; score: number | null; max_mark: number; comment: string | null }[]
  instructor_full_name: string
}

const buildMessage = (student: OutreachData, reportDate: Date, lang: Language): string => {
  const {
    parent_first_name, student_first_name, instructor_full_name,
    attendance_status, attendance_comment, present_class_count,
    assignments, graded_items,
  } = student

  if (lang === "ar") {
    const formattedDate = format(reportDate, "dd/MM/yyyy")
    const parentName = parent_first_name || "ولي الأمر"

    // Absent Template (Arabic)
    if (attendance_status === "Absent" || !attendance_status) {
      return `مرحبًا ${parentName}،\n\nكان ${student_first_name} غائبًا عن حصة اليوم، ${formattedDate}.\n\nمع أطيب التحيات،\n${instructor_full_name}`
    }

    // Present/Tardy Template (Arabic)
    const t = (key: "Done" | "Partially Done" | "Not Done" | "Present" | "Tardy") => {
      return { "Done": "تم", "Partially Done": "تم جزئيًا", "Not Done": "لم يتم", "Present": "حاضرًا في الوقت المحدد", "Tardy": "متأخرًا" }[key]
    }

    const hasAssignments = assignments && assignments.length > 0
    const hasGradedItems = graded_items && graded_items.length > 0

    let attendanceSection = `الحضور:\nكان ${student_first_name} ${t(attendance_status)} في الحصة اليوم.`
    if (attendance_comment) attendanceSection += `\n${attendance_comment}`

    const assignmentsSection = hasAssignments
      ? `الواجبات:\n` + assignments.map(a => `    ${a.title}: ${t(a.status)}` + (a.comment ? `\n    ${a.comment}` : "")).join("\n")
      : ""
    const gradedItemsSection = hasGradedItems
      ? `التقييمات:\n` + graded_items.map(gi => `    ${gi.title}: ${gi.score ?? "N/A"} / ${gi.max_mark}` + (gi.comment ? `\n    ${gi.comment}` : "")).join("\n")
      : ""

    let middleSection
    if (hasAssignments && hasGradedItems) middleSection = `${assignmentsSection}\n\n${gradedItemsSection}`
    else if (hasAssignments) middleSection = `${assignmentsSection}\n\nلم تكن هناك تقييمات لجلسة اليوم.`
    else if (hasGradedItems) middleSection = `لم تكن هناك واجبات مستحقة في جلسة اليوم.\n\n${gradedItemsSection}`
    else middleSection = `لم تكن هناك واجبات مستحقة أو تقييمات لجلسة اليوم.`

    return `مرحبًا ${parentName}،\n\nإليك ملخص تقدم ${student_first_name} في حصة اليوم:\n\nالحصة رقم: ${present_class_count}\nالتاريخ: ${formattedDate}\n\n${attendanceSection}\n\n${middleSection}\n\nنتطلع لرؤية ${student_first_name} في الحصة القادمة!\n\nمع أطيب التحيات،\n${instructor_full_name}`

  } else { // English
    const formattedDate = format(reportDate, "MMMM d, yyyy")
    const parentName = parent_first_name || "Guardian"
    
    // Absent Template (English)
    if (attendance_status === "Absent" || !attendance_status) {
      return `Hello ${parentName},\n\n${student_first_name} was absent for today's class, ${formattedDate}.\n\nBest regards,\n${instructor_full_name}`
    }

    // Present/Tardy Template (English)
    const hasAssignments = assignments && assignments.length > 0
    const hasGradedItems = graded_items && graded_items.length > 0

    let attendanceSection = `Attendance:\n${student_first_name} was ${attendance_status === "Tardy" ? "tardy" : "present and on time"} for class today.`
    if (attendance_comment) attendanceSection += `\n${attendance_comment}`
    
    const assignmentsSection = hasAssignments
        ? `Assignments:\n` + assignments.map(a => `    ${a.title}: ${a.status}` + (a.comment ? `\n    ${a.comment}`: "")).join("\n")
        : ""
    const gradedItemsSection = hasGradedItems
        ? `Graded Items:\n` + graded_items.map(gi => `    ${gi.title}: ${gi.score ?? "N/A"} / ${gi.max_mark}` + (gi.comment ? `\n    ${gi.comment}` : "")).join("\n")
        : ""
    
    let middleSection
    if(hasAssignments && hasGradedItems) middleSection = `${assignmentsSection}\n\n${gradedItemsSection}`
    else if (hasAssignments) middleSection = `${assignmentsSection}\n\nThere were no graded items for today's session.`
    else if (hasGradedItems) middleSection = `There were no assignments due today's session.\n\n${gradedItemsSection}`
    else middleSection = `There were no assignments due or graded items for today's session.`

    return `Hello ${parentName},\n\nHere is a summary of ${student_first_name}'s progress in today's class:\n\nClass: ${present_class_count}\nDate: ${formattedDate}\n\n${attendanceSection}\n\n${middleSection}\n\nWe look forward to seeing ${student_first_name} in the next class!\n\nBest regards,\n${instructor_full_name}`
  }
}

export default function ParentOutreachTab({ groupId }: { groupId: string }) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])
  const [language, setLanguage] = useState<Language>("ar") // Default to Arabic
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleGenerate = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.rpc("get_parent_outreach_data", {
      p_group_id: Number(groupId),
      p_report_date: reportDate,
    })

    if (error) { toast.error(`Failed to generate report: ${error.message}`); setIsLoading(false); return; }
    if (!data || data.length === 0) { toast.info("No student data found for this group."); setIsLoading(false); return; }

    const exportData = data
      .filter((s: OutreachData) => s.parent_phone)
      .map((s: OutreachData) => ({
        Phone: `+2${s.parent_phone}`,
        Message: buildMessage(s, new Date(reportDate + 'T00:00:00'), language),
      }));

    if (exportData.length === 0) { toast.warning("No students with guardian phone numbers found."); setIsLoading(false); return; }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parent Messages");
    XLSX.writeFile(workbook, `Group_${groupId}_ParentMessages_${reportDate}.xlsx`);
    toast.success("Excel file generated!");
    setIsLoading(false);
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
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="space-y-1.5 flex-1 w-full sm:w-auto">
            <Label htmlFor="report-date">Report Date</Label>
            <Input id="report-date" type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="max-w-xs" />
          </div>
          <div className="space-y-1.5 w-full sm:w-auto">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger id="language" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto shrink-0">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isLoading ? "Generating..." : "Generate Excel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}