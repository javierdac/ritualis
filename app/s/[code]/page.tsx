import { auth } from "@/auth";
import { Room } from "@/components/room/room";

export const metadata = {
  title: "Sala en vivo · Ritualis",
};

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth();
  return <Room code={code.toUpperCase()} defaultName={session?.user?.name ?? undefined} />;
}
