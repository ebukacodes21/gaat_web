"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiCall, formatErr } from "@/utils/helper";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";

const PasswordSchema = z
  .object({
    old_password: z.string().min(1, "Required"),
    new_password: z.string().min(8, "Must be at least 8 characters"),
    confirm_password: z.string().min(1, "Required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function UpdatePassword() {
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  const form = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
  });

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const resu = await apiCall("/api/update_password", "PATCH", {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      toast.success(resu.message);
      form.reset();
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-3 w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {[
            { l: "Current Password", n: "old_password" },
            { l: "New Password", n: "new_password" },
            { l: "Confirm New Password", n: "confirm_password" },
          ].map((f) => (
            <div key={f.n} className="space-y-1">
              <label className="text-[10px] uppercase text-[#8C8176]">
                {f.l}
              </label>
              <div className="relative">
                <Input
                  {...form.register(f.n as any)}
                  type={show ? "text" : "password"}
                  className="bg-[#1A1715] border-[#2C2621] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-[#656F78]"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#E6A15C] hover:bg-[#E6A15C] text-black font-bold"
        >
          {saving ? <Loader2 className="animate-spin" /> : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
