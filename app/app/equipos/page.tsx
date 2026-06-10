import { requireUser } from "@/lib/session";
import { getTeams, getProjects } from "@/lib/data";
import { TeamsManager } from "@/components/app/teams-manager";

export default async function EquiposPage() {
  const user = await requireUser();
  const [teams, projects] = await Promise.all([
    getTeams(user.id),
    getProjects(user.id),
  ]);
  return (
    <div className="mx-auto max-w-4xl">
      <TeamsManager teams={teams} projects={projects} />
    </div>
  );
}
