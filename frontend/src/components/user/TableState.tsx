import {
  Loader2,
  LucideSearch,
  LucideX,
  LucideRefreshCw,
  LucideFrown,
} from "lucide-react";
import { TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";

interface TableStateProps {
  colSpan: number;
  type: "loading" | "error" | "empty";
  onAction?: () => void;
}

export const TableState = ({ colSpan, type, onAction }: TableStateProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex flex-col items-center justify-center py-20 bg-white/50">
          <div className="mb-4">
            {type === "loading" && (
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 rounded-full border-2 border-slate-100" />
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {type === "error" && (
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center ring-8 ring-red-50/50">
                <LucideFrown className="w-6 h-6 text-red-500" />
              </div>
            )}
            {type === "empty" && (
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <LucideSearch className="w-6 h-6 text-slate-300" />
              </div>
            )}
          </div>

          <div className="text-center max-w-xs px-6">
            <h3 className="text-slate-900 font-semibold text-sm lg:text-md">
              {type === "loading" && "Loading..."}
              {type === "error" && "Failed to load data"}
              {type === "empty" && "No results found"}
            </h3>
            <p className="text-slate-400 text-xs mt-1 mb-6 leading-relaxed">
              {type === "loading" &&
                "Please wait while we sync with the server."}
              {type === "error" &&
                "There was a connection problem. Check your backend or token."}
              {type === "empty" &&
                "Try adjusting your search keywords or filters."}
            </p>

            {onAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAction}
                className="h-8 gap-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                {type === "error" ? (
                  <>
                    <LucideRefreshCw className="w-3 h-3" /> Retry
                  </>
                ) : (
                  <>
                    <LucideX className="w-3 h-3" /> Clear Filters
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
