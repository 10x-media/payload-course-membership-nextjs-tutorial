'use client'

import { Course } from '@/payload-types'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface PaymentFormInterface {
  course: Course
  participationId: string
}

export default function PaymentForm({ course, participationId }: PaymentFormInterface) {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if(!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    })

    if(paymentIntent?.status === "succeeded"){
      // wait 3 seconds
      setTimeout(() => {
        window.location.href = `${window.location.origin}/dashboard/participation/${participationId}`;
      },3000)
    } else {
      setIsProcessing(false);
      setErrorMessage("Payment not completed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <div className="text-sm">errorMessage</div>}
      <button
        type="submit"
        disabled={isProcessing}
        className="bg-teal-500 hover-bg-teal-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disable:cursor-not-allowed"
      >
        {isProcessing
          ? 'Processing...'
          : `Buy Course for ${new Intl.NumberFormat('en-US').format(course.price)}`}
      </button>
    </form>
  )
}
