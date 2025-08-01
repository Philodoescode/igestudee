// app/ta/courses/components/group-card.tsx
import { motion } from "framer-motion";
import { Users, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaGroup } from "@/types/course";

interface GroupCardProps {
  group: TaGroup;
  onSelect: () => void;
  onModify: (e: React.MouseEvent) => void;
}

export function GroupCard({ group, onSelect, onModify }: GroupCardProps) {
  return (
    <div
      onClick={onSelect}
      className="relative border rounded-lg p-3 shadow-sm bg-white dark:bg-zinc-800/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/70 transition-colors duration-200 cursor-pointer group"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onModify}
        aria-label="Modify Group"
        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
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
  );
}