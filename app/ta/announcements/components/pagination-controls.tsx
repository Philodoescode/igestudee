// START OF app/ta/announcements/components/pagination-controls.tsx
"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1))
  }

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1))
  }

  // Generate page numbers with ellipsis for a better UX
  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    const range = 2 // How many pages to show around the current page

    if (totalPages <= 1) {
      return []
    }

    // Always show the first page
    pageNumbers.push(1)

    // Add ellipsis if current page is far from the start
    if (currentPage > range + 1) {
      pageNumbers.push("...")
    }

    // Add pages around the current page
    for (let i = Math.max(2, currentPage - range + 1); i <= Math.min(totalPages - 1, currentPage + range - 1); i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis if current page is far from the end
    if (currentPage < totalPages - range) {
      pageNumbers.push("...")
    }

    // Always show the last page
    pageNumbers.push(totalPages)

    return pageNumbers
  }

  const pages = generatePageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePrevious()
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleNext()
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
// END OF app/ta/announcements/components/pagination-controls.tsx