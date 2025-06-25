// START OF app/ta/announcements/components/create-announcement-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

type AnnouncementData = {
  title: string
  content: string
  group: string
}

interface CreateAnnouncementFormProps {
  onSubmit: (data: AnnouncementData) => void
  onSuccess: () => void
}

export function CreateAnnouncementForm({ onSubmit, onSuccess }: CreateAnnouncementFormProps) {
  const [announcement, setAnnouncement] = useState<AnnouncementData>({
    title: "",
    content: "",
    group: "all",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(announcement)
    onSuccess() // Call the success handler to close the dialog
  }

  const isFormValid = announcement.title.trim() !== "" && announcement.content.trim() !== ""

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Mid-term project deadline"
          value={announcement.title}
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Enter the full announcement details here..."
          rows={6}
          value={announcement.content}
          onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="group">Target Group</Label>
        <Select
          value={announcement.group}
          onValueChange={(value) => setAnnouncement({ ...announcement, group: value })}
        >
          <SelectTrigger id="group">
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
      <Button type="submit" disabled={!isFormValid} className="mt-2">
        <Send className="h-4 w-4 mr-2" />
        Post Announcement
      </Button>
    </form>
  )
}
// END OF app/ta/announcements/components/create-announcement-form.tsx