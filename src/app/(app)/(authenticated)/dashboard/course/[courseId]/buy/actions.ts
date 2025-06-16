"use server"

import configPromise from '@payload-config';
import { participate } from '@/app/(app)/(authenticated)/_actions/participate'
import { Course, Customer, Participation } from '@/payload-types'
import { getPayload } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK || "", {})

export async function createPaymentIntent(course: Course, user: Customer) {
  const payload = await getPayload({ config: configPromise })

  if (!user) {
    throw new Error('User not found')
  }

  try {
    // creating a payment intent for the amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // check if participation already exists
    const existingParticipation = await payload.find({
      collection: 'participation',
      where: {
        course: { equals: course.id },
        customer: { equals: user.id },
      },
    })

    let participation: Participation | null = null

    // if participation already exists, return the client secret and participation id
    if (existingParticipation.docs.length > 0) {
      participation = existingParticipation.docs[0]

      // update the payment intent in the participation
      await payload.update({
        collection: 'participation',
        id: participation.id,
        data: { paymentIntent: paymentIntent.id },
      })
      
    }else{
      participation = await participate(course.id, paymentIntent.id)
    }

    await updatePaymentMetadata(paymentIntent.id, participation)

    return { clientSecret: paymentIntent.client_secret, paymentIndentId: paymentIntent.id, participationId: participation.id };
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function updatePaymentMetadata(paymentIntentId: string, participation: Participation) {
  // Attach the participation ID to the payment intent
  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: { participationId: participation.id },
  })
}