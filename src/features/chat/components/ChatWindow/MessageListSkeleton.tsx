import { Skeleton } from "@/components/ui/skeleton";

export function MessageListSkeleton() {
  return (
    <div className="space-y-4 p-4 flex-1 overflow-y-auto flex flex-col justify-end">
      {/* Incoming message skeleton */}
      <div className="flex gap-2 mr-auto max-w-[70%]">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="h-14 w-48 rounded-[18px_18px_18px_4px]" />
      </div>

      {/* Outgoing message skeleton */}
      <div className="flex gap-2 ml-auto max-w-[70%] justify-end">
        <Skeleton className="h-12 w-64 rounded-[18px_18px_4px_18px]" />
      </div>

      {/* Incoming message skeleton */}
      <div className="flex gap-2 mr-auto max-w-[70%]">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="h-12 w-32 rounded-[18px_18px_18px_4px]" />
      </div>

      {/* Outgoing message skeleton */}
      <div className="flex gap-2 ml-auto max-w-[70%] justify-end">
        <Skeleton className="h-16 w-56 rounded-[18px_18px_4px_18px]" />
      </div>

      {/* Incoming message skeleton */}
      <div className="flex gap-2 mr-auto max-w-[70%]">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="h-14 w-60 rounded-[18px_18px_18px_4px]" />
      </div>
    </div>
  );
}
export default MessageListSkeleton;
