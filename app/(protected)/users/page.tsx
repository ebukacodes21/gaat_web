"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { apiCall, formatErr } from "@/utils/helper";
import { User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/usertable";

const PAGE_SIZE = 10;

export default function DepositPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async (pageNum: number) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiCall("/api/users", "GET", {
        page: pageNum,
        page_size: PAGE_SIZE,
      });

      setUsers(response?.data?.items ?? []);
      setTotalPages(response?.data?.pagination?.total_pages ?? 1);
    } catch (error: any) {
      setErrorMessage(formatErr(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      {/* ─── MAIN APPARATUS WORKSPACE CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* WORKSPACE APP MAIN FRAMING AREA */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* PROFILE WELCOME BLOCK */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#FAF8F5]">
                Users Overview
              </h1>
              <p className="text-xs text-[#A39990] mt-0.5">
                View, manage, and monitor all registered users and their account
                activity in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(page)}
                className="h-9 gap-1.5 text-xs bg-[#211E1B] border-[#332D28] hover:bg-[#26221E] hover:text-[#FAF8F5] text-[#E6E1DC] rounded-xl"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Records
              </Button>
            </div>
          </div>

          {/* LOAD DIAGNOSTIC TILES */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[350px] w-full gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-[#E6A15C]" />
              <span className="text-xs text-[#8C8176]">
                Synchronizing records securely...
              </span>
            </div>
          )}

          {errorMessage && !loading && (
            <Card className="border-dashed border-red-900/40 bg-red-950/10 p-8 text-center rounded-2xl">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/50 text-red-400 border border-red-900/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#FAF8F5]">
                Sync Interrupted
              </h3>
              <p className="mt-1 text-xs text-[#8C8176] max-w-md mx-auto">
                {errorMessage}
              </p>
              <Button
                onClick={() => fetchUsers(page)}
                size="sm"
                className="mt-4 text-xs bg-[#FAF8F5] hover:bg-[#E6E1DC] text-neutral-950 font-medium rounded-xl"
              >
                Retry Connection
              </Button>
            </Card>
          )}

          {/* MAIN SECURE SYSTEM CONSOLE VIEWPORT */}
          {!loading && !errorMessage && (
            <>
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <Tabs defaultValue="loans" className="w-full">
                      <div className="flex items-center justify-between border-b border-[#2C2621] pb-1 mb-4">
                        <TabsList className="bg-[#1E1A17] border border-[#2E2823] p-1 rounded-xl">
                          <TabsTrigger
                            value="loans"
                            className="text-sm text-white px-4 py-1.5 rounded-lg data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FAF8F5] transition-all"
                          >
                            ALL USERS
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* DYNAMIC LOANS TAB SECTION CONTAINER */}
                      <TabsContent value="loans" className="mt-0">
                        {users.length > 0 ? (
                          <UserTable users={users} />
                        ) : (
                          <div className="p-8 text-center text-[#70665C]">
                            No Loans found.
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-[#8C8176]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 p-0 rounded-xl border-[#332D28] bg-[#1A1816]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 p-0 rounded-xl border-[#332D28] bg-[#1A1816]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
