import Link from "next/link";
import { requireUser } from "@/lib/session";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { UserMenu } from "@/components/app/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar/70 p-4 backdrop-blur md:flex">
        <Link href="/app" className="mb-7 flex items-center gap-2.5 px-2">
          <RitualisMark className="h-9 w-9 text-primary" />
          <span className="font-brand text-lg tracking-[0.14em]">RITUALIS</span>
        </Link>
        <SidebarNav isAdmin={user.role === "admin"} />
        <div className="mt-auto px-2 pt-4 text-xs text-muted-foreground">
          Dinámicas para todas las ceremonias Scrum
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/70 px-4 backdrop-blur sm:px-6">
          <Link href="/app" className="flex items-center gap-2 md:hidden">
            <RitualisMark className="h-7 w-7 text-primary" />
            <span className="font-brand text-base tracking-[0.14em]">
              RITUALIS
            </span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu name={user.name} email={user.email} />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
