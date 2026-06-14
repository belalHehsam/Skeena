export function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900" />
        </div>
        <div className="h-6 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900" />
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-3 w-5/6 rounded-full bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-3 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-3 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-3 w-20 rounded-full bg-neutral-100 dark:bg-neutral-900" />
      </div>
    </div>
  );
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
