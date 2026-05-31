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
  Loader2,
  ArrowLeft,
  Mail,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/logo";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordForm = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const result = await apiCall("/api/forgot", "POST", values);
      setSuccess(result.message);
      reset();
    } catch (error) {
      setError(formatErr(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] dark:bg-neutral-950 flex font-sans antialiased">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-[40%] bg-neutral-900 p-12 flex-col justify-between relative overflow-hidden text-neutral-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,31,40,0.12),transparent_60%)]" />

        <Logo />

        <div className="space-y-6 relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-[11px] text-[#D61F28] font-semibold border border-neutral-700/50">
            <Sparkles className="h-3 w-3" /> Identity Recovery Subsystem
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Recover your portal credential mapping.
          </h1>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Initiate an authenticated token reset routing flow to clear
            credentials and securely re-enter your dashboard environment.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Automated structural security routing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Identity isolation protection patterns
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6 relative z-10">
          <div>
            <div className="text-xl font-semibold text-white tracking-tight">
              256-Bit
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Token Security
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

      {/* RIGHT WORKSPACE PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-16 lg:px-20 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-[400px] space-y-6">
          <button
            type="button"
            onClick={() => router.push(routes.LOGIN)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#656F78] hover:text-[#2C3237] dark:text-neutral-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </button>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-[#2C3237] dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-xs text-[#656F78]">
              Enter your registration email to generate a secure recovery link
            </p>
          </div>

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
            </FieldGroup>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-[#D61F28] border border-red-100 dark:border-red-900/50 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 border border-green-100 dark:border-green-900/50 rounded-lg text-xs font-medium flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-[8px] shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating Recovery Link...
                </>
              ) : (
                "Send Password Recovery Link"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
