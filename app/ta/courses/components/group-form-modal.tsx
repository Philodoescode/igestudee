// app/ta/courses/components/group-form-modal.tsx
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ChevronsUpDown, X, Trash2 } from "lucide-react";
import { type TaGroup, type Student, type Course, type CourseSession } from "@/lib/database";
import { cn } from "@/lib/utils";

interface GroupFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (group: Omit<TaGroup, 'id' | 'groupName'> | TaGroup) => void;
  onDelete: (groupId: string) => void;
  groupToEdit: TaGroup | null;
  sessionId: string | null;
  allStudents: Student[];
  allCourses: Course[];
  allSessions: CourseSession[];
  allGroups: TaGroup[];
}

const getInitialFormData = () => ({
    students: [] as Student[],
});

export default function GroupFormModal({
  isOpen,
  setIsOpen,
  onSave,
  onDelete,
  groupToEdit,
  sessionId,
  allStudents,
  allCourses,
  allSessions,
  allGroups
}: GroupFormModalProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);

  useEffect(() => {
    if (groupToEdit) {
      setFormData({ students: groupToEdit.students });
    } else {
      setFormData(getInitialFormData());
    }
    setErrors({});
  }, [groupToEdit, isOpen]);

  const activeSessionId = groupToEdit?.sessionId ?? sessionId;

  const sessionDetails = useMemo(() => {
    if (!activeSessionId) return null;
    const session = allSessions.find(s => s.id === activeSessionId);
    if (!session) return null;
    const course = allCourses.find(c => c.id === session.courseId);
    return { session, course };
  }, [activeSessionId, allSessions, allCourses]);

  const assignedStudentIds = useMemo(() => {
    if (!activeSessionId) return new Set<string>();

    const otherGroupsInSession = allGroups.filter(
        g => g.sessionId === activeSessionId && g.id !== groupToEdit?.id
    );

    const studentIds = otherGroupsInSession.flatMap(g => g.students.map(s => s.id));
    return new Set(studentIds);
  }, [activeSessionId, allGroups, groupToEdit]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.students.length === 0) newErrors.students = "At least one student is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validate() || !activeSessionId) return;
    setIsSaving(true);
    
    const dataToSave = groupToEdit
      ? { ...groupToEdit, students: formData.students } // For editing
      : { sessionId: activeSessionId, students: formData.students }; // For creating

    setTimeout(() => {
        onSave(dataToSave);
        setIsSaving(false);
    }, 1000);
  };
  
  const handleDelete = () => {
    if (groupToEdit) {
      onDelete(groupToEdit.id);
    }
  }

  const availableStudentsForCourse = useMemo(() => {
    if (!sessionDetails?.course) return [];
    return allStudents.filter(s => s.registeredCourses.includes(sessionDetails.course!.title as 'ICT' | 'Mathematics'));
  }, [sessionDetails, allStudents]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{groupToEdit ? `Modify ${groupToEdit.groupName}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {groupToEdit ? `For session: ${sessionDetails?.session?.month} ${sessionDetails?.session?.year}` : "Assign students to a new group for the selected session."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 max-h-[60vh] pr-2 -mr-2 overflow-y-auto">
          <div className="grid gap-2">
            <Label>Students</Label>
            <Popover open={isStudentSelectorOpen} onOpenChange={setIsStudentSelectorOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={isStudentSelectorOpen} className="w-full justify-between" disabled={!activeSessionId}>
                        {formData.students.length > 0 ? `${formData.students.length} student(s) selected` : "Select students..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search students..." />
                        <CommandList>
                            <CommandEmpty>No students found for this course.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-48">
                                  <TooltipProvider>
                                    {availableStudentsForCourse.map((student) => {
                                        const isAssigned = assignedStudentIds.has(student.id);
                                        const isSelected = formData.students.some(s => s.id === student.id);
                                        return (
                                        <Tooltip key={student.id} delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <div className="w-full">
                                                    <CommandItem
                                                        value={student.name}
                                                        disabled={isAssigned}
                                                        onSelect={() => {
                                                            if (isAssigned) return;
                                                            setFormData(prev => ({ ...prev, students: isSelected ? prev.students.filter(s => s.id !== student.id) : [...prev.students, student] }));
                                                        }}
                                                        className={cn(isAssigned && "text-muted-foreground cursor-not-allowed")}
                                                        >
                                                        <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                                        {student.name}
                                                    </CommandItem>
                                                </div>
                                            </TooltipTrigger>
                                            {isAssigned && (
                                                <TooltipContent>
                                                    <p>Student is already in another group for this session.</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    )})}
                                  </TooltipProvider>
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {errors.students && <p className="text-xs text-red-500">{errors.students}</p>}
            {formData.students.length > 0 && (
                <ScrollArea className="max-h-24 w-full rounded-md border p-2">
                    <div className="flex flex-wrap gap-1">
                        {formData.students.map(student => (
                            <Badge key={student.id} variant="secondary">
                                {student.name}
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== student.id) }))} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
          <div>
          {groupToEdit && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button" className="w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the group <span className="font-semibold">'{groupToEdit.groupName}'</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
           )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}> Cancel </Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {groupToEdit ? "Save Changes" : "Create Group"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}