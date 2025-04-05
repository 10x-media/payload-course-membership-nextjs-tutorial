"use client"

import { Participation } from "@/payload-types"
import { useState } from "react"
import NextButton from "./NextButton"
import { markProgress } from "../_actions/markProgress"

export default function VideoModule({
  module,
  participation,
  onCompleted,
}: {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
}) {

  const [loading, setLoading] = useState(false)

  async function handleNextModule(){
    setLoading(true)
    try {
      let updatedParticipation = await markProgress(participation)
      if (updatedParticipation && updatedParticipation.progress) {
        onCompleted(updatedParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
      }
    } catch (error) {
      console.error('Error marking progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>
     
      <div className="relative w-full aspect-video border border-white overflow-hidden">
        <iframe
          src={`${module.playerUrl}`}
          style={{ border: 'none', position: 'absolute', top: 0, height: '100%', width: '100%' }}
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
          allowFullScreen
          data-card-controls="1" // helps override Embedly defaults
        />
      </div>

      <NextButton
        loading={loading}
        text="Next"
        onClick={handleNextModule}
      />
    </div>
  )
}
