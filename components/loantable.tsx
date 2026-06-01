"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loan } from "@/types";
import Link from "next/link";
import { routes } from "@/constants";
import { Badge } from "./ui/badge";

export function LoanTable({ data }: { data: Loan[] }) {
  const statusStyles: Record<string, string> = {
    approved: "border-emerald-900 text-emerald-400",
    pending: "border-amber-900 text-amber-400",
    forwarded: "border-blue-900 text-blue-400",
    rejected: "border-red-900 text-red-400",
    repaid: "border-sky-900 text-sky-400",
    defaulted: "border-gray-700 text-gray-400",
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#2C2621] bg-[#241F1B] overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#141211]/30">
            <TableRow className="border-[#2C2621] hover:bg-transparent">
              <TableHead className="text-[14px] text-white uppercase">
                S/N
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase">
                Loan Type
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Principal Amount
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Borrower Name
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-center">
                Status
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Due Date
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((loan, i) => (
              <TableRow key={loan.id} className="border-[#2C2621] text-xs hover:bg-transparent">
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell className="font-medium">{loan.loan_type}</TableCell>
                <TableCell className="text-right font-mono">
                  ₦{Number(loan.principal_amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-right capitalize font-medium">
                  {loan.borrower_name}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      statusStyles[loan.status] ||
                      "border-neutral-700 text-neutral-400"
                    }`}
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {new Date(loan.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`${routes.LOANS}/${loan.id}`}
                    className="text-[#E6A15C] hover:text-[#e6c19c] font-bold underline underline-offset-4"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
