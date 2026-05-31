import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FieldLabel } from "./FieldLabel";
import { type ComponentPropsWithoutRef } from "react";

interface CustomSelectProps extends Omit<
  ComponentPropsWithoutRef<typeof SelectTrigger>,
  "onChange"
> {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: number | string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  ...props
}: CustomSelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel>{label}</FieldLabel>}

      <Select
        value={value === 0 || value === "" ? undefined : value.toString()}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`h-11! w-full rounded-lg border bg-white text-sm placeholder:text-slate-400 font-medium border-slate-200 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:border-primary/50 data-[state=open]:border-primary/50 ${className ?? ""}`}
          {...props}
        >
          <SelectValue placeholder={placeholder ?? "Pilih..."} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={4}
          className="rounded-lg border border-slate-100 bg-white shadow-xl shadow-slate-200/40 p-1 w-[--radix-select-trigger-width] overflow-hidden"
        >
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value.toString()}
              className="rounded-md text-sm cursor-pointer focus:bg-accent/10 data-[state=checked]:text-accent data-[state=checked]:font-semibold transition-colors py-2.5 px-3"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
