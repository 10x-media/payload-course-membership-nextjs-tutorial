import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course, Participation } from '@/payload-types'
import ejs from 'ejs'
import axios from 'axios'
import { getUser } from '@/app/(app)/(authenticated)/_actions/getUser'

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await getUser();

    // check for user
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const participationId = params.id

    const participation: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user
    })

    if (!participation) {
      return new Response('Participation not found', { status: 404 })
    }

    const course = participation.course as Course

    // Validate certificate eligibility
    const lastModule = course.curriculum[course.curriculum.length - 1]
    if (lastModule.blockType !== 'finish') {
      return new Response('Course has no certificate', { status: 400 })
    }

    if (participation.progress !== course.curriculum.length - 1) {
      return new Response('Course not completed', { status: 400 })
    }

    if (!('template' in lastModule)) {
      return new Response('Template not found', { status: 400 })
    }

    const html = ejs.render(lastModule.template, {
      name: user?.email ?? 'Anonymous',
      courseTitle: course.title,
      date: new Date(participation.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    })

    const pdfResponse = await axios({
      method: 'post',
      url: 'https://rapidapi.windypdf.com/convert',
      data: {
        landscape: false,
        html,
        format: 'A4',
        tailwind: true,
      },
      headers: {
        'Content-Type': 'application/json',
        'api-secret': `${process.env.WINDYPDF_API_KEY}`,
      },
      responseType: 'stream',
    })

    const buffer = await streamToBuffer(pdfResponse.data)

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Certificate.pdf"',
      },
    })
  } catch (err: any) {
    console.error('PDF Generation Failed:', err)
    return new Response('Failed to generate certificate', { status: 500 })
  }
}