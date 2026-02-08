import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { upsertSubscription, getUserByStripeCustomer } from "@/lib/subscription";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        // Get period end from first subscription item
        const periodEnd = subscription.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400;
        upsertSubscription({
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          status: "active",
          currentPeriodEnd: periodEnd,
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const existing = getUserByStripeCustomer(customerId);
      if (existing) {
        const periodEnd = subscription.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000);
        upsertSubscription({
          userId: existing.userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          status: subscription.status === "active" ? "active" : "inactive",
          currentPeriodEnd: periodEnd,
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
