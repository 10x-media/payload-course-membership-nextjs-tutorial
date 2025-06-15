'use client'

import { Course, Participation } from '@/payload-types'
import { useState } from 'react'
import { HiExclamationTriangle } from 'react-icons/hi2'
import CourseModule from './CourseModule'
import Curriculum from './Curriculum'

export default function CourseViewer({ participation }: { participation: Participation }) {
  const [currentProgress, setCurrentProgress] = useState(participation?.progress || 0)

  const course = participation.course as Course

  async function handleCompleted(nextIndex: number) {
    setCurrentProgress(nextIndex)
  }

  if(participation.paid === false) {
    return (
      <div className="w-full p-6 bg-yellow-900 border border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <HiExclamationTriangle className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-400">Payment Pending</h3>
            <p className="mt-1 text-sm text-yellow-500">Your payment is being processed. Please wait for it to be confirmed before accessing the course content.</p>
            <p className="mt-1 text-sm text-yellow-500">Refresh the page to check again.</p>
          </div>
        </div>
      </div>
    )
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
