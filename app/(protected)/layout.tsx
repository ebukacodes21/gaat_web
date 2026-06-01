"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routes } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  UsersIcon,
  User,
} from "lucide-react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { PiBuildingOfficeBold, PiHandDeposit } from "react-icons/pi";
import toast from "react-hot-toast";
import { apiCall, formatErr } from "@/utils/helper";
import { clearAuth, getUserRole } from "@/utils/auth";
import { MdSecurity } from "react-icons/md";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      path: routes.DASHBOARD,
      roles: ["admin", "supervisor", "staff", "user"],
    },
    {
      id: "loans",
      label: "Loans",
      icon: BiMoneyWithdraw,
      path: routes.LOANS,
      roles: ["admin", "supervisor", "staff"],
    },
    {
      id: "deposits",
      label: "Deposits",
      icon: PiHandDeposit,
      path: routes.DEPOSITS,
      roles: ["admin", "supervisor", "staff"],
    },
    {
      id: "security",
      label: "Security",
      icon: MdSecurity,
      path: routes.SECURITY,
      roles: ["admin", "supervisor", "staff", "user"],
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: routes.PROFILE,
      roles: ["admin", "supervisor", "staff", "user"],
    },
    {
      id: "management",
      label: "Management",
      icon: PiBuildingOfficeBold,
      path: routes.MANAGEMENT,
      roles: ["admin", "supervisor"],
    },
    {
      id: "users",
      label: "Users",
      icon: UsersIcon,
      path: routes.USERS,
      roles: ["admin"],
    },
  ];

  const handleLogout = async () => {
    try {
      await apiCall("/api/logout", "GET");
      clearAuth();
      router.push(routes.LOGIN);
      toast.success("all session data cleared");
    } catch (error) {
      toast.error(formatErr(error));
    }
  };

  const allowedNavigation = navigationItems.filter((item) =>
    item.roles.includes(role!),
  );

  if (!mounted || !role) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#1A1816] text-[#E6E1DC]">
      {/* 1. Mobile Header (Now in Layout) */}
      <div className="md:hidden flex h-16 w-full items-center justify-between border-b border-[#2C2621] bg-[#141211] px-6 fixed top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#E63946] to-[#B31924] flex items-center justify-center font-black text-sm text-white shadow-md shadow-[#D61F28]/10">
            G
          </div>
          <span className="font-bold text-sm tracking-tight text-[#FAF8F5]">
            GAAT Asset Portal
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-[#1E1A17] rounded-xl"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Sidebar - Persists across all pages */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 flex flex-col justify-between p-3.5 bg-[#141211] border-r border-[#2C2621]
        w-64 md:w-16 md:hover:w-64 md:sticky md:h-screen transition-all duration-300 ease-out shrink-0 group
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="space-y-8">
          {/* Main Workspace Branding Label */}
          <div className="flex items-center justify-between md:justify-start gap-3.5 px-1.5 h-10">
            <div className="flex items-center gap-3.5">
              <div className="h-8 w-8 min-w-[32px] rounded-lg bg-gradient-to-br from-[#E63946] to-[#B31924] flex items-center justify-center font-black text-sm text-white shadow-md shadow-[#D61F28]/10">
                G
              </div>
              <span className="font-bold text-sm tracking-tight text-[#FAF8F5] whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100">
                GAAT Asset Portal
              </span>
            </div>
            <button
              className="md:hidden p-1 text-[#8C8176]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {allowedNavigation.map((item) => {
              const Icon = item.icon;

              // Check if the current URL matches the item's path
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-xs font-medium transition-all relative ${
                    isActive
                      ? "bg-[#26211C] text-[#FAF8F5] border border-[#3D352E] shadow-sm"
                      : "text-[#A39990] hover:bg-[#1E1A17] hover:text-[#FAF8F5]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-[#E6A15C]" : ""}`}
                  />
                  <span className="whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    {item.label}
                  </span>

                  {isActive && (
                    <div className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-[#E6A15C] md:group-hover:block hidden" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Workspace Signout Anchors */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#1A1715] border border-[#2A2420] overflow-hidden">
            <div className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#8C8176] font-mono tracking-wider whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              ENCRYPTED_SESSION
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-[#A39990] hover:text-[#E63946] hover:bg-red-950/10 gap-3.5 text-xs h-10 px-2.5 rounded-xl"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              Sign Out Securely
            </span>
          </Button>
        </div>
      </aside>
      {/* 3. Main Content Wrapper */}
      <div className="flex-1 pt-16 md:pt-0">
        {" "}
        {/* Added padding top for mobile header */}
        {children}
      </div>
    </div>
  );
}
