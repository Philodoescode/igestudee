// app/ta/groups/components/group-management-view.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  PlusCircle,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import {
  taGroupsData as initialGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  allStudents,
  allInstructors,
  type TaGroup,
} from "@/lib/database";
import GroupFormModal from "./group-form-modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

interface GroupManagementViewProps {
  onBack: () => void;
}

export default function GroupManagementView({ onBack }: GroupManagementViewProps) {
  const [groups, setGroups] = useState<TaGroup[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TaGroup | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<TaGroup | null>(null);

  const filteredGroups = useMemo(() => {
    return groups.filter(
      (group) =>
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGroups, currentPage]);

  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);

  const handleAddNewGroup = () => {
    setEditingGroup(null);
    setIsFormModalOpen(true);
  };

  const handleEditGroup = (group: TaGroup) => {
    setEditingGroup(group);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (group: TaGroup) => {
    setGroupToDelete(group);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      deleteGroup(groupToDelete.id);
      setGroups(groups.filter((g) => g.id !== groupToDelete.id));
      toast.success(`Group '${groupToDelete.groupName}' deleted successfully.`);
      setIsDeleteAlertOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleSaveGroup = (groupData: TaGroup) => {
    if (editingGroup) {
      // Update
      const updated = updateGroup(groupData);
      if (updated) {
        setGroups(groups.map((g) => (g.id === updated.id ? updated : g)));
        toast.success(`Group '${updated.groupName}' updated successfully.`);
      }
    } else {
      // Add
      const added = addGroup(groupData);
      setGroups([added, ...groups]);
      toast.success(`Group '${added.groupName}' created successfully.`);
    }
    setIsFormModalOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          <h1 className="text-3xl font-poppins font-bold text-gray-900">
            Group Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage student groups.
          </p>
        </div>
        <Button onClick={handleAddNewGroup} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Group
        </Button>
      </div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by group or course name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGroups.length > 0 ? (
                paginatedGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.groupName}</TableCell>
                    <TableCell>{group.courseName}</TableCell>
                    <TableCell>{group.instructorName}</TableCell>
                    <TableCell className="text-center">{group.studentCount}</TableCell>
                    <TableCell>
                      <Badge variant={group.isActive ? "default" : "outline"} className={group.isActive ? "bg-green-100 text-green-800" : ""}>
                        {group.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditGroup(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No groups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                   className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>

      <GroupFormModal
        isOpen={isFormModalOpen}
        setIsOpen={setIsFormModalOpen}
        onSave={handleSaveGroup}
        group={editingGroup}
        allStudents={allStudents}
        allInstructors={allInstructors}
        totalGroups={groups.length}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              <span className="font-semibold"> '{groupToDelete?.groupName}'</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}