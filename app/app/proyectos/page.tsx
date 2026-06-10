import { requireUser } from "@/lib/session";
import { getProjects } from "@/lib/data";
import { ProjectsManager } from "@/components/app/projects-manager";

export default async function ProyectosPage() {
  const user = await requireUser();
  const projects = await getProjects(user.id);
  return (
    <div className="mx-auto max-w-4xl">
      <ProjectsManager projects={projects} />
    </div>
  );
}
