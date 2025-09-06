// courses/components/course-list-view.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion } from "framer-motion";
// allInstructors is no longer needed here
import type { Course, CourseSession, Group } from '@/types/course';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PlusCircle, Search, User, Edit, FolderArchive } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { GroupCard } from './group-card';

const ITEMS_PER_PAGE = 5;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CourseListViewProps {
    courses: Course[];
    sessions: CourseSession[];
    groups: Group[];
    onSelectGroup: (group: Group) => void;
    onOpenCourseModal: (course: Course | null) => void;
    onOpenSessionModal: (session: CourseSession | null, courseId: string) => void;
    onOpenGroupModal: (group: Group | null, sessionId: string) => void;
}

export default function CourseListView({ courses, sessions, groups, onSelectGroup, onOpenCourseModal, onOpenSessionModal, onOpenGroupModal }: CourseListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInactive, setShowInactive] = useState(true);

  const processedData = useMemo(() => {
    const filteredSessions = showInactive ? sessions : sessions.filter(s => s.status === 'active');

    let visibleGroupIds = new Set(groups.map(g => g.id));
    let visibleSessionIds = new Set(filteredSessions.map(s => s.id));
    let visibleCourseIds = new Set(courses.map(c => c.id));

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        visibleGroupIds = new Set();
        const coursesMap = new Map(courses.map(c => [c.id, c]));
        
        groups.forEach(group => {
            const session = filteredSessions.find(s => s.id === group.sessionId);
            const course = coursesMap.get(session?.courseId ?? '');
            if (
                group.groupName.toLowerCase().includes(lowerSearch) ||
                course?.title.toLowerCase().includes(lowerSearch) ||
                course?.instructorName?.toLowerCase().includes(lowerSearch) ||
                session?.month.toLowerCase().includes(lowerSearch) ||
                session?.year.toString().includes(lowerSearch)
            ) {
                visibleGroupIds.add(group.id);
            }
        });
        const groupsToShow = groups.filter(g => visibleGroupIds.has(g.id));
        visibleSessionIds = new Set(groupsToShow.map(g => g.sessionId));
        const sessionsToShow = filteredSessions.filter(s => visibleSessionIds.has(s.id));
        visibleCourseIds = new Set(sessionsToShow.map(s => s.courseId));
    }

    const groupsBySession = groups.reduce((acc, group) => {
        if (!visibleGroupIds.has(group.id)) return acc;
        if (!acc[group.sessionId]) acc[group.sessionId] = [];
        acc[group.sessionId].push(group);
        return acc;
    }, {} as Record<string, Group[]>);
    
    const sessionsByCourse = filteredSessions.reduce((acc, session) => {
        if (!visibleSessionIds.has(session.id)) return acc;
        if (!acc[session.courseId]) acc[session.courseId] = [];
        acc[session.courseId].push(session);
        return acc;
    }, {} as Record<string, CourseSession[]>);

    return courses
      .filter(course => visibleCourseIds.has(course.id))
      .map(course => {
        const courseSessions = (sessionsByCourse[course.id] || [])
            .sort((a,b) => b.year - a.year || MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month));
        
        const activeGroupCount = courseSessions
            .filter(s => s.status === 'active')
            .reduce((sum, session) => sum + (groupsBySession[session.id]?.length || 0), 0);

        return {
            ...course,
            sessions: courseSessions.map(session => {
                const sessionGroups = (groupsBySession[session.id] || []).sort((a,b) => a.groupName.localeCompare(b.groupName));
                const totalStudents = sessionGroups.reduce((sum, group) => sum + group.students.length, 0);
                return {
                    ...session,
                    groups: sessionGroups,
                    totalStudents: totalStudents,
                }
            }),
            sessionCount: courseSessions.length,
            activeGroupCount: activeGroupCount,
        }
      });
  }, [searchTerm, courses, sessions, groups, showInactive]);
  
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedCourses = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Course & Group Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Oversee all courses, sessions, and student groups.</p>
        </div>
        <Button onClick={() => onOpenCourseModal(null)} className="w-full sm:w-auto flex-shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search courses, instructors, sessions, or groups..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="pl-10" />
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
            <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
            <Label htmlFor="show-inactive">Show Inactive</Label>
        </div>
      </div>

      {paginatedCourses.length > 0 ? (
        <>
        <Accordion type="multiple" className="w-full space-y-4">
          {paginatedCourses.map(course => (
            <motion.div key={course.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AccordionItem value={course.id} className="border rounded-lg bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <AccordionTrigger className="px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 data-[state=open]:border-b group">
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-4'>
                    <div className="flex-1 min-w-0">
                      <h3 className='font-semibold text-lg text-slate-800 dark:text-slate-100 text-left truncate'>{course.title}</h3>
                      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                         <span>{course.sessionCount} Sessions</span> • <span>{course.activeGroupCount} Active Groups</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 sm:gap-4 flex-shrink-0 self-end sm:self-center'>
                      <div className='hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                          <User className='h-4 w-4'/> 
                          {/* FIX: Use instructorName directly from the course object */}
                          <span>{course.instructorName || 'Unknown'}</span>
                      </div>
                      <div className='flex items-center'>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onOpenCourseModal(course); }}><Edit className="h-4 w-4 mr-1"/> Modify</Button>
                        <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-500" onClick={(e) => { e.stopPropagation(); onOpenSessionModal(null, course.id); }}><PlusCircle className="h-4 w-4 mr-1"/> Add Session</Button>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0 border-t dark:border-zinc-800">
                   <Accordion type="multiple" className="w-full bg-slate-50/70 dark:bg-zinc-800/40" defaultValue={course.sessions.length > 0 ? [course.sessions[0].id] : []}>
                      {course.sessions.map(session => (
                          <AccordionItem key={session.id} value={session.id} className="border-b last:border-b-0 dark:border-zinc-700/50">
                              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-100/50 dark:hover:bg-zinc-700/50 data-[state=open]:border-b dark:data-[state=open]:border-zinc-700/50 group">
                                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 text-left'>
                                      <div className='flex-1 min-w-0'>
                                          <span className='font-semibold'>{session.month} {session.year}</span>
                                          <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0 sm:inline-flex sm:ml-3">
                                              <Badge variant={session.status === 'active' ? 'default' : 'secondary'} className={cn('font-medium', session.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70' : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300')}>{session.status}</Badge>
                                              <Badge variant="outline">{session.groups.length} Group{session.groups.length !== 1 && 's'}</Badge>
                                              <Badge variant="outline">{session.totalStudents} Student{session.totalStudents !== 1 && 's'}</Badge>
                                          </div>
                                      </div>
                                      <div className='flex items-center flex-shrink-0 self-end sm:self-center'>
                                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onOpenSessionModal(session, course.id); }}><Edit className="h-4 w-4 mr-1"/> Modify</Button>
                                          <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-500" onClick={(e) => { e.stopPropagation(); onOpenGroupModal(null, session.id); }}><PlusCircle className="h-4 w-4 mr-1"/> Add Group</Button>
                                      </div>
                                  </div>
                              </AccordionTrigger>
                              <AccordionContent className="p-4 md:p-6 bg-white dark:bg-zinc-900">
                                  {session.groups.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                          {session.groups.map(group => (
                                              <GroupCard key={group.id} group={group} onSelect={() => onSelectGroup(group)} onModify={(e) => {e.stopPropagation(); onOpenGroupModal(group, session.id);}}/>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className='text-center py-4 text-sm text-slate-500 dark:text-slate-400'>No groups in this session yet.</div>
                                  )}
                              </AccordionContent>
                          </AccordionItem>
                      ))}
                   </Accordion>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
        {totalPages > 1 && (
            <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p-1)); }} /></PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}><PaginationLink href="#" isActive={currentPage === i+1} onClick={(e) => { e.preventDefault(); setCurrentPage(i+1); }}>{i+1}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1)); }} /></PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-slate-50 dark:bg-zinc-900/50 rounded-lg border-2 border-dashed dark:border-zinc-800">
            <FolderArchive className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">No Courses Found</h3>
            <p className="text-sm mt-1">{searchTerm ? "Try adjusting your search criteria." : "Click 'Create Course' to get started."}</p>
        </div>
      )}
    </div>
  );
}