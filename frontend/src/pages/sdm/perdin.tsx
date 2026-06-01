import { useState } from "react";
import {
  formatDate,
  formatNumber,
  getVisiblePages,
  type TravelQuery,
  type TravelStatus,
} from "../../utils/user";
import { useAuth } from "../../hooks/auth";
import useSWR from "swr";
import type { UserTravel } from "../../api/user";
import { authFetcher } from "../../utils/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { TableState } from "../../components/user/TableState";
import {
  LucideBadgeX,
  LucideCheckCircle,
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
  LucideSearch,
  LucideXCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { PerdinActionDialog } from "../../components/dialog/PerdinActionDialog";
import useSWRMutation from "swr/mutation";
import { mToast } from "../../components/base/mToast";

function StatusPill({ status }: { status: TravelStatus }) {
  const styles = {
    pending: "bg-yellow-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    declined: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function SdmPerdinList() {
  const [selectedStatus, setSelectedStatus] = useState<TravelQuery>("pending");
  const [page, setPage] = useState(1);

  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: "approve" | "decline";
  }>({ open: false, type: "approve" });

  const { user } = useAuth();

  const buildParams = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    if (selectedStatus) params.append("status", String(selectedStatus));

    return params.toString();
  };

  const {
    data: rawData,
    isLoading,
    error,
    mutate,
  } = useSWR<UserTravel>(
    [
      `${import.meta.env.VITE_BACKEND_URL}/sdm/travels?${buildParams()}`,
      user.token,
    ],
    authFetcher,
  );

  const paged = rawData?.data?.travels;
  const totalItems = rawData?.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, rawData?.data?.meta?.last_page ?? 1);

  async function updateTravelRequest(
    url: string,
    { arg }: { arg: { travelID: number; action: string } },
  ) {
    const { travelID, action } = arg;

    const response = await fetch(`${url}/${travelID}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to update the withdraw status");
    return response.json;
  }

  const { trigger: triggerAction, isMutating: isUpdating } = useSWRMutation(
    `${import.meta.env.VITE_BACKEND_URL}/sdm/travels`,
    updateTravelRequest,
  );

  const handleAction = async () => {
    if (!selectedRow) return;

    try {
      await triggerAction({
        travelID: selectedRow.id,
        action: dialogState.type === "approve" ? "approve" : "decline",
      });

      setDialogState((prev) => ({ ...prev, open: false }));

      mutate();
    } catch (error) {
      mToast.error(error.message);
    }
  };

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          //   variant="ghost"
          className={
            selectedStatus === "pending"
              ? "bg-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-pointer"
          }
          onClick={() => setSelectedStatus("pending")}
        >
          Pengajuan Baru
        </Button>
        <Button
          //   variant="ghost"
          className={
            selectedStatus === "history"
              ? "bg-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-pointer"
          }
          onClick={() => setSelectedStatus("history")}
        >
          History Pengajuan
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                ID
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Nama
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Kota
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Tanggal
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Keterangan
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Status
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-50">
            {isLoading ? (
              <TableState type="loading" colSpan={6} />
            ) : error ? (
              <TableState type="error" colSpan={6} onAction={mutate} />
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <LucideSearch className="w-8 h-8 mb-3 opacity-40" />
                    <p className="text-sm font-medium">
                      Tidak ada perdin yang ditemukan
                    </p>
                    <p className="text-xs mt-1">
                      Ajukan perdin atau hubungi admin jika ada masalah
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.id}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.user_name}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.origin_city} → {item.destination_city}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {formatDate(item.departure_date)} -
                      {formatDate(item.return_date)} ({item.trip_duration} hari)
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.description}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <StatusPill status={item.status} />
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    {item.status === "approved" ? (
                      <div className="flex items-center gap-2 h-5 px-3 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors">
                        <LucideCheckCircle className="w-4 h-4" /> Approved
                      </div>
                    ) : item.status === "declined" ? (
                      <div className="flex items-center gap-2 h-5 px-3 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors">
                        <LucideXCircle className="w-4 h-4" /> Declined
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(item);
                            setDialogState({ open: true, type: "approve" });
                          }}
                        >
                          <LucideCheckCircle /> Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(item);
                            setDialogState({ open: true, type: "decline" });
                          }}
                        >
                          <LucideBadgeX /> Decline
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PerdinActionDialog
          open={dialogState.open}
          setOpen={(val: boolean) =>
            setDialogState({ ...dialogState, open: val })
          }
          variant={dialogState.type}
          data={selectedRow}
          isLoading={isUpdating}
          onConfirm={handleAction}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Shows{" "}
          <span className="font-medium text-slate-600">
            {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, totalItems)}
          </span>{" "}
          from{" "}
          <span className="font-medium text-slate-600">
            {formatNumber(totalItems)}
          </span>{" "}
          perdin
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <LucideChevronFirst className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-7 h-7 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <LucideChevronLeft className="w-3.5 h-3.5" />
          </Button>

          {visiblePages.map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                p === page
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="w-7 h-7 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <LucideChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            <LucideChevronLast className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
