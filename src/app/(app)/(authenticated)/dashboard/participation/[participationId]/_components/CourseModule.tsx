"use client"

import { Participation } from '@/payload-types'
import QuizModule from './QuizModule'
import VideoModule from './VideoModule'
import FinishModule from './FinishModule'

interface ModuleProps {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function CourseModule({ module, participation, onCompleted }: ModuleProps) {
  console.log('CourseModule', module, participation)

  switch (module.blockType) {
    case 'video':
      return <VideoModule participation={participation} module={module} onCompleted={onCompleted} />
    case 'quiz':
      return <QuizModule participation={participation} module={module} onCompleted={onCompleted} />
    case 'finish': 
      return <FinishModule participation={participation}/>
    default:
      return <div>Unknown module type</div>
  }
}
