import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="space-y-2 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    </div>
  );
}
