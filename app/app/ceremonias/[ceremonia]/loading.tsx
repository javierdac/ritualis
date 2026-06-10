import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/app/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <CardGridSkeleton count={6} />
    </div>
  );
}
