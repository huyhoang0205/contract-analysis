"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
// import stripePromise from "@/lib/stripe";

export default function Home() {
  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payment/create-checkout-session");
      // const stripe = await stripePromise;

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <h1>
      <Button variant={"outline"} onClick={handleUpgrade}>
        Upgrade to Premium
      </Button>
    </h1>
  );
}
