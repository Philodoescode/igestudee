// app/ta/groups/page.tsx
"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Toaster } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Import your distinct view components
import GroupsLandingView from "./components/groups-landing-view"
import GroupManagementView from "./components/group-management-view"
import GroupDetailView from "./components/group-detail-view"

import { type TaGroup } from "@/lib/database"

// --- Main Page Component ---
export default function GroupsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  const [view, setView] = useState<"landing" | "manage" | "detail">("landing");
  const [selectedGroup, setSelectedGroup] = useState<TaGroup | null>(null)

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const handleSelectGroup = (group: TaGroup) => {
    setSelectedGroup(group);
    setView("detail");
  }

  const handleBackToLanding = () => {
    setSelectedGroup(null);
    setView("landing");
  }

  const handleGoToManage = () => {
    setView("manage");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
       <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GroupsLandingView 
                onSelectGroup={handleSelectGroup} 
                onGoToManage={handleGoToManage} 
            />
          </motion.div>
        )}
        {view === 'manage' && (
            <motion.div
                key="manage-view"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                <GroupManagementView onBack={handleBackToLanding} />
            </motion.div>
        )}
        {view === 'detail' && selectedGroup && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupDetailView group={selectedGroup} onBack={handleBackToLanding} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}