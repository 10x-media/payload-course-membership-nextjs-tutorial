import { Course, Participation } from '@/payload-types'
import Link from 'next/link'
import { HiPlay } from 'react-icons/hi'

export default async function ParticipationButton({
  participation,
}: {
  participation: Participation
}) {
  const course = participation.course

  // Check if course is populated
  const isPopulatedCourse = (course: any): course is Course => {
    return typeof course === 'object' && course !== null && 'id' in course
  }

  if (!isPopulatedCourse(course)) {
    return null
  }

  const courseLength = course.curriculum.length
  let progress = participation.progress  ?? 0
  progress = progress + 1; // Increment progress by 1 for the sake of the button display

  const progressPercent = Math.min((progress / courseLength) * 100, 100)

  console.log('progressPercent', progressPercent)

  return (
    <Link
      href={`/dashboard/participation/${participation.id}`}
      className="relative w-full bg-teal-500 flex flex-col hover:bg-teal-600 rounded overflow-hidden transition"
    >
      <div className="flex flex-row items-center justify-between pl-2">
        <p className="font-semibold text-white">{course.title}</p>
        <div className="flex items-center justify-center bg-teal-600 h-12 w-12">
          <HiPlay className="h-6 w-6" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Link>
  )
}
