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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type LoanType = {
  id: string;
  name: string;
  rate: number;
  is_active: boolean;
};

export default function LoanTypeManagement() {
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanType | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    is_active: true,
  });

  const fetchLoanTypes = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/admin_loan_types", "GET");
      setLoanTypes(response.data || []);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        rate: formData.rate,
        is_active: formData.is_active,
      };

      console.log(payload, editingLoan)

      const endpoint = editingLoan
        ? "/api/update_loan_type"
        : "/api/create_loan_type";

      const method = editingLoan ? "PATCH" : "POST";

      await apiCall(
        endpoint,
        method,
        editingLoan
          ? { id: editingLoan.id, ...payload }
          : payload
      );

      toast.success(
        editingLoan
          ? "Loan type updated successfully"
          : "Loan type created successfully"
      );

      setIsDialogOpen(false);
      setEditingLoan(null);
      setFormData({ name: "", rate: "", is_active: true });

      fetchLoanTypes();
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-md md:text-lg font-bold text-[#FAF8F5]">
          Configured Loan Types
        </h2>

        <Button
          onClick={() => {
            setEditingLoan(null);
            setFormData({ name: "", rate: "", is_active: true });
            setIsDialogOpen(true);
          }}
          className="bg-[#E6A15C] hover:bg-[#d4914c] text-neutral-950 font-bold rounded-xl text-xs"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Loan Type
        </Button>
      </div>

      {/* TABLE */}
      <div className="border border-[#2C2621] bg-[#1A1715] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2C2621] hover:bg-transparent">
              <TableHead className="text-[#8C8176]">Name</TableHead>
              <TableHead className="text-[#8C8176] text-right">
                Interest Rate (%)
              </TableHead>
              <TableHead className="text-[#8C8176] text-right">
                Status
              </TableHead>
              <TableHead className="text-[#8C8176] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto text-[#E6A15C]" />
                </TableCell>
              </TableRow>
            ) : (
              loanTypes.map((loan) => (
                <TableRow
                  key={loan.id}
                  className="border-[#2C2621] hover:bg-transparent"
                >
                  <TableCell className="text-[#FAF8F5] font-semibold">
                    {loan.name}
                  </TableCell>

                  <TableCell className="text-right font-mono text-white">
                    {loan.rate}%
                  </TableCell>

                  <TableCell className="text-right">
                    <span
                      className={
                        loan.is_active
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {loan.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setEditingLoan(loan);
                        setFormData({
                          name: loan.name,
                          rate: String(loan.rate),
                          is_active: loan.is_active,
                        });
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

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="lg:max-w-3xl bg-[#1A1715] border-[#2C2621]">
          <DialogHeader>
            <DialogTitle className="text-[#FAF8F5]">
              {editingLoan ? "Edit Loan Type" : "Create New Loan Type"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Loan Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-[#241F1B] text-white border-[#2C2621]"
              />
            </div>

            {/* RATE */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Interest Rate (%)
              </label>
              <Input
                type="number"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="bg-[#241F1B] text-white border-[#2C2621]"
              />
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Status
              </label>

              <Select
                value={formData.is_active ? "active" : "inactive"}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    is_active: val === "active",
                  })
                }
              >
                <SelectTrigger className="bg-[#241F1B] border-[#2C2621] text-white">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-[#1A1715] border-[#2C2621] text-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SAVE */}
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-[#E6A15C] text-neutral-950 font-bold hover:bg-[#d4914c]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}