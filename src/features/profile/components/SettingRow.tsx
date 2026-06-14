import type { ReactNode } from "react";

type SettingRowProps = {
    label: string;
    description: string;
    control: ReactNode;
};

export function SettingRow({
    label,
    description,
    control,
}: SettingRowProps) {
    return (
        <div className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {label}
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            </div>

            <div className="shrink-0">
                {control}
            </div>
        </div>
    );
}