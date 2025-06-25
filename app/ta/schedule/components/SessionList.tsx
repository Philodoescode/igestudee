"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Calendar, Clock, Link as LinkIcon, Edit, Trash2, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { type TASession } from "@/lib/database"

interface SessionListProps {
  title: string
  sessions: TASession[]
  mode: 'upcoming' | 'recent'
  onEdit?: (session: TASession) => void
  onCancel?: (sessionId: string) => void
}

const SESSIONS_TO_SHOW = 5;

export default function SessionList({ title, sessions, mode, onEdit, onCancel }: SessionListProps) {
  const [itemsToShow, setItemsToShow] = useState(SESSIONS_TO_SHOW)
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  const listVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hidden: {
      opacity: 0,
    },
  }

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      {sessions.length > 0 ? (
        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
          {sessions.slice(0, itemsToShow).map(session => {
            const sessionDate = new Date(session.dateTime)
            return (
              <motion.li key={session.id} variants={itemVariants} className="p-4 border rounded-lg bg-white">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                  <h3 className="font-semibold text-gray-800">{session.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>{format(sessionDate, "MMM d, yyyy")}</span></div>
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{format(sessionDate, "p")}</span></div>
                  </div>
                </div>
                {session.description && <p className="text-sm text-gray-600 mb-4">{session.description}</p>}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-400"/>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline truncate">
                            {session.meetingLink}
                        </a>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyLink(session.meetingLink, session.id)}>
                            {copiedLink === session.id ? <Check className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                            <span className="sr-only">Copy link</span>
                        </Button>
                    </div>

                    {mode === 'upcoming' && onEdit && onCancel && (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button variant="outline" size="sm" onClick={() => onEdit(session)}><Edit className="h-3 w-3 mr-1.5"/> Edit</Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" ><Trash2 className="h-3 w-3 mr-1.5"/> Cancel</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently cancel the session "{session.title}". This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Dismiss</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onCancel(session.id)}>Confirm Cancel</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
              </motion.li>
            )
          })}
           {sessions.length > itemsToShow && (
                <div className="text-center mt-4">
                    <Button variant="link" onClick={() => setItemsToShow(itemsToShow + SESSIONS_TO_SHOW)}>Load More</Button>
                </div>
            )}
        </motion.ul>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No {mode} sessions.</p>
          {mode === 'upcoming' && <p className="text-sm text-gray-400 mt-1">Click 'Schedule Session' to add one.</p>}
        </div>
      )}
    </section>
  )
}