// courses/components/select-students-modal.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import type { Group } from "@/types/course";
import { cn } from "@/lib/utils";

type Student = {
  id: string;
  name: string;
  grade?: number | null;
};

interface SelectStudentsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (selectedStudents: Student[]) => void;
  // onDelete is no longer passed to the modal
  allStudents: Student[];
  initiallySelectedNames: string[];
  groupsInSession: Group[];
  currentGroupId: string | null;
  isEditing: boolean;
  groupName?: string;
}

const areSetsEqual = (set1: Set<string>, set2: Set<string>): boolean => {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
}

export default function SelectStudentsModal({
  isOpen,
  setIsOpen,
  onSelect,
  allStudents,
  initiallySelectedNames,
  groupsInSession,
  currentGroupId,
  isEditing,
  groupName,
}: SelectStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);


  const studentToGroupMap = useMemo(() => {
    const map = new Map<string, string>();
    groupsInSession.forEach(group => {
      if (isEditing && group.id === currentGroupId) {
        return;
      }
      group.students.forEach(student => {
        map.set(student.id, group.groupName);
      });
    });
    return map;
  }, [groupsInSession, currentGroupId, isEditing]);

  useEffect(() => {
    if (isOpen) {
      const initialIds = new Set(
        allStudents
          .filter(s => initiallySelectedNames.includes(s.name))
          .map(s => s.id)
      );
      setSelectedIds(initialIds);
      setInitialSelectedIds(initialIds);
      
      setSearchTerm("");
      setSelectedGrade("all");
      setIsDirty(false);
    }
  }, [isOpen, initiallySelectedNames, allStudents]);

  useEffect(() => {
      if (!isOpen) return;
      setIsDirty(!areSetsEqual(selectedIds, initialSelectedIds));
  }, [selectedIds, initialSelectedIds, isOpen])


  const handleClose = useCallback(() => {
    setIsOpen(false);
    setShowWarning(false);
  }, [setIsOpen]);

  const handleAttemptClose = useCallback(() => {
      if (isDirty) {
          setShowWarning(true);
      } else {
          handleClose();
      }
  }, [isDirty, handleClose]);

  const handleInteractOutside = useCallback((e: Event) => {
      if (isDirty) {
          e.preventDefault();
          setShowWarning(true);
      }
  }, [isDirty]);


  const uniqueGrades = useMemo(() => {
    const grades = new Set<number>();
    allStudents.forEach(student => {
      if (student.grade !== null && student.grade !== undefined) {
        grades.add(student.grade);
      }
    });
    return Array.from(grades).sort((a, b) => a - b);
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const gradeMatch = selectedGrade === "all" || String(student.grade) === selectedGrade;
      return nameMatch && gradeMatch;
    });
  }, [allStudents, searchTerm, selectedGrade]);

  const availableStudents = useMemo(() => {
    return filteredStudents.filter(s => !studentToGroupMap.has(s.id));
  }, [filteredStudents, studentToGroupMap]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedIds(prev => {
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
    setSelectedIds(new Set(availableStudents.map(s => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleConfirm = () => {
    const selectedStudents = allStudents.filter(s => selectedIds.has(s.id));
    onSelect(selectedStudents);
    handleClose();
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleAttemptClose()}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
        >
        <DialogHeader>
          <DialogTitle>{isEditing ? `Modify Group: ${groupName}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the student roster for this group." : "Select students to form the new group."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full sm:w-[140px] shrink-0">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {uniqueGrades.map(grade => (
                  <SelectItem key={grade} value={String(grade)}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Button variant="link" size="sm" onClick={handleSelectAll}>
                Select All Available
              </Button>
              <Button variant="link" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
            <Badge variant="secondary">{selectedIds.size} selected</Badge>
          </div>

          <ScrollArea className="h-72 w-full rounded-md border p-2">
            <div className="space-y-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const existingGroup = studentToGroupMap.get(student.id);
                  const isDisabled = !!existingGroup;

                  return (
                    <div
                      key={student.id}
                      className={cn(
                        "flex items-center space-x-3 rounded-md p-2",
                        !isDisabled && "hover:bg-slate-50 cursor-pointer",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isDisabled && handleToggleStudent(student.id)}
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedIds.has(student.id)}
                        onCheckedChange={() => !isDisabled && handleToggleStudent(student.id)}
                        disabled={isDisabled}
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className={cn(
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1",
                          !isDisabled && "cursor-pointer"
                        )}
                      >
                        {student.name}
                        {student.grade !== null && student.grade !== undefined && (
                          <span className="text-xs text-muted-foreground ml-2">(Grade {student.grade})</span>
                        )}
                      </label>
                      {isDisabled && (
                        <Badge variant="outline" className="font-normal">{existingGroup}</Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-gray-500 py-10">
                  No students found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={handleAttemptClose}>
                Cancel
            </Button>
            <Button onClick={handleConfirm}>{isEditing ? "Save Changes" : "Create Group"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
     <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to discard them and close the dialog?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClose} className="bg-destructive hover:bg-destructive/90">Discard</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}