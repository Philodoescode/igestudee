"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Group } from "@/types/course"

interface GroupInfoModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  group: Group
  sessionName: string // Keep sessionName prop
  courseTitle: string // Add courseTitle prop
}

export function GroupInfoModal({
  isOpen,
  setIsOpen,
  group,
  sessionName,
  courseTitle, // Accept courseTitle prop
}: GroupInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Update title format as requested */}
          <DialogTitle>{courseTitle}: {group.groupName} for {sessionName}</DialogTitle>
          <DialogDescription>
            {group.students.length} student{group.students.length !== 1 && 's'} in this group.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-2 space-y-1">
                {group.students.length > 0 ? (
                    group.students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50">
                            <span className="font-medium">{student.name}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-muted-foreground py-10">
                        This group has no students.
                    </div>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}