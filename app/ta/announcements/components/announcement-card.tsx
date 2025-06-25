// START OF app/ta/announcements/components/announcement-card.tsx
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Users } from "lucide-react"

type Announcement = {
  id: string
  author: string
  date: string
  title: string
  content: string
  group: string
}

interface AnnouncementCardProps {
  announcement: Announcement
}

const groupDisplayConfig: {
  [key: string]: { name: string }
} = {
  all: { name: "All Groups" },
  "group-a": { name: "ICT Fundamentals - Group A" },
  "group-b": { name: "Mathematics - Group B" },
  "group-c": { name: "ICT Practical - Group C" },
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { author, date, title, content, group } = announcement

  const formattedDate = new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const { name: groupName } = groupDisplayConfig[group] || { name: "Unknown Group" }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800 dark:hover:shadow-primary/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-2 gap-x-4">
          <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap py-1 px-2.5 text-xs font-medium">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {groupName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Using whitespace-pre-wrap to respect newlines in the content */}
        <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span>
              Posted by <span className="font-medium text-foreground">{author}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
// END OF app/ta/announcements/components/announcement-card.tsx