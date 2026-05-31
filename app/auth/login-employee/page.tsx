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

// Operational UI iconography
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Logo from "@/components/logo";
import toast from "react-hot-toast";
import { setAuthToken } from "@/utils/auth";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const LoginEmployee = () => {
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

      const result = await apiCall("/api/login_staff", "POST", values);
      setAuthToken(result.data.token)

      toast.success(result.message)
      router.push(routes.DASHBOARD);
    } catch (error) {
      setError(formatErr(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#141211] flex font-sans antialiased">
      {/* LEFT: CORPORATE IDENTITY TERMINAL */}
      <div className="hidden lg:flex w-[45%] bg-[#1A1715] p-16 flex-col justify-between relative border-r border-[#2C2621]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(214,31,40,0.05),transparent)]" />

        <Logo />

        <div className="space-y-6 relative z-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#E6A15C] font-bold">
            Internal Operations Portal
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Administrative
            <br />
            Command Center
          </h1>
          <p className="text-[#8C8176] text-sm leading-relaxed max-w-sm">
            Restricted access for authorized personnel only. Manage loan
            lifecycles, treasury movements, and staff audits within the secured
            environment.
          </p>
        </div>

        {/* Operational Stats Footer */}
        <div className="flex gap-8 relative z-10">
          <div>
            <div className="text-white font-mono text-lg">04</div>
            <div className="text-[9px] uppercase tracking-widest text-[#544B41]">
              Active Regions
            </div>
          </div>
          <div>
            <div className="text-white font-mono text-lg">99.9%</div>
            <div className="text-[9px] uppercase tracking-widest text-[#544B41]">
              Uptime
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: AUTHENTICATION GATEWAY */}
      <div className="flex-1 flex flex-col justify-center items-center px-10 bg-[#FAF8F5] dark:bg-[#1A1715]">
        <div className="w-full max-w-[360px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1A1715] dark:text-white">
              Staff Login
            </h2>
            <p className="text-xs text-[#8C8176]">
              Enter corporate credentials to proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#D61F28] hover:bg-[#b81a22] text-white font-bold rounded-[8px]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Authorize Entry"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginEmployee;
