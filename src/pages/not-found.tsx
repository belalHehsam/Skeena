import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
    const { t } = useTranslation("errors");

    return (
        <main className="majlis-page-pattern relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />

            <section className="relative w-full max-w-130 rounded-2xl border border-neutral-200 bg-white/90 p-7 text-center shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <SearchX className="size-8 text-primary" />
                </div>

                <div className="mb-4 inline-flex rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                    {t("notFound.badge")}
                </div>

                <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                    {t("notFound.title")}
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {t("notFound.desc")}
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-600"
                    >
                        <Home className="size-4" />
                        {t("notFound.goHome")}
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <ArrowLeft className="size-4 rtl:rotate-180" />
                        {t("notFound.goBack")}
                    </button>
                </div>

                <div className="mt-7 flex items-center justify-center gap-2 text-xs text-neutral-400">
                    <img src="/logo-icon.png" alt="Majlis" className="size-5" />
                    <span>{t("notFound.footer")}</span>
                </div>
            </section>
        </main>
    );
};

export default NotFound;