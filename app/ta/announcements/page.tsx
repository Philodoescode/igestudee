// START OF app/ta/announcements/page.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRequireAuth } from "@/hooks/use-auth"
import { taAnnouncementsData } from "@/lib/database"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Megaphone, Plus } from "lucide-react"

import { AnnouncementList } from "./components/announcement-list"
import { CreateAnnouncementForm } from "./components/create-announcement-form"
import { PaginationControls } from "./components/pagination-controls"

type Announcement = {
  id: string
  author: string
  date: string
  title: string
  content: string
  group: string
}

const ITEMS_PER_PAGE = 5

export default function TAAnnouncementsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [announcements, setAnnouncements] = useState<Announcement[]>(taAnnouncementsData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) {
    return <div>Loading...</div> // A skeleton loader would be a good enhancement here
  }

  const handleCreateAnnouncement = (newAnnouncementData: Omit<Announcement, "id" | "author" | "date">) => {
    if (!newAnnouncementData.title || !newAnnouncementData.content) return

    const announcement: Announcement = {
      id: `ta-ann-${Date.now()}`,
      author: user?.name || "TA",
      date: new Date().toISOString(),
      ...newAnnouncementData,
    }
    setAnnouncements([announcement, ...announcements])
    setCurrentPage(1) // Go to the first page to see the new announcement
  }

  // Pagination logic
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAnnouncements = announcements.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            Announcements
          </h1>
          <p className="text-muted-foreground mt-2">Create and manage announcements for your student groups.</p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>New Announcement</DialogTitle>
              <DialogDescription>
                Fill in the details below to post a new announcement. It will be visible to the selected group.
              </DialogDescription>
            </DialogHeader>
            <CreateAnnouncementForm onSubmit={handleCreateAnnouncement} onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.header>

      <main>
        <AnnouncementList announcements={currentAnnouncements} />
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </div>
  )
}
// END OF app/ta/announcements/page.tsx