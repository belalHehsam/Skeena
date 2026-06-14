import type { ReactNode } from "react";

type SettingsSectionProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function SettingsSection({
    title,
    description,
    children,
}: SettingsSectionProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-card shadow-sm dark:border-neutral-800">
            <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800 sm:px-6">
                <h2 className="font-heading text-base font-semibold">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {children}
            </div>
        </section>
    );
}