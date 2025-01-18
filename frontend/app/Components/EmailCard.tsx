import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from "next/image"
import { Card } from './card'

interface Email {
  sender: string
  content: string
}

interface EmailCardProps {
  emails: Email[]
}

export function EmailCard({ emails }: EmailCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      <div className="bg-[#F9F9F9] p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Personal and business inbox</p>
          <h2 className="text-xl font-semibold mt-1">Check mail</h2>
        </div>
        <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowUpRight className="h-6 w-6" />
        </a>
      </div>
      <div className="p-4 space-y-4">
        {emails.map((email, index) => (
          <div key={index} className="flex items-start gap-3">
            <Image
              src="/einstein.jpg"
              alt={email.sender}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-medium text-gray-900">{email.sender}</div>
              <div className="text-sm text-gray-600">{email.content}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
