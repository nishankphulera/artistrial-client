'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Check, Crown, Users, Star, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";

// Load Razorpay script dynamically
declare global {
  interface Window {
    Razorpay: any;
  }
}

type SubscriptionType = "free" | "community" | "single" | "full" | "premium";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [signupStep, setSignupStep] = useState<"subscription" | "form">("subscription");
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    profileType: "Artist",
    subscriptionType: "free" as SubscriptionType,
    agreeToTerms: false,
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (mode === "signup") {
      if (
        !formData.fullName ||
        !formData.username ||
        !formData.profileType
      ) {
        toast.error("Please fill in all required fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      if (!formData.agreeToTerms) {
        toast.error("Please agree to the terms and conditions");
        return false;
      }
    }

    return true;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  e.stopPropagation();

  console.log('Form submitted, mode:', mode, 'signupStep:', signupStep);
  console.log('Form data:', { ...formData, password: '***', confirmPassword: '***' });

  // Prevent double submission
  if (loading || processingPayment) {
    console.log('Already processing, ignoring duplicate submission');
    return;
  }

  if (!validateForm()) {
    console.log('Form validation failed');
    return;
  }

  console.log('Form validation passed, starting submission');
  setLoading(true);

  try {
    if (mode === "signin") {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } else {
      console.log('Starting signup process...');
      
      // For paid plans, check if payment was completed
      if (formData.subscriptionType !== 'free') {
        console.log('Checking payment for paid plan:', formData.subscriptionType);
        const pendingPayment = localStorage.getItem('pending_payment_order');
        if (!pendingPayment) {
          console.error('No pending payment found for paid plan');
          toast.error('Please complete payment before creating your account');
          setLoading(false);
          return;
        }

        try {
          const paymentData = JSON.parse(pendingPayment);
          console.log('Payment data found:', paymentData);
          
          // Verify payment was completed
          const verifyResponse = await fetch('http://localhost:5001/api/payments/order/' + paymentData.orderId, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!verifyResponse.ok) {
            console.error('Payment verification failed:', verifyResponse.status);
            toast.error('Payment verification required. Please complete payment first.');
            setLoading(false);
            return;
          }

          const orderData = await verifyResponse.json();
          console.log('Order data:', orderData);
          
          if (orderData.data?.status !== 'completed') {
            console.error('Payment not completed, status:', orderData.data?.status);
            toast.error('Payment not completed. Please complete payment first.');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Unable to verify payment. Please contact support.');
          setLoading(false);
          return;
        }
      }

      // Map your formData to backend fields
      const userData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        display_name: formData.fullName,
        role: formData.profileType.toLowerCase(),
        subscription_type: formData.subscriptionType,
        bio: "",
        avatar_url: "",
      };

      console.log('Sending signup request with data:', { ...userData, password: '***' });

      // Pass as ONE object
      const signupResult = await signUp(userData); // ✅ single object
      
      console.log('Signup result:', signupResult);
      if (signupResult.error) {
        console.error('Signup error:', signupResult.error);
        toast.error(signupResult.error.message || "Failed to create account");
        setLoading(false);
      } else {
        console.log('Signup successful, processing post-signup tasks...');
        // If payment was made before signup, link payment to newly created user
        if (formData.subscriptionType !== 'free') {
          const pendingPayment = localStorage.getItem('pending_payment_order');
          if (pendingPayment) {
            try {
              const paymentData = JSON.parse(pendingPayment);
              const token = localStorage.getItem('access_token');
              
              // Get user ID from stored user data
              const storedUser = localStorage.getItem('user');
              let newUserId = null;
              if (storedUser) {
                try {
                  const userData = JSON.parse(storedUser);
                  newUserId = userData.id;
                } catch (e) {
                  console.error('Error parsing user data:', e);
                }
              }
              
              if (newUserId && paymentData.razorpayOrderId && token) {
                // Update payment order with user ID
                const updateResponse = await fetch(
                  `http://localhost:5001/api/payments/order/${paymentData.orderId}`,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      userId: newUserId,
                      razorpayOrderId: paymentData.razorpayOrderId,
                      email: formData.email,
                    }),
                  }
                );

                // Also update user subscription if payment was verified
                if (updateResponse.ok) {
                  // The subscription type should already be set during signup, but verify
                  console.log('Payment linked to user successfully');
                }
              }
              
              localStorage.removeItem('pending_payment_order');
            } catch (error) {
              console.error('Error linking payment to user:', error);
              // Don't fail signup if payment linking fails
            }
          }
        }
        
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    }
  } catch (error) {
    console.error('Unexpected error in handleSubmit:', error);
    toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    setLoading(false);
  }
};


  const switchMode = () => {
    // Reset all states when switching modes
    console.log('Switching mode from', mode, 'to', mode === "signin" ? "signup" : "signin");
    setLoading(false);
    setProcessingPayment(false);
    setMode(mode === "signin" ? "signup" : "signin");
    setSignupStep("subscription");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      username: "",
      profileType: "Artist",
      subscriptionType: "free" as SubscriptionType,
      agreeToTerms: false,
    });
    // Force a small delay to ensure state is reset
    setTimeout(() => {
      setLoading(false);
      setProcessingPayment(false);
    }, 100);
  };

  const subscriptionPlans = [
    {
      id: "free" as SubscriptionType,
      name: "Free",
      price: "$0",
      icon: Users,
      description: "Perfect for getting started",
      features: [
        "Browse all marketplaces",
        "Basic profile creation", 
        "5 uploads per month",
        "Community forum access",
        "Standard support"
      ],
      popular: false
    },
    {
      id: "community" as SubscriptionType,
      name: "Community",
      price: "$9",
      icon: Star,
      description: "Connect & collaborate",
      features: [
        "Unlimited uploads & listings",
        "Advanced messaging system",
        "Community events access",
        "Basic performance analytics",
        "Priority email support"
      ],
      popular: false
    },
    {
      id: "single" as SubscriptionType,
      name: "Single Module",
      price: "$19",
      icon: Target,
      description: "Focus on one marketplace",
      features: [
        "Full access to one chosen module",
        "Unlimited listings in selected module",
        "Advanced module-specific tools",
        "Dedicated analytics for your module",
        "Priority support for chosen area"
      ],
      popular: false
    },
    {
      id: "full" as SubscriptionType,
      name: "Full Access",
      price: "$29",
      icon: Zap,
      description: "Complete creator toolkit",
      features: [
        "Advanced marketplace tools",
        "Collaboration project management",
        "Professional analytics dashboard",
        "Custom profile branding",
        "API access & integrations"
      ],
      popular: true
    },
    {
      id: "premium" as SubscriptionType,
      name: "Premium",
      price: "$99",
      icon: Crown,
      description: "Enterprise-level power",
      features: [
        "White-label platform access",
        "Dedicated account manager",
        "Custom feature development",
        "24/7 priority phone support",
        "Advanced security features"
      ],
      popular: false
    }
  ];

  const handleSubscriptionSelect = (subscriptionType: SubscriptionType) => {
    setFormData(prev => ({ ...prev, subscriptionType }));
  };

  const handlePayment = async () => {
    const selectedPlan = subscriptionPlans.find(p => p.id === formData.subscriptionType);
    
    // Free plan doesn't need payment
    if (formData.subscriptionType === 'free') {
      setSignupStep("form");
      return;
    }

    // For paid plans, require email first
    if (!formData.email) {
      toast.error('Please enter your email address to proceed with payment');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    setProcessingPayment(true);

    try {
      // Create payment order (no auth required for signup flow)
      const response = await fetch('http://localhost:5001/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || null, // Will be set after signup
          subscriptionType: formData.subscriptionType,
          email: formData.email, // For signup flow
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const paymentData = await response.json();

      // Store payment order ID for later verification
      localStorage.setItem('pending_payment_order', JSON.stringify({
        orderId: paymentData.data.orderId,
        razorpayOrderId: paymentData.data.razorpayOrderId,
        subscriptionType: formData.subscriptionType,
      }));

      // Initialize Razorpay checkout
      const options = {
        key: paymentData.data.keyId,
        amount: paymentData.data.amount * 100, // Convert to paise
        currency: paymentData.data.currency,
        name: 'Artistrial',
        description: `${selectedPlan?.name} Subscription`,
        order_id: paymentData.data.razorpayOrderId,
        handler: async function (response: any) {
          // Payment successful, verify payment
          try {
            // Verify payment (no auth required for signup flow)
            const verifyResponse = await fetch('http://localhost:5001/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id || null,
                email: formData.email,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Proceeding to registration...');
              localStorage.removeItem('pending_payment_order');
              setSignupStep("form");
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          email: formData.email || '',
          name: formData.fullName || '',
        },
        theme: {
          color: '#FF8D28',
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate payment');
      setProcessingPayment(false);
    }
  };

  // Subscription selection step for signup
  const renderSubscriptionSelection = () => (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-title mb-4">
            Select Your Account Type
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the account type that best suits your needs. You can upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = formData.subscriptionType === plan.id;
            return (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative ${
                  isSelected 
                    ? 'ring-2 ring-[#FF8D28] bg-[#FF8D28]/5 shadow-lg scale-[1.02]' 
                    : 'hover:shadow-lg'
                } ${plan.popular ? 'border-[#FF8D28]' : ''}`}
                onClick={() => handleSubscriptionSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-[#FF8D28] text-white px-3 py-1 rounded-full text-xs font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4 pt-6 relative">
                  <div className="text-center mb-3">
                    <div className={`w-12 h-12 ${isSelected ? 'bg-[#FF8D28]' : 'bg-gray-100'} rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="text-center">
                        <CardTitle className="font-title text-xl mb-1">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-gray-900">
                          {plan.price}
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ml-3 ${
                        isSelected 
                          ? 'bg-[#FF8D28] border-[#FF8D28]' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium mb-4">{plan.description}</p>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="space-y-1.5">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Email input for paid plans */}
        {formData.subscriptionType !== 'free' && (
          <div className="max-w-md mx-auto mb-6">
            <Label htmlFor="subscription-email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address (Required for payment)
            </Label>
            <Input
              id="subscription-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll use this email for payment and account creation
            </p>
          </div>
        )}

        <div className="text-center">
          <Button 
            className="mb-6 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
            onClick={handlePayment}
            disabled={
              !formData.subscriptionType || 
              processingPayment || 
              loading ||
              (formData.subscriptionType !== 'free' && (!razorpayLoaded || !formData.email))
            }
          >
            {processingPayment ? (
              'Processing Payment...'
            ) : formData.subscriptionType === 'free' ? (
              `Continue with ${subscriptionPlans.find(p => p.id === formData.subscriptionType)?.name || 'Free Plan'}`
            ) : (
              `Pay & Continue with ${subscriptionPlans.find(p => p.id === formData.subscriptionType)?.name || 'Selected Plan'}`
            )}
          </Button>
          
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchMode}
              disabled={loading || processingPayment}
              className={`font-medium text-[#FF8D28] hover:text-[#FF8D28]/90 ${
                loading || processingPayment ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return mode === "signup" && signupStep === "subscription" ? renderSubscriptionSelection() : (
    <div className="bg-gray-50 flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          variant="ghost"
          onClick={() => {
            if (mode === "signup" && signupStep === "form") {
              setSignupStep("subscription");
            } else {
              router.push("/");
            }
          }}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {mode === "signup" && signupStep === "form" ? "Back to Plans" : "Back to Home"}
        </Button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-title">
            {mode === "signin"
              ? "Welcome back"
              : "Complete Your Registration"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : `You've selected the ${subscriptionPlans.find(p => p.id === formData.subscriptionType)?.name} plan. Fill in your details below.`}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-title">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6" 
              noValidate
              onKeyDown={(e) => {
                // Allow Enter key to submit form
                if (e.key === 'Enter' && !loading && !processingPayment) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            >
              {mode === "signup" && (
                <>
                  <div>
                    <Label htmlFor="fullName">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange(
                          "fullName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange(
                          "username",
                          e.target.value,
                        )
                      }
                      placeholder="Choose a unique username"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="profileType">
                      Profile Type *
                    </Label>
                    <Select
                      value={formData.profileType}
                      onValueChange={(value) =>
                        handleInputChange("profileType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your profile type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Artist">
                          Artist - Create and sell artwork
                        </SelectItem>
                        <SelectItem value="Venue">
                          Venue - Rent out studio/gallery space
                        </SelectItem>
                        <SelectItem value="Investor">
                          Investor - Fund creative projects
                        </SelectItem>
                        <SelectItem value="Legal">
                          Legal - Provide legal services
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      You can change this later in your profile
                      settings
                    </p>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange(
                        "password",
                        e.target.value,
                      )
                    }
                    placeholder={
                      mode === "signup"
                        ? "Create a password (min 6 characters)"
                        : "Enter your password"
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "agreeToTerms",
                          checked,
                        )
                      }
                      required
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-[#FF8D28] hover:text-[#FF8D28]/90"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-[#FF8D28] hover:text-[#FF8D28]/90"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                disabled={loading || processingPayment}
                onClick={(e) => {
                  console.log('Submit button clicked');
                  console.log('Current state - loading:', loading, 'processingPayment:', processingPayment, 'mode:', mode);
                  
                  // If button is disabled, prevent action
                  if (loading || processingPayment) {
                    console.log('Button is disabled, preventing action');
                    e.preventDefault();
                    return;
                  }
                  
                  // Ensure form submits normally
                  console.log('Button click allowed, proceeding with form submission');
                }}
              >
                {loading || processingPayment
                  ? "Loading..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  disabled={loading || processingPayment}
                  className={`font-medium text-[#FF8D28] hover:text-[#FF8D28]/90 ${
                    loading || processingPayment ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Google Sign-In Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => (window.location.href = "http://localhost:5001/auth/google")}
                className="flex items-center justify-center w-full border border-gray-300 bg-white text-black rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <FcGoogle className="mr-2 w-5 h-5" />
                {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPageRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}