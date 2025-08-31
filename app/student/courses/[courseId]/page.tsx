"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2, BookOpen, CheckSquare, CalendarCheck, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Type definitions for the data fetched from the RPC
type GradedItemData = {
  id: number;
  title: string;
  item_date: string;
  max_score: number;
  score: number | null;
  comment: string | null;
};

type AssignmentData = {
  id: number;
  title: string;
  item_date: string;
  status: 'Done' | 'Partially Done' | 'Not Done';
  comment: string | null;
};

type AttendanceData = {
  id: number;
  item_date: string;
  status: 'Present' | 'Absent' | 'Tardy';
  comment: string | null;
};

type CourseData = {
  course_title: string;
  instructor_name: string;
  graded_items: GradedItemData[];
  assignments: AssignmentData[];
  attendance: AttendanceData[];
};

// Helper functions for styling badges
const getAssignmentStatusBadgeClass = (status: AssignmentData['status']) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-800 border-green-200";
      case "Partially Done": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Not Done": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
};

const getAttendanceStatusBadgeClass = (status: AttendanceData['status']) => {
    switch(status) {
        case 'Present': return 'bg-green-100 text-green-800 border-green-200';
        case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
        case 'Tardy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const courseId = parseInt(params.courseId, 10);

  useEffect(() => {
    const fetchDetails = async () => {
      if (isNaN(courseId)) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_student_course_details', { p_course_id: courseId });
      
      if (error) {
        console.error("Error fetching course details:", error);
      } else {
        setCourseData(data);
      }
      setIsLoading(false);
    };
    fetchDetails();
  }, [supabase, courseId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold">Course Data Not Found</h1>
        <p className="text-muted-foreground mt-2">Could not retrieve details for this course or you might not be enrolled.</p>
        <Button asChild className="mt-6">
          <Link href="/student/courses"><ArrowLeft className="mr-2 h-4 w-4" />Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const { course_title, instructor_name, graded_items, assignments, attendance } = courseData;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button variant="ghost" asChild className="-ml-4">
            <Link href="/student/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
            </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{course_title}</h1>
        <p className="text-muted-foreground">Instructor: {instructor_name}</p>
      </motion.div>

      <Tabs defaultValue="graded-items" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
          <TabsTrigger value="graded-items"><BookOpen className="w-4 h-4 mr-2" /> Graded Items</TabsTrigger>
          <TabsTrigger value="assignments"><CheckSquare className="w-4 h-4 mr-2" /> Assignments</TabsTrigger>
          <TabsTrigger value="attendance"><CalendarCheck className="w-4 h-4 mr-2" /> Attendance</TabsTrigger>
        </TabsList>

        {/* Graded Items Tab */}
        <TabsContent value="graded-items" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Graded Items</CardTitle><CardDescription>Your scores on tests, quizzes, and other graded work.</CardDescription></CardHeader>
            <CardContent>
                {graded_items.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {graded_items.map(item => (
                            <AccordionItem value={`gi-${item.id}`} key={item.id}>
                                <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-4 rounded-md">
                                    <div className="flex flex-1 items-center justify-between gap-4 w-full pr-2 text-left">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{format(parseISO(item.item_date), "MMMM d, yyyy")}</p>
                                        </div>
                                        <div className="font-mono text-lg font-medium text-right flex-shrink-0">
                                            {item.score ?? '-'}<span className="text-sm text-muted-foreground"> / {item.max_score}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                {item.comment && (
                                    <AccordionContent className="p-4 border-t bg-slate-50 dark:bg-zinc-800/50">
                                        <p className="text-sm text-muted-foreground flex items-start gap-2"><MessageSquare className="h-4 w-4 mt-0.5 shrink-0"/><span>{item.comment}</span></p>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : <p className="text-center text-muted-foreground py-8">No graded items found for this course yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Assignments</CardTitle><CardDescription>Your completion status for homework and other assignments.</CardDescription></CardHeader>
            <CardContent>
                {assignments.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {assignments.map(item => (
                             <AccordionItem value={`a-${item.id}`} key={item.id}>
                                <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-4 rounded-md">
                                     <div className="flex flex-1 items-center justify-between gap-4 w-full pr-2 text-left">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{format(parseISO(item.item_date), "MMMM d, yyyy")}</p>
                                        </div>
                                        <Badge variant="outline" className={cn("text-sm", getAssignmentStatusBadgeClass(item.status))}>{item.status}</Badge>
                                    </div>
                                </AccordionTrigger>
                                {item.comment && (
                                    <AccordionContent className="p-4 border-t bg-slate-50 dark:bg-zinc-800/50">
                                        <p className="text-sm text-muted-foreground flex items-start gap-2"><MessageSquare className="h-4 w-4 mt-0.5 shrink-0"/><span>{item.comment}</span></p>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : <p className="text-center text-muted-foreground py-8">No assignments found for this course yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-6">
           <Card>
            <CardHeader><CardTitle>Attendance</CardTitle><CardDescription>Your attendance record for all sessions.</CardDescription></CardHeader>
            <CardContent>
                {attendance.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {attendance.map(item => (
                             <AccordionItem value={`att-${item.id}`} key={item.id}>
                                <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-4 rounded-md">
                                     <div className="flex flex-1 items-center justify-between gap-4 w-full pr-2 text-left">
                                        <p className="font-semibold truncate">Attendance for {format(parseISO(item.item_date), "MMMM d, yyyy")}</p>
                                        <Badge variant="outline" className={cn("text-sm", getAttendanceStatusBadgeClass(item.status))}>{item.status}</Badge>
                                    </div>
                                </AccordionTrigger>
                                {item.comment && (
                                    <AccordionContent className="p-4 border-t bg-slate-50 dark:bg-zinc-800/50">
                                        <p className="text-sm text-muted-foreground flex items-start gap-2"><MessageSquare className="h-4 w-4 mt-0.5 shrink-0"/><span>{item.comment}</span></p>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : <p className="text-center text-muted-foreground py-8">No attendance records found for this course yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}