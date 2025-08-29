// app/ta/groups/components/select-students-modal.tsx
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/lib/database";
import { Search } from "lucide-react";

interface SelectStudentsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (selectedStudents: Student[]) => void;
  allStudents: Student[];
  initiallySelectedNames: string[];
}

export default function SelectStudentsModal({
  isOpen,
  setIsOpen,
  onSelect,
  allStudents,
  initiallySelectedNames,
}: SelectStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      const initialIds = new Set(
        allStudents
          .filter((s) => initiallySelectedNames.includes(s.name))
          .map((s) => s.id)
      );
      setSelectedIds(initialIds);
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
    setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleConfirm = () => {
    const selectedStudents = allStudents.filter((s) => selectedIds.has(s.id));
    onSelect(selectedStudents);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Students</DialogTitle>
          <DialogDescription>
            Choose students to add to the group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Button variant="link" size="sm" onClick={handleSelectAll}>
                Select All
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
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-3 rounded-md p-2 hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleToggleStudent(student.id)}
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedIds.has(student.id)}
                      onCheckedChange={() => handleToggleStudent(student.id)}
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                    >
                      {student.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-10">
                  No students found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Selection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}