"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall, formatErr } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Forward,
  Check,
  X,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { RepaymentModal } from "@/components/repay";
import { getUserRole } from "@/utils/auth";

export default function LoanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [isRepayOpen, setIsRepayOpen] = useState(false);

  const role = getUserRole();

  const fetchLoanDetails = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetching the specific loan (assuming endpoint /api/user_loans/[id])
      const response = await apiCall(`/api/loan`, "GET", { loan_id: id });
      setLoan(response.data || response);
    } catch (err) {
      setError(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLoanDetails();
  }, [id]);

  const handleAction = async (action: string) => {
    setProcessing(action);
    try {
      await apiCall(`/api/manage_loan`, "PATCH", { id, action });
      await fetchLoanDetails();
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setProcessing(null);
    }
  };

  // Update your handleAction call to trigger the modal first
  const initiateRepayment = () => setIsRepayOpen(true);

  const processRepayment = async ({
    amount,
    receipt,
  }: {
    amount: number;
    receipt: string;
  }) => {
    setProcessing("repay");

    try {
      const res = await apiCall(`/api/request_deposit`, "POST", {
        loan_id: loan?.id,
        amount: String(amount),
        receipt,
      });
      await fetchLoanDetails();
      toast.success(res.message);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setIsRepayOpen(false);
      setProcessing(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
      {/* DIAGNOSTIC TILES (Loading/Error states mirrored from Dashboard) */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[350px] w-full gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-[#E6A15C]" />
          <span className="text-xs text-[#8C8176]">
            Synchronizing records securely...
          </span>
        </div>
      )}

      {error && !loading && (
        <Card className="border-dashed border-red-900/40 bg-red-950/10 p-8 text-center rounded-2xl">
          <ShieldCheck className="h-5 w-5 mx-auto text-red-400" />
          <h3 className="mt-4 text-sm font-semibold text-[#FAF8F5]">
            Sync Interrupted
          </h3>
          <p className="mt-1 text-xs text-[#8C8176]">{error}</p>
        </Card>
      )}

      {!loading && loan && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-xs text-[#A39990] pl-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Overview
              </Button>
              <div className="flex items-center gap-3 mt-2">
                <h1 className="text-2xl font-bold text-[#FAF8F5]">
                  {loan?.loan_type}
                </h1>
                {/* ADDED STATUS BADGE HERE */}
                <div
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    loan?.status === "approved"
                      ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                      : loan?.status === "pending"
                        ? "bg-amber-950/30 border-amber-900/50 text-amber-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400"
                  }`}
                >
                  {loan?.status}
                </div>
              </div>
              <p className="text-sm text-[#8C8176] font-mono mt-1">
                ID: {loan?.id}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-[#211E1B] p-2 rounded-2xl border border-[#332D28]">
              {/* Primary Action */}
              {/* Status Management - Grouped tightly */}
              {role && role === "staff" ? (
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { action: "forwarded", tag: "Forward" },
                    { action: "approved", tag: "Approve" },
                    { action: "rejected", tag: "Reject" },
                    { action: "repaid", tag: "Repaid" },
                    { action: "defaulted", tag: "Default" },
                  ].map((item) => (
                    <Button
                      key={item.action}
                      size="sm"
                      variant="outline"
                      disabled={!!processing}
                      onClick={() => handleAction(item.action)}
                      className={`
                        h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                        ${
                          processing === item.action
                            ? "bg-[#2C2621] border-[#3D352E] text-[#8C8176]"
                            : "bg-[#1A1715] border-[#2C2621] text-[#A39990] hover:border-[#3D352E]"
                        }
                      `}
                    >
                      {processing === item.action ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        item.tag
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loan.status === "pending"}
                    onClick={initiateRepayment}
                    className="h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest border-[#2C2621] text-[#E6A15C]"
                  >
                    <Wallet className="h-3 w-3 mr-2" /> Repay
                  </Button>

                  <div className="h-6 w-[1px] bg-[#332D28] hidden sm:block" />
                </>
              )}
            </div>
          </div>

          {/* div Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. FINANCIALS */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6">
                Financials
              </CardTitle>
              <div className="space-y-4">
                {[
                  {
                    label: "Principal",
                    val: `₦${Number(loan?.principal_amount).toLocaleString()}`,
                  },
                  {
                    label: "Interest Rate",
                    val: `${(Number(loan?.interest_rate) * 100).toFixed(1)}%`,
                  },
                  {
                    label: "Term (Months)",
                    val: `${loan?.term_months} Month(s)`,
                  },
                  {
                    label: "Monthly Payment",
                    val: `₦${Number(loan?.monthly_payment).toLocaleString()}`,
                  },
                  {
                    label: "Admin Fee",
                    val: `₦${Number(loan?.admin_fee).toLocaleString()}`,
                  },
                  {
                    label: "Total Interest",
                    val: `₦${Number(loan?.total_interest).toLocaleString()}`,
                  },
                  {
                    label: "Total Repayment",
                    val: `₦${Number(loan?.total_repayment).toLocaleString()}`,
                  },
                  {
                    label: "Total Paid / Unpaid",
                    val: `₦${Number(loan?.total_repaid).toLocaleString()} / ₦${Number(loan?.total_unpaid).toLocaleString()}`,
                  },
                  {
                    label: "Due Date",
                    val: new Date(loan?.due_date).toLocaleDateString(),
                    highlight: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${item.highlight ? "text-[#E6A15C]" : "text-[#FAF8F5]"}`}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. BORROWER & COMPLIANCE */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6">
                Borrower & Compliance
              </CardTitle>
              <div className="space-y-4">
                {[
                  { label: "Borrower", val: loan?.borrower_name },
                  { label: "Email", val: loan?.email },
                  { label: "Occupation", val: loan?.occupation },
                  { label: "Bank", val: loan?.bank_name },
                  { label: "Account Name", val: loan?.account_holder },
                  { label: "Account No", val: loan?.account_number },
                  { label: "BVN", val: loan?.bvn },
                  { label: "Employer Phone", val: loan?.employer_phone },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#FAF8F5] truncate">
                      {item.val || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. GUARANTOR DETAILS */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6">
                Guarantor Information
              </CardTitle>
              <div className="space-y-4">
                {[
                  { label: "Guarantor Name", val: loan?.guarantor_name },
                  { label: "Guarantor Email", val: loan?.guarantor_email },
                  { label: "Guarantor Phone", val: loan?.guarantor_phone },
                  { label: "IPPIS / ID No", val: loan?.guarantor_ippis_no },
                  { label: "Collateral Type", val: loan?.collateral },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#FAF8F5]">
                      {item.val || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Documents Section */}
          <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
            <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6">
              Attached Documentation
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Bank Statement", url: loan?.statement },
                { label: "Admin Fee Receipt", url: loan?.admin_fee_receipt },
                {
                  label: "Collateral Document",
                  url: loan?.collateral_document,
                },
              ].map((doc) => (
                <a
                  key={doc.label}
                  href={doc.url}
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-[#1A1715] border border-[#2C2621] rounded-xl hover:border-[#3D352E] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-[#E6A15C]" />
                    <span className="text-xs text-[#E6E1DC] group-hover:text-white">
                      {doc.label}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-[#544B41]" />
                </a>
              ))}
            </div>
          </Card>

          <RepaymentModal
            loan={loan}
            isOpen={isRepayOpen}
            onClose={() => setIsRepayOpen(false)}
            onConfirm={processRepayment}
          />
        </>
      )}
    </div>
  );
}
