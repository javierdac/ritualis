import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FullPageMessage } from "@/components/full-page-message";

export default function NotFound() {
  return (
    <FullPageMessage
      title="Página no encontrada"
      message="La página que buscás no existe o fue movida."
    >
      <Button asChild>
        <Link href="/">Ir al inicio</Link>
      </Button>
    </FullPageMessage>
  );
}
