// app/ta/courses/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar } from "lucide-react"

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>

      {/* Search Bar Skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Course List Skeleton */}
      <div className="w-full space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm">
            {/* Course Header Skeleton */}
            <div className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            {/* Session Area Skeleton */}
            <div className="p-0 border-t dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40">
                <div className="border-b dark:border-zinc-700/50 px-4 py-3 flex justify-between items-center w-full">
                     <div className='flex items-center gap-3'>
                        <Calendar className='h-4 w-4 text-slate-400 dark:text-slate-500'/>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
                {/* Group Cards Skeleton */}
                <div className="p-4 md:p-6 bg-white dark:bg-zinc-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3].map(j => (
                             <div key={j} className="border rounded-lg p-4 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="pt-3 border-t dark:border-zinc-700/60 flex justify-end">
                                     <Skeleton className="h-7 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}