import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import { Dynamic } from "@/lib/models";
import { serialize } from "@/lib/serialize";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const url = new URL(req.url);
  const skip = Math.max(0, Number(url.searchParams.get("skip")) || 0);
  const limit = Math.min(24, Math.max(1, Number(url.searchParams.get("limit")) || 9));
  const ceremonia = url.searchParams.get("ceremonia");
  const q = url.searchParams.get("q")?.trim();

  await dbConnect();
  const isAdmin = session.user.role === "admin";
  const filter: Record<string, unknown> = isAdmin
    ? {}
    : { $or: [{ isSeed: true }, { owner: session.user.id }] };
  if (ceremonia) filter.ceremonias = ceremonia;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$and = [{ $or: [{ nombre: rx }, { resumen: rx }] }];
  }

  const [total, items] = await Promise.all([
    Dynamic.countDocuments(filter),
    Dynamic.find(filter).sort({ nombre: 1 }).skip(skip).limit(limit).lean(),
  ]);

  return NextResponse.json({ total, items: serialize(items) });
}
