import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CheckoutForm({ amount, description, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        const errorMessage = error.message || "Payment failed";
        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage);
      } else {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
        });
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Payment Details
        </CardTitle>
        {description && (
          <p className="text-slate-300 text-sm">{description}</p>
        )}
        <div className="text-2xl font-bold text-blue-400">${amount.toFixed(2)}</div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <PaymentElement 
              options={{
                layout: "tabs",
              }}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}