import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type SettingRowProps = {
    label: string;
    description: string;
    control: ReactNode;
    controlId?: string;
    isPending?: boolean;
    onActivate?: () => void;
};

export function SettingRow({
    label,
    description,
    control,
    controlId,
    isPending = false,
    onActivate,
}: SettingRowProps) {
    const content = (
        <>
            <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {label}
            </span>

            <span className="mt-1 block max-w-2xl text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                {description}
            </span>
        </>
    );

    return (
        <div className="hover:bg-primary/5 dark:hover:bg-primary/8 flex flex-col items-stretch gap-4 px-5 py-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6">
            {onActivate ? (
                <button
                    type="button"
                    aria-controls={controlId}
                    onClick={onActivate}
                    disabled={isPending}
                    className="focus-visible:ring-primary/30 min-w-0 flex-1 cursor-pointer text-start outline-none focus-visible:rounded-lg focus-visible:ring-2 disabled:cursor-not-allowed"
                >
                    {content}
                </button>
            ) : (
                <div className="min-w-0 flex-1">{content}</div>
            )}

            <div className="flex shrink-0 items-center justify-end gap-2 self-end sm:self-auto">
                <span
                    className="grid size-4 place-items-center"
                    aria-hidden="true"
                >
                    {isPending && (
                        <LoaderCircle className="text-primary size-4 animate-spin" />
                    )}
                </span>
                {control}
            </div>
        </div>
    );
}
