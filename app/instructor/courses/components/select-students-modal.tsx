// courses/components/select-students-modal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Group } from "@/types/course";

interface Student {
  id: string;
  name: string;
  grade?: number | null;
}

interface SelectStudentsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (selectedStudents: Student[]) => void;
  allStudents: Student[];
  initiallySelectedNames: string[];
  groupsInSession?: Group[];
  currentGroupId?: string | null;
  isEditing: boolean;
  onDelete?: () => void;
  groupName?: string;
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
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const assignedStudentsMap = useMemo(() => {
    const map = new Map<string, string>();
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
      setGradeFilter("all");
    }
  }, [isOpen, initiallySelectedNames, allStudents]);

  const availableGrades = useMemo(() => {
    const grades = new Set<number>();
    allStudents.forEach(student => {
      if (student.grade != null) grades.add(student.grade);
    });
    return Array.from(grades).sort((a, b) => a - b);
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const gradeMatch = gradeFilter === "all" || student.grade === Number(gradeFilter);
      return nameMatch && gradeMatch;
    });
  }, [allStudents, searchTerm, gradeFilter]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(studentId) ? newSet.delete(studentId) : newSet.add(studentId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const visibleUnassignedIds = filteredStudents
      .filter(s => !assignedStudentsMap.has(s.id))
      .map(s => s.id);
    setSelectedIds(new Set(visibleUnassignedIds));
  };

  const handleClearSelection = () => setSelectedIds(new Set());

  const handleConfirm = () => {
    const selectedStudents = allStudents.filter(s => selectedIds.has(s.id));
    onSelect(selectedStudents);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 
        Key Fix 1: The DialogContent is now a flex container with a max height.
        Padding is removed (`p-0`) to allow precise control of child layouts.
      */}
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        
        {/* Header: Fixed height, with its own padding. */}
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>{isEditing ? `Modify Group: ${groupName}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the student list for this group."
              : "Choose students for the new group. A name will be auto-assigned."}
          </DialogDescription>
        </DialogHeader>

        {/* 
          Key Fix 2: This is the main body. It grows to fill available space (`flex-1`) 
          and establishes a new flex context for the controls and the scrollable list.
          `min-h-0` is CRITICAL for allowing flex children to shrink and scroll.
        */}
        <div className="flex-1 flex flex-col gap-4 p-6 min-h-0">
          
          {/* Controls section (Search, Filter). Fixed height. */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by grade..." />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {availableGrades.map(grade => (
                      <SelectItem key={grade} value={String(grade)}>
                          Grade {grade}
                      </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Select All / Clear All section. Fixed height. */}
          <div className="flex-shrink-0 flex items-center justify-between text-sm">
            <div className="space-x-1">
              <Button variant="link" size="sm" className="h-auto p-1" onClick={handleSelectAll}>
                Select All Visible
              </Button>
              <span className="text-muted-foreground">/</span>
              <Button variant="link" size="sm" className="h-auto p-1" onClick={handleClearSelection}>
                Clear Selection
              </Button>
            </div>
            <Badge variant="secondary" className="font-mono">
              {selectedIds.size} / {filteredStudents.filter(s => !assignedStudentsMap.has(s.id)).length}
            </Badge>
          </div>

          {/* 
            Key Fix 3: The scrollable area. `flex-1` makes it take all remaining space.
            `relative` positioning contains the absolutely positioned ScrollArea.
          */}
          <div className="flex-1 relative">
            <ScrollArea className="absolute inset-0 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => {
                    const assignedToGroup = assignedStudentsMap.get(student.id);
                    const isDisabled = !!assignedToGroup;
                    return (
                      <div
                        key={student.id}
                        className={cn(
                          "flex items-center gap-3 rounded-md p-2",
                          isDisabled ? "opacity-60" : "cursor-pointer hover:bg-accent"
                        )}
                        onClick={isDisabled ? undefined : () => handleToggleStudent(student.id)}
                      >
                        <Checkbox
                          checked={!isDisabled && selectedIds.has(student.id)}
                          disabled={isDisabled}
                        />
                        <label className={cn("flex-1", isDisabled ? "cursor-not-allowed" : "cursor-pointer")}>
                          {student.name}
                        </label>
                        {assignedToGroup && (
                          <Badge variant="outline">In {assignedToGroup}</Badge>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No students found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer: Fixed height, with its own padding. */}
        <DialogFooter className="p-6 pt-4 border-t sm:justify-between">
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
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>
              {isEditing ? `Save Changes (${selectedIds.size})` : `Create Group (${selectedIds.size})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}