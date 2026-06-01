"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import ProfileSettings from "@/components/profile-settings";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { apiCall, formatErr } from "@/utils/helper";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setLoading(true);

    apiCall("/api/user", "GET")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(formatErr(err));
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      {/* ─── MAIN APPARATUS WORKSPACE CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* WORKSPACE APP MAIN FRAMING AREA */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* LOAD DIAGNOSTIC TILES */}
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
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/50 text-red-400 border border-red-900/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#FAF8F5]">
                Sync Interrupted
              </h3>
              <p className="mt-1 text-xs text-[#8C8176] max-w-md mx-auto">
                {"operation not available"}
              </p>
              <Button
                // onClick={() => fetchLoans(page)}
                size="sm"
                className="mt-4 text-xs bg-[#FAF8F5] hover:bg-[#E6E1DC] text-neutral-950 font-medium rounded-xl"
              >
                Retry Connection
              </Button>
            </Card>
          )}

          {!loading && !error && (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#FAF8F5]">
                    Account Profile
                  </h1>
                  <p className="text-xs text-[#A39990] mt-0.5">
                    Edit your account record
                  </p>
                </div>
              </div>
              <ProfileSettings initialData={profile} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
