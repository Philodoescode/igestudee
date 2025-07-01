// app/ta/groups/components/group-form-modal.tsx
"use client";

import { useState, useEffect, useMemo, type ChangeEvent } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { taGroupsData, type TaGroup, type Student, type Instructor } from "@/lib/database";
import SelectStudentsModal from "./select-students-modal";

interface GroupFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (group: TaGroup) => void;
  group: TaGroup | null;
  allStudents: Student[];
  allInstructors: Instructor[];
  totalGroups: number;
}

export default function GroupFormModal({
  isOpen,
  setIsOpen,
  onSave,
  group,
  allStudents,
  allInstructors,
  totalGroups,
}: GroupFormModalProps) {
  const [formData, setFormData] = useState({
    groupName: "",
    courseName: "",
    instructorName: "",
    studentsText: "",
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
        studentsText: group.students.map((s) => s.name).join("\n"),
        isActive: group.isActive,
      });
    } else {
       const existingGroupNumbers = new Set(
        taGroupsData.map(g => {
          const match = g.groupName.match(/Group (\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      let nextGroupNumber = 1;
      while(existingGroupNumbers.has(nextGroupNumber)) {
        nextGroupNumber++;
      }

      setFormData({
        groupName: `Group ${nextGroupNumber}`,
        courseName: "",
        instructorName: "",
        studentsText: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [group, isOpen, totalGroups]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.groupName.trim()) newErrors.groupName = "Group Number is required.";
    if (!formData.courseName.trim()) newErrors.courseName = "Course Name is required.";
    if (!formData.instructorName) newErrors.instructorName = "Instructor is required.";
    
    // Check for duplicate group number only when adding a new group
    // and if the generated name wasn't manually overridden.
    if (!group && formData.groupName.startsWith("Group ")) {
        const groupNumber = parseInt(formData.groupName.replace("Group ", ""), 10);
        const existingGroup = taGroupsData.find(g => g.groupName === `Group ${groupNumber}`);
        if(existingGroup) {
             newErrors.groupName = `Group ${groupNumber} already exists. The number should auto-increment.`;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleStudentListChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.includes(",") || value.includes(";")) {
      const studentNames = value
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      setFormData({ ...formData, studentsText: studentNames.join("\n") });
    } else {
      setFormData({ ...formData, studentsText: value });
    }
  };
  
  const handleStudentsSelected = (selected: Student[]) => {
    const studentNames = selected.map(s => s.name).join('\n');
    setFormData(prev => ({ ...prev, studentsText: studentNames }));
  };
  
  const availableStudentsForCourse = useMemo(() => {
    if (!formData.courseName) return [];
    return allStudents.filter(s => s.registeredCourses.includes(formData.courseName as 'ICT' | 'Mathematics'));
  }, [formData.courseName, allStudents]);

  const currentSelectedStudentNames = useMemo(() => {
    return formData.studentsText.split(/[\n]/).map(s => s.trim()).filter(Boolean);
  }, [formData.studentsText]);

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);

    const studentNames = formData.studentsText.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    const students: Student[] = studentNames.map(name => {
      const existingStudent = allStudents.find(s => s.name.toLowerCase() === name.toLowerCase());
      return existingStudent || { id: `new-stu-${Date.now()}-${Math.random()}`, name, registeredCourses: [] };
    });

    const groupData: TaGroup = {
      id: group?.id || "", 
      groupName: formData.groupName,
      courseName: formData.courseName,
      courseId: formData.courseName.toLowerCase().replace(/\s+/g, '-'),
      instructorName: formData.instructorName,
      students,
      studentCount: students.length,
      isActive: formData.isActive,
    };
    
    setTimeout(() => {
        onSave(groupData);
        setIsSaving(false);
    }, 1000);
  };

  return (
    <>
      <Dialog open={isOpen && !isStudentSelectorOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{group ? "Edit Group" : "Add Group"}</DialogTitle>
            <DialogDescription>
              {group ? `Editing group: ${group.groupName}` : "Fill out the details for the new group."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Select
                value={formData.courseName}
                onValueChange={(value) => setFormData({ ...formData, courseName: value })}
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
                <div className="flex justify-between items-center">
                    <Label htmlFor="students">Student List</Label>
                    <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setIsStudentSelectorOpen(true)}
                        disabled={!formData.courseName}
                    >
                        Select from List...
                    </Button>
                </div>
                <Textarea
                    id="students"
                    placeholder="Enter student names: one per line, comma/semicolon separated, or select from list."
                    value={formData.studentsText}
                    onChange={handleStudentListChange}
                    rows={5}
                />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {group ? "Save Changes" : "Add Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SelectStudentsModal
        isOpen={isStudentSelectorOpen}
        setIsOpen={setIsStudentSelectorOpen}
        allStudents={availableStudentsForCourse}
        initiallySelectedNames={currentSelectedStudentNames}
        onSelect={handleStudentsSelected}
      />
    </>
  );
}