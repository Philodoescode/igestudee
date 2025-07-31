// app/ta/courses/components/course-form-modal.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import { type Course, type Instructor } from "@/lib/database";

interface CourseFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (course: Omit<Course, 'id'> | Course) => void;
  onDelete: (courseId: string) => void;
  courseToEdit: Course | null;
  allInstructors: Instructor[];
}

const getInitialFormData = () => ({
  title: "",
  instructorId: "",
});

export default function CourseFormModal({ isOpen, setIsOpen, onSave, onDelete, courseToEdit, allInstructors }: CourseFormModalProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        title: courseToEdit.title,
        instructorId: courseToEdit.instructorId,
      });
    } else {
      setFormData(getInitialFormData());
    }
    setErrors({});
  }, [courseToEdit, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Course Title is required.";
    if (!formData.instructorId) newErrors.instructorId = "Instructor is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    const dataToSave = courseToEdit
      ? { ...courseToEdit, ...formData }
      : formData;
    
    // Simulate API call
    setTimeout(() => {
      onSave(dataToSave);
      setIsSaving(false);
    }, 1000);
  };

  const handleDelete = () => {
    if (courseToEdit) {
      onDelete(courseToEdit.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{courseToEdit ? "Modify Course" : "Create New Course"}</DialogTitle>
          <DialogDescription>
            {courseToEdit ? "Edit the details of the course." : "Fill out the details for the new course."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Advanced Mathematics"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instructor">Course Instructor</Label>
            <Select
              value={formData.instructorId}
              onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
            >
              <SelectTrigger id="instructor">
                <SelectValue placeholder="Select an instructor" />
              </SelectTrigger>
              <SelectContent>
                {allInstructors.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.instructorId && <p className="text-xs text-red-500">{errors.instructorId}</p>}
          </div>
        </div>
        <DialogFooter className="flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:space-x-2">
          <div>
            {courseToEdit && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the course <span className="font-semibold">'{courseToEdit.title}'</span> and all of its associated sessions and groups. This action cannot be undone.
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
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {courseToEdit ? "Save Changes" : "Create Course"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}