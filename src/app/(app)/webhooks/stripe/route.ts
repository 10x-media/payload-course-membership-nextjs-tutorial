import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Init Stripe
const stripe = new Stripe(process.env.STRIPE_SK!)

// Disable body parsing (done automatically in App Router)
export const config = {
  api: {
    bodyParser: false,
  },
}

// Actual handler
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const rawBody = await request.text()

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id)

      try {
        await payload.update({
          collection: 'participation',
          where: {
            paymentIntent: {
              equals: paymentIntent.id,
            },
          },
          data: {
            paid: true,
          },
        })
      } catch (err: any) {
        console.error('❌ Error updating participation:', err.message)
      }
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('❌ PaymentIntent failed:', paymentIntent.id)
      // delete the participation
      await payload.delete({
        collection: 'participation',
        where: {
          paymentIntent: { equals: paymentIntent.id },
        },
      })
      break
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('❌ PaymentIntent failed:', paymentIntent.id)
      // delete the participation
      await payload.delete({
        collection: 'participation',
        where: {
          paymentIntent: { equals: paymentIntent.id },
        },
      })
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
