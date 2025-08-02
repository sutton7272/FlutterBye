import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import CurrencySelector, { supportedCurrencies, type Currency } from "@/components/currency-selector";
import FlbyTokenInfo from "@/components/flby-token-info";
import { 
  Heart, 
  Gift, 
  Star, 
  Cake, 
  PartyPopper, 
  Sparkles,
  Calendar,
  Send,
  DollarSign,
  Clock
} from "lucide-react";

interface GreetingTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  icon: React.ComponentType;
  suggestedValue: string;
  description: string;
}

const greetingTemplates: GreetingTemplate[] = [
  {
    id: "birthday",
    name: "Birthday Wishes",
    category: "celebration",
    template: "🎂 Happy Birthday! 🎉",
    icon: Cake,
    suggestedValue: "0.05",
    description: "Perfect for birthday celebrations with attached SOL value"
  },
  {
    id: "congratulations",
    name: "Congratulations",
    category: "achievement",
    template: "🎊 Congratulations! 🌟",
    icon: PartyPopper,
    suggestedValue: "0.1",
    description: "Celebrate achievements and milestones"
  },
  {
    id: "thank-you",
    name: "Thank You",
    category: "gratitude",
    template: "💝 Thank You So Much! ✨",
    icon: Heart,
    suggestedValue: "0.025",
    description: "Express gratitude with a meaningful gesture"
  },
  {
    id: "holiday",
    name: "Holiday Greetings",
    category: "seasonal",
    template: "🎄 Happy Holidays! 🎁",
    icon: Gift,
    suggestedValue: "0.075",
    description: "Seasonal greetings for any holiday"
  },
  {
    id: "good-luck",
    name: "Good Luck",
    category: "encouragement",
    template: "🍀 Best of Luck! 💫",
    icon: Star,
    suggestedValue: "0.05",
    description: "Send encouragement and positive energy"
  },
  {
    id: "custom",
    name: "Custom Message",
    category: "personal",
    template: "",
    icon: Sparkles,
    suggestedValue: "0.05",
    description: "Create your own personalized message"
  }
];

export default function GreetingCards() {
  const [selectedTemplate, setSelectedTemplate] = useState<GreetingTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [attachedValue, setAttachedValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(supportedCurrencies[0]);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const { toast } = useToast();

  const createGreetingCard = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/greeting-cards", data);
    },
    onSuccess: () => {
      toast({
        title: "Greeting Card Sent!",
        description: "Your tokenized greeting card has been created and sent successfully.",
      });
      // Reset form
      setSelectedTemplate(null);
      setCustomMessage("");
      setAttachedValue("");
      setRecipientAddress("");
      setPersonalNote("");
      setScheduledDate("");
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: "Could not send your greeting card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = () => {
    const message = selectedTemplate?.id === "custom" ? customMessage : selectedTemplate?.template;
    
    if (!message || !recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter recipient address.",
        variant: "destructive",
      });
      return;
    }

    createGreetingCard.mutate({
      message: message.substring(0, 27), // Ensure 27 char limit
      attachedValue: attachedValue || "0",
      currency: selectedCurrency.symbol,
      currencyAddress: selectedCurrency.address,
      recipientAddress,
      personalNote,
      scheduledDate: scheduledDate || null,
      cardType: selectedTemplate?.category || "personal",
      templateId: selectedTemplate?.id
    });
  };

  const getMessage = () => {
    return selectedTemplate?.id === "custom" ? customMessage : selectedTemplate?.template || "";
  };

  const remainingChars = 27 - getMessage().length;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Digital Greeting Cards</h1>
          <p className="text-xl text-muted-foreground">Send meaningful messages with attached value on the blockchain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient">Choose Your Card Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {greetingTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate?.id === template.id 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4 text-center">
                      <template.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      {template.template && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {template.template}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTemplate?.id === "custom" && (
                <div className="space-y-2">
                  <Label>Custom Message</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write your personalized message..."
                    maxLength={27}
                    className="resize-none pulse-border"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Character limit for blockchain storage</span>
                    <Badge variant={remainingChars < 0 ? "destructive" : "secondary"}>
                      {remainingChars}/27
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Details */}
          <Card className="electric-frame">
            <CardHeader>
              <CardTitle className="text-gradient">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Recipient Wallet Address</Label>
                <Input
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter recipient's Solana wallet address"
                  className="font-mono text-sm pulse-border"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Currency</Label>
                    <CurrencySelector
                      value={selectedCurrency.symbol}
                      onValueChange={setSelectedCurrency}
                      showExchangeRates
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attached Value</Label>
                    <div className="relative">
                      <selectedCurrency.icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        value={attachedValue}
                        onChange={(e) => setAttachedValue(e.target.value)}
                        placeholder={selectedTemplate?.suggestedValue || "0.05"}
                        className="pl-10 pulse-border"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Suggested: {selectedTemplate?.suggestedValue || "0.05"} {selectedCurrency.symbol}</span>
                  {selectedCurrency.symbol === "FLBY" && (
                    <Badge variant="secondary" className="text-xs">
                      Native token discount: 10% off fees
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Personal Note (Optional)</Label>
                <Textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Add a personal message that accompanies your greeting card..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule Delivery (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to send immediately
                </p>
              </div>

              {/* Preview */}
              {selectedTemplate && (
                <div className="bg-muted/20 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  <div className="text-center py-4">
                    <selectedTemplate.icon className="w-12 h-12 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-medium">{getMessage()}</p>
                    {attachedValue && (
                      <Badge variant="secondary" className="mt-2">
                        +{attachedValue} {selectedCurrency.symbol}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleCreateCard}
                disabled={!selectedTemplate || !recipientAddress || createGreetingCard.isPending}
                className="w-full"
                size="lg"
              >
                {createGreetingCard.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating Card...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Greeting Card
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8 text-gradient">Why Blockchain Greeting Cards?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="electric-frame">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Real Value Attached</h3>
                <p className="text-sm text-muted-foreground">
                  Your greetings carry actual SOL value that recipients can use
                </p>
              </CardContent>
            </Card>
            <Card className="electric-frame">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Permanent & Unique</h3>
                <p className="text-sm text-muted-foreground">
                  Each card is a unique token stored permanently on Solana blockchain
                </p>
              </CardContent>
            </Card>
            <Card className="electric-frame">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Meaningful Connections</h3>
                <p className="text-sm text-muted-foreground">
                  Show you care with messages that have lasting digital and financial value
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FLBY Token Information Sidebar */}
        <div className="mt-16">
          <FlbyTokenInfo 
            onGetTokens={() => {
              toast({
                title: "Early Access Signup",
                description: "You've been added to the FLBY token early access list!",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}