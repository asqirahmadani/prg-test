import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { LucideAlertTriangle, LucideCheckCircle2, Loader2 } from "lucide-react";
import { formatRpLong } from "../../utils/user";

interface WithdrawActionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onConfirm: (reason?: string) => void;
  variant: "approve" | "decline";
  isLoading: boolean;
}

export function PerdinActionDialog({
  open,
  setOpen,
  data,
  onConfirm,
  variant,
  isLoading,
}: WithdrawActionDialogProps) {
  const [reason, setReason] = useState("");
  const isReject = variant === "decline";

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const ui = {
    approve: {
      title: "Setujui Perjalanan Dinas",
      description: (
        <span className="text-sm text-slate-600 leading-relaxed">
          Kamu akan menyetujui perjalanan dinas yang diajukan{" "}
          <span className="font-semibold text-slate-800">
            {data?.origin_city} → {data?.destination_city}
          </span>{" "}
          oleh{" "}
          <span className="font-semibold text-slate-800">
            {data?.user_name}
          </span>
          . Dengan total uang saku{" "}
          <span className="font-semibold text-blue-600">
            {formatRpLong(data?.allowance)}
          </span>{" "}
          akan dicairkan. Tindakan ini tidak dapat dibatalkan.
        </span>
      ),
      icon: <LucideCheckCircle2 className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      btnClass: "bg-blue-600 hover:bg-blue-700",
      btnText: "Ya, Setujui",
    },
    decline: {
      title: "Tolak Perjalanan Dinas",
      description: (
        <span className="text-sm text-slate-600 leading-relaxed">
          Aapakah kamu yakin akan menolak perjalanan dinas yang diajukan{" "}
          <span className="font-semibold text-slate-800">
            {data?.origin_city} → {data?.destination_city}
          </span>{" "}
          by{" "}
          <span className="font-semibold text-slate-800">
            {data?.user_name}
          </span>
          ? Dengan total uang saku{" "}
          <span className="font-semibold text-rose-600">
            {formatRpLong(data?.allowance)}
          </span>{" "}
          tidak akan dicairkan.
        </span>
      ),
      icon: <LucideAlertTriangle className="w-6 h-6 text-rose-600" />,
      iconBg: "bg-rose-100",
      btnClass: "bg-rose-600 hover:bg-rose-700",
      btnText: "Konfirmasi Tolak",
    },
  }[variant];

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-center p-2 text-center">
          <div
            className={`w-12 h-12 rounded-full ${ui.iconBg} flex items-center justify-center mb-4`}
          >
            {ui.icon}
          </div>
          <DialogTitle className="text-xl">{ui.title}</DialogTitle>
          <DialogDescription className="pt-2">
            {ui.description}
          </DialogDescription>
        </DialogHeader>

        {isReject && (
          <div className="py-4">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Rejection Reason
            </label>
            <Textarea
              placeholder="e.g. No money..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-25 border-slate-200"
              disabled={isLoading}
            />
          </div>
        )}

        <DialogFooter className="mt-4 md:gap-2 gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => (isReject ? onConfirm(reason) : onConfirm())}
            disabled={isLoading || (isReject && !reason.trim())}
            className={`flex-1 text-white ${ui.btnClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              ui.btnText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
