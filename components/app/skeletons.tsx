import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  className = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-3 p-5">
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border">
      <div className="flex items-center gap-4 border-b px-4 py-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <div className="flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b px-4 py-4 last:border-0">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-48" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton genérico: encabezado + grilla de tarjetas. */
export function ListPageSkeleton({
  cards = 6,
  withFilters = false,
}: {
  cards?: number;
  withFilters?: boolean;
}) {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      {withFilters && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      )}
      <CardGridSkeleton count={cards} />
    </div>
  );
}

/** Skeleton genérico: encabezado + tabla. */
export function TablePageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeaderSkeleton />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <TableSkeleton rows={rows} />
    </div>
  );
}
