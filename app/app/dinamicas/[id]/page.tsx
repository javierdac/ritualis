import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getDynamic, getTeams } from "@/lib/data";
import DinamicaDetalle from "@/components/DinamicaDetalle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const [d, teams] = await Promise.all([
    getDynamic(user.id, id, isAdmin),
    getTeams(user.id, isAdmin),
  ]);
  if (!d) notFound();
  return (
    <DinamicaDetalle
      d={d}
      teams={teams.map((t) => ({ id: t._id, name: t.name }))}
    />
  );
}
