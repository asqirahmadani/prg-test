import { Input } from "../ui/input";
import { FieldLabel } from "./FieldLabel";

export const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = "text",
  step,
  min,
  max,
  Icon,
  hint,
  rightEl,
  disabled,
  error,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  Icon?: React.ElementType;
  hint?: string;
  rightEl?: React.ReactNode;
  disabled?: boolean;
  error?: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10"
          />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          className={[
            `h-11 w-full rounded-lg border text-sm shadow-xs placeholder:text-slate-400 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2`,
            Icon ? "pl-9" : "",
            rightEl ? "pr-10" : "",
            error
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
              : "border-slate-200 focus-visible:border-primary focus-visible:ring-primary/30",
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              : "bg-white",
          ].join(" ")}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            {rightEl}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-[11px] text-destructive leading-relaxed">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default CustomInput;
