import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, LucideAlertTriangle, LucideUserX2 } from "lucide-react";

export function DeleteCityDialog({
  open,
  setOpen,
  data,
  onConfirm,
  isLoading,
}) {
  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : setOpen}>
      <DialogContent className="sm:max-w-105 border-none p-8 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-50 rounded-full blur-3xl -z-10 opacity-60" />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-red-50 rounded-3xl rotate-12 absolute inset-0 opacity-50" />
            <div className="relative w-16 h-16 bg-white border border-red-100 rounded-3xl flex items-center justify-center shadow-sm">
              <LucideUserX2 className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Hapus kota ini?
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm leading-relaxed">
              Data{" "}
              <span className="font-semibold text-slate-900">
                "{data?.name || "kota"}"
              </span>{" "}
              mungkin saja terhubung dengan beberapa perjalan dinas. Jika kamu
              menghapus ini, Semua data perjalanan dinas yang berhubungan dengan
              kota ini akan ikut terhapus secara permanen.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-3 items-center">
            <LucideAlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-left text-slate-600 leading-snug">
              Aksi ini sudah final dan tidak bisa di ulang. <br /> Pikirkan
              secara bijak.
            </p>
          </div>
        </div>
        <DialogFooter className="mt-4 md:gap-2 gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1  font-medium"
          >
            Batal Hapus
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Konfirmasi Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
