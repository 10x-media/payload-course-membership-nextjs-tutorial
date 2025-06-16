'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Course, Media, Participation } from '@/payload-types'
import Link from 'next/link'
import { HiVideoCamera, HiPencilAlt, HiArrowLeft } from 'react-icons/hi'
import { getUser } from '../../../_actions/getUser'
import ParticipationButton from '../../_components/ParticipationButton'

interface CoursePageProps {
  params: { courseId: string }
}

const CoursePage = async ({ params }: CoursePageProps) => {
  const payload = await getPayload({ config: configPromise })

  const { courseId } = await params

  let course: Course | null = null

  // get the user
  const user = await getUser()

  try {
    const res: Course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      overrideAccess: false,
      user: user,
    })

    course = res
  } catch (err) {
    console.error('Failed to fetch course:', err)
    return notFound()
  }

  console.log('check if participation exists', courseId, user?.id)

  // check if participation exists
  const participationResult = await payload.find({
    collection: 'participation',
    where: {
      course: {
        equals: courseId,
      },
      customer: {
        equals: user?.id,
      },
    },
    overrideAccess: false,
    user: user,
  })

  const participation: Participation | undefined = participationResult.docs[0]

  if (!course) return notFound()

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <HiArrowLeft className="text-lg" />
          Back to Dashboard
        </Link>
      </div>

      <div className="relative w-full aspect-video overflow-hidden border border-gray-700">
        <Image src={(course.image as Media).url || ""} alt={course.title} fill className="object-cover" />
      </div>

      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-300">{course.description}</p>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Curriculum</h2>
        <div className="flex flex-col gap-4">
          {course.curriculum.map((block, idx) => {
            if (block.blockType === 'video') {
              return (
                <div key={idx} className="p-4 border border-gray-700 bg-gray-900">
                  <div className="text-teal-400 font-medium flex items-center gap-2">
                    <HiVideoCamera className="text-xl" />
                    Video: {block.title}
                  </div>
                  <div className="text-sm text-gray-400">Duration: {block.duration} min</div>
                </div>
              )
            }

            if (block.blockType === 'quiz') {
              return (
                <div key={idx} className="p-4 border border-gray-700 bg-gray-900">
                  <div className="text-yellow-400 font-medium flex items-center gap-2">
                    <HiPencilAlt className="text-xl" />
                    Quiz: {block.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    Questions: {block.questions?.length || 0}
                  </div>
                </div>
              )
            }

            return null
          })}
        </div>
      </div>

      {participation ? (
        <div className="w-72"><ParticipationButton participation={participation} /></div>
      ) : (
        <Link href={`/dashboard/course/${course.id}/buy`} className="w-72 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded text-center">
          Buy Course for ${course.price}
        </Link>
      )}
    </div>
  )
}

export default CoursePage
