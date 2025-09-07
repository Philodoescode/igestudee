// courses/components/group-card.tsx
// app/instructor/courses/components/group-card.tsx
import { motion } from "framer-motion";
import { Users, Edit, ChevronsRight, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import type { Group } from "@/types/course";

interface GroupCardProps {
  group: Group;
  onSelect: () => void;
  onModify: () => void;
  onDelete: (groupId: string) => void;
}

export function GroupCard({ group, onSelect, onModify, onDelete }: GroupCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={onSelect}
          className="relative border rounded-lg p-3 shadow-sm bg-white dark:bg-zinc-800/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/70 transition-colors duration-200 cursor-pointer group"
        >
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors pr-8">
              {group.groupName}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <Users className='h-3.5 w-3.5'/>
              <span>{group.students.length} Student{group.students.length !== 1 && 's'}</span>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onSelect}>
          <ChevronsRight className="h-4 w-4 mr-2" />
          Open Group
        </ContextMenuItem>
         <ContextMenuItem onSelect={onModify}>
          <Edit className="h-4 w-4 mr-2" />
          Modify Group
        </ContextMenuItem>
        <ContextMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 dark:text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />Delete Group
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the group <span className="font-semibold">'{group.groupName}'</span> and all of its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(group.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}