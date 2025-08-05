"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Student } from "@/types/user";
import type { Group } from "@/types/course";

interface SelectStudentsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (selectedStudents: Student[]) => void;
  allStudents: Student[];
  initiallySelectedNames: string[];
  groupsInSession?: Group[];
  currentGroupId?: string | null;
  // NEW PROPS FOR DELETE FUNCTIONALITY
  isEditing: boolean;
  onDelete?: () => void;
  groupName?: string; // To show in the delete confirmation
}

export default function SelectStudentsModal({
  isOpen,
  setIsOpen,
  onSelect,
  allStudents,
  initiallySelectedNames,
  groupsInSession = [],
  currentGroupId = null,
  isEditing,
  onDelete,
  groupName,
}: SelectStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const assignedStudentsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!groupsInSession) return map;
    for (const group of groupsInSession) {
      if (group.id === currentGroupId) continue;
      for (const student of group.students) {
        map.set(student.id, group.groupName);
      }
    }
    return map;
  }, [groupsInSession, currentGroupId]);

  useEffect(() => {
    if (isOpen) {
      const initialIds = new Set(
        allStudents
          .filter((s) => initiallySelectedNames.includes(s.name))
          .map((s) => s.id)
      );
      setSelectedIds(initialIds);
      setSearchTerm("");
    }
  }, [isOpen, initiallySelectedNames, allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStudents, searchTerm]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const availableStudentIds = filteredStudents
      .filter((s) => !assignedStudentsMap.has(s.id))
      .map((s) => s.id);
    setSelectedIds(new Set(availableStudentIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleConfirm = () => {
    const selectedStudents = allStudents.filter((s) => selectedIds.has(s.id));
    onSelect(selectedStudents);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Modify Group: ${groupName}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the student list for this group."
              : "Choose students for the new group. A name will be auto-assigned."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="space-x-1">
              <Button variant="link" size="sm" className="h-auto p-1" onClick={handleSelectAll}>
                Select All Visible
              </Button>
              <span className="text-muted-foreground">/</span>
              <Button variant="link" size="sm" className="h-auto p-1" onClick={handleClearSelection}>
                Clear Selection
              </Button>
            </div>
            <Badge variant="secondary" className="font-mono px-2.5 py-1 text-xs">
              {selectedIds.size} / {filteredStudents.filter((s) => !assignedStudentsMap.has(s.id)).length}
            </Badge>
          </div>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-1 pr-1">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const assignedToGroup = assignedStudentsMap.get(student.id);
                  const isDisabled = !!assignedToGroup;
                  return (
                    <div
                      key={student.id}
                      className={cn(
                        "flex items-center gap-3 rounded-md p-2 transition-colors",
                        isDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      )}
                      onClick={isDisabled ? undefined : () => handleToggleStudent(student.id)}
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={!isDisabled && selectedIds.has(student.id)}
                        disabled={isDisabled}
                        aria-label={`Select ${student.name}`}
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className={cn(
                          "font-medium leading-none flex-1",
                          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                      >
                        {student.name}
                      </label>
                      {assignedToGroup && (
                        <Badge variant="outline" className="text-xs font-normal">
                          In {assignedToGroup}
                        </Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground py-10 flex flex-col items-center gap-2">
                  <Users className="h-8 w-8 text-muted-foreground/50" />
                  <p>No students found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="pt-4 border-t sm:justify-between">
          {/* --- NEW DELETE BUTTON SECTION --- */}
          <div>
            {isEditing && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the group <span className="font-semibold">'{groupName}'</span>. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {/* --- END OF NEW SECTION --- */}
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {isEditing ? `Save Changes (${selectedIds.size})` : `Create Group (${selectedIds.size})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}