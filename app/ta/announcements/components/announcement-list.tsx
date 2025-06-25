// START OF app/ta/announcements/components/announcement-list.tsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AnnouncementCard } from "./announcement-card"
import { Megaphone } from "lucide-react"

type Announcement = {
  id: string
  author: string
  date: string
  title: string
  content: string
  group: string
}

interface AnnouncementListProps {
  announcements: Announcement[]
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 px-6 border-2 border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No announcements yet</h3>
        <p className="text-muted-foreground mt-2">Click on 'Create Announcement' to post your first one.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {announcements.map((ann, index) => (
          <motion.div
            key={ann.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <AnnouncementCard announcement={ann} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
// END OF app/ta/announcements/components/announcement-list.tsx