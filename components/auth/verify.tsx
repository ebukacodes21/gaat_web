"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { routes } from "@/constants";
import { apiCall, formatErr } from "@/utils/helper";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const VerifySchema = z.object({
  code: z
    .array(z.string().length(1, "Required"))
    .length(6, "Fill code entirely"),
});

const VerifyAccountForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailCtx = searchParams.get("email") || "";
  const expiresCtx = searchParams.get("expires_in") || "";

  // 🧠 STRICT BACKEND ONLY PARSER: No magical fallback values.
  const getInitialCountdown = (): number => {
    if (!emailCtx || !expiresCtx) return 0;

    // Check if the backend gave an integer (relative seconds)
    if (/^\d+$/.test(expiresCtx)) return parseInt(expiresCtx, 10);

    // Otherwise treat it strictly as an absolute ISO/Timestamp string
    const parsedDate = Date.parse(expiresCtx);
    return !isNaN(parsedDate)
      ? Math.max(0, Math.floor((parsedDate - Date.now()) / 1000))
      : 0;
  };

  const [loading, setIsLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // ⚡ HYDRATION FIX: Track mounting state to prevent server/client timestamp drift mismatch
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // UI Control States
  const [customEmail, setCustomEmail] = useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    setCountdown(getInitialCountdown());
  }, [expiresCtx, emailCtx]);

  const { control, handleSubmit, setValue, getValues } = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: { code: ["", "", "", "", "", ""] },
  });

  useEffect(() => {
    if (!isMounted || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isMounted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (
    value: string,
    index: number,
    onChange: (...event: any[]) => void,
  ) => {
    const currentCodeArray = [...getValues("code")];
    if (value.length > 1) {
      const cleanPaste = value
        .replace(/[^0-9]/g, "")
        .slice(0, 6)
        .split("");
      const updatedCode = [...currentCodeArray];
      cleanPaste.forEach((char, idx) => {
        if (idx < 6) updatedCode[idx] = char;
      });
      setValue("code", updatedCode);
      inputRefs.current[Math.min(cleanPaste.length, 5)]?.focus();
      return;
    }
    currentCodeArray[index] = value;
    onChange(currentCodeArray);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !getValues("code")[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResendCode = async (e: React.FormEvent) => {
    setResending(true);
    e.preventDefault();

    try {
      const finalEmailTarget = customEmail.trim() || emailCtx;

      if (
        !finalEmailTarget ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmailTarget)
      ) {
        setEmailInputError(
          "Please provide a structurally valid email address.",
        );
        return;
      }

      setEmailInputError("");
      setError("");
      setSuccess("");

      const result = await apiCall("/api/resend", "POST", {
        email: finalEmailTarget,
      });
      setSuccess(result.message);

      const newExpiry =
        result?.data?.code_expires_at || result?.code_expires_at;

      if (!newExpiry) {
        setCountdown(0);
        return;
      }

      // ⚡ UPDATE THE ROUTER STACK: Sync the browser's context parameters with the updated timeline data
      const params = new URLSearchParams(window.location.search);
      params.set("email", finalEmailTarget);
      params.set("expires_in", String(newExpiry));
      router.replace(`${window.location.pathname}?${params.toString()}`);

      // Parse and display countdown numbers cleanly
      if (/^\d+$/.test(newExpiry)) {
        setCountdown(parseInt(newExpiry, 10));
      } else {
        const parsedDate = Date.parse(newExpiry);
        setCountdown(
          !isNaN(parsedDate)
            ? Math.max(0, Math.floor((parsedDate - Date.now()) / 1000))
            : 0,
        );
      }
    } catch (error) {
      setError(formatErr(error));
      setCountdown(0);
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof VerifySchema>) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        email: emailCtx || customEmail.trim(),
        code: values.code.join(""),
      };

      const result = await apiCall("/api/verify", "POST", payload);
      toast.success(result.message);
      setSuccess(result.message);
      setTimeout(() => router.push(routes.LOGIN), 1500);
    } catch (error) {
      setError(formatErr(error));
      setCountdown(0)
    } finally {
      setIsLoading(false);
    }
  };

  // Switch layouts automatically if backend tokens indicate expiration status
  const isExpiredOrMissing = countdown <= 0 || !emailCtx;

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] dark:bg-neutral-950 flex font-sans antialiased">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-[40%] bg-neutral-900 p-12 flex-col justify-between relative overflow-hidden text-neutral-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,31,40,0.12),transparent_60%)]" />

        <div className="flex items-center gap-2 relative z-10">
          <div className="h-6 w-6 rounded bg-[#D61F28] flex items-center justify-center font-black text-xs text-white">
            G
          </div>
          <span className="font-bold tracking-tight text-white text-lg">
            GAAT Investment
          </span>
        </div>

        <div className="space-y-6 relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-[11px] text-[#D61F28] font-semibold border border-neutral-700/50">
            <Sparkles className="h-3 w-3" /> Integrity Check Subsystem
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Authenticate your communications node.
          </h1>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Verify possession of your declared communications channel to
            validate identity records and authorize database state changes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6 relative z-10">
          <div>
            <div className="text-xl font-semibold text-white tracking-tight">
              Identity
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Tethering Matrix
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
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-[360px] space-y-6">
          <button
            type="button"
            onClick={() => router.push(routes.LOGIN)}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#656F78] hover:text-[#2C3237] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </button>

          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-[#2C3237] dark:text-white">
              {!isMounted || isExpiredOrMissing
                ? "Request New Authorization Token"
                : "Verify Account Signature"}
            </h2>
            <p className="text-xs text-[#656F78] leading-relaxed">
              {!isMounted || isExpiredOrMissing
                ? "Your validation session code has expired or is missing. Provide your registration email location to dispatch a fresh security token array."
                : `Enter the 6-digit confirmation key array sent to ${emailCtx}`}
            </p>
          </div>

          {/* ================= CONDITION A: VALIDATION SUBMIT VIEW ================= */}
          {isMounted && !isExpiredOrMissing ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 animate-in fade-in duration-200"
            >
              <FieldGroup>
                <Controller
                  name="code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex justify-between items-center mb-2">
                        <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Secure Passcode
                        </FieldLabel>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          Expires in {formatTime(countdown)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        {field.value.map((char, index) => (
                          <Input
                            key={index}
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            maxLength={1}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            value={char}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                field.onChange,
                              )
                            }
                            className={cn(
                              "w-[44px] h-[48px] text-center text-lg font-bold rounded-lg bg-[#F9FAFB] transition-all border",
                              fieldState.invalid
                                ? "border-[#D61F28] focus-visible:ring-[#D61F28]"
                                : "border-[#E5E7EB] dark:border-border focus-visible:ring-neutral-900",
                            )}
                          />
                        ))}
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>

              {error && (
                <div className="p-3 bg-red-50 text-[#D61F28] border border-red-100 rounded-lg text-xs font-medium flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Submit Authorization Token"
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCountdown(0)}
                  className="text-[11px] text-neutral-400 hover:text-[#D61F28] underline transition-colors"
                >
                  Didn't receive code / Use alternative email
                </button>
              </div>
            </form>
          ) : (
            // ================= CONDITION B: TOKEN RECOVERY/RESEND VIEW =================
            <form
              onSubmit={onResendCode}
              className="space-y-4 animate-in slide-in-from-bottom-2 duration-200"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Target Account Delivery Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    defaultValue={emailCtx}
                    value={customEmail || undefined}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="h-10 pl-9 text-xs rounded-lg bg-[#F9FAFB] border-[#E5E7EB]"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                </div>
                {emailInputError && (
                  <p className="text-[11px] text-[#D61F28] font-medium pt-0.5">
                    {emailInputError}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-[#D61F28] border border-red-100 rounded-lg text-xs font-medium flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-medium flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={resending}
                className="w-full h-10 bg-[#D61F28] text-white hover:bg-red-700 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                {resending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Generating Token...
                  </>
                ) : (
                  "Generate Delivery Payload"
                )}
              </Button>

              {emailCtx && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCountdown(getInitialCountdown())}
                    className="text-[11px] text-neutral-400 hover:text-neutral-600 underline transition-colors"
                  >
                    Return to code validation panel
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
