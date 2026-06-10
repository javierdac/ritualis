import { requireUser } from "@/lib/session";
import { getPeople, getTeams } from "@/lib/data";
import { PeopleManager } from "@/components/app/people-manager";

export default async function PersonasPage() {
  const user = await requireUser();
  const [people, teams] = await Promise.all([
    getPeople(user.id),
    getTeams(user.id),
  ]);
  return (
    <div className="mx-auto max-w-4xl">
      <PeopleManager people={people} teams={teams} />
    </div>
  );
}
