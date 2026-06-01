"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { routes } from "@/constants";
import { Deposit } from "@/types";

export function StaffTable({ data }: { data: any[] }) {

  return (
    <div className="space-y-4">
      <div className="border border-[#2C2621] bg-[#241F1B] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#141211]/30">
            <TableRow className="border-[#2C2621] hover:bg-transparent">
              <TableHead className="text-[14px] text-white uppercase">S/N</TableHead>
              <TableHead className="text-[14px] text-white uppercase">Type</TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">Amount</TableHead>
              <TableHead className="text-[14px] text-white uppercase text-center">Status</TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">Date</TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id} className="border-[#2C2621] text-xs text-[#FAF8F5]">
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-semibold">{item.type}</TableCell>
                <TableCell className="text-right font-mono font-bold">
                   ₦{Number(item.amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      item.status === 'approved' ? 'border-emerald-900 text-emerald-400' : 
                      item.status === 'pending' ? 'border-amber-900 text-amber-400' : 'border-neutral-700'
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link 
                    href={`${routes.DEPOSITS}/${item.id}`} 
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