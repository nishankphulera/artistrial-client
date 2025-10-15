import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    profileType: "Artist",
    agreeToTerms: false,
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, navigate]);

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

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signIn(
          formData.email,
          formData.password,
        );
        if (error) {
          toast.error(error.message || "Failed to sign in");
        } else {
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        }
      } else {
        const userData = {
          full_name: formData.fullName,
          username: formData.username,
          profile_type: formData.profileType,
        };

        const { error } = await signUp(
          formData.email,
          formData.password,
          userData,
        );
        if (error) {
          toast.error(
            error.message || "Failed to create account",
          );
        } else {
          toast.success("Account created successfully!");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      username: "",
      profileType: "Artist",
      agreeToTerms: false,
    });
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-title">
            {mode === "signin"
              ? "Welcome back"
              : "Join Artistrial"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Create your account and start your creative journey"}
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="text-purple-600 hover:text-purple-500"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-purple-600 hover:text-purple-500"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
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
                  onClick={switchMode}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

