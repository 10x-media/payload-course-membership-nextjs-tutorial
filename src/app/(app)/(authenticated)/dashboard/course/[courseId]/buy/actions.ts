"use server"

import { Participation } from '@/payload-types'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK || "", {})

export async function createPaymentIntent(amount: number) {
  try {
    // creating a payment intent for the amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret, paymentIndentId: paymentIntent.id };
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function updatePaymentMetadata(paymentIntentId: string, participation: Participation) {
  // Attach the donation ID to the payment intent
  await stripe.paymentIntents.update(paymentIntentId, {
    metadata: { participationId: participation.id },
  })
}
