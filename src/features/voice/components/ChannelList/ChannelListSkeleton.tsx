import { Skeleton } from "@/components/ui/skeleton";

export function ChannelListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
              <Skeleton className="h-7 w-7 rounded-full border" />
              <Skeleton className="h-7 w-7 rounded-full border" />
              <Skeleton className="h-7 w-7 rounded-full border" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
