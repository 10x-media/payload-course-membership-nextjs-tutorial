import { getPayload } from "payload"
import configPromise from '@payload-config'
import { getUser } from "../../../_actions/getUser"
import { notFound } from "next/navigation"
import { Participation } from "@/payload-types"
import Link from "next/link"
import { HiArrowLeft } from "react-icons/hi"
import CourseViewer from "./_components/CourseViewer"

export default async function ParticipationPage({ params }: { params: { participationId: string } }) {
  const payload = await getPayload({ config: configPromise })

  const { participationId } = await params

  let participation: any | null = null

  // get the user
  const user = await getUser()

  try {
    const res: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: user,
    })

    participation = res

  } catch (err) {
    console.error('Failed to fetch course:', err)
    return notFound()
  }

  if (!participation) return notFound()

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
      <h1 className="text-3xl font-bold">{participation.course.title}</h1>
      <CourseViewer participation={participation} />
    </div>
  )
}