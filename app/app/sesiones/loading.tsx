import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/app/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <CardGridSkeleton count={4} className="sm:grid-cols-2" />
    </div>
  );
}
