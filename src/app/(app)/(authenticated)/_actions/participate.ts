"use server"
import configPromise from '@payload-config';

import { getPayload } from "payload"
import { getUser } from './getUser';

export async function participate(courseId: string, paymentIntentId: string) {
  const payload = await getPayload({ config: configPromise })

  // get the user
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  // create participation
  const createdParticipation = await payload.create({
    collection: 'participation',
    data: {
      customer: user.id,
      course: courseId,
      progress: 0,
      paymentIntent: paymentIntentId,
      paid: false
    }
  })

  return createdParticipation
}

export async function deleteParticipation(participationId: string) {
  const payload = await getPayload({ config: configPromise })

  await payload.delete({
    collection: 'participation',
    id: participationId,
  })
}