import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Waves, User, Phone, Mail, MapPin, DollarSign, Calendar, Heart } from "lucide-react";

// Enhanced registration schema for comprehensive data collection
const enhancedRegistrationSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  alternatePhone: z.string().optional(),
  
  // Address Information
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  zipCode: z.string().min(5, "Please enter your zip code"),
  
  // Pool Information (for customers)
  poolType: z.enum(["inground", "above_ground", "spa", "hot_tub"]),
  poolSize: z.enum(["small", "medium", "large", "extra_large"]),
  poolAge: z.number().min(0).optional(),
  poolEquipment: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
  propertyType: z.enum(["residential", "commercial", "hoa"]).default("residential"),
  
  // Service Preferences
  serviceFrequency: z.enum(["weekly", "bi-weekly", "monthly", "as-needed"]).optional(),
  budgetRange: z.enum(["under-100", "100-200", "200-300", "300-500", "500+"]).optional(),
  preferredServiceDay: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
  preferredServiceTime: z.enum(["morning", "afternoon", "evening"]).optional(),
  
  // Marketing & Communication Preferences
  marketingOptIn: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  promotionalEmails: z.boolean().default(true),
  preferredContactMethod: z.enum(["email", "phone", "sms"]).default("email"),
  communicationFrequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  
  // Customer Journey
  referralSource: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

type EnhancedRegistrationData = z.infer<typeof enhancedRegistrationSchema>;

interface EnhancedRegistrationFormProps {
  onSuccess?: () => void;
}

export function EnhancedRegistrationForm({ onSuccess }: EnhancedRegistrationFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const form = useForm<EnhancedRegistrationData>({
    resolver: zodResolver(enhancedRegistrationSchema),
    defaultValues: {
      marketingOptIn: true,
      emailNotifications: true,
      smsNotifications: false,
      promotionalEmails: true,
      preferredContactMethod: "email",
      communicationFrequency: "weekly",
      propertyType: "residential",
      poolEquipment: [],
      interests: [],
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: EnhancedRegistrationData) => {
      // Transform data for backend
      const registrationData = {
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        poolType: data.poolType,
        poolSize: data.poolSize,
        poolAge: data.poolAge,
        poolEquipment: JSON.stringify(data.poolEquipment || []),
        specialRequirements: data.specialRequirements,
        propertyType: data.propertyType,
        serviceFrequency: data.serviceFrequency,
        budgetRange: data.budgetRange,
        preferredServiceDay: data.preferredServiceDay,
        preferredServiceTime: data.preferredServiceTime,
        marketingOptIn: data.marketingOptIn,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        promotionalEmails: data.promotionalEmails,
        preferredContactMethod: data.preferredContactMethod,
        communicationFrequency: data.communicationFrequency,
        referralSource: data.referralSource,
        interests: JSON.stringify(data.interests || []),
        customerSegment: "new",
        isCleaner: false,
      };
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to PoolPal!",
        description: "Your account has been created successfully. We'll connect you with the best pool cleaners in your area.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EnhancedRegistrationData) => {
    registerMutation.mutate(data);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-blue-600" />
          Join PoolPal - Pool Owner Registration
        </CardTitle>
        <CardDescription>
          Step {step} of 4: Let's gather some information to provide you with the best pool cleaning service experience
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter secure password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Property Address</h3>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="hoa">HOA/Community</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Pool Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Waves className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Pool Details</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="poolType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pool type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inground">In-ground Pool</SelectItem>
                            <SelectItem value="above_ground">Above Ground Pool</SelectItem>
                            <SelectItem value="spa">Spa</SelectItem>
                            <SelectItem value="hot_tub">Hot Tub</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="poolSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pool size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small (under 15,000 gal)</SelectItem>
                            <SelectItem value="medium">Medium (15,000-25,000 gal)</SelectItem>
                            <SelectItem value="large">Large (25,000-40,000 gal)</SelectItem>
                            <SelectItem value="extra_large">Extra Large (40,000+ gal)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="poolAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pool Age (years, optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements or Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special needs, access requirements, or pool concerns..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Service Preferences & Marketing */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Service Preferences</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Service Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How often?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="as-needed">As Needed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Budget Range (per service)
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-100">Under $100</SelectItem>
                            <SelectItem value="100-200">$100 - $200</SelectItem>
                            <SelectItem value="200-300">$200 - $300</SelectItem>
                            <SelectItem value="300-500">$300 - $500</SelectItem>
                            <SelectItem value="500+">$500+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="referralSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Google search, friend recommendation, social media..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Communication Preferences</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredContactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="sms">Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily updates</SelectItem>
                              <SelectItem value="weekly">Weekly updates</SelectItem>
                              <SelectItem value="monthly">Monthly updates</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="marketingOptIn"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Yes, I'd like to receive marketing communications about pool care tips and special offers
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Email notifications for job updates and important messages
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              SMS notifications for urgent updates and appointment reminders
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="ml-auto bg-blue-600 hover:bg-blue-700"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}