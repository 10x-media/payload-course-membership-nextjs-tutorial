"use client"

import { Course } from "@/payload-types"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./PaymentForm"

interface CheckoutInterface {
    clientSecret: string
    course: Course
    participationId: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "");

export default function Checkout({clientSecret, course, participationId}:CheckoutInterface){
    return (
        <Elements stripe={stripePromise} options={{clientSecret}}>
            <PaymentForm course={course} participationId={participationId}></PaymentForm>
        </Elements>
    )
}