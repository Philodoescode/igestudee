// app/instructor/courses/components/group-detail-view.tsx
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { type Group } from "@/types/course"

import GradingTabContent from "./grading-tab"
import AttendanceTabContent from "./attendance-tab"

export default function GroupDetailView({ group, onBack }: { group: Group & { courseName: string, courseId: string }; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-emerald-600 -ml-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Groups
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{group.groupName}</h1>
        <p className="text-gray-600 mt-1">{group.courseName}</p>
      </div>

      {/* Tabs and Content */}
      <Tabs defaultValue="grading" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="grading" className="mt-6">
          {/* FIX: Pass the entire group object, not just the courseId. */}
          <GradingTabContent group={group} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <AttendanceTabContent group={group} />
        </TabsContent>
      </Tabs>
    </div>
  )
}