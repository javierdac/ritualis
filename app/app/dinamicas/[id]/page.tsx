import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getDynamic } from "@/lib/data";
import DinamicaDetalle from "@/components/DinamicaDetalle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const d = await getDynamic(user.id, id, user.role === "admin");
  if (!d) notFound();
  return <DinamicaDetalle d={d} />;
}
