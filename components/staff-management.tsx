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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall, formatErr } from "@/utils/helper";
import { Edit2, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export default function StaffManagement() {
  // data
  const [staffs, setStaffs] = useState<any[]>([]);
  const [error, setError] = useState("");

  // ui states
  const [loading, setLoading] = useState(true); // page fetch
  const [saving, setSaving] = useState(false); // dialog submit
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // edit state
  const [editingStaff, setEditingStaff] = useState<any>(null);

  // form
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "staff",
  });

  const fetchStaffs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiCall("/api/staffs", "GET");
      setStaffs(res?.data?.items || []);
    } catch (err) {
      setError(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = editingStaff ? "/api/update_staff" : "/api/create_staff";

      const method = editingStaff ? "PATCH" : "POST";

      await apiCall(
        endpoint,
        method,
        editingStaff ? { id: editingStaff.id, ...formData } : formData,
      );

      toast.success(editingStaff ? "Staff updated" : "Staff invited");

      await fetchStaffs();

      // reset state cleanly
      setEditingStaff(null);
      setFormData({ full_name: "", email: "", role: "staff" });
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleStaffStatus = async () => {
    if (!editingStaff) return;

    setSaving(true);
    try {
      const action = editingStaff.account_enabled ? "disable" : "enable";

      const res = await apiCall("/api/manage_staff", "POST", {
        id: editingStaff.id,
        action: action,
      });

      toast.success(res?.message || `Staff ${action}d successfully`);

      await fetchStaffs();
      setIsDialogOpen(false);
      setEditingStaff(null);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-[#E6A15C]" />
          <span className="text-xs text-[#8C8176]">
            Synchronizing records securely...
          </span>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <Card className="border-dashed border-red-900/40 bg-red-950/10 p-8 text-center rounded-2xl">
          <ShieldCheck className="h-5 w-5 mx-auto text-red-400" />
          <h3 className="mt-4 text-sm font-semibold text-[#FAF8F5]">
            Sync Interrupted
          </h3>
          <p className="mt-1 text-xs text-[#8C8176]">{error}</p>
        </Card>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#FAF8F5]">
              Staff Management
            </h2>

            <Button
              onClick={() => {
                setEditingStaff(null);
                setFormData({ full_name: "", email: "", role: "staff" });
                setIsDialogOpen(true);
              }}
              className="bg-[#E6A15C] hover:bg-[#d4914c] text-neutral-950 font-bold rounded-xl text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Invite Employee
            </Button>
          </div>

          {/* TABLE */}
          <div className="border border-[#2C2621] bg-[#1A1715] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2C2621] hover:bg-transparent">
                  <TableHead className="text-[#8C8176]">S/N</TableHead>
                  <TableHead className="text-[#8C8176]">Full Name</TableHead>
                  <TableHead className="text-[#8C8176]">Email</TableHead>
                  <TableHead className="text-[#8C8176]">Role</TableHead>
                  <TableHead className="text-[#8C8176] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {staffs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-[#8C8176]"
                    >
                      No staff records found
                    </TableCell>
                  </TableRow>
                ) : (
                  staffs.map((s, i) => (
                    <TableRow key={s.id} className="border-[#2C2621] hover:bg-transparent">
                      <TableCell className="text-[#FAF8F5]">{i + 1}</TableCell>
                      <TableCell className="text-[#FAF8F5] capitalize">
                        {s.full_name}
                      </TableCell>
                      <TableCell className="text-[#FAF8F5]">
                        {s.email}
                      </TableCell>
                      <TableCell className="text-[#FAF8F5] capitalize">
                        {s.role}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setEditingStaff(s);
                            setFormData({
                              full_name: s.full_name ?? "",
                              email: s.email ?? "",
                              role: s.role ?? "staff",
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
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
                  {editingStaff ? "Edit Staff" : "Create New Staff"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <label className="text-[10px] text-neutral-400 uppercase">
                  Full Name
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name: e.target.value,
                    })
                  }
                  className="bg-[#241F1B] border-[#2C2621] text-white capitalize"
                />

                <label className="text-[10px] text-neutral-400 uppercase">
                  Email
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="bg-[#241F1B] border-[#2C2621] text-white"
                />

                <div className="flex justify-between">
                  <Select
                    value={formData.role}
                    onValueChange={(val) =>
                      setFormData({ ...formData, role: val })
                    }
                  >
                    <SelectTrigger className="bg-[#241F1B] border-[#2C2621] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1715] border-[#2C2621] text-white">
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    onClick={toggleStaffStatus}
                    disabled={saving || !editingStaff}
                    className={cn(
                      "font-bold",
                      editingStaff?.account_enabled
                        ? "bg-red-900/50 hover:bg-red-900 text-red-200"
                        : "bg-green-900/50 hover:bg-green-900 text-green-200",
                    )}
                  >
                    {editingStaff?.account_enabled
                      ? "Disable Staff"
                      : "Enable Staff"}
                  </Button>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-[#E6A15C] hover:bg-[#E6A15C] text-black font-bold"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
