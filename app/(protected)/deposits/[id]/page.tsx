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
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserRole } from "@/utils/auth";

export default function DepositDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deposit, setDeposit] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchDeposit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiCall(`/api/deposit`, "GET", { deposit_id: id });
      setDeposit(response.data || response);
    } catch (err) {
      setError(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDeposit();
  }, [id]);

  const handleAction = async (action: string) => {
    setProcessing(action);
    try {
      await apiCall(`/api/manage_deposit`, "PATCH", { id, action });
      await fetchDeposit();
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setProcessing(null);
    }
  };

  const role = getUserRole()

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

      {!loading && deposit && (
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
                  {deposit.type}
                </h1>
                {/* ADDED STATUS BADGE HERE */}
                <div
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    deposit.status === "approved"
                      ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                      : deposit.status === "pending"
                        ? "bg-amber-950/30 border-amber-900/50 text-amber-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400"
                  }`}
                >
                  {deposit.status}
                </div>
              </div>
              <p className="text-sm text-[#8C8176] font-mono mt-1">
                ID: {deposit.id}
              </p>
            </div>


            {role && role === "user" && <div className="flex flex-wrap items-center gap-2 bg-[#211E1B] p-2 rounded-2xl border border-[#332D28]">
              {/* Status Management - Grouped tightly */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { action: "forwarded", tag: "Forward" },
                  { action: "approved", tag: "Approve" },
                  { action: "rejected", tag: "Reject" },
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
            </div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Amount Paid",
                value: `₦${Number(deposit.amount).toLocaleString()}`,
                icon: "₦",
              },
              {
                label: "Term Duration",
                value: `${deposit.months} Month(s)`,
                icon: "📅",
              },
              { label: "Depositor Email", value: deposit.email, icon: "📧" },
              { label: "Transaction ID", value: deposit.id!, icon: "🔗" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#241F1B] border border-[#362F29] p-4 rounded-xl"
              >
                <span className="text-[9px] uppercase tracking-widest text-[#8C8176] block mb-1">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-[#FAF8F5]">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* SECONDARY METADATA ROW */}
          <div className="flex gap-4 p-4 bg-[#1A1715] border border-[#2C2621] rounded-xl text-[10px] text-[#544B41]">
            <div>
              <span className="uppercase tracking-wider">Created:</span>{" "}
              <span className="text-[#8C8176]">
                {new Date(deposit.created_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="uppercase tracking-wider">Last Updated:</span>{" "}
              <span className="text-[#8C8176]">
                {new Date(deposit.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
          {/* Documents Section */}
          <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
            <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6">
              Attached Documentation
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: "Deposit Receipt", url: deposit.receipt }].map(
                (doc) => (
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
                ),
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
