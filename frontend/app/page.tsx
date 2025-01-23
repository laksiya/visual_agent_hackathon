"use client"

import { useState, useRef } from "react"
import { BusinessSparringCard } from "./Components/BusinessSparingCard"
import { EmailCard } from "./Components/EmailCard"
import { ScheduleCard } from "./Components/ScheduleCard"
import { Spinner } from "./utils/spinner"

type Response  = {
  answer: {
    message: string;
    task: string;
    result: string;
    document_name: string;
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const scheduleEvents = [
    { time: "10:00 - 18:00", title: "Mad Lab Hackaton", color: "#4CAF50", barColor: "#B8EBD0" },
    { time: "12:30 - 16:00", title: "Branding design workshop with the creative team", color: "#E040FB", barColor: "#EAD1F8" },
    { time: "17:30 - 19:00", title: "Workshop with clients", color: "#FFC107", barColor: "#F9E5C6" },
  ]

  const emails = [
    { sender: "Smug investor", content: "Hey, have you hit your milestones? I am waiting" },
    { sender: "Evil bank", content: "Your loan is overdue. Pay asap" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const submit = async () => {

      try {

        const fetchData = await fetch(`http://localhost:8000/v1/agent/ask_question?question=${input.current.value}`)
        const response: Response = await fetchData.json()

        console.log("response", response)
        setResponse(response.answer.result)
      } catch (e) {
        console.error(e)
        setResponse("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    submit()
  }


  const formatResponse = (text: string) => {
    const urlRegex = /\((https?:\/\/[^\s]+)\)/g
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(`(${part})`) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {part}
        </a>
      ) : (
        part
      )
    )
  }

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
      <form onSubmit={handleSubmit}>
        <input ref={input} type="text" className="border-2 w-full border-gray-300 p-2 rounded-lg" />
        {loading ? <Spinner /> : <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Submit</button>}
      </form>

      {response && <div>{formatResponse(response)}</div>}

    </div>
  )
}
