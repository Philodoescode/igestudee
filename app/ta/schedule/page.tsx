"use client"

import { useState, useMemo } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "sonner"
import { isAfter, isBefore, subDays } from "date-fns"
import { taScheduleData, taAvailabilityData, type TASession } from "@/lib/database"
import WeeklyAvailability from "./components/WeeklyAvailability"
import ScheduleSessionModal from "./components/ScheduleSessionModal"
import SessionList from "./components/SessionList"
import { redirect } from "next/navigation"

const INITIAL_SESSIONS_DISPLAY = 5; // Define a constant for initial display count

export default function TASchedulePage() {
  redirect('/under-construction');
  const { user, isLoading } = useRequireAuth(["ta"])
  const [sessions, setSessions] = useState<TASession[]>(taScheduleData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<TASession | null>(null)

  const { upcomingSessions, recentSessions } = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)
    
    const upcoming = sessions
      .filter(s => isAfter(new Date(s.dateTime), now))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

    const recent = sessions
      .filter(s => isBefore(new Date(s.dateTime), now) && isAfter(new Date(s.dateTime), thirtyDaysAgo))
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

    return { upcomingSessions: upcoming, recentSessions: recent }
  }, [sessions])

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>
  }
  
  const handleOpenModal = (session: TASession | null = null) => {
    setEditingSession(session)
    setIsModalOpen(true)
  }

  const handleSaveSession = (newSession: TASession) => {
    setSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === newSession.id);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newSession;
            return updated;
        }
        return [...prev, newSession];
    });
    setIsModalOpen(false);
    toast.success(`Session "${newSession.title}" has been ${editingSession ? 'updated' : 'scheduled'}!`);
  }

  const handleCancelSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast.error("Session has been cancelled.");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-8">
      <Toaster position="top-center" richColors />
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Schedule & Meetings</h1>
          <p className="text-gray-500 mt-1">Manage your availability and scheduled sessions.</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="outline" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </header>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <WeeklyAvailability availability={taAvailabilityData} />
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <SessionList 
          title="Upcoming Sessions"
          sessions={upcomingSessions}
          mode="upcoming"
          onEdit={handleOpenModal}
          onCancel={handleCancelSession}
          initialDisplayCount={INITIAL_SESSIONS_DISPLAY}
        />
        <SessionList 
          title="Recent Sessions"
          sessions={recentSessions}
          mode="recent"
          initialDisplayCount={INITIAL_SESSIONS_DISPLAY}
        />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ScheduleSessionModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            onSave={handleSaveSession}
            sessionToEdit={editingSession}
            availability={taAvailabilityData}
          />
        )}
      </AnimatePresence>
    </div>
  )
}