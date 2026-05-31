"use client";

import React, { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanRequestSchema } from "@/schema";
import {
  apiCall,
  fileUploader,
  formatCurrency,
  formatErr,
} from "@/utils/helper";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Core Shadcn layout & display containers
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Primitives matching your workspace field architecture
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

// Operational UI iconography
import {
  Loader2,
  FileText,
  Landmark,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronsUpDown,
  Check,
  Copy,
} from "lucide-react";
import { FileUpload } from "./file-uploader";
import { BankResponse } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { routes } from "@/constants";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

type PreviewProp = {
  customRate: string;
  loanId: string;
  type: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  monthlyInterest: number;
  totalInterest: number;
  totalAmountToPayBack: number;
  numberOfMonths: number;
  formattedDueDate: string;
  onclose: () => void;
  isDialogOpen: boolean;
};

export const Preview: FC<PreviewProp> = ({
  customRate,
  loanId,
  type,
  amount,
  interestRate,
  monthlyPayment,
  monthlyInterest,
  totalInterest,
  totalAmountToPayBack,
  numberOfMonths,
  formattedDueDate,
  onclose,
  isDialogOpen
}) => {
  // Interface System States
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [copy, setCopied] = useState<boolean>(false);
  const router = useRouter();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Account number copied!");
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      toast.error("failed to copy");
    }
  };

  // File Upload Ingestion Status Maps
  const [isStatementLoading, setIsStatementLoading] = useState<boolean>(false);
  const [isAdminFeeReceiptLoading, setIsAdminFeeReceiptLoading] =
    useState<boolean>(false);
  const [isCollateralDocumentLoading, setIsCollateralDocumentLoading] =
    useState<boolean>(false);
  const [isLoanInterestLoading, setIsLoanInterestLoading] =
    useState<boolean>(false);
  const [selectedBankCode, setSelectedBankCode] = useState<string>("");

  // File Storage Reference Strings
  const [statement, setStatement] = useState<string>("");
  const [adminFeeReceipt, setAdminFeeReceipt] = useState<string>("");
  const [collateralDocument, setCollateralDocument] = useState<string>("");
  const [loanInterest, setLoanInterest] = useState<string>("");
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const adminFee =
    type === "Proof of Funds Loan" ? 0.005 * amount : 0.01 * amount;

  const { control, handleSubmit, reset, setValue, watch } = useForm<
    z.infer<typeof LoanRequestSchema>
  >({
    resolver: zodResolver(LoanRequestSchema),
    defaultValues: {
      account_number: "",
      account_holder: "",
      bank_name: "",
      collateral: "",
      bvn: "",
      guarantor_name: "",
      guarantor_email: "",
      guarantor_phone: "",
      guarantor_ippis_no: "",
      occupation: "",
      employer_name: "",
      employer_address: "",
      employer_phone: "",
      ippis_no: "",
    },
  });

  const handleFileUpload = async (
    file: File | undefined,
    name: string,
    setFileUrl: React.Dispatch<React.SetStateAction<string>>,
    setUploadProgress: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (!file) return;
    try {
      setSuccess("");
      setError("");
      setUploadProgress(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const result = await fileUploader("/api/upload", formData);
      setSuccess(result.message);
      setFileUrl(result.url);
      toast.success(result.message);
    } catch (err) {
      setError(formatErr(err));
    } finally {
      setUploadProgress(false);
    }
  };

  useEffect(() => {
    fetch("https://supermx1.github.io/nigerian-banks-api/data.json")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name),
        );
        setBanks(sorted);
      })
      .catch((err) => console.error("bank fetch failed", err));
  }, []);

  const accountNumber = watch("account_number");

  useEffect(() => {
    if (accountNumber?.length === 10 && selectedBankCode) {
      setIsValidating(true);
      apiCall(
        `/api/verify-account?account_number=${accountNumber}&bank_code=${selectedBankCode}`,
        "GET",
      )
        .then((res) => {
          if (res.status === true && res.data?.account_name) {
            setValue("account_holder", res.data.account_name);
          } else {
            toast.error("Unable to resolve account");
          }
        })
        .catch(() => {
          toast.error("Failed to resolve account");
        })
        .finally(() => setIsValidating(false));
    }
  }, [accountNumber, selectedBankCode]);

  const onSubmit = async (values: z.infer<typeof LoanRequestSchema>) => {
    try {
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (
        !statement ||
        !adminFeeReceipt ||
        !collateralDocument ||
        (type === "Proof of Funds Loan" && !loanInterest)
      ) {
        setError(
          "Document verification incomplete. Please attach all mandatory receipts.",
        );
        setIsLoading(false);
        return;
      }

      const result = await apiCall("/api/request_loan", "POST", {
        ...values,
        loan_type_id: loanId,
        type,
        principal_amount: amount,
        term_months: numberOfMonths,
        statement,
        admin_fee_receipt: adminFeeReceipt,
        collateral_document: collateralDocument,
        loan_interest: loanInterest,
        override_rate: customRate !== null ? customRate : "",
      });

      reset();
      setSuccess(result.message);
      toast.success(result.message);
      setTimeout(() => {
        setSuccess("");
        setShowForm(false);
        onclose();
        router.push(routes.DASHBOARD);
      }, 2000);
    } catch (error) {
      setError(formatErr(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onclose}>
      <DialogContent className="lg:max-w-3xl bg-[#1A1715] border-[#2C2621]">
        <DialogTitle className="text-[12px] font-bold uppercase tracking-widest text-[#E6A15C]">
          Loan Settlement & Fee Validation
        </DialogTitle>
        <ScrollArea className="w-full h-[540px] pr-3">
          <Card className="w-full border-none shadow-none bg-transparent pb-4">
            {!showForm ? (
              <>
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-bold tracking-tight text-white">
                    Loan Overview Target
                  </CardTitle>
                  <CardDescription className="text-neutral-400 dark:text-neutral-400">
                    Review the underlying asset constants before generating
                    dynamic platform legal notes.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0 space-y-4">
                  <div className="rounded-2xl p-4  space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Facility Framework
                      </span>
                      <span className="font-semibold text-white">
                        {type}
                      </span>
                    </div>
                    <Separator className="dark:bg-neutral-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Allocated Principal
                      </span>
                      <span className="font-mono font-bold text-neutral-400">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Base System APR
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {(interestRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Separator className="dark:bg-neutral-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Installment (Monthly)
                      </span>
                      <span className="font-mono font-medium text-neutral-400">
                        {type !== "Proof of Funds Loan"
                          ? formatCurrency(monthlyPayment)
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Interest Accrual (Monthly)
                      </span>
                      <span className="font-mono text-neutral-500 dark:text-neutral-400">
                        {type !== "Proof of Funds Loan"
                          ? formatCurrency(monthlyInterest)
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Aggregated Interest Liability
                      </span>
                      <span className="font-mono font-semibold text-neutral-400">
                        {formatCurrency(totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Processing &amp; Admin Fee
                      </span>
                      <span className="font-mono font-semibold text-neutral-400">
                        {formatCurrency(adminFee)}
                      </span>
                    </div>
                    <Separator className="dark:bg-neutral-800" />
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-neutral-400">
                        Gross Return Capital
                      </span>
                      <span className="font-mono font-black text-neutral-400">
                        {formatCurrency(totalAmountToPayBack)}
                      </span>
                    </div>
                    <Separator className="dark:bg-neutral-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Amortization Timeline
                      </span>
                      <span className="font-medium text-neutral-500">
                        {numberOfMonths} Month{numberOfMonths > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Final Maturity Date
                      </span>
                      <span className="font-mono text-neutral-500">
                        {formattedDueDate}
                      </span>
                    </div>
                  </div>

                  <Alert className="border-amber-200/60  dark:border-amber-900/40">
                    <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Pre-Execution Obligation
                    </AlertTitle>
                    <AlertDescription className="text-xs text-amber-700/90 dark:text-amber-500/90 mt-1 leading-relaxed">
                      {type === "Proof of Funds Loan" ? (
                        <>
                          Processing requirements command upfront settlement of
                          the interest allocation total of{" "}
                          <strong>{formatCurrency(totalInterest)}</strong>{" "}
                          paired with the administrative platform fee of{" "}
                          <strong>{formatCurrency(adminFee)}</strong>. Proceed
                          next to submit confirmations.
                        </>
                      ) : (
                        <>
                          Processing rules command upfront platform
                          administrative fee clearance totaling{" "}
                          <strong>{formatCurrency(adminFee)}</strong>. Click
                          progress anchors below to attach verification records.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 px-0 border-neutral-100 dark:border-neutral-800">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-xs font-semibold rounded-[8px]"
                    onClick={onclose}
                  >
                    Abandon Session
                  </Button>
                  <Button
                    className="w-full h-11 bg-[#D61F28] text-white hover:bg-[#b81a22] text-xs font-semibold shadow-md rounded-[8px]"
                    onClick={() => setShowForm(true)}
                  >
                    Initialize Application Setup{" "}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader className="px-0 pt-0 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -ml-2 text-neutral-500 dark:text-neutral-400"
                      onClick={() => setShowForm(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-[12px] font-mono tracking-widest text-neutral-400 uppercase">
                      Underwriting Verification
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight text-neutral-400">
                    Platform Dossier Pipeline
                  </CardTitle>
                  <CardDescription className="text-neutral-400 dark:text-neutral-400">
                    Supply the data packages below to finalize credit
                    authorization claims.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* SECTION 1: EMPLOYMENT PARAMETERS */}
                  <FieldGroup className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" /> Employment Parameters
                    </h4>

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
                                : "text-neutral-300",
                            )}
                          >
                            Your Occupation
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            >
                              <SelectValue placeholder="Select Occupation" />
                            </SelectTrigger>
                            <SelectContent className="">
                              {[
                                "Employed",
                                "Self-Employed",
                                "Unemployed",
                                "Student",
                              ].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Controller
                        name="employer_name"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Employer Name
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="Employer name or 'NIL'"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="employer_phone"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Employer Phone
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="Employer phone or 'NIL'"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
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
                      name="employer_address"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-neutral-300",
                            )}
                          >
                            Your Employer Address
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="Employer address or 'NIL'"
                            className={cn(
                              "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                              fieldState.invalid && "border-[#D61F28]",
                            )}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="ippis_no"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-neutral-300",
                            )}
                          >
                            Your IPPIS Number
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder="IPPIS identity mapping if applicable"
                            className={cn(
                              "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                              fieldState.invalid && "border-[#D61F28]",
                            )}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <Separator className="dark:bg-neutral-800" />

                  {/* SECTION 2: SETTLEMENT NODE ROUTING */}
                  <FieldGroup className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <Landmark className="h-3.5 w-3.5" /> Settlement Node
                      Routing
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Controller
                        name="bank_name"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Bank Name
                            </FieldLabel>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="h-[44px] w-full justify-between border-[#E5E7EB] dark:border-border rounded-[8px]"
                                >
                                  {selectedBankCode
                                    ? banks.find(
                                        (b) => b.code === selectedBankCode,
                                      )?.name
                                    : "Select bank"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search bank..." />

                                  <CommandList>
                                    <CommandEmpty>No bank found.</CommandEmpty>

                                    {banks.map((bank) => (
                                      <CommandItem
                                        key={bank.id}
                                        value={bank.name}
                                        onSelect={() => {
                                          setSelectedBankCode(bank.code);
                                          field.onChange(bank.name);
                                        }}
                                      >
                                        {bank.name}
                                        <Check
                                          className={`ml-auto h-4 w-4 ${
                                            selectedBankCode === bank.code
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                      </CommandItem>
                                    ))}
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
                        name="account_number"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Account Number
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="10-digit NUBAN ledger"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Controller
                          name="account_holder"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                className={cn(
                                  "text-[12px] font-medium",
                                  fieldState.invalid
                                    ? "text-[#D61F28]"
                                    : "text-neutral-300",
                                )}
                              >
                                Your Account Name
                              </FieldLabel>
                              <Input
                                {...field}
                                disabled
                                placeholder="Account holder naming structure"
                                className={cn(
                                  "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                  fieldState.invalid && "border-[#D61F28]",
                                )}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        {isValidating && (
                          <div className="flex gap-2 items-center">
                            <p className="text-white text-sm">validating Account Holder</p>
                            <ClipLoader size={20} color="white"/>
                          </div>
                        )}
                      </div>
                      <Controller
                        name="bvn"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Bank Verification Number (BVN)
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="11-digit system identifier"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>

                  <Separator className="dark:bg-neutral-800" />

                  {/* SECTION 3: GUARANTOR ASSIGNMENT */}
                  <FieldGroup className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Credit Guarantor
                      Assignment
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Controller
                        name="guarantor_name"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Guarantor Name
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="Full Name"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="guarantor_email"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Your Guarantor Email
                            </FieldLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Contact Email"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Controller
                        name="guarantor_phone"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Guarantor Phone Number
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="Contact Phone"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="guarantor_ippis_no"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              className={cn(
                                "text-[12px] font-medium",
                                fieldState.invalid
                                  ? "text-[#D61F28]"
                                  : "text-neutral-300",
                              )}
                            >
                              Guarantor IPPIS Number
                            </FieldLabel>
                            <Input
                              {...field}
                              placeholder="Guarantor IPPIS payload index"
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>

                  <Separator className="dark:bg-neutral-800" />

                  {/* SECTION 4: FILE ATTACHMENTS & COLLATERAL */}
                  <FieldGroup className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                      Mandatory Asset File Attachment Vectors
                    </h4>

                    <FileUpload
                      title="Statement of Account (Minimum 6 months running data)"
                      onChange={(file) =>
                        handleFileUpload(
                          file,
                          "statement of account",
                          setStatement,
                          setIsStatementLoading,
                        )
                      }
                      isLoading={isStatementLoading}
                       text_color="text-white"
                    />

                    <Controller
                      name="collateral"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            className={cn(
                              "text-[12px] font-medium",
                              fieldState.invalid
                                ? "text-[#D61F28]"
                                : "text-neutral-300",
                            )}
                          >
                            Select Collateral Variant
                          </FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px] rounded-[8px] bg-[#F9FAFB] dark:bg-neutral-900 dark:border-neutral-800",
                                fieldState.invalid && "border-[#D61F28]",
                              )}
                            >
                              <SelectValue placeholder="Select Collateral" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Real Estate Property",
                                "Personal Property",
                                "Other",
                              ].map((coll) => (
                                <SelectItem key={coll} value={coll}>
                                  {coll}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <FileUpload
                      title="Upload Selected Collateral Legal Bindings"
                      onChange={(file) =>
                        handleFileUpload(
                          file,
                          "collateral document",
                          setCollateralDocument,
                          setIsCollateralDocumentLoading,
                        )
                      }
                      isLoading={isCollateralDocumentLoading}
                       text_color="text-white"
                    />

                    {type === "Proof of Funds Loan" && (
                      <FileUpload
                        title={`Upload Advance Interest Remittance Proof [ ${formatCurrency(totalInterest)} ]`}
                        onChange={(file) =>
                          handleFileUpload(
                            file,
                            "loan interest receipt",
                            setLoanInterest,
                            setIsLoanInterestLoading,
                          )
                        }
                        isLoading={isLoanInterestLoading}
                         text_color="text-white"
                      />
                    )}
                  </FieldGroup>

                  <Separator className="dark:bg-neutral-800" />

                  {/* FIXED COMPANY ACCOUNT DETAILS METADATA */}
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-white space-y-3">
                    <span className="text-[14px] font-mono text-neutral-400 tracking-widest uppercase block">
                      Target Settlement Corporate Vault
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="block text-neutral-400 text-[14px] mb-0.5">
                          Institution Node
                        </span>
                        <span className="font-bold tracking-wide">
                          ACCESS BANK
                        </span>
                      </div>
                      <div>
                        <span className="block text-neutral-400 text-[14px] mb-0.5">
                          Ledger Identity
                        </span>
                        <div className="gap-2 items-center flex">
                          <span className="font-mono font-bold tracking-wider">
                            0009044606
                          </span>
                          <button
                            onClick={() => handleCopy("0009044606")}
                            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Copy Employee Code"
                          >
                            {copy ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="block text-neutral-400 text-[14px] mb-0.5">
                          Beneficiary Target
                        </span>
                        <span className="font-bold truncate block">
                          GAAT INVESTMENT LTD
                        </span>
                      </div>
                    </div>
                    <p className="text-[14px] text-neutral-400 leading-relaxed">
                      Transfer the administrative fee (
                      <strong>{formatCurrency(adminFee)}</strong>) to the
                      corporate vault details above. Ensure the transaction
                      narration includes your reference code.
                    </p>
                  </div>

                  <FileUpload
                    title={`Upload Platform Administrative Fee Receipt [ ${formatCurrency(adminFee)} ]`}
                    onChange={(file) =>
                      handleFileUpload(
                        file,
                        "admin fee receipt",
                        setAdminFeeReceipt,
                        setIsAdminFeeReceiptLoading,
                      )
                    }
                    isLoading={isAdminFeeReceiptLoading}
                    text_color="text-white"
                  />

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-[#D61F28] border border-red-100 dark:border-red-900/30 rounded-lg text-xs font-medium flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 rounded-lg text-xs font-medium flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </div>
                  )}

                  {/* ACTION FOOTER TRAY INSIDE FORM SCROLL FLOW */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                    <div className="flex flex-col gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 text-xs font-semibold rounded-[8px]"
                        disabled={loading}
                        onClick={() => {
                          reset();
                          setError("");
                          setSuccess("");
                          setShowForm(false);
                          onclose();
                        }}
                      >
                        Cancel Session
                      </Button>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-[#D61F28] hover:bg-[#b81a22] text-white text-xs font-semibold rounded-[8px] shadow-md flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {loading
                          ? "Transmitting..."
                          : "Commit Underwriting Schema"}
                      </Button>
                    </div>

                    <p className="text-[14px] text-neutral-500 italic text-center leading-relaxed">
                      Disclaimer Notice: Execution setup triggers automatic
                      underwriting audit pipelines. Non-adherence or fraudulent
                      entries forfeit structural applications automatically.
                    </p>
                  </div>
                </form>
              </>
            )}
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
