import {
  Anchor,
  Angry,
  Backpack,
  Ban,
  BookOpen,
  CircleCheck,
  CircleDashed,
  Clapperboard,
  CloudLightning,
  Flame,
  Frown,
  Map as MapIcon,
  Minus,
  Mountain,
  Palmtree,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Smile,
  Star,
  Sun,
  ThumbsUp,
  Trash2,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Ceremonia } from "@/lib/types";

export const CEREMONIA_ICON: Record<Ceremonia, LucideIcon> = {
  retro: RefreshCw,
  daily: Sun,
  planning: MapIcon,
  review: Clapperboard,
  refinement: Search,
};

export function CeremoniaIcon({
  ceremonia,
  className,
}: {
  ceremonia: Ceremonia;
  className?: string;
}) {
  const Icon = CEREMONIA_ICON[ceremonia];
  return <Icon className={className} aria-hidden="true" />;
}

/** Iconos equivalentes a los emojis de columnas (claves sin variation selector). */
const EMOJI_ICON: Record<string, LucideIcon> = {
  "😠": Angry,
  "😢": Frown,
  "😄": Smile,
  "🚀": Rocket,
  "🛑": Ban,
  "✅": CircleCheck,
  "➕": Plus,
  "➖": Minus,
  "💨": Wind,
  "⚓": Anchor,
  "🪨": Mountain,
  "🏝": Palmtree,
  "👍": ThumbsUp,
  "📚": BookOpen,
  "🕳": CircleDashed,
  "🌟": Star,
  "🗑": Trash2,
  "🔧": Wrench,
  "🔥": Flame,
  "🎒": Backpack,
  "☀": Sun,
  "⛈": CloudLightning,
};

/**
 * Icono para una columna de tablero. Las columnas vienen de la base con un
 * emoji persistido; si no hay icono equivalente se muestra el emoji original.
 */
export function ColumnIcon({
  emoji,
  className,
}: {
  emoji?: string;
  className?: string;
}) {
  if (!emoji) return null;
  const Icon = EMOJI_ICON[emoji.replace(/️/g, "")];
  if (!Icon) return <span>{emoji}</span>;
  return <Icon className={className} aria-hidden="true" />;
}
