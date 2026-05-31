"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiCall, formatErr } from "@/utils/helper";
import { Loader2, Plus, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export default function StaffManagement() {
  const [loanTypes, setLoanTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", rate: "" });

  const fetchLoanTypes = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/loan_types", "GET");
      setLoanTypes(response.data || []);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { ...formData, rate: formData.rate };
      const endpoint = editingLoan
        ? `/api/update_loan_type`
        : `/api/create_loan_type`;
      const method = editingLoan ? "PATCH" : "POST";

      await apiCall(
        endpoint,
        method,
        editingLoan ? { id: editingLoan.id, ...payload } : payload,
      );
      toast.success(
        editingLoan
          ? "Loan type updated successfully"
          : "Loan type created successfully",
      );

      fetchLoanTypes();
    } catch (err) {
      toast.error(formatErr(err));
    }finally {
      setLoading(false)
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#FAF8F5]">
          Configured Loan Types
        </h2>
        <Button
          onClick={() => {
            setEditingLoan(null);
            setFormData({ name: "", rate: "" });
            setIsDialogOpen(true);
          }}
          className="bg-[#E6A15C] hover:bg-[#d4914c] text-neutral-950 font-bold rounded-xl text-xs"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Loan Type
        </Button>
      </div>

      <div className="border border-[#2C2621] bg-[#1A1715] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2C2621] hover:bg-transparent">
              <TableHead className="text-[#8C8176]">Name</TableHead>
              <TableHead className="text-[#8C8176] text-right">
                Interest Rate (%)
              </TableHead>
              <TableHead className="text-[#8C8176] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto text-[#E6A15C]" />
                </TableCell>
              </TableRow>
            ) : (
              loanTypes.map((loan) => (
                <TableRow key={loan.id} className="border-[#2C2621]">
                  <TableCell className="text-[#FAF8F5] font-semibold">
                    {loan.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-white">
                    {loan.rate}%
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setEditingLoan(loan);
                        setFormData({ name: loan.name, rate: loan.rate });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-[#A39990]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="lg:max-w-3xl bg-[#1A1715] border-[#2C2621]">
          <DialogHeader>
            <DialogTitle className="text-[#FAF8F5]">
              {editingLoan ? "Edit Loan Type" : "Create New Loan Type"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Loan Name
              </label>
              <Input
                placeholder="e.g. School Fees Loan"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-[#241F1B] text-white border-[#2C2621]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Interest Rate (%)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="bg-[#241F1B] text-white border-[#2C2621]"
              />
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-[#E6A15C] text-neutral-950 font-bold hover:bg-[#d4914c]"
              disabled={loading}
            >
              {loading ? "Saving...": "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
