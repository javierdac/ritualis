import { Skeleton } from "@/components/ui/skeleton";
import { StatsSkeleton, CardGridSkeleton } from "@/components/app/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <StatsSkeleton />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <CardGridSkeleton count={5} />
      </div>
    </div>
  );
}
