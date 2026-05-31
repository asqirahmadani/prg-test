import { Label } from "../../components/ui/label";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[11px] font-bold tracking-[0.08em] uppercase text-slate-600">
      {children}
    </Label>
  );
}
