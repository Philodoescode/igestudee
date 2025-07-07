// NEW FILE: components/ui/tabs.tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  const handleScrollability = React.useCallback(() => {
    const list = listRef.current
    if (list) {
      const { scrollWidth, clientWidth, scrollLeft } = list
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return

    handleScrollability()
    const resizeObserver = new ResizeObserver(handleScrollability)
    resizeObserver.observe(list)
    for (const child of list.children) {
      resizeObserver.observe(child)
    }

    list.addEventListener("scroll", handleScrollability, { passive: true })
    window.addEventListener("resize", handleScrollability)

    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScrollability)
      }
      window.removeEventListener("resize", handleScrollability)
      resizeObserver.disconnect()
    }
  }, [handleScrollability, children])

  const scroll = (direction: "left" | "right") => {
    const list = listRef.current
    if (list) {
      const scrollAmount = list.clientWidth * 0.8
      list.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-gray-50 to-transparent pr-8 transition-opacity duration-300",
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={() => scroll("left")}
          className="p-1 rounded-full bg-white/50 hover:bg-white shadow-md border"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <TabsPrimitive.List
        ref={combinedRef}
        className={cn(
          "flex items-center space-x-1 overflow-x-auto scroll-smooth hide-scrollbar",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-gray-50 to-transparent pl-8 transition-opacity duration-300",
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={() => scroll("right")}
          className="p-1 rounded-full bg-white/50 hover:bg-white shadow-md border"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-emerald-600 data-[state=active]:font-semibold",
      className
    )}
    {...props}
  >
    {children}
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-0.5",
        "bg-emerald-500",
        "transform scale-x-0 transition-transform duration-300 ease-in-out",
        "group-data-[state=active]:scale-x-100"
      )}
    />
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
