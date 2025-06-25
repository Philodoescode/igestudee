"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Plus, Send, Clock, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { taAnnouncementsData } from "@/lib/database"

export default function TAAnnouncementsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [announcements, setAnnouncements] = useState(taAnnouncementsData)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", group: "all" })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return

    const announcement = {
      id: `ta-ann-${Date.now()}`,
      author: user?.name || "TA",
      date: new Date().toISOString(),
      ...newAnnouncement,
    }
    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ title: "", content: "", group: "all" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">Create and manage announcements for your student groups.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Announcement Form */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Create New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter announcement details..."
                  rows={5}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Target Group</Label>
                <Select value={newAnnouncement.group} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="group-a">ICT Fundamentals - Group A</SelectItem>
                    <SelectItem value="group-b">Mathematics - Group B</SelectItem>
                    <SelectItem value="group-c">ICT Practical - Group C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreateAnnouncement}>
                <Send className="h-4 w-4 mr-2" />
                Post Announcement
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posted Announcements List */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-purple-600" />
                Your Posted Announcements
              </CardTitle>
              <CardDescription>A list of announcements you have created.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                    <Badge variant="outline">{ann.group}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{ann.content}</p>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{ann.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(ann.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No announcements posted yet.</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}