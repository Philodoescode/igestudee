"use client"

import { type TAAvailabilitySlot } from "@/lib/database"
import { Badge } from "@/components/ui/badge"

interface WeeklyAvailabilityProps {
  availability: TAAvailabilitySlot[]
}

export default function WeeklyAvailability({ availability }: WeeklyAvailabilityProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Availability</h2>
      <div className="p-4 border rounded-lg bg-white">
        <div className="hidden md:grid md:grid-cols-7 gap-px">
          {availability.map(daySlot => (
            <div key={daySlot.day} className="flex flex-col p-2">
              <p className="font-semibold text-center text-sm mb-2">{daySlot.day}</p>
              <div className="space-y-1">
                {daySlot.slots.length > 0 ? daySlot.slots.map(slot => (
                  <Badge key={slot} variant="secondary" className="block text-center whitespace-nowrap bg-emerald-100 text-emerald-800 font-normal">
                    {slot}
                  </Badge>
                )) : (
                  <p className="text-xs text-center text-gray-400">-</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="md:hidden space-y-2">
             {availability.map(daySlot => (
                <div key={daySlot.day} className="flex items-start gap-4 p-2 border-b last:border-b-0">
                    <p className="font-semibold text-sm w-20 shrink-0">{daySlot.day}</p>
                    <div className="flex flex-wrap gap-1">
                         {daySlot.slots.length > 0 ? daySlot.slots.map(slot => (
                            <Badge key={slot} variant="secondary" className="whitespace-nowrap bg-emerald-100 text-emerald-800 font-normal">
                                {slot}
                            </Badge>
                         )) : (
                            <p className="text-xs text-gray-400">Unavailable</p>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  )
}