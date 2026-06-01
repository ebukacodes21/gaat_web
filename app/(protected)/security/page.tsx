"use client";
import UpdatePassword from "@/components/security-management";

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      {/* ─── MAIN APPARATUS WORKSPACE CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* WORKSPACE APP MAIN FRAMING AREA */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          <>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#FAF8F5]">
                  Security
                </h1>
                <p className="text-xs text-[#A39990] mt-0.5">
                  Update your account password
                </p>
              </div>
            </div>
            <UpdatePassword />
          </>
        </main>
      </div>
    </div>
  );
}
