import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UserCardSkeleton = () => {
  return (
    <Card className="flex flex-col items-center justify-between overflow-hidden text-center transition-all hover:shadow-md">
      <CardHeader className="flex flex-col items-center pt-6 pb-4 w-full">
        <Skeleton className="h-24 w-24 rounded-full mb-2" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardFooter className="w-full py-4">
        <div className="flex w-full gap-3 justify-center">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
};
