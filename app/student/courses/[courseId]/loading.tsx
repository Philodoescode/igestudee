// app/student/courses/[courseId]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function CourseLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="h-40 rounded-2xl bg-gray-200 animate-pulse" />

      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}