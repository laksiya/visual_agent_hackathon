import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Card } from './card'

interface Event {
  time: string
  title: string
  color: string
  barColor: string
}

interface ScheduleCardProps {
  events: Event[]
}

export function ScheduleCard({ events }: ScheduleCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      <div className="bg-[#F9F9F9] p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">via Google Calendar</p>
          <h2 className="text-xl font-semibold mt-1">See the schedule</h2>
        </div>
        <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowUpRight className="h-6 w-6" />
        </a>
      </div>
      <div className="p-4 space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-1 h-12 rounded-full`} style={{ backgroundColor: event.barColor }} />
            <div className="flex-1 min-w-0">
              <p className="font-bold" style={{ color: event.color }}>{event.time}</p>
              <p className="text-gray-700 truncate">{event.title}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
