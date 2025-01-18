"use client"

import { useState, useRef } from "react"
import { BusinessSparringCard } from "./Components/BusinessSparingCard"
import { EmailCard } from "./Components/EmailCard"
import { ScheduleCard } from "./Components/ScheduleCard"



export default function Dashboard() {
  const scheduleEvents = [
    { time: "10:00 - 18:00", title: "Mad Lab Hackaton", color: "#4CAF50", barColor: "#B8EBD0" },
    { time: "12:30 - 16:00", title: "Branding design workshop with the creative team", color: "#E040FB", barColor: "#EAD1F8" },
    { time: "17:30 - 19:00", title: "Workshop with clients", color: "#FFC107", barColor: "#F9E5C6" },
  ]

  const emails = [
    { sender: "Smug investor", content: "Hey, have you hit your milestones? I am waiting" },
    { sender: "Evil bank", content: "Your loan is overdue. Pay asap" },
  ]


  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900 p-8 flex flex-col justify-center">

      <div className="mb-10 text-2xl">

        <h1>Welcome back, son!</h1>

      </div>
      <div className="grid gap-4 md:grid-cols-3 min-h-[400px]">
        <ScheduleCard events={scheduleEvents} />
        <BusinessSparringCard />
        <EmailCard emails={emails} />
      </div>
    </div>
  )
}
