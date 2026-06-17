import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <section className="bg-card overflow-hidden rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800">
      <div className="h-40 sm:h-52 w-full bg-neutral-100 dark:bg-neutral-800/50 animate-pulse" />

      <div className="relative px-4 pb-6 sm:px-6 sm:pb-7">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="-mt-16 w-fit rounded-full sm:col-start-1 sm:row-start-1">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-card bg-neutral-200 dark:bg-neutral-800 shadow-md animate-pulse" />
          </div>

          <div className="mt-4 sm:col-start-2 sm:row-start-1 sm:mt-0 sm:mb-2 sm:self-end">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>

          <div className="mt-3 sm:col-span-2 sm:row-start-2">
            <Skeleton className="h-7 w-48 rounded-md" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:col-span-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="mt-4 space-y-2 max-w-2xl">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-5/6 rounded" />
        </div>

        <div className="mt-5 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </section>
  );
}
