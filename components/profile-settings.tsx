"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiCall, formatErr } from "@/utils/helper";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ProfileSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  lga: z.string().min(1, "Required"),
  zip_code: z.string().optional(),
  state: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  marital_status: z.string().min(1, "Required"),
  phone1: z.string().min(10, "Required"),
  phone2: z.string().optional(),
  occupation: z.string().min(1, "Required"),
});

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statesData, setStatesData] = useState<any[]>([]);
  const [stateOpen, setStateOpen] = useState(false);
  const [lgaOpen, setLgaOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address: "",
      lga: "",
      zip_code: "",
      state: "",
      gender: "",
      marital_status: "",
      phone1: "",
      phone2: "",
      occupation: "",
    },
  });

  const selectedState = form.watch("state");
  const availableLgas = useMemo(
    () => statesData.find((s) => s.state === selectedState)?.lgas || [],
    [selectedState, statesData],
  );

  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then((data) =>
        setStatesData(
          data.sort((a: any, b: any) => a.state.localeCompare(b.state)),
        ),
      );

    apiCall("/api/user", "GET")
      .then((res) => form.reset(res.data))
      .catch((err) => toast.error(formatErr(err)))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await apiCall("/api/update_user", "PATCH", data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <RefreshCw className="animate-spin mx-auto text-[#E6A15C]" />
      </div>
    );

  return (
  <div className="py-6 px-3">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Names */}
      <div className="flex flex-col md:flex-row">
        {[
          { l: "First Name", n: "first_name" },
          { l: "Last Name", n: "last_name" },
        ].map((f) => (
          <div key={f.n} className="space-y-1">
            <label className="text-[10px] uppercase text-[#8C8176]">
              {f.l}
            </label>
            <Input
              {...form.register(f.n as any)}
              className="bg-[#1A1715] border-[#2C2621]"
            />
          </div>
        ))}
      </div>

      {/* Address & Zip */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase text-[#8C8176]">Address</label>
        <Input
          {...form.register("address")}
          className="bg-[#1A1715] border-[#2C2621]"
        />
      </div>
      <div className="flex flex-col md:flex-row">
        {[
          { l: "State", n: "state", isGeo: true },
          { l: "LGA", n: "lga", isGeo: true },
          { l: "Zip Code", n: "zip_code" },
        ].map((f) => (
          <div key={f.n} className="space-y-1">
            <label className="text-[10px] uppercase text-[#8C8176]">
              {f.l}
            </label>
            {f.isGeo ? (
              <Popover
                open={f.n === "state" ? stateOpen : lgaOpen}
                onOpenChange={f.n === "state" ? setStateOpen : setLgaOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-[#1A1715] border-[#2C2621]"
                  >
                    {form.watch(f.n as any) || `Select ${f.l}`}{" "}
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={`Search ${f.l}...`} />
                    <CommandList>
                      {(f.n === "state" ? statesData : availableLgas).map(
                        (item: any) => (
                          <CommandItem
                            key={f.n === "state" ? item.state : item}
                            onSelect={() => {
                              form.setValue(
                                f.n as any,
                                f.n === "state" ? item.state : item,
                              );
                              f.n === "state" && form.setValue("lga", "");
                              f.n === "state"
                                ? setStateOpen(false)
                                : setLgaOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch(f.n as any) ===
                                  (f.n === "state" ? item.state : item)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {f.n === "state" ? item.state : item}
                          </CommandItem>
                        ),
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <Input
                {...form.register(f.n as any)}
                className="bg-[#1A1715] border-[#2C2621]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Phones & Selects */}
      <div className="flex flex-col md:flex-row">
        {[
          { l: "Phone 1", n: "phone1" },
          { l: "Phone 2", n: "phone2" },
        ].map((f) => (
          <div key={f.n} className="space-y-1">
            <label className="text-[10px] uppercase text-[#8C8176]">
              {f.l}
            </label>
            <Input
              {...form.register(f.n as any)}
              className="bg-[#1A1715] border-[#2C2621]"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row">
        {[
          { l: "Gender", n: "gender", opts: ["Male", "Female"] },
          {
            l: "Marital Status",
            n: "marital_status",
            opts: ["Single", "Married", "Divorced"],
          },
          {
            l: "Occupation",
            n: "occupation",
            opts: ["Employed", "Self-Employed", "Unemployed"],
          },
        ].map((f) => (
          <Controller
            key={f.n}
            name={f.n as any}
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1 w-full">
                <label className="text-[10px] uppercase text-[#8C8176]">
                  {f.l}
                </label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-[#1A1715] border-[#2C2621]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {f.opts.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        ))}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#E6A15C] hover:bg-[#E6A15C] text-black font-bold"
      >
        {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
      </Button>
    </form>
  </div>
  );
}
