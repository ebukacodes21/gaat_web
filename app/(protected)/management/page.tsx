"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanTypeManagement from "@/components/loan-type-management";
import StaffManagement from "@/components/staff-management";

export default function DepositPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      {/* ─── MAIN APPARATUS WORKSPACE CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* WORKSPACE APP MAIN FRAMING AREA */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
            <>
              {/* PROFILE WELCOME BLOCK */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#FAF8F5]">
                    Office Management
                  </h1>
                  <p className="text-xs text-[#A39990] mt-0.5">
                    Create and manage office and human resources
                  </p>
                </div>
              </div>
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <Tabs defaultValue="staffs" className="w-full">
                      <div className="flex items-center justify-between border-b border-[#2C2621] pb-1 mb-4">
                        <TabsList className="bg-[#1E1A17] border border-[#2E2823] p-1 rounded-xl">
                          <TabsTrigger
                            value="staffs"
                            className="text-sm text-white px-4 py-1.5 rounded-lg data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FAF8F5] transition-all"
                          >
                            STAFFS
                          </TabsTrigger>
                          <TabsTrigger
                            value="types"
                            className="text-sm text-white px-4 py-1.5 rounded-lg data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FAF8F5] transition-all"
                          >
                            LOAN TYPES
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="staffs" className="mt-0">
                        <StaffManagement />
                      </TabsContent>

                      <TabsContent value="types" className="mt-0">
                        <LoanTypeManagement />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </>
        </main>
      </div>
    </div>
  );
}
