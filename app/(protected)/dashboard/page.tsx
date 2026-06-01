"use client";

import { useEffect, useState } from "react";
import { apiCall, formatErr } from "@/utils/helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GiReceiveMoney } from "react-icons/gi";
import { VscLayersActive } from "react-icons/vsc";
import { RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { Calculator } from "@/components/calculator";
import { LoanTable } from "@/components/loantable";
import { Deposit, Loan } from "@/types";
import { DepositTable } from "@/components/deposittable";

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  
  // Independent state management
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDeposits, setLoadingDeposits] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await apiCall("/api/user_loans", "GET");
      setLoans(res?.data?.items || []);
    } catch (error: any) {
      setErrorMessage(formatErr(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeposits = async () => {
    if (deposits.length > 0) return;
    setLoadingDeposits(true);
    setDepositError(null);
    try {
      const res = await apiCall("/api/user_deposits", "GET");
      setDeposits(res?.data?.items || []);
    } catch (error: any) {
      setDepositError(formatErr(error));
    } finally {
      setLoadingDeposits(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const totalLoanAmount = loans.reduce((total, loan) => {
    return loan.status.toLowerCase() === "approved"
      ? total + Number(loan.principal_amount)
      : total;
  }, 0);

  const activeLoansCount = loans.filter(
    (loan) => loan.status.toLowerCase() === "approved",
  ).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[350px] w-full gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-[#E6A15C]" />
              <span className="text-xs text-[#8C8176]">Synchronizing records securely...</span>
            </div>
          )}

          {errorMessage && !loading && (
            <Card className="border-dashed border-red-900/40 bg-red-950/10 p-8 text-center rounded-2xl">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/50 text-red-400 border border-red-900/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#FAF8F5]">Sync Interrupted</h3>
              <p className="mt-1 text-xs text-[#8C8176] max-w-md mx-auto">{errorMessage}</p>
              <Button onClick={fetchLoans} size="sm" className="mt-4 text-xs bg-[#FAF8F5] hover:bg-[#E6E1DC] text-neutral-950 font-medium rounded-xl">
                Retry Connection
              </Button>
            </Card>
          )}

          {!loading && !errorMessage && (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#FAF8F5]">Welcome back</h1>
                  <p className="text-xs text-[#A39990] mt-0.5">Monitor your capital assets, tracking summaries, and projected finance earnings in real time.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchLoans} className="h-9 gap-1.5 text-xs bg-[#211E1B] border-[#332D28] hover:bg-[#26221E] hover:text-[#FAF8F5] text-[#E6E1DC] rounded-xl">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Accounts
                </Button>
              </div>
              
              <div className="space-y-6 animate-in fade-in duration-300">
                <section className="grid gap-4 sm:grid-cols-2">
                  {/* Cards remain unchanged */}
                  <Card className="bg-[#241F1B] border-[#362F29] shadow-sm relative overflow-hidden group rounded-2xl">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[#E63946] to-[#B31924]" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider">Active Lines of Credit</CardTitle>
                      <div className="p-2 rounded-xl bg-[#1A1715] border border-[#332D28] text-[#E63946]"><GiReceiveMoney className="h-4 w-4" /></div>
                    </CardHeader>
                    <CardContent className="pt-1">
                      <span className="text-2xl font-bold font-mono tracking-tight text-[#FAF8F5]">₦{totalLoanAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#241F1B] border-[#362F29] shadow-sm relative overflow-hidden group rounded-2xl">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[#E6A15C] to-[#C7833C]" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider">Approved Financing Products</CardTitle>
                      <div className="p-2 rounded-xl bg-[#1A1715] border border-[#332D28] text-[#E6A15C]"><VscLayersActive className="h-4 w-4" /></div>
                    </CardHeader>
                    <CardContent className="pt-1">
                      <span className="text-2xl font-bold font-mono tracking-tight text-[#FAF8F5]">{activeLoansCount} Active {activeLoansCount === 1 ? "Contract" : "Contracts"}</span>
                    </CardContent>
                  </Card>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <Tabs defaultValue="loans" className="w-full" onValueChange={(val) => val === "deposits" && fetchDeposits()}>
                      <div className="flex items-center justify-between border-b border-[#2C2621] pb-1 mb-4">
                        <TabsList className="bg-[#1E1A17] border border-[#2E2823] p-1 rounded-xl">
                          <TabsTrigger value="loans" className="text-sm text-white px-4 py-1.5 rounded-lg data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FAF8F5] transition-all">My Loans</TabsTrigger>
                          <TabsTrigger value="deposits" className="text-sm text-white px-4 py-1.5 rounded-lg data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FAF8F5] transition-all">Savings &amp; Deposits</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="loans" className="mt-0">
                        {loans.length > 0 ? <LoanTable data={loans} /> : <div className="p-8 text-center text-[#70665C]">No Loans found.</div>}
                      </TabsContent>

                      <TabsContent value="deposits" className="mt-0 focus-visible:outline-none">
                        {loadingDeposits ? <div className="p-8 text-center text-[#70665C]">Synchronizing...</div> : depositError ? <div className="p-8 text-center text-red-400">{depositError}</div> : deposits.length > 0 ? <DepositTable data={deposits} /> : <div className="p-8 text-center text-[#70665C]">No Deposits found.</div>}
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 py-0.5 text-[#8C8176]">
                      <Wallet className="h-3.5 w-3.5 text-[#E6A15C]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Interest Simulation Studio</span>
                    </div>
                    <div className="p-1 overflow-hidden"><Calculator auth={true} /></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}