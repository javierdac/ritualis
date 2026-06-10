import { TablePageSkeleton } from "@/components/app/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl">
      <TablePageSkeleton rows={6} />
    </div>
  );
}
