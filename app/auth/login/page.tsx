"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { routes } from "@/constants";
import { apiCall, formatErr } from "@/utils/helper";

// Custom form control layout primitives matching your architecture
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

// Core component UI elements
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Operational UI iconography
import {
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/logo";
import { setAuthToken } from "@/utils/auth";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await apiCall("/api/login", "POST", values);
      router.push(routes.DASHBOARD);
      setAuthToken(res.data.token)
    } catch (error) {
      setError(formatErr(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] dark:bg-neutral-950 flex font-sans antialiased">
      {/* LEFT BRAND PANEL: Core System Context */}
      <div className="hidden lg:flex w-[40%] bg-neutral-900 p-12 flex-col justify-between relative overflow-hidden text-neutral-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,31,40,0.12),transparent_60%)]" />

        {/* Company Minimal Branding */}
        <Logo />

        {/* Dynamic Context Block */}
        <div className="space-y-6 relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-[11px] text-[#D61F28] font-semibold border border-neutral-700/50">
            <Sparkles className="h-3 w-3" /> Secure Access Terminal
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Welcome back to your dashboard.
          </h1>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Log in to monitor active loans, review repayment trajectories, or
            request new capital funding allocations.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Real-time credit line updates
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Protected financial environment
              </span>
            </div>
          </div>
        </div>

        {/* System Technical Footprint Metadata */}
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6 relative z-10">
          <div>
            <div className="text-xl font-semibold text-white tracking-tight">
              256-Bit
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Session Security
            </div>
          </div>
          <div>
            <div className="text-xl font-semibold text-white tracking-tight">
              Verified
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              CBN Compliance Standards
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT WORKSPACE PANEL: Login Processing Subsystem */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-16 lg:px-20 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Section Dynamic Heading Block */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-[#2C3237] dark:text-white">
              Account Authentication
            </h2>
            <p className="text-xs text-[#656F78]">
              Provide your verified credentials to access your portal
            </p>
          </div>

          {/* Primary Input Controller Processing Structure */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="space-y-4">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className={cn(
                        "text-[12px] font-medium transition-colors",
                        fieldState.invalid
                          ? "text-[#D61F28]"
                          : "text-[#2C3237] dark:text-white",
                      )}
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                      className={cn(
                        "h-[44px] rounded-[8px] transition-all bg-[#F9FAFB]",
                        fieldState.invalid
                          ? "border-[#D61F28] focus-visible:ring-[#D61F28]"
                          : "border-[#E5E7EB] dark:border-border",
                      )}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex justify-between items-center mb-1">
                      <FieldLabel
                        className={cn(
                          "text-[12px] font-medium transition-colors",
                          fieldState.invalid
                            ? "text-[#D61F28]"
                            : "text-[#2C3237] dark:text-white",
                        )}
                      >
                        Password
                      </FieldLabel>
                      <button
                        type="button"
                        onClick={() => router.push(routes.FORGOT)}
                        className="text-[11px] font-medium text-[#D61F28] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={cn(
                          "h-[44px] rounded-[8px] pr-10 transition-all bg-[#F9FAFB]",
                          fieldState.invalid
                            ? "border-[#D61F28] focus-visible:ring-[#D61F28]"
                            : "border-[#E5E7EB] dark:border-border",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#656F78] hover:text-[#2C3237] dark:text-neutral-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-[#D61F28] border border-red-100 dark:border-red-900/50 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-[8px] shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Authenticating Profile...
                  </>
                ) : (
                  <>
                    Sign In to Portal <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-[#656F78]">
                Don't have an application account?{" "}
                <button
                  type="button"
                  onClick={() => router.push(routes.SIGNUP)}
                  className="font-semibold text-[#D61F28] hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
