"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, User, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { taGroupsData, type TaGroup } from "@/lib/database"

import GradingTabContent from "./components/grading-tab"
import AttendanceTabContent from "./components/attendance-tab"

export default function GroupsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [selectedGroup, setSelectedGroup] = useState<TaGroup | null>(null)

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const handleSelectGroup = (group: TaGroup) => {
    setSelectedGroup(group)
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null)
  }

  return (
    <div className="p-6 space-y-6">
      <AnimatePresence mode="wait">
        {selectedGroup ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupDetailView group={selectedGroup} onBack={handleBackToGroups} />
          </motion.div>
        ) : (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupsLandingView onSelectGroup={handleSelectGroup} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GroupsLandingView({ onSelectGroup }: { onSelectGroup: (group: TaGroup) => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-poppins font-bold text-gray-900">Groups</h1>
        <p className="text-gray-600 mt-1">Select a group to manage.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {taGroupsData.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            className="cursor-pointer"
            onClick={() => onSelectGroup(group)}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{group.groupName}</CardTitle>
                <CardDescription>{group.courseName}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{group.studentCount} Students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{group.instructorName}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function GroupDetailView({ group, onBack }: { group: TaGroup; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-emerald-600">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{group.groupName}</CardTitle>
          <CardDescription>{group.courseName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grading">
            <TabsList className="grid w-full grid-cols-2">
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