import { Skeleton } from "@/components/ui/skeleton";

export function AuthLayoutSkeleton() {
  return (
    <div className="auth-pattern relative flex min-h-screen w-full items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <section className="w-full max-w-105 space-y-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>

        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-10 w-full rounded-md pt-2" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-4 w-48" />
        </div>
      </section>
    </div>
  );
}
