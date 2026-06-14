import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PrivateProfileState() {
    const { t } = useTranslation("profile");

    return (
        <section className="rounded-2xl border border-neutral-200 bg-card px-6 py-14 text-center shadow-sm dark:border-neutral-800">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Lock className="size-6" />
            </div>

            <h2 className="mt-4 font-heading text-lg font-semibold">
                {t("private.title")}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {t("private.description")}
            </p>
        </section>
    );
}