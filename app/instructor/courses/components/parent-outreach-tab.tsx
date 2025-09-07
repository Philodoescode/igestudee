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

  // normalize student name (trim and collapse extra spaces) — names are in English per your note
  const studentName = (student_first_name ?? "").replace(/\s+/g, " ").trim()
  // also trim parent name in case you still use it elsewhere later
  const parentName = (parent_first_name ?? "").replace(/\s+/g, " ").trim() || "ولي الأمر"

  // Helpers to force WhatsApp formatting when mixing Arabic (RTL) and English (LTR).
  // We insert LEFT-TO-RIGHT MARK (\u200E) inside the formatting markers so WhatsApp detects them.
  const LRM = "\u200E"
  const wrapBold = (s: string) => `*${LRM}${s}${LRM}*`
  const wrapItalic = (s: string) => `_${LRM}${s}${LRM}_`

  if (lang === "ar") {
    const formattedDate = format(reportDate, "dd/MM/yyyy")

    // Time-aware greeting (uses client's current local time)
    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 12 ? "صباح الخير،" : "مساء الخير،"

    // mapping for statuses
    type TKey = "Done" | "Partially Done" | "Not Done" | "Present" | "Tardy"
    const t = (key: TKey) => {
      return {
        "Done": "تم إنجازه",
        "Partially Done": "تم إنجازه جزئيًا",
        "Not Done": "لم يتم إنجازه",
        "Present": "حاضر في الوقت المحدد",
        "Tardy": "تأخر قليلًا"
      }[key]
    }

    // Absent Template (Arabic) — no parent name inserted after greeting to avoid duplication
    if (attendance_status === "Absent" || !attendance_status) {
      return `${greeting}\n\nأردت إبلاغك أن ${wrapBold(studentName)} لم يحضر حصة اليوم (${wrapItalic(formattedDate)}).\n\nمع خالص التحية،\n${instructor_full_name}`
    }

    const hasAssignments = assignments && assignments.length > 0
    const hasGradedItems = graded_items && graded_items.length > 0

    // attendance section — attendance_status is either "Present" or "Tardy" here
    const attendanceKey = (attendance_status as ("Present" | "Tardy")) as TKey
    let attendanceSection = `*الحضور:*\n${wrapBold(studentName)} كان ${t(attendanceKey)} في الحصة اليوم.`
    if (attendance_comment) attendanceSection += `\n_ملاحظة:_ ${attendance_comment}`

    // Assignments section
    const assignmentsSection = hasAssignments
      ? `*الواجبات:*\n` + assignments.map(a =>
          ` - ${a.title}: ${wrapBold(t(a.status as TKey))}` + (a.comment ? `\n   _ملاحظة:_ ${a.comment}` : "")
        ).join("\n")
      : ""

    // Graded items section
    const gradedItemsSection = hasGradedItems
      ? `*التقييمات:*\n` + graded_items.map(gi =>
          ` - ${gi.title}: ${wrapBold(gi.score ?? "N/A")} / ${wrapItalic(String(gi.max_mark))}` + (gi.comment ? `\n   _ملاحظة:_ ${gi.comment}` : "")
        ).join("\n")
      : ""

    let middleSection: string
    if (hasAssignments && hasGradedItems) middleSection = `${assignmentsSection}\n\n${gradedItemsSection}`
    else if (hasAssignments) middleSection = `${assignmentsSection}\n\nلم يكن هناك تقييمات لهذا اليوم.`
    else if (hasGradedItems) middleSection = `لم يكن هناك واجبات مطلوبة لهذا اليوم.\n\n${gradedItemsSection}`
    else middleSection = `لم يكن هناك واجبات أو تقييمات لهذا اليوم.`

    // Short headline as requested; use wrapBold on the student name so WhatsApp bold works
    return `${greeting}\n\nملخص ${wrapBold(studentName)} في حصة اليوم:\n\n_رقم الحصة:_ ${wrapBold(String(present_class_count))}\n_التاريخ:_ ${wrapItalic(formattedDate)}\n\n${attendanceSection}\n\n${middleSection}\n\nنتمنى لـ${wrapBold(studentName)} دوام التوفيق ونلقاه في الحصة القادمة بإذن الله.\n\nخالص التحية،\n${instructor_full_name}`
  } else { // English (unchanged)
    const formattedDate = format(reportDate, "MMMM d, yyyy")
    const parentDisplay = parent_first_name || "Guardian"
    
    // Absent Template (English)
    if (attendance_status === "Absent" || !attendance_status) {
      return `Hello ${parentDisplay},\n\n${studentName} was absent for today's class, ${formattedDate}.\n\nBest regards,\n${instructor_full_name}`
    }

    // Present/Tardy Template (English)
    const hasAssignments = assignments && assignments.length > 0
    const hasGradedItems = graded_items && graded_items.length > 0

    let attendanceSection = `Attendance:\n${studentName} was ${attendance_status === "Tardy" ? "tardy" : "present and on time"} for class today.`
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

    return `Hello ${parentDisplay},\n\nHere is a summary of ${studentName}'s progress in today's class:\n\nClass: ${present_class_count}\nDate: ${formattedDate}\n\n${attendanceSection}\n\n${middleSection}\n\nWe look forward to seeing ${studentName} in the next class!\n\nBest regards,\n${instructor_full_name}`
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
