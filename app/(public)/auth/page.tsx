'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Check, Crown, Users, Star, Zap, Target, Mail, X } from "lucide-react";
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
import { apiUrl } from '@/utils/api';

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
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ orderId: string; razorpayOrderId: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
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

  const completeSignup = async (paymentInfo?: { orderId?: string; razorpayOrderId?: string }) => {
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

    setLoading(true);
    let signupSucceeded = false;

    try {
      const signupResult = await signUp(userData);

      if (signupResult.error) {
        console.error('Signup error:', signupResult.error);
        toast.error(signupResult.error.message || "Failed to create account");
        return;
      }

      if (paymentInfo?.orderId && paymentInfo?.razorpayOrderId) {
        try {
          const token = localStorage.getItem('access_token');
          const storedUser = localStorage.getItem('user');
          let newUserId: string | null = null;

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              newUserId = parsedUser?.id ?? null;
            } catch (e) {
              console.error('Error parsing user data from localStorage:', e);
            }
          }

          if (newUserId && token) {
            const updateResponse = await fetch(
              apiUrl(`payments/order/${paymentInfo.orderId}`),
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  userId: newUserId,
                  razorpayOrderId: paymentInfo.razorpayOrderId,
                  email: formData.email,
                }),
              }
            );

            if (updateResponse.ok) {
              console.log('Payment linked to user successfully');
            } else {
              console.error('Failed to link payment to user:', updateResponse.status);
            }
          }
        } catch (error) {
          console.error('Error linking payment to user:', error);
        }
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
      signupSucceeded = true;
    } catch (error) {
      console.error('Unexpected error in completeSignup:', error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
      setProcessingPayment(false);
      if (signupSucceeded) {
        setPaymentVerified(false);
        setPaymentDetails(null);
      }
    }
  };

  const initiatePaymentFlow = async () => {
    const selectedPlan = subscriptionPlans.find(p => p.id === formData.subscriptionType);

    if (!formData.email) {
      toast.error('Please enter your email address before proceeding to payment');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    setProcessingPayment(true);

    try {
      const response = await fetch(apiUrl('payments/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || null,
          subscriptionType: formData.subscriptionType,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create payment order';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorMessage);
      }

      const paymentData = await response.json();
      const { orderId, razorpayOrderId, keyId, amount, currency } = paymentData.data;

      setPaymentDetails({ orderId, razorpayOrderId });

      const options = {
        key: keyId,
        amount: amount * 100,
        currency,
        name: 'Artistrial',
        description: `${selectedPlan?.name ?? 'Selected'} Subscription`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch(apiUrl('payments/verify'), {
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
              setPaymentVerified(true);
              toast.success('Payment successful! Finishing your registration...');
              await completeSignup({ orderId, razorpayOrderId });
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
          ondismiss: async () => {
            setProcessingPayment(false);
            toast.info('Payment cancelled');
            try {
              await completeSignup();
            } catch (error) {
              console.error('Signup completion after payment cancellation failed:', error);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate payment');
      setProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Form submitted, mode:', mode, 'signupStep:', signupStep);
    console.log('Form data:', { ...formData, password: '***', confirmPassword: '***' });

    if (loading || processingPayment) {
      console.log('Already processing, ignoring duplicate submission');
      return;
    }

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, determining next action');

    if (mode === "signin") {
      console.log('Starting sign-in process...');
      setLoading(true);
      try {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message || "Failed to sign in");
        } else {
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error('Unexpected error during sign-in:', error);
        toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (signupStep === "subscription") {
      console.warn('Signup submitted while on subscription step. Redirecting to form.');
      setSignupStep("form");
      return;
    }

    if (formData.subscriptionType !== 'free' && !paymentVerified) {
      console.log('Paid subscription selected; initiating payment flow before signup');
      await initiatePaymentFlow();
      return;
    }

    await completeSignup(paymentDetails ?? undefined);
  };


  const switchMode = () => {
    // Reset all states when switching modes
    console.log('Switching mode from', mode, 'to', mode === "signin" ? "signup" : "signin");
    setLoading(false);
    setProcessingPayment(false);
    setPaymentVerified(false);
    setPaymentDetails(null);
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
    setPaymentVerified(false);
    setPaymentDetails(null);
    setSignupStep("form");
  };

  const handleVerifyEmail = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(apiUrl('otp/send'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp_type: mode === 'signup' ? 'signup' : 'email_verification',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setShowOtpModal(true);
        toast.success("OTP sent to your email!");
      } else {
        setOtpError(data.message || "Failed to send OTP");
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(apiUrl('otp/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp_code: otpCode,
          otp_type: mode === 'signup' ? 'signup' : 'email_verification',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        setShowOtpModal(false);
        setOtpCode("");
        toast.success("Email verified successfully!");
      } else {
        setOtpError(data.message || "Invalid OTP code");
        toast.error(data.message || "Invalid OTP code");
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError("Failed to verify OTP. Please try again.");
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setSendingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(apiUrl('otp/resend'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp_type: mode === 'signup' ? 'signup' : 'email_verification',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpCode("");
        toast.success("OTP resent to your email!");
      } else {
        setOtpError(data.message || "Failed to resend OTP");
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setOtpError("Failed to resend OTP. Please try again.");
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setSendingOtp(false);
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

        <div className="text-center">
          <p className="mb-6 text-sm text-gray-600">
            Select a plan above to continue to the registration form.
          </p>
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
              setPaymentVerified(false);
              setPaymentDetails(null);
              setProcessingPayment(false);
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
                {mode === "signup" ? (
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleInputChange("email", e.target.value);
                        setOtpVerified(false);
                        setOtpSent(false);
                      }}
                      placeholder="Enter your email"
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyEmail}
                      disabled={!formData.email || sendingOtp || otpVerified}
                      className="whitespace-nowrap"
                    >
                      {sendingOtp ? (
                        "Sending..."
                      ) : otpVerified ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-1" />
                          Verify Email
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
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
                )}
                {mode === "signup" && otpVerified && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Email verified successfully
                  </p>
                )}
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
                onClick={() => (window.location.href = `${apiUrl('').replace('/api', '')}/auth/google`)}
                className="flex items-center justify-center w-full border border-gray-300 bg-white text-black rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <FcGoogle className="mr-2 w-5 h-5" />
                {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-title">Verify Your Email</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                    setOtpError("");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                We've sent a 6-digit verification code to <strong>{formData.email}</strong>. 
                Please enter the code below.
              </p>

              <div>
                <Label htmlFor="otp">Enter Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                    setOtpError("");
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
                {otpError && (
                  <p className="text-xs text-red-600 mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={sendingOtp}
                  className="flex-1"
                >
                  {sendingOtp ? "Sending..." : "Resend Code"}
                </Button>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length !== 6 || verifyingOtp}
                  className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                >
                  {verifyingOtp ? "Verifying..." : "Verify"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Didn't receive the code? Check your spam folder or click "Resend Code".
              </p>
            </CardContent>
          </Card>
        </div>
      )}
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