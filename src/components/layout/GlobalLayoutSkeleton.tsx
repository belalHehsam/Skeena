import { Skeleton } from "@/components/ui/skeleton";

export function GlobalLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <aside className="hidden h-full w-64 flex-col space-y-6 border-r border-neutral-200 bg-white p-6 lg:flex dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>

        <nav className="flex-1 space-y-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-lg lg:hidden" />
            <Skeleton className="h-8 w-48 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        <main className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 flex-1 rounded-full" />
              </div>
            </div>

            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2.5 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="flex gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
