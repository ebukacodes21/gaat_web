import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Separator } from "./ui/separator";
import toast from "react-hot-toast";
import { FileUpload } from "./file-uploader";
import { fileUploader, formatCurrency, formatErr } from "@/utils/helper";

export function RepaymentModal({
  loan,
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  isLoading
}: any) {
  // 1. Force the amount to be at least the monthly payment
  const [amount, setAmount] = useState<number>(Number(loan?.monthly_payment));
  const [copy, setCopied] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<string>("");
  const [isFeeLoading, setIsFeeLoading] = useState<boolean>(false);

  // 2. Validation: Check if the user is paying at least the monthly installment
  const isAmountValid = useMemo(() => {
    return (
      amount >= Number(loan?.monthly_payment)
    );
  }, [amount, loan]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Account number copied!");
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      toast.error("failed to copy");
    }
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      setIsFeeLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "repayment_receipt");

      const result = await fileUploader("/api/upload", formData);
      setReceipt(result.url);
      toast.success(result.message);
    } catch (err) {
      toast.error(formatErr(err));
    } finally {
      setIsFeeLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-3xl bg-[#1A1715] border-[#2C2621]">
        <DialogTitle className="text-[12px] font-bold uppercase tracking-widest text-[#E6A15C]">
          Loan Settlement & Receipt Verification
        </DialogTitle>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
              Amount to Repay (Minimum: {formatCurrency(loan?.monthly_payment)})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-[44px] bg-[#241F1B] border-[#2C2621] rounded-[8px] font-mono text-white"
            />
            {!isAmountValid && (
              <p className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Minimum Amount to repay is: {formatCurrency(loan?.monthly_payment)}
              </p>
            )}
          </div>

          <Separator className="bg-[#2C2621]" />

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-white space-y-3">
            <span className="text-[14px] font-mono text-neutral-400 tracking-widest uppercase block">
              Target Settlement Corporate Vault
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block text-neutral-400 text-[14px] mb-0.5">
                  Institution Node
                </span>
                <span className="font-bold tracking-wide">ACCESS BANK</span>
              </div>
              <div>
                <span className="block text-neutral-400 text-[14px] mb-0.5">
                  Ledger Identity
                </span>
                <div className="gap-2 items-center flex">
                  <span className="font-mono font-bold tracking-wider">
                    0009044606
                  </span>
                  <button
                    onClick={() => handleCopy("0009044606")}
                    className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    title="Copy Employee Code"
                  >
                    {copy ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <span className="block text-neutral-400 text-[14px] mb-0.5">
                  Beneficiary Target
                </span>
                <span className="font-bold truncate block">
                  GAAT INVESTMENT LTD
                </span>
              </div>
            </div>
            <p className="text-[14px] text-neutral-400 leading-relaxed">
              Transfer the repayment amount (
              <strong>{formatCurrency(amount)}</strong>) to the corporate vault
              details above. Ensure the transaction narration includes your
              reference code.
            </p>
          </div>

          {/* Receipt Upload */}
          <FileUpload
            title={`Upload Payment Receipt for ${formatCurrency(amount)}`}
            onChange={handleFileUpload}
            isLoading={isFeeLoading}
            text_color="text-white"
          />

          {/* Submission */}
          <Button
            className="w-full h-11 bg-[#D61F28] hover:bg-[#b81a22] text-white font-semibold rounded-[8px]"
            onClick={() => onConfirm({ amount, receipt })}
            disabled={isProcessing || !receipt || isLoading}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Confirm Settlement"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
