// courses/components/course-form-modal.tsx
// app/ta/courses/components/course-form-modal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, Trash2 } from "lucide-react";
import type { Course } from "@/types/course";
import type { Instructor } from "@/types/user";

interface CourseFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // FIX: onSave now passes a simpler object
  onSave: (courseData: { title: string }) => void;
  // onDelete is no longer passed to the modal
  courseToEdit: Course | null;
  // allInstructors is no longer needed but kept in props for consistency if you need it for editing
  allInstructors: Instructor[];
}

const getInitialFormData = () => ({
  title: "",
});

export default function CourseFormModal({ isOpen, setIsOpen, onSave, courseToEdit }: CourseFormModalProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (courseToEdit) {
            setFormData({ title: courseToEdit.title });
        } else {
            setFormData(getInitialFormData());
        }
        setErrors({});
        setIsDirty(false);
    }
  }, [courseToEdit, isOpen]);

  useEffect(() => {
      if (!isOpen) return;
      const initialTitle = courseToEdit?.title || "";
      setIsDirty(formData.title !== initialTitle);
  }, [formData, courseToEdit, isOpen]);

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


  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Course Title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    
    // In a real app, you would handle editing differently,
    // but for creation, we just pass the title.
    const dataToSave = { title: formData.title };
    
    setTimeout(() => {
      onSave(dataToSave);
      setIsSaving(false);
      handleClose(); // Close after save
    }, 1000);
  };

  // handleDelete is removed from here

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleAttemptClose()}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
        >
        <DialogHeader>
          <DialogTitle>{courseToEdit ? "Modify Course" : "Create New Course"}</DialogTitle>
          <DialogDescription>
            {courseToEdit ? "Edit the details of the course." : "Enter the title for the new course. You will be assigned as the instructor."}
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
          {/* FIX: Instructor dropdown is completely removed */}
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={handleAttemptClose} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {courseToEdit ? "Save Changes" : "Create Course"}
            </Button>
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