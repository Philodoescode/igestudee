// courses/components/session-form-modal.tsx
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import type { CourseSession } from "@/types/course";

interface SessionFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (session: Omit<CourseSession, 'id'> | CourseSession) => void;
  // onDelete is no longer passed to the modal
  sessionToEdit: CourseSession | null;
  courseId: string | null;
  allSessions: CourseSession[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear + i - 1);
};

const getInitialFormData = () => ({
  month: '',
  year: new Date().getFullYear(),
  status: 'active' as 'active' | 'inactive',
});

export default function SessionFormModal({ isOpen, setIsOpen, onSave, sessionToEdit, courseId, allSessions }: SessionFormModalProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const YEARS = getYears();
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [initialState, setInitialState] = useState(getInitialFormData());


  useEffect(() => {
    if(isOpen) {
      const initialStateData = sessionToEdit 
          ? { month: sessionToEdit.month, year: sessionToEdit.year, status: sessionToEdit.status } 
          : getInitialFormData();
      setFormData(initialStateData);
      setInitialState(initialStateData);
      setErrors({});
      setIsDirty(false);
    }
  }, [sessionToEdit, isOpen]);

  useEffect(() => {
    if(!isOpen) return;
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialState));
  }, [formData, initialState, isOpen]);

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
    if (!formData.month) newErrors.month = "Month is required.";
    if (!formData.year) newErrors.year = "Year is required.";

    const isDuplicate = allSessions.some(
      s => s.courseId === courseId &&
           s.month === formData.month &&
           s.year === formData.year &&
           s.id !== sessionToEdit?.id
    );

    if (isDuplicate) {
        newErrors.month = "This session already exists for this course.";
        newErrors.year = " "; // To show error under both fields
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !courseId) return;
    setIsSaving(true);

    const dataToSave = sessionToEdit
      ? { ...sessionToEdit, ...formData }
      : { ...formData, courseId };

    setTimeout(() => {
      onSave(dataToSave);
      setIsSaving(false);
      handleClose();
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
          <DialogTitle>{sessionToEdit ? "Modify Session" : "Create New Session"}</DialogTitle>
          <DialogDescription>
            {sessionToEdit ? "Edit the session details." : "Create a new session for this course."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="month">Month</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData(f => ({ ...f, month: value }))}>
                <SelectTrigger id="month"><SelectValue placeholder="Select month" /></SelectTrigger>
                <SelectContent>{MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              {errors.month && <p className="text-xs text-red-500">{errors.month}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Select value={String(formData.year)} onValueChange={(value) => setFormData(f => ({ ...f, year: Number(value) }))}>
                <SelectTrigger id="year"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
              </Select>
               {errors.year && <p className="text-xs text-red-500"> {/* Spacer for alignment */}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => setFormData(f => ({ ...f, status: checked ? 'active' : 'inactive' }))}
            />
            <Label htmlFor="status" className="cursor-pointer">Active Session</Label>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={handleAttemptClose} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sessionToEdit ? "Save Changes" : "Create Session"}
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