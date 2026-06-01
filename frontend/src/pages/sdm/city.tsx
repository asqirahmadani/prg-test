import { useState } from "react";
import { useAuth } from "../../hooks/auth";
import useSWR from "swr";
import { authFetcher } from "../../utils/fetcher";
import type { SdmCity } from "../../api/city";
import { formatNumber, getVisiblePages } from "../../utils/user";
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
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
  LucideSearch,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import CityDialog from "../../components/dialog/CityDialog";
import type { CityRequest } from "../../types/city";
import { useCity } from "../../hooks/useCity";
import { mToast } from "../../components/base/mToast";

const PAGE_SIZE = 10;

export default function CityList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const { create } = useCity();

  const buildParams = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    return params.toString();
  };

  const {
    data: rawData,
    isLoading,
    error,
    mutate,
  } = useSWR<SdmCity>(
    [
      `${import.meta.env.VITE_BACKEND_URL}/sdm/cities?${buildParams()}`,
      user.token,
    ],
    authFetcher,
  );

  const paged = rawData?.data?.cities;
  const totalItems = rawData?.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, rawData?.data?.meta?.last_page ?? 1);

  const visiblePages = getVisiblePages(page, totalPages);

  const handleSubmit = async (a: CityRequest) => {
    try {
      await create(a);
      setDialogOpen(false);
      mToast.success("Kota berhasil ditambahkan");
    } catch (err) {
      mToast.error(
        err instanceof Error ? err.message : "Gagal mengajukan perdin",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex"></div>

        <button
          onClick={() => setDialogOpen(true)}
          className="w-50 group flex flex-col items-center justify-center gap-4 py- rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-primary/2 hover:border-primary/30 transition-all duration-300"
        >
          Tambah Kota
        </button>
      </div>

      <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                ID
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Nama Kota
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Provinsi
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Pulau
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Luar Negeri
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Latitude
              </TableHead>
              <TableHead className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-70">
                Longitude
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
                      Tidak ada kota yang ditemukan
                    </p>
                    <p className="text-xs mt-1">
                      Tambahkan data kota atau hubungi admin jika ada masalah
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
                      {item.name}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.province}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.island}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.is_abroad ? "Iya" : "Tidak"}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.latitude}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <span className="text-sm text-slate-600 truncate max-w-50">
                      {item.longitude}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
          kota
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

      <CityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
