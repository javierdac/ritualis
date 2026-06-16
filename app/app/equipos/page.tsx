import { requireUser } from "@/lib/session";
import { getTeams, getProjects, getPeople } from "@/lib/data";
import { TeamsManager } from "@/components/app/teams-manager";

export default async function EquiposPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const [teams, projects, people] = await Promise.all([
    getTeams(user.id, isAdmin),
    getProjects(user.id, isAdmin),
    getPeople(user.id, isAdmin),
  ]);
  return (
    <div className="mx-auto max-w-4xl">
      <TeamsManager teams={teams} projects={projects} people={people} />
    </div>
  );
}
