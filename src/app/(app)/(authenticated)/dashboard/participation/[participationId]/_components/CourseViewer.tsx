'use client'

import { Course, Participation } from '@/payload-types'
import { useEffect, useState } from 'react'
import CourseModule from './CourseModule'
import { markProgress } from '../_actions/markProgress'
import Curriculum from './Curriculum'

export default function CourseViewer({ participation }: { participation: Participation }) {
  const [currentProgress, setCurrentProgress] = useState(participation?.progress || 0)

  const course = participation.course as Course

  async function handleCompleted(nextIndex: number) {
    setCurrentProgress(nextIndex)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <CourseModule
        participation={participation}
        module={course.curriculum[currentProgress]}
        onCompleted={handleCompleted}
      />
      <Curriculum course={course} currentProgress={currentProgress} />
    </div>
  )
}
