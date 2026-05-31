"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Landmark, Settings2 } from "lucide-react";
import ProfileSettings from "@/components/profile-settings";
import StaffManagement from "@/components/staff-management";
import LoanTypeManagement from "@/components/loan-type-management";
import { getUserRole } from "@/utils/auth";
import UpdatePassword from "@/components/security-management";

export default function SettingsPage() {
  const role = getUserRole();
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1816] text-[#E6E1DC] font-sans antialiased selection:bg-[#E6A15C]/20">
      <div>
        <h1 className="text-3xl font-bold text-[#FAF8F5]">Platform Settings</h1>
        <p className="text-[#8C8176]">
          Manage administrative privileges and financial configurations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#211E1B] border border-[#332D28] p-1 h-auto inline-flex">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#2C2621] data-[state=active]:text-white"
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>

              <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#2C2621] data-[state=active]:text-white"
          >
            <User className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>

          {/* Admin-only tabs */}
          {isAdmin && (
            <>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-[#2C2621] data-[state=active]:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                Staff Management
              </TabsTrigger>
              <TabsTrigger
                value="loans"
                className="data-[state=active]:bg-[#2C2621] data-[state=active]:text-white"
              >
                <Landmark className="mr-2 h-4 w-4" />
                Loan Types
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <div className="bg-[#241F1B] border border-[#362F29] rounded-2xl w-full">
          <TabsContent value="profile" className="">
            <ProfileSettings />
          </TabsContent>
           <TabsContent value="security" className="m-0">
            <UpdatePassword />
          </TabsContent>
          {isAdmin && (
            <>
              <TabsContent value="staff" className="m-0">
                <StaffManagement />
              </TabsContent>
              <TabsContent value="loans" className="m-0">
                <LoanTypeManagement />
              </TabsContent>
                <TabsContent value="security" className="m-0">
                <UpdatePassword />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}