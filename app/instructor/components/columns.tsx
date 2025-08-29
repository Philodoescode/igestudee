"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { StudentRoster } from "@/types/student"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { GuardianInfoCell } from "./guardian-info-cell"
import { format } from "date-fns"

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

const renderUnknown = () => <span className="text-muted-foreground">Unknown</span>

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
        const firstNameA = nameA.split(' ')[0] || '';
        const firstNameB = nameB.split(' ')[0] || '';
        return firstNameA.localeCompare(firstNameB);
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string
      const age = calculateAge(dob)
      if (age === null || age < 5) {
        return renderUnknown()
      }
      return <span>{age}</span>
    },
    sortingFn: (rowA, rowB, columnId) => {
        const ageA = calculateAge(rowA.getValue(columnId) as string) || 0;
        const ageB = calculateAge(rowB.getValue(columnId) as string) || 0;
        return ageA - ageB;
    }
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
        const gender = row.getValue("gender") as string
        if (!gender) return renderUnknown()
        return <span>{gender}</span>
    }
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
        const grade = row.getValue("grade") as number | null
        if (grade === null) return renderUnknown()
        return <span>{grade}</span>
    }
  },
  {
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
    cell: ({ row }) => {
        const school = row.getValue("school") as string
        if (!school) return renderUnknown()
        return <span>{school}</span>
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      if (!phone) return renderUnknown()
      return <a href={`tel:${phone}`} className="text-emerald-600 hover:underline">{phone}</a>
    },
  },
  {
    id: "guardianInfo",
    header: "Primary Guardian",
    cell: ({ row }) => <GuardianInfoCell row={row} />,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined At" />
    ),
    cell: ({ row }) => {
        const date = row.getValue("joinedAt") as string
        if (!date) return renderUnknown()
        return <span>{format(new Date(date), "dd MMM yyyy")}</span>
    }
  },
]