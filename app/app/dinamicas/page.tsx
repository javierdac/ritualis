import { requireUser } from "@/lib/session";
import { DynamicsManager } from "@/components/app/dynamics-manager";

export default async function DinamicasPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-5xl">
      <DynamicsManager />
    </div>
  );
}
