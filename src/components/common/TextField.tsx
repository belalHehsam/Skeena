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
                        className="text-xs font-semibold text-neutral-800"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {startIcon}
                        </div>
                    )}

                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            "h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 outline-none transition",
                            "placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15",
                            startIcon ? "pl-9" : "pl-3",
                            endIcon ? "pr-10" : "pr-3",
                            error &&
                            "border-destructive focus:border-destructive focus:ring-destructive/15",
                            className,
                        )}
                        {...props}
                    />

                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
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