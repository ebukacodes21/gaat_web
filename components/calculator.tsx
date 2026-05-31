"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { apiCall } from "@/utils/helper";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Percent, Calendar, Settings2, ArrowRight } from "lucide-react";

import { Preview } from "./preview";

type Loan = {
  id: string;
  name: string;
  rate: number;
};

type Props = {
  auth: boolean;
};

const MIN = 50000;
const MAX = 100000000;

export const Calculator = ({ auth }: Props) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState([175000]);
  const [term, setTerm] = useState(1);
  const [interestRate, setInterestRate] = useState(0);
  const [type, setType] = useState("");
  const [loanId, setLoanId] = useState("");
  const [customRate, setCustomRate] = useState<number | null>(null);
  const [useCustom, setUseCustom] = useState(false);

  // Controlled state to manage modal visibility cleanly from inside Preview
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const effectiveRate =
    useCustom && customRate !== null ? customRate / 100 : interestRate;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiCall("/api/loan_types", "GET");
        if (mounted && Array.isArray(res.data)) {
          setLoans(res.data);
          if (res.data.length > 0) {
            setInterestRate(Number(res.data[0].rate));
            setType(res.data[0].name);
            setLoanId(res.data[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const calc = useMemo(() => {
    const principal = amount[0];
    const r = effectiveRate / 12;
    const monthly =
      r === 0
        ? principal / term
        : (principal * (r * Math.pow(1 + r, term))) /
          (Math.pow(1 + r, term) - 1);
    const total = monthly * term;
    const interest = total - principal;
    const monthlyInterest = interest / term;

    return { monthly, total, interest, monthlyInterest };
  }, [amount, term, effectiveRate]);

  // Generates a dynamic due date string matching your Preview requirements
  const formattedDueDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + term);
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [term]);

  const format = (v: number) =>
    `₦${v.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <Card className="w-full border-neutral-200/60 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
      <CardHeader >
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            Live Rates Included
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Est. Rate: {(effectiveRate * 100).toFixed(1)}%
          </span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Calculate Your Loan Options
        </CardTitle>
        <CardDescription>
          Adjust terms to match your precise budget requirements.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* AMOUNT SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Desired Financing
            </Label>
            <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
              {format(amount[0])}
            </span>
          </div>
          <div className="pt-1.5">
            <Slider
              value={amount}
              min={MIN}
              max={MAX}
              step={5000}
              onValueChange={setAmount}
              className="py-2 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
            <span>Min: {format(MIN).split(".")[0]}</span>
            <span>Max: {format(MAX).split(".")[0]}</span>
          </div>
        </div>

        {/* LOAN TYPES SELECTION */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Product Framework
          </Label>
          {loading ? (
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          ) : (
            <div className="sm:flex sm:flex-wrap gap-2 space-y-1.5">
              {loans.map((l) => {
                const isSelected = interestRate === l.rate && !useCustom;
                return (
                  <Button
                    key={l.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-9 justify-center text-xs font-medium transition-all px-3",
                      isSelected
                        ? "bg-neutral-900 text-white shadow-sm dark:bg-neutral-50 dark:text-neutral-900"
                        : "bg-white hover:bg-neutral-50 dark:bg-neutral-950",
                    )}
                    onClick={() => {
                      setUseCustom(false);
                      setType(l.name);
                      setLoanId(l.id);
                      setInterestRate(l.rate);
                    }}
                  >
                    {l.name}
                    <span
                      className={cn(
                        "ml-1.5 px-1 rounded text-[10px]",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {(l.rate * 100).toFixed(0)}%
                    </span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* REPAYMENT DURATION */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Repayment
            Schedule
          </Label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[...Array(12)].map((_, i) => {
              const currentMonths = i + 1;
              const isSelected = term === currentMonths;
              return (
                <Button
                  key={i}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-8 min-w-[50px] shrink-0 text-xs font-semibold",
                    isSelected
                      ? "bg-[#D61F28] text-white hover:bg-[#b81a22]"
                      : "",
                  )}
                  onClick={() => setTerm(currentMonths)}
                >
                  {currentMonths}M
                </Button>
              );
            })}
          </div>
        </div>

        {/* ADMINISTRATIVE CONTROLS */}
        {auth && (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400"
              onClick={() => setUseCustom((p) => !p)}
            >
              <Settings2 className="mr-1.5 h-3.5 w-3.5" />
              {useCustom
                ? "Deactivate custom override"
                : "Apply administrative interest rate"}
            </Button>
            {useCustom && (
              <div className="relative mt-2">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Override percentage (e.g. 14)"
                  className="h-9 pl-9 text-xs"
                  value={customRate ?? ""}
                  onChange={(e) =>
                    setCustomRate(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* LEDGER DISPLAY */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white shadow-inner dark:bg-neutral-900">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5 blur-xl" />
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">
                Installment Allocation (Monthly)
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {format(calc.monthly)}
              </span>
            </div>
            <Separator className="bg-white/10" />
            <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
              <div>
                <span className="block font-medium text-neutral-400">
                  Total Interest Accrued
                </span>
                <span className="text-sm font-bold text-neutral-200">
                  {format(calc.interest)}
                </span>
              </div>
              <div className="text-right">
                <span className="block font-medium text-neutral-400">
                  Gross Return Liability
                </span>
                <span className="text-sm font-bold text-neutral-200">
                  {format(calc.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION TRIGGER */}
        {!auth ? (
          <p className="text-center text-[11px] font-medium text-muted-foreground">
            Calculated variables present an estimation model. Final underwriting
            review applies.
          </p>
        ) : (
          <>
            <Button
              className="w-full h-11 bg-[#D61F28] text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              Proceed to Loan Preview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Preview
              customRate={String(customRate)}
              loanId={loanId}
              type={type}
              amount={amount[0]}
              interestRate={effectiveRate}
              monthlyPayment={calc.monthly}
              monthlyInterest={calc.monthlyInterest}
              totalInterest={calc.interest}
              totalAmountToPayBack={calc.total}
              numberOfMonths={term}
              formattedDueDate={formattedDueDate}
              onclose={() => setIsDialogOpen(false)}
              isDialogOpen={isDialogOpen}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
