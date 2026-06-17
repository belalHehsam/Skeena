import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, startIcon, endIcon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-s-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-neutral-400 [&_[role=button]]:pointer-events-auto [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
              {startIcon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            className={cn(
              "h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 transition-all duration-200 outline-none",
              "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
              "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              "hover:border-neutral-300 dark:hover:border-neutral-700",
              "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:bg-white focus-visible:ring-2 dark:focus-visible:bg-neutral-950",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startIcon ? "ps-9" : "ps-3",
              endIcon ? "pe-10" : "pe-3",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className,
            )}
            {...props}
          />

          {endIcon && (
            // Smart Wrapper: Blocks clicks on SVGs, allows clicks on Buttons
            <div className="pointer-events-none absolute inset-e-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-neutral-500 [&_[role=button]]:pointer-events-auto [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-destructive text-xs font-medium">{error}</p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
