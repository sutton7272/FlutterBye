import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { ReactNode, useEffect, useState } from "react";

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publishableKey) {
      console.error("VITE_STRIPE_PUBLIC_KEY not found in environment variables");
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
  amount?: number;
}

export function StripeProvider({ children, clientSecret, amount }: StripeProviderProps) {
  const [stripe] = useState(() => getStripe());

  if (!stripe) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400">
          Stripe is not properly configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#1e293b",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          backgroundColor: "#334155",
          border: "1px solid #475569",
          color: "#ffffff",
        },
        ".Input:focus": {
          border: "1px solid #3b82f6",
          boxShadow: "0 0 0 1px #3b82f6",
        },
        ".Label": {
          color: "#e2e8f0",
          fontWeight: "500",
        },
      },
    },
  };

  return (
    <Elements stripe={stripe} options={clientSecret ? options : undefined}>
      {children}
    </Elements>
  );
}