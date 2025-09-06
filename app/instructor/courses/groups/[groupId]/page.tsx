"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertCircle, MessageSquareShare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import GradedItemsTab from "../../components/graded-items-tab"
import AssignmentsTab from "../../components/assignments-tab"
import AttendanceTab from "../../components/attendance-tab"
import ParentOutreachTab from "../../components/parent-outreach-tab"

type GroupDetails = {
  id: number
  name: string
  course_title: string
  session_name: string
  students: { id: string; name: string }[]
}

export default function GroupDetailPage({ params }: { params: { groupId: string } }) {
  const { groupId } = params
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true)
      const { data, error: rpcError } = await supabase.rpc("get_group_details", {
        p_group_id: Number(groupId),
      })

      if (rpcError) {
        console.error("Error fetching group details:", rpcError)
        setError(rpcError.message)
        setGroupDetails(null)
      } else {
        setGroupDetails(data)
        setError(null)
      }
      setIsLoading(false)
    }

    if (groupId) {
      fetchGroupDetails()
    }
  }, [groupId, supabase])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Group</AlertTitle>
        <AlertDescription>
          There was a problem fetching the group data: {error}
          <div className="mt-4">
            <Button asChild variant="secondary">
              <Link href="/instructor/courses">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Courses
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (!groupDetails) {
    return <p>No group details found.</p>
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-4">
        <Link href="/instructor/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{groupDetails.name}</h1>
        <p className="text-gray-600 mt-1">
          {groupDetails.course_title} &middot; {groupDetails.session_name}
        </p>
      </div>

      <Tabs defaultValue="graded-items" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
          <TabsTrigger value="graded-items">Graded Items</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="parent-outreach">
            <MessageSquareShare className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Parent Outreach</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graded-items" className="mt-6">
          <GradedItemsTab groupId={groupId} students={groupDetails.students} />
        </TabsContent>
        <TabsContent value="assignments" className="mt-6">
          <AssignmentsTab groupId={groupId} students={groupDetails.students} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <AttendanceTab groupId={groupId} students={groupDetails.students} />
        </TabsContent>
        <TabsContent value="parent-outreach" className="mt-6">
          <ParentOutreachTab groupId={groupId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}