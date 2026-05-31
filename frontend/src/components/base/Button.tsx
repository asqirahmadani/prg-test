import { LucideLoader2 } from "lucide-react";
import React from "react";

export type BtnVariant =
  | "primary"
  | "accent"
  | "outline"
  | "secondary"
  | "ghost"
  | "danger";
export type BtnSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

const btnVariant: Record<BtnVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-sm border-transparent",
  accent:
    "bg-accent hover:bg-accent text-[#2d3a00] shadow-sm border-transparent",
  outline:
    "bg-transparent text-primary border border-primary/80 hover:bg-primary hover:text-white",
  secondary:
    "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-500 border-transparent hover:bg-slate-100",
  danger:
    "bg-rose-500/90 hover:bg-rose-600 text-white shadow-sm border-transparent",
};
const btnSize: Record<BtnSize, string> = {
  xs: "h-7  px-2 text-[11px] rounded-lg",
  sm: "h-8  px-2.5   text-xs     rounded-lg",
  md: "h-10  px-3.5   text-[13px] rounded-[10px]",
  lg: "h-11 px-4.5   text-md     rounded-[10px]",
  xl: "h-13 px-6   text-lg rounded-xl",
  icon: "h-9 w-9 p-0 rounded-[10px]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const dis = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={dis}
        className={[
          "inline-flex items-center justify-center gap-1.5 font-semibold border transition-all duration-150 cursor-pointer select-none",
          btnVariant[variant],
          btnSize[size],
          dis
            ? "opacity-40 cursor-not-allowed pointer-events-none"
            : "active:scale-[.97]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <LucideLoader2 size={14} className="animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

export default CustomButton;
