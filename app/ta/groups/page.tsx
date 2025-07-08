// app/ta/groups/page.tsx
"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Toaster, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import GroupsLandingView from "./components/groups-landing-view"
import GroupDetailView from "./components/group-detail-view"
import GroupFormModal from "./components/group-form-modal"

import { 
  taGroupsData as initialGroups,
  allStudents,
  allInstructors,
  addGroup,
  updateGroup,
  deleteGroup as dbDeleteGroup,
  type TaGroup,
} from "@/lib/database"

// --- Main Page Component ---
export default function GroupsPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  
  const [view, setView] = useState<"landing" | "detail">("landing");
  const [groups, setGroups] = useState<TaGroup[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<TaGroup | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TaGroup | null>(null);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  // --- View Navigation Handlers ---
  const handleSelectGroup = (group: TaGroup) => {
    setSelectedGroup(group);
    setView("detail");
  }

  const handleBackToLanding = () => {
    setSelectedGroup(null);
    setView("landing");
  }
  
  // --- CRUD and Modal Handlers ---
  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsFormModalOpen(true);
  };

  const handleModifyGroup = (group: TaGroup) => {
    setEditingGroup(group);
    setIsFormModalOpen(true);
  };

  const handleSaveGroup = (groupData: TaGroup) => {
    if (editingGroup) { // Update existing group
      const updated = updateGroup(groupData);
      if (updated) {
        setGroups(prevGroups => prevGroups.map(g => g.id === updated.id ? updated : g));
        toast.success(`Group '${updated.groupName}' updated successfully.`);
      }
    } else { // Add new group
      const added = addGroup(groupData);
      setGroups(prevGroups => [added, ...prevGroups]);
      toast.success(`Group '${added.groupName}' created successfully.`);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    const groupName = groups.find(g => g.id === groupId)?.groupName || 'Group';
    dbDeleteGroup(groupId);
    setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
    toast.error(`Group '${groupName}' has been deleted.`);
    setIsFormModalOpen(false);
  }

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
                groups={groups}
                onSelectGroup={handleSelectGroup} 
                onAddGroup={handleAddGroup}
                onModifyGroup={handleModifyGroup}
            />
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

      <GroupFormModal
        isOpen={isFormModalOpen}
        setIsOpen={setIsFormModalOpen}
        onSave={handleSaveGroup}
        onDelete={handleDeleteGroup}
        group={editingGroup}
        allStudents={allStudents}
        allInstructors={allInstructors}
      />
    </div>
  )
}