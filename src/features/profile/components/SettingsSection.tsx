import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SettingsSectionProps = {
    id?: string;
    icon: LucideIcon;
    title: string;
    description: string;
    children: ReactNode;
};

export function SettingsSection({
    id,
    icon: Icon,
    title,
    description,
    children,
}: SettingsSectionProps) {
    return (
        <section
            id={id}
            className="bg-card scroll-mt-24 overflow-hidden rounded-2xl border border-emerald-100 shadow-sm dark:border-emerald-900"
        >
            <div className="flex items-start gap-3 border-b border-neutral-200 px-5 py-5 sm:px-6 dark:border-neutral-800">
                <div className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-xl">
                    <Icon className="size-4.5" aria-hidden="true" />
                </div>

                <div className="min-w-0 pt-0.5">
                    <h2 className="font-heading text-base font-semibold text-neutral-950 dark:text-neutral-50">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                        {description}
                    </p>
                </div>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {children}
            </div>
        </section>
    );
}
