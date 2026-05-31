import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { capitalize } from "../../utils/util";

export const mToast = {
  success: (msg: string, description?: string) =>
    toast.success(capitalize(msg), {
      description: description,
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    }),

  error: (msg: string, description?: string) =>
    toast.error(capitalize(msg), {
      description: description,
      icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
    }),

  info: (msg: string, description?: string) =>
    toast.info(capitalize(msg), {
      description: description,
      icon: <Info className="h-5 w-5 text-secondary" />,
    }),

  warning: (msg: string, description?: string) =>
    toast.warning(capitalize(msg), {
      description: description,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    }),

  loading: (msg: string) => toast.loading(capitalize(msg)),

  dismiss: () => toast.dismiss(),
};
