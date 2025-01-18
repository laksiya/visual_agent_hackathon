import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from "next/image"
import { Card } from './card'
import { VideoWrapper } from './VideoWrapper'

export function BusinessSparringCard() {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      <div className="bg-[#F9F9F9] p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Business sparring</p>
          <h2 className="text-xl font-semibold mt-1">Chat with your sidekick</h2>
        </div>
        <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowUpRight className="h-6 w-6" />
        </a>
      </div>
      <div className="p-4 h-full">
        <VideoWrapper/>
      </div>
    </Card>
  )
}
