import { requireAdmin } from "@/lib/session";
import { getUsers } from "@/lib/data";
import { UsersManager } from "@/components/app/users-manager";

export default async function UsuariosPage() {
  const admin = await requireAdmin();
  const users = await getUsers();
  return (
    <div className="mx-auto max-w-4xl">
      <UsersManager users={users} currentUserId={admin.id} />
    </div>
  );
}
