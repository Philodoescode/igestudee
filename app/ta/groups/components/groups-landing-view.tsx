// app/ta/groups/components/groups-landing-view.tsx
import { motion } from "framer-motion"
import { Settings, ArrowRight, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { taGroupsData, type TaGroup } from "@/lib/database" // Assuming taGroupsData is globally accessible or passed as prop

export default function GroupsLandingView({ onSelectGroup, onGoToManage }: { onSelectGroup: (group: TaGroup) => void; onGoToManage: () => void; }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Groups</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Select a group to manage its details.</p>
        </div>
        <Button onClick={onGoToManage} variant="outline" className="w-full sm:w-auto flex-shrink-0">
            <Settings className="mr-2 h-4 w-4" />
            Manage All Groups
        </Button>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {taGroupsData.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="group cursor-pointer"
            onClick={() => onSelectGroup(group)}
          >
            <div className={cn(
                "h-full flex flex-col justify-between p-5 rounded-lg border",
                "bg-white dark:bg-zinc-900",
                "border-zinc-200 dark:border-zinc-800",
                "transition-all duration-300 ease-in-out",
                "group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 dark:group-hover:border-primary/40"
            )}>
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
                
                {/* Bottom Section: Stats & Action Indicator */}
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
                    <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}