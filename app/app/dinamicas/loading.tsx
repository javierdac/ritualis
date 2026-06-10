import { ListPageSkeleton } from "@/components/app/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl">
      <ListPageSkeleton cards={9} withFilters />
    </div>
  );
}
