import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-row gap-4 p-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
