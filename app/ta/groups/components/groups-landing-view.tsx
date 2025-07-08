"use client";

import { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { PlusCircle, Users, User, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { type TaGroup } from "@/lib/database";

interface GroupsLandingViewProps {
  groups: TaGroup[];
  onSelectGroup: (group: TaGroup) => void;
  onAddGroup: () => void;
  onModifyGroup: (group: TaGroup) => void;
}

export default function GroupsLandingView({ groups, onSelectGroup, onAddGroup, onModifyGroup }: GroupsLandingViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        group.groupName.toLowerCase().includes(searchLower) ||
        group.courseName.toLowerCase().includes(searchLower) ||
        group.instructorName.toLowerCase().includes(searchLower);
      
      const matchesFilter = courseFilter === 'all' || group.courseName === courseFilter;

      return matchesSearch && matchesFilter;
    });
  }, [groups, searchTerm, courseFilter]);
  
  const uniqueCourses = ['all', ...Array.from(new Set(groups.map(g => g.courseName)))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Groups</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Select a group to view details or add a new group.</p>
        </div>
        <Button onClick={onAddGroup} className="w-full sm:w-auto flex-shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Group
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by group, course, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCourses.map(course => (
              <SelectItem key={course} value={course}>
                {course === 'all' ? 'All Courses' : course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      
      {/* Groups Grid */}
      <div>
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.2, ease: "easeOut" }}
                layout
              >
                <div 
                  className={cn(
                      "h-full flex flex-col justify-between p-5 rounded-lg border cursor-pointer",
                      "bg-white dark:bg-zinc-900",
                      "border-zinc-200 dark:border-zinc-800",
                      "transition-all duration-300 ease-in-out",
                      "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:hover:border-primary/40"
                  )}
                  onClick={() => onSelectGroup(group)}
                >
                    {/* Top Section: Title & Status */}
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-100 pr-2">{group.groupName}</h3>
                            <div title={group.isActive ? "Active" : "Inactive"} className="flex-shrink-0">
                                <span className={cn(
                                    "h-2.5 w-2.5 rounded-full inline-block mt-1.5",
                                    group.isActive ? "bg-green-500" : "bg-gray-400"
                                )} />
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{group.courseName}</p>
                    </div>
                    
                    {/* Bottom Section: Stats & Action */}
                    <div className="mt-6 pt-4 flex items-end justify-between border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex flex-col space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                                <span>{group.studentCount} Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                                <span>{group.instructorName}</span>
                            </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); onModifyGroup(group); }}
                          className="self-end"
                        >
                            <Edit className="h-3 w-3 mr-1.5" /> Modify
                        </Button>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 bg-slate-50 rounded-lg"
          >
            <p className="font-semibold">No Groups Found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}