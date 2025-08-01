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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ChevronsUpDown, X, Trash2 } from "lucide-react";
import { taGroupsData } from "@/lib/database";
import type { TaGroup } from "@/types/course";
import type { Student, Instructor } from "@/types/user";
import { cn } from "@/lib/utils";


interface GroupFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (group: TaGroup) => void;
  onDelete: (groupId: string) => void;
  group: TaGroup | null;
  allStudents: Student[];
  allInstructors: Instructor[];
}

export default function GroupFormModal({
  isOpen,
  setIsOpen,
  onSave,
  onDelete,
  group,
  allStudents,
  allInstructors,
}: GroupFormModalProps) {
  const [formData, setFormData] = useState({
    groupName: "",
    courseName: "",
    instructorName: "",
    students: [] as Student[],
    isActive: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);

  useEffect(() => {
    if (group) {
      setFormData({
        groupName: group.groupName,
        courseName: group.courseName,
        instructorName: group.instructorName,
        students: group.students,
        isActive: group.isActive,
      });
    } else {
      setFormData({
        groupName: "",
        courseName: "",
        instructorName: "",
        students: [],
        isActive: true,
      });
    }
    setErrors({});
  }, [group, isOpen]);

  useEffect(() => {
    if (!group && formData.courseName) {
      const groupsInCourse = taGroupsData.filter(g => g.courseName === formData.courseName);
      const existingNumbers = new Set(
        groupsInCourse.map(g => {
          const match = g.groupName.match(/Group (\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      let nextNumber = 1;
      while (existingNumbers.has(nextNumber)) {
        nextNumber++;
      }
      setFormData(prev => ({ ...prev, groupName: `Group ${nextNumber}` }));
    } else if (!group && !formData.courseName) {
      setFormData(prev => ({ ...prev, groupName: "" }));
    }
  }, [formData.courseName, group]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.groupName.trim()) newErrors.groupName = "A course must be selected to generate a group number.";
    if (!formData.courseName.trim()) newErrors.courseName = "Course Name is required.";
    if (!formData.instructorName) newErrors.instructorName = "Instructor is required.";
    if (formData.students.length === 0) newErrors.students = "At least one student is required.";
    
    if (!group) {
        const groupExists = taGroupsData.some(g => g.courseName === formData.courseName && g.groupName === formData.groupName);
        if (groupExists) {
            newErrors.groupName = `Group number ${formData.groupName} already exists for ${formData.courseName}. The number should auto-increment.`;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);

    const groupData: TaGroup = {
      id: group?.id || `group-${Date.now()}`,
      groupName: formData.groupName,
      courseName: formData.courseName,
      courseId: formData.courseName.toLowerCase().replace(/\s+/g, '-'),
      instructorName: formData.instructorName,
      students: formData.students,
      studentCount: formData.students.length,
      isActive: formData.isActive,
    };
    
    setTimeout(() => {
        onSave(groupData);
        setIsSaving(false);
    }, 1000);
  };
  
  const handleDelete = () => {
    if (group) {
      onDelete(group.id);
    }
  }

  const availableStudentsForCourse = useMemo(() => {
    if (!formData.courseName) return [];
    return allStudents.filter(s => s.registeredCourses.includes(formData.courseName as 'ICT' | 'Mathematics'));
  }, [formData.courseName, allStudents]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{group ? "Modify Group" : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {group ? `Editing group: ${group.groupName}` : "Fill out the details for the new group."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] w-full pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Select
                value={formData.courseName}
                onValueChange={(value) => setFormData({ ...formData, courseName: value, students: [] })} // Reset students on course change
              >
                <SelectTrigger id="courseName">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="ICT">ICT</SelectItem>
                </SelectContent>
              </Select>
              {errors.courseName && <p className="text-xs text-red-500">{errors.courseName}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="groupName">Group Number</Label>
              <Input
                id="groupName"
                value={formData.groupName}
                disabled
                placeholder="Select a course to generate number"
              />
              {errors.groupName && <p className="text-xs text-red-500">{errors.groupName}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="instructorName">Instructor Name</Label>
              <Select
                value={formData.instructorName}
                onValueChange={(value) => setFormData({ ...formData, instructorName: value })}
              >
                <SelectTrigger id="instructorName">
                  <SelectValue placeholder="Select an instructor" />
                </SelectTrigger>
                <SelectContent>
                  {allInstructors.map((inst) => (
                    <SelectItem key={inst.id} value={inst.name}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.instructorName && <p className="text-xs text-red-500">{errors.instructorName}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Students</Label>
              <Popover open={isStudentSelectorOpen} onOpenChange={setIsStudentSelectorOpen}>
                  <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isStudentSelectorOpen}
                          className="w-full justify-between"
                          disabled={!formData.courseName}
                      >
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
                                      {availableStudentsForCourse.map((student) => (
                                          <CommandItem
                                              key={student.id}
                                              value={student.name}
                                              onSelect={() => {
                                                  const isSelected = formData.students.some(s => s.id === student.id);
                                                  if (isSelected) {
                                                      setFormData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== student.id) }));
                                                  } else {
                                                      setFormData(prev => ({ ...prev, students: [...prev.students, student] }));
                                                  }
                                              }}
                                          >
                                              <Check
                                                  className={cn(
                                                      "mr-2 h-4 w-4",
                                                      formData.students.some(s => s.id === student.id) ? "opacity-100" : "opacity-0"
                                                  )}
                                              />
                                              {student.name}
                                          </CommandItem>
                                      ))}
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
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
          <div>
          {group && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button" className="w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Group
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the group <span className="font-semibold">'{group.groupName}'</span> and all of its associated data.
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {group ? "Save Changes" : "Create Group"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}