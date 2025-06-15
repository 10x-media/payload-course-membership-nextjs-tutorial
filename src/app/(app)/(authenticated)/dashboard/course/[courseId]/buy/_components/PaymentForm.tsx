"use client"

import { Course } from '@/payload-types'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

export default function PaymentForm({ course, participationId }: { course: Course, participationId: string }) {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    setIsProcessing(false)

    if (paymentIntent?.status === 'succeeded') {
      window.location.href = `${window.location.origin}/dashboard/participation/${participationId}`
    } else {
      setErrorMessage('Payment not completed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <PaymentElement />
      {errorMessage && <div className="text-sm text-destructive">{errorMessage}</div>}
      <button
        type="submit"
        disabled={isProcessing}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Buy Course for $${new Intl.NumberFormat('en-US').format(course.price)}`}
      </button>
    </form>
  )
}

