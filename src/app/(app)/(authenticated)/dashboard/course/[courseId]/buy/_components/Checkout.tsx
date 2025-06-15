"use client"

import React, { useState, useEffect } from 'react'

import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './PaymentForm'
import { Course } from '@/payload-types'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent, updatePaymentMetadata } from '../actions'
import { participate } from '@/app/(app)/(authenticated)/_actions/participate'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!)

export default function Checkout({course}: {course: Course}) {
  const [clientSecret, setClientSecret] = useState<string>()
  const [participationId, setParticipationId] = useState<string>()

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const paymentIntent = await createPaymentIntent(course.price)
        const participation = await participate(course.id, paymentIntent.paymentIndentId)
        await updatePaymentMetadata(paymentIntent.paymentIndentId, participation)
        const secret = paymentIntent.clientSecret
        if (secret) {
          setClientSecret(secret)
        }
        setParticipationId(participation.id)
      } catch (error) {
        console.error('Failed to initialize payment:', error)
      }
    }

    initializePayment()
  }, [course])

  if (!clientSecret) {
    return <div>Loading...</div>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm course={course} participationId={participationId || ""} />
    </Elements>
  )
}
