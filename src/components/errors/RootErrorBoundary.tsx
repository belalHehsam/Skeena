import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Button } from "@/components/ui/button";

function getErrorDetails(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`,
      message:
        error.data?.message ||
        "The page could not be loaded correctly.",
    };
  }

  if (error instanceof Error) {
    return {
      title: "Something went wrong",
      message: error.message,
    };
  }

  return {
    title: "Something went wrong",
    message: "An unexpected error occurred while loading this page.",
  };
}

export default function RootErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();
  const { title, message } = getErrorDetails(error);

  return (
    <main className="majlis-page-pattern relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-destructive/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <section className="relative w-full max-w-[560px] rounded-2xl border border-neutral-200 bg-white/90 p-7 text-center shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-8 text-destructive" />
        </div>

        <div className="mb-4 inline-flex rounded-full border border-destructive/20 bg-destructive/10 px-4 py-1 text-sm font-semibold text-destructive">
          Error
        </div>

        <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          We could not complete your request. Please try again, or
          return to the home page.
        </p>

        {import.meta.env.DEV && (
          <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-left dark:border-neutral-800 dark:bg-neutral-950">
            <p className="mb-1 text-xs font-semibold text-neutral-500">
              Developer details:
            </p>

            <p className="break-words text-xs leading-5 text-neutral-700 dark:text-neutral-300">
              {message}
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="gap-2 rounded-md text-white"
          >
            <RotateCcw className="size-4" />
            Reload Page
          </Button>

          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Home className="size-4" />
            Go Home
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-md text-neutral-700 dark:text-neutral-200"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            Go Back
          </Button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <img src="/logo-icon.png" alt="Majlis" className="size-5" />
          <span>Majlis Community Platform</span>
        </div>
      </section>
    </main>
  );
}