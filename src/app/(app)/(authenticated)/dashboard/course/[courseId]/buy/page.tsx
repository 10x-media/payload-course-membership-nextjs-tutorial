import React from 'react'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Course, Media } from '@/payload-types'
import { getUser } from '@/app/(app)/(authenticated)/_actions/getUser'

import Checkout from './_components/Checkout'

export default async function page({ params }: { params: { courseId: string } }) {
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

  if (!course) {
    return notFound()
  }

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

      <div className="flex flex-col-reverse md:flex-row gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-300">{course.description}</p>
          <p className="text-teal-400 text-xl font-bold mt-4">
            ${new Intl.NumberFormat('en-US').format(course.price)}
          </p>
        </div>
        <div className="flex-1 relative aspect-video overflow-hidden border border-gray-700">
          <Image
            src={(course.image as Media).url || ''}
            alt={course.title || ''}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Checkout course={course}/>
    </div>
  )
}
