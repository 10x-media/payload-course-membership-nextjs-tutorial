
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import Stripe from "stripe";
import configPromise from "@payload-config";

const stripe = new Stripe(process.env.STRIPE_SK || "");

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature")
  if(!sig){
    return NextResponse.json({error: "Missing stripe-signature"}, { status: 400});
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err){
    return NextResponse.json({error: `Webhook Error`}, {status: 400});
  }

  const payload = await getPayload({config: configPromise})

  switch(event.type){
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      try{
        await payload.update({
          collection: "participation",
          where: {
            paymentIntent: {
              equals: paymentIntent.id
            }
          },
          data: {
            paid: true
          }
        })
      } catch (err){
        console.error("Error updating participation");
      }
    }
    break;
    case "payment_intent.canceled":
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      try{
        await payload.delete({
          collection: "participation",
          where: {
            paymentIntent: {
              equals: paymentIntent.id
            }
          }
        })
      } catch (err){
        console.error("Error deleting participation");
      }
    }
    default: 
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true })
}
 