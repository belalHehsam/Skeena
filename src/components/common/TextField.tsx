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
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {startIcon && (
                        <div className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {startIcon}
                        </div>
                    )}

                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            "h-10 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 outline-none transition",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary focus:bg-white dark:focus:bg-neutral-950 focus:ring-2 focus:ring-primary/15",
                            startIcon ? "ps-9" : "ps-3",
                            endIcon ? "pe-10" : "pe-3",
                            error &&
                            "border-destructive focus:border-destructive focus:ring-destructive/15",
                            className,
                        )}
                        {...props}
                    />

                    {endIcon && (
                        <div className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            {endIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-xs font-medium text-destructive">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

TextField.displayName = "TextField";