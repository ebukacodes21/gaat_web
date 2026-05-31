"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall, formatErr } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  UserCircle,
  MapPin,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserRole, UserRole } from "@/utils/auth";
import { User } from "@/types";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const result = await apiCall(`/api/query_user`, "GET", { user_id: id });
      toast.success(result.message);
      setUser(result.data);
    } catch (error) {
      setError(formatErr(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleAction = async (action: string) => {
    setProcessing(action);
    try {
      await apiCall(`/api/manage_user`, "PATCH", { id, action });
      await fetchUser();
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setProcessing(null);
    }
  };

  const role = getUserRole();

  const allowedRoles: UserRole[] = ["admin", "supervisor"]

  return (
    <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
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

      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-xs text-[#A39990] pl-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
              </Button>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={user?.img_url}
                  className="h-16 w-16 rounded-full border border-[#2C2621]"
                  alt="Avatar"
                />
                <div>
                  <h1 className="text-2xl font-bold text-[#FAF8F5] capitalize">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8C8176]">
                      {user?.email}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${user?.account_enabled ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400" : "bg-red-950/30 border-red-900/50 text-red-400"}`}
                    >
                      {user?.account_enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {allowedRoles.includes(role!) && (
              <div className="flex flex-wrap items-center gap-2 bg-[#211E1B] p-2 rounded-2xl border border-[#332D28]">
                {/* Status Management - Grouped tightly */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { action: "disable", tag: "Disable" },
                    { action: "enable", tag: "Enable" },
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
              </div>
            )}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. IDENTITY */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6 flex items-center gap-2">
                <UserCircle className="h-4 w-4" /> Identity Details
              </CardTitle>
              <div className="space-y-4">
                {[
                  { label: "Role", val: user?.role },
                  { label: "Gender", val: user?.gender },
                  { label: "Marital Status", val: user?.marital_status },
                  { label: "Occupation", val: user?.occupation },
                  { label: "Phone 1", val: user?.phone1 },
                  { label: "Phone 2", val: user?.phone2 || "N/A" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-[#FAF8F5]">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. GEOGRAPHIC */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address Data
              </CardTitle>
              <div className="space-y-4">
                {[
                  { label: "Address", val: user?.address },
                  { label: "LGA", val: user?.lga },
                  { label: "State", val: user?.state },
                  { label: "Zip Code", val: user?.zip_code },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-[#FAF8F5] mt-1">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. SYSTEM AUDIT */}
            <Card className="bg-[#241F1B] border-[#362F29] rounded-2xl p-6">
              <CardTitle className="text-xs font-semibold text-[#8C8176] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4" /> System Audit
              </CardTitle>
              <div className="space-y-4">
                {[
                  {
                    label: "Email Verified",
                    val: user?.email_verified ? "Yes" : "No",
                  },
                  {
                    label: "Created At",
                    val: new Date(user?.created_at!).toLocaleDateString(),
                  },
                  {
                    label: "Last Updated",
                    val: new Date(user?.updated_at!).toLocaleDateString(),
                  },
                  {
                    label: "Last Login",
                    val: new Date(user?.last_login!).toLocaleString(),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-[#2C2621] pb-2"
                  >
                    <span className="text-[10px] text-[#8C8176] uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-[#E6A15C]">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
