"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Percent, CalendarCheck, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import type { CourseDetail } from "@/types/course"
import { createClient } from "@/lib/supabase/client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This is a simplified type for the data we get from our RPC call
type CourseData = {
  grades: {
    id: number;
    title: string;
    dueDate: string;
    grade: string | null;
    score: number | null;
    maxScore: number | null;
    status: 'Graded' | 'Pending';
  }[];
  attendance: {
    id: number;
    date: string;
    status: 'Present' | 'Absent' | 'Tardy';
  }[];
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
        <p className="text-muted-foreground mt-2">Could not retrieve details for this course.</p>
        <Button asChild className="mt-6">
          <Link href="/student/courses"><ArrowLeft className="mr-2 h-4 w-4" />Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const { grades, attendance } = courseData;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/student/courses" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
        {/* Title is fetched in the parent page, not here, so we show a generic one */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Course Details</h1>
      </motion.div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="grades"><Percent className="w-4 h-4 mr-2" /> Grades</TabsTrigger>
          <TabsTrigger value="attendance"><CalendarCheck className="w-4 h-4 mr-2" /> Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Grades Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {grades?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{item.grade || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Attendance Record</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {attendance?.map((att) => (
                      <TableRow key={att.id}>
                        <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={att.status === "Present" ? "default" : att.status === "Tardy" ? "secondary" : "destructive"} className={att.status === 'Present' ? 'bg-green-100 text-green-800' : ''}>
                            {att.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}