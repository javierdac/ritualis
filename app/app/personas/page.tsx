import { requireUser } from "@/lib/session";
import { getPeople, getTeams } from "@/lib/data";
import { PeopleManager } from "@/components/app/people-manager";

export default async function PersonasPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const [people, teams] = await Promise.all([
    getPeople(user.id, isAdmin),
    getTeams(user.id, isAdmin),
  ]);
  return (
    <div className="mx-auto max-w-4xl">
      <PeopleManager people={people} teams={teams} />
    </div>
  );
}
