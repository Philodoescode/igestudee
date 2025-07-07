// app/ta/groups/components/group-detail-view.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { type TaGroup } from "@/lib/database" // Assuming TaGroup is globally accessible or imported via types

import GradingTabContent from "./grading-tab"
import AttendanceTabContent from "./attendance-tab"

export default function GroupDetailView({ group, onBack }: { group: TaGroup; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-emerald-600">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Groups
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{group.groupName}</CardTitle>
          <CardDescription>{group.courseName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grading">
            <TabsList>
              <TabsTrigger value="grading">Grading</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="grading" className="mt-4">
              <GradingTabContent courseId={group.courseId} />
            </TabsContent>
            <TabsContent value="attendance" className="mt-4">
              <AttendanceTabContent groupId={group.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}