"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { StudentRoster } from "@/types/student"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"

const calculateAge = (dob: string | null): number | null => {
  if (!dob) return null
  try {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  } catch (error) {
    return null
  }
}

export const columns: ColumnDef<StudentRoster>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
    sortingFn: (rowA, rowB, columnId) => {
        const nameA = rowA.getValue(columnId) as string;
        const nameB = rowB.getValue(columnId) as string;
        const lastNameA = nameA.split(' ').slice(-1)[0] || '';
        const lastNameB = nameB.split(' ').slice(-1)[0] || '';
        if (lastNameA.localeCompare(lastNameB) !== 0) {
            return lastNameA.localeCompare(lastNameB);
        }
        // If last names are the same, sort by first name
        const firstNameA = nameA.split(' ')[0] || '';
        const firstNameB = nameB.split(' ')[0] || '';
        return firstNameA.localeCompare(firstNameB);
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB (Age)" />
    ),
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string
      const age = calculateAge(dob)
      return <span>{dob} ({age ?? 'N/A'})</span>
    },
    sortingFn: (rowA, rowB, columnId) => {
        const ageA = calculateAge(rowA.getValue(columnId) as string) || 0;
        const ageB = calculateAge(rowB.getValue(columnId) as string) || 0;
        return ageA - ageB;
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      if (!phone) return <span className="text-muted-foreground">N/A</span>
      return <a href={`tel:${phone}`} className="text-emerald-600 hover:underline">{phone}</a>
    },
  },
  {
    accessorKey: "guardianName",
    header: "Primary Guardian",
  },
  {
    accessorKey: "groups",
    header: "My Group(s)",
    cell: ({ row }) => {
      const groups = row.getValue("groups") as string[]
      if (!groups || groups.length === 0) {
        return <span className="text-muted-foreground">No groups</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {groups.map((group) => (
            <Badge key={group} variant="secondary">{group}</Badge>
          ))}
        </div>
      )
    },
  },
]