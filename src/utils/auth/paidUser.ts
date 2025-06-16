import { Payload } from 'payload'

interface paidUser {
  collection: "users" | "customers" | undefined
  userId: string | undefined
  payload: Payload
  id: string
}

export async function paidUser({ collection, userId, payload, id }: paidUser) {
  if (collection === 'users') {
    return true
  } else {
    // check if user has a participation for the courseAdd commentMore actions
    const participation = await payload.find({
      collection: 'participation',
      where: {
        customer: { equals: userId },
        course: { equals: id },
        paid: { equals: true },
      },
    })
    return participation.docs.length > 0
  }
}
