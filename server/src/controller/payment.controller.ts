import type { Request, Response } from "express";
import Stripe from "stripe";
import type { IUser } from "../model/user.model";
import User from "../model/user.model";
import { sendPremiumConformationEmail } from "../services/email.service";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lifetime Subcription",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment_success`,
      cancel_url: `${process.env.CLIENT_URL}/payment_cancel`,
      client_reference_id: user._id.toString(),
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create charge" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sign = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sign,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.log(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id as string;

    if (userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        { isPremium: true },
        { returnDocument: "after" },
      );
      if (user && user.email) {
        await sendPremiumConformationEmail(user.email, user.displayName);
      }
    }
  }

  res.status(200).json({ received: true });
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.isPremium) {
    res.json({ status: "active" });
  } else {
    res.json({ status: "inactive" });
  }
};
