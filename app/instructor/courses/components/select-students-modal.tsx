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
  onDelete?: () => void;
  allStudents: Student[];
  initiallySelectedNames: string[];
  groupsInSession: Group[];
  currentGroupId: string | null;
  isEditing: boolean;
  groupName?: string;
}

export default function SelectStudentsModal({
  isOpen,
  setIsOpen,
  onSelect,
  onDelete,
  allStudents,
  initiallySelectedNames,
  groupsInSession,
  currentGroupId,
  isEditing,
  groupName,
}: SelectStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Create a map of students already in other groups within the same session
  const studentToGroupMap = useMemo(() => {
    const map = new Map<string, string>();
    groupsInSession.forEach(group => {
      // Exclude students from the group currently being edited
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
    }
  }, [isOpen, initiallySelectedNames, allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStudents, searchTerm]);

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
    // Only select students that are not disabled
    setSelectedIds(new Set(availableStudents.map(s => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleConfirm = () => {
    const selectedStudents = allStudents.filter(s => selectedIds.has(s.id));
    onSelect(selectedStudents);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Modify Group: ${groupName}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the student roster for this group." : "Select students to form the new group."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
        <DialogFooter className="flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
            <div>
              {isEditing && onDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button" className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Group
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the group <span className="font-semibold">'{groupName}'</span> and all of its associated data.
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm}>{isEditing ? "Save Changes" : "Create Group"}</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}