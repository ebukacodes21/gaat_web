"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { SignupSchema } from "@/schema";
import { routes } from "@/constants";
import { apiCall, formatErr } from "@/utils/helper";

// Custom form control layout primitives matching your architecture
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Core component UI elements
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Operational UI iconography
import {
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import Logo from "@/components/logo";
import toast from "react-hot-toast";

const SignupForm = () => {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [statesData, setStatesData] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [lgaOpen, setLgaOpen] = useState(false);

  useEffect(() => {
    setLoadingStates(true);

    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not pull geographic information schema.");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a: any, b: any) =>
          a.state.localeCompare(b.state),
        );
        setStatesData(sorted);
      })
      .catch((err) => {
        console.error("Safely bypassed remote map data failure:", err);
        toast.error("Geographic boundaries could not be retrieved. Refresh to try again.");
      })
      .finally(() => setLoadingStates(false));
  }, []);

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      zipCode: "",
      state: "",
      lga: "",
      address: "",
      phone1: "",
      phone2: "",
      gender: "",
      maritalStatus: "",
      occupation: "",
      aboutUs: "",
      termsAccepted: true,
    },
  });

  const selectedState = watch("state");

  const availableLgas = useMemo(() => {
    return statesData.find((s) => s.state === selectedState)?.lgas || [];
  }, [selectedState, statesData]);

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ["firstName", "lastName", "email", "password", "confirmPassword"]
        : step === 2
          ? ["gender", "maritalStatus", "phone1", "occupation", "aboutUs"]
          : [];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    setIsLoading(true);

    try {
      const result = await apiCall("/api/register", "POST", {
        address: values.address,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        gender: values.gender,
        occupation: values.occupation,
        phone1: values.phone1,
        phone2: values.phone2,
        state: values.state,
        lga: values.lga,
        email: values.email,
        zip_code: values.zipCode,
        marital_status: values.maritalStatus,
        about_us: values.aboutUs
      });

      reset();
      toast.success(
        result?.message || "Loan application profile created successfully!",
      );
      
      // Extract properties safely with protective defaults
      const targetEmail = result?.data?.email || values.email;
      const targetExpiry = result?.data?.code_expires_in || result?.code_expires_in || "60";

      // this maps directly to your verification panel structure
      setTimeout(() => {
        router.push(`${routes.VERIFY}?email=${encodeURIComponent(targetEmail)}&expires_in=${targetExpiry}`);
      }, 1500);
      
    } catch (error) {
      toast.error(formatErr(error));
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
            <Sparkles className="h-3 w-3" /> Secure Credit Portal
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Loan applications, simplified.
          </h1>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Set up your secure profile, provide your occupational criteria, and
            get fast tracking toward flexible financial credit facilities.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Fast-tracked profile verification
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-neutral-800 rounded-lg text-[#D61F28]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-neutral-300">
                Safe and highly encrypted personal details
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
              Data Encryption
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

      {/* RIGHT WORKSPACE PANEL: Field Driven Registration Subsystem */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-16 lg:px-20 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-[480px] space-y-6">
          {/* Section Dynamic Heading Block */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-[#2C3237] dark:text-white">
              {step === 1 && "Account Security"}
              {step === 2 && "Personal Details"}
              {step === 3 && "Contact Address"}
            </h2>
            <p className="text-xs text-[#656F78]">
              Step {step} of 3 —{" "}
              {step === 1
                ? "Create your login credentials"
                : step === 2
                  ? "Provide details for credit assessment"
                  : "Confirm your current physical address"}
            </p>
          </div>

          {/* Graphical Progress Interface indicators */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  i <= step
                    ? "bg-[#D61F28]"
                    : "bg-[#F3F4F6] dark:bg-neutral-800",
                )}
              />
            ))}
          </div>

          {/* Primary Input Controller Processing Structure */}
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log("FORM ERRORS", errors);
            })}
            className="space-y-5"
          >
            <FieldGroup className="space-y-4">
              {/* STEP 1: INITIAL CORE CREDENTIALS */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in-40 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="firstName"
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
                            First Name <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="John"
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
                      name="lastName"
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
                            Last Name <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="Doe"
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
                  </div>

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
                          Email Address{" "}
                          <span className="text-[#D61F28]">*</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="password"
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
                            Password <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
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

                    <Controller
                      name="confirmPassword"
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
                            Confirm Password{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
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
                  </div>
                </div>
              )}

              {/* STEP 2: PROFILE SPECIFICATIONS & DETAILS */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in-40 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="gender"
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
                            Gender <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] transition-all bg-[#F9FAFB]",
                                fieldState.invalid
                                  ? "border-[#D61F28]"
                                  : "border-[#E5E7EB] dark:border-border",
                              )}
                            >
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="maritalStatus"
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
                            Marital Status{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] transition-all bg-[#F9FAFB]",
                                fieldState.invalid
                                  ? "border-[#D61F28]"
                                  : "border-[#E5E7EB] dark:border-border",
                              )}
                            >
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="phone1"
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
                            Primary Phone Number{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="0800 000 0000"
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
                      name="phone2"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-[12px] font-medium text-[#2C3237] dark:text-white">
                            Secondary Phone Number
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="Optional alternative line"
                            className="h-[44px] rounded-[8px] border-[#E5E7EB] dark:border-border bg-[#F9FAFB]"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="occupation"
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
                            Employment Status{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] transition-all bg-[#F9FAFB]",
                                fieldState.invalid
                                  ? "border-[#D61F28]"
                                  : "border-[#E5E7EB] dark:border-border",
                              )}
                            >
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employed">Employed</SelectItem>
                              <SelectItem value="Self-employed">
                                Self-employed
                              </SelectItem>
                              <SelectItem value="Unemployed">
                                Unemployed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="aboutUs"
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
                            How Did You Hear About Us?{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] transition-all bg-[#F9FAFB]",
                                fieldState.invalid
                                  ? "border-[#D61F28]"
                                  : "border-[#E5E7EB] dark:border-border",
                              )}
                            >
                              <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Online Ad">
                                Online Advertisement
                              </SelectItem>
                              <SelectItem value="Friend">
                                Word of mouth / Referral
                              </SelectItem>
                              <SelectItem value="Social Media">
                                Social Media Channels
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: PHYSICAL JURISDICTION ATTRIBUTION */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in-40 duration-200">
                  <Controller
                    name="address"
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
                          Residential Address{" "}
                          <span className="text-[#D61F28]">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Plot 12, Commercial District"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name="state"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="md:col-span-1"
                        >
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium transition-colors",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-[#2C3237] dark:text-white",
                            )}
                          >
                            State <span className="text-[#D61F28]">*</span>
                          </FieldLabel>

                          <Popover open={stateOpen} onOpenChange={setStateOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                aria-expanded={stateOpen}
                                className={cn(
                                  "h-[44px] w-full justify-between rounded-[8px] bg-[#F9FAFB] font-normal",
                                  fieldState.invalid
                                    ? "border-[#D61F28]"
                                    : "border-[#E5E7EB] dark:border-border",
                                )}
                              >
                                {field.value || "Select state"}

                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search state..." />

                                <CommandList>
                                  <CommandEmpty>No state found.</CommandEmpty>

                                  <CommandGroup>
                                    {statesData.map((item, i) => (
                                      <CommandItem
                                        key={i}
                                        value={item.state}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);

                                          setValue("lga", "", {
                                            shouldValidate: true,
                                          });

                                          setStateOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === item.state
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />

                                        {item.state}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lga"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="md:col-span-1"
                        >
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium transition-colors",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-[#2C3237] dark:text-white",
                            )}
                          >
                            LGA <span className="text-[#D61F28]">*</span>
                          </FieldLabel>

                          <Popover open={lgaOpen} onOpenChange={setLgaOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                disabled={!selectedState}
                                className={cn(
                                  "h-[44px] w-full justify-between rounded-[8px] bg-[#F9FAFB] font-normal",
                                  fieldState.invalid
                                    ? "border-[#D61F28]"
                                    : "border-[#E5E7EB] dark:border-border",
                                )}
                              >
                                {field.value || "Select LGA"}

                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search LGA..." />

                                <CommandList>
                                  <CommandEmpty>No LGA found.</CommandEmpty>

                                  <CommandGroup>
                                    {availableLgas.map(
                                      (lga: any, i: number) => (
                                        <CommandItem
                                          key={i}
                                          value={lga.name}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setLgaOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === lga.name
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />

                                          {lga.name}
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="md:col-span-1"
                        >
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium transition-colors",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-[#2C3237] dark:text-white",
                            )}
                          >
                            Postal Code{" "}
                            <span className="text-[#D61F28]">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="100001"
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
                  </div>

                  <Controller
                    name="termsAccepted"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="rounded-[12px] border border-[#E5E7EB] dark:border-border bg-[#F9FAFB] p-4 mt-2 transition-all hover:bg-gray-50 flex items-start space-x-3"
                      >
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 data-[state=checked]:bg-[#D61F28] data-[state=checked]:border-[#D61F28]"
                        />
                        <div className="space-y-1 leading-none">
                          <FieldLabel className="text-[12px] font-normal text-[#656F78] cursor-pointer">
                            I declare that the information provided is accurate
                            and I authorize GAAT Investment to perform
                            verification and credit checks necessary for this
                            loan application.
                          </FieldLabel>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </div>
              )}
            </FieldGroup>

            {/* Stepper Pagination Interface Footer */}
            <div className="flex gap-3 pt-4 border-t border-[#F3F4F6] dark:border-border">
              {step > 1 && (
                <Button
                  type="button"
                      disabled={loading}
                  variant="outline"
                  onClick={prevStep}
                  className="h-10 px-4 border-[#E5E7EB] dark:border-border text-xs font-medium text-[#2C3237] dark:text-white"
                >
                  <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto h-10 px-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-[8px] shadow-sm"
                >
                  Continue <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="ml-auto h-10 px-5 bg-[#D61F28] hover:bg-[#b81a22] text-white text-xs font-semibold rounded-[8px] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying
                      Profile...
                    </span>
                  ) : (
                    "Submit Application Setup"
                  )}
                </Button>
              )}
            </div>
            <div className="text-center pt-2">
              <p className="text-xs text-[#656F78] dark:text-neutral-400 font-normal">
                Already have a secure workspace?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.push(routes.LOGIN)}
                  className="text-[#D61F28] hover:text-[#b91b20] font-bold underline underline-offset-4 transition-colors cursor-pointer bg-transparent border-none p-0 inline"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
