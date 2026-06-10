"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Repeat,
  Sparkles,
  Radio,
  FolderKanban,
  Users,
  UserRound,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/app", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/app/ceremonias", label: "Ceremonias", icon: Repeat },
  { href: "/app/dinamicas", label: "Dinámicas", icon: Sparkles },
  { href: "/app/sesiones", label: "Sesiones en vivo", icon: Radio },
  { href: "/app/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/app/equipos", label: "Equipos", icon: Users },
  { href: "/app/personas", label: "Personas", icon: UserRound },
];

const ADMIN_ITEMS = [
  { href: "/app/usuarios", label: "Usuarios", icon: Shield, exact: false },
];

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...ITEMS, ...ADMIN_ITEMS] : ITEMS;

  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-transform",
                !active && "group-hover:scale-110",
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
