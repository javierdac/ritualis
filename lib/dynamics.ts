import type { Dinamica } from "./types";

export const DINAMICAS: Dinamica[] = [
  // ─────────────────────────── RETRO ───────────────────────────
  {
    id: "mad-sad-glad",
    columns: [
      { key: "mad", label: "Mad", emoji: "😠" },
      { key: "sad", label: "Sad", emoji: "😢" },
      { key: "glad", label: "Glad", emoji: "😄" },
    ],
    nombre: "Mad, Sad, Glad",
    resumen:
      "Clásica emocional: el equipo agrupa lo que lo enojó, entristeció o alegró durante el sprint.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso", "recolectar-feedback"],
    duracionMin: 45,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Pizarra o tablero online", "Post-its de 3 colores", "Marcadores"],
    pasos: [
      {
        titulo: "Preparar el tablero",
        detalle:
          "Dibujá tres columnas: 😠 Mad (me frustró), 😢 Sad (me decepcionó) y 😄 Glad (me alegró).",
        duracionMin: 3,
      },
      {
        titulo: "Escritura individual en silencio",
        detalle:
          "Cada persona escribe en post-its los eventos del sprint y los ubica en la columna que corresponda. Sin charlar todavía.",
        duracionMin: 8,
      },
      {
        titulo: "Agrupar y leer",
        detalle:
          "El facilitador agrupa post-its similares y los lee en voz alta. Quien lo escribió puede dar contexto breve.",
        duracionMin: 12,
      },
      {
        titulo: "Votación (dot voting)",
        detalle:
          "Cada persona tiene 3 votos para marcar los temas que más quiere discutir.",
        duracionMin: 5,
      },
      {
        titulo: "Discusión y acciones",
        detalle:
          "Discutan los 2-3 temas más votados y definan acciones concretas con responsable.",
        duracionMin: 17,
      },
    ],
    tips: [
      "Reforzá que 'Glad' importa tanto como 'Mad': celebrar refuerza buenos hábitos.",
      "Limitá cada explicación a 1 minuto para que entren todos los temas.",
    ],
  },
  {
    id: "estrella-de-mar",
    columns: [
      { key: "empezar", label: "Empezar a hacer", emoji: "🚀" },
      { key: "dejar", label: "Dejar de hacer", emoji: "🛑" },
      { key: "seguir", label: "Seguir haciendo", emoji: "✅" },
      { key: "mas", label: "Hacer más", emoji: "➕" },
      { key: "menos", label: "Hacer menos", emoji: "➖" },
    ],
    nombre: "Estrella de Mar (Starfish)",
    resumen:
      "Cinco categorías para afinar el proceso: empezar, dejar de, seguir, hacer más y hacer menos.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso"],
    duracionMin: 50,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero con estrella de 5 puntas", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Dibujar la estrella",
        detalle:
          "Cinco secciones: Empezar a hacer · Dejar de hacer · Seguir haciendo · Hacer más · Hacer menos.",
        duracionMin: 3,
      },
      {
        titulo: "Brainstorm individual",
        detalle: "Cada persona completa las secciones con post-its.",
        duracionMin: 10,
      },
      {
        titulo: "Compartir por sección",
        detalle:
          "Recorran sección por sección leyendo y agrupando lo similar.",
        duracionMin: 15,
      },
      {
        titulo: "Priorizar acciones",
        detalle:
          "Voten y elijan 2-3 cambios concretos. Foco en 'Empezar' y 'Dejar de hacer'.",
        duracionMin: 22,
      },
    ],
    tips: [
      "Ideal cuando el equipo ya tiene cierta madurez y quiere ajustar finos, no solo ventilar emociones.",
    ],
  },
  {
    id: "velero",
    columns: [
      { key: "viento", label: "Viento (nos impulsa)", emoji: "💨" },
      { key: "anclas", label: "Anclas (nos frenan)", emoji: "⚓" },
      { key: "rocas", label: "Rocas (riesgos)", emoji: "🪨" },
      { key: "isla", label: "Isla (meta)", emoji: "🏝️" },
    ],
    nombre: "El Velero (Sailboat)",
    resumen:
      "Metáfora visual: el viento que impulsa, las anclas que frenan, las rocas (riesgos) y la isla (meta).",
    ceremonias: ["retro", "planning"],
    objetivos: ["mejorar-proceso", "detectar-riesgos", "alinear"],
    duracionMin: 50,
    equipoMin: 3,
    equipoMax: 15,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Dibujo de velero, isla, anclas y rocas", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Presentar la metáfora",
        detalle:
          "🏝️ Isla = objetivo del equipo. 💨 Viento = lo que nos impulsa. ⚓ Anclas = lo que nos frena. 🪨 Rocas = riesgos que vienen.",
        duracionMin: 4,
      },
      {
        titulo: "Completar el dibujo",
        detalle: "Cada persona suma post-its a viento, anclas y rocas.",
        duracionMin: 10,
      },
      {
        titulo: "Recorrer el velero",
        detalle: "Lean y agrupen por zona. Empiecen por el viento (lo positivo).",
        duracionMin: 14,
      },
      {
        titulo: "Atacar anclas y rocas",
        detalle:
          "Prioricen 1-2 anclas para soltar y 1 roca para mitigar. Definan acciones.",
        duracionMin: 22,
      },
    ],
    tips: [
      "Muy visual: excelente para equipos nuevos o que se aburren del formato de columnas.",
      "Las 'rocas' lo hacen útil también como anticipo de riesgos del próximo sprint.",
    ],
  },
  {
    id: "cuatro-ls",
    columns: [
      { key: "liked", label: "Liked (gustó)", emoji: "👍" },
      { key: "learned", label: "Learned (aprendí)", emoji: "📚" },
      { key: "lacked", label: "Lacked (faltó)", emoji: "🕳️" },
      { key: "longed", label: "Longed for (deseé)", emoji: "🌟" },
    ],
    nombre: "4 Ls — Liked, Learned, Lacked, Longed for",
    resumen:
      "Cuatro lentes: qué gustó, qué se aprendió, qué faltó y qué se deseó tener.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso", "recolectar-feedback"],
    duracionMin: 45,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero con 4 cuadrantes", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Armar los cuadrantes",
        detalle:
          "👍 Liked (gustó) · 📚 Learned (aprendí) · 🕳️ Lacked (faltó) · 🌟 Longed for (deseé tener).",
        duracionMin: 3,
      },
      {
        titulo: "Reflexión individual",
        detalle: "Cada persona completa los cuatro cuadrantes.",
        duracionMin: 10,
      },
      {
        titulo: "Puesta en común",
        detalle: "Recorran cuadrante por cuadrante agrupando temas.",
        duracionMin: 15,
      },
      {
        titulo: "Acciones",
        detalle:
          "Lacked y Longed for suelen revelar acciones de mejora. Elijan 2-3.",
        duracionMin: 17,
      },
    ],
    tips: ["Buena para retros de fin de proyecto o de un trimestre, no solo de sprint."],
  },
  {
    id: "daki",
    columns: [
      { key: "drop", label: "Drop (dejar)", emoji: "🗑️" },
      { key: "add", label: "Add (sumar)", emoji: "➕" },
      { key: "keep", label: "Keep (mantener)", emoji: "✅" },
      { key: "improve", label: "Improve (mejorar)", emoji: "🔧" },
    ],
    nombre: "DAKI — Drop, Add, Keep, Improve",
    resumen:
      "Orientada 100% a acción: qué dejar de hacer, qué sumar, qué mantener y qué mejorar.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso"],
    duracionMin: 40,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero con 4 columnas", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Cuatro columnas",
        detalle:
          "🗑️ Drop (dejar) · ➕ Add (sumar) · ✅ Keep (mantener) · 🔧 Improve (mejorar).",
        duracionMin: 2,
      },
      {
        titulo: "Generar ideas",
        detalle: "Brainstorm individual y ubicación en columnas.",
        duracionMin: 10,
      },
      {
        titulo: "Discusión",
        detalle: "Agrupen, lean y discutan los puntos clave.",
        duracionMin: 13,
      },
      {
        titulo: "Compromisos",
        detalle:
          "Cada acción de Add/Improve sale con responsable y fecha. Pocas y reales.",
        duracionMin: 15,
      },
    ],
    tips: ["La más directa cuando el tiempo es corto (40 min o menos)."],
  },
  {
    id: "globo-aerostatico",
    columns: [
      { key: "fuego", label: "Fuego (nos eleva)", emoji: "🔥" },
      { key: "peso", label: "Peso (nos baja)", emoji: "🎒" },
      { key: "buen-clima", label: "Buen clima (oportunidades)", emoji: "☀️" },
      { key: "tormenta", label: "Tormenta (riesgos)", emoji: "⛈️" },
    ],
    nombre: "Globo Aerostático",
    resumen:
      "El equipo es un globo: el fuego que lo eleva, el peso que lo baja, el buen y mal clima por venir.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso", "detectar-riesgos", "celebrar"],
    duracionMin: 50,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Dibujo de globo aerostático", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Presentar la metáfora",
        detalle:
          "🔥 Fuego = lo que nos eleva · 🎒 Peso/sacos = lo que nos baja · ☀️ Buen clima = oportunidades · ⛈️ Tormenta = riesgos.",
        duracionMin: 4,
      },
      {
        titulo: "Completar",
        detalle: "Cada persona suma post-its a cada elemento del globo.",
        duracionMin: 10,
      },
      {
        titulo: "Recorrido",
        detalle: "Lean y agrupen por elemento.",
        duracionMin: 14,
      },
      {
        titulo: "Acciones",
        detalle: "Suelten 1-2 sacos y preparen el equipo para la tormenta. Definan acciones.",
        duracionMin: 22,
      },
    ],
    tips: ["Variante del velero; alterná entre ambas para que no se vuelva rutina."],
  },
  {
    id: "linea-de-tiempo",
    nombre: "Línea de Tiempo del Sprint",
    resumen:
      "Reconstruyen el sprint día a día y marcan picos altos y bajos de ánimo o energía.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso", "recolectar-feedback"],
    duracionMin: 55,
    equipoMin: 3,
    equipoMax: 10,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Eje horizontal largo (línea de tiempo)", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Dibujar la línea",
        detalle:
          "Eje horizontal con los días/hitos del sprint. Eje vertical = ánimo/energía (alto arriba, bajo abajo).",
        duracionMin: 4,
      },
      {
        titulo: "Reconstruir eventos",
        detalle:
          "El equipo va ubicando eventos en el tiempo, marcando si fueron positivos o negativos.",
        duracionMin: 18,
      },
      {
        titulo: "Identificar patrones",
        detalle:
          "¿Dónde se cayó la energía? ¿Qué hito disparó problemas? Buscá causas.",
        duracionMin: 15,
      },
      {
        titulo: "Acciones",
        detalle: "Definan acciones para suavizar los valles del próximo sprint.",
        duracionMin: 18,
      },
    ],
    tips: ["Muy útil tras un sprint caótico: hace visible la historia real de lo que pasó."],
  },
  {
    id: "start-stop-continue",
    columns: [
      { key: "start", label: "Start (empezar)", emoji: "▶️" },
      { key: "stop", label: "Stop (dejar)", emoji: "⏹️" },
      { key: "continue", label: "Continue (seguir)", emoji: "🔁" },
    ],
    nombre: "Start, Stop, Continue",
    resumen:
      "El clásico de tres columnas: qué empezar a hacer, qué dejar de hacer y qué seguir haciendo.",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso"],
    duracionMin: 40,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero con 3 columnas", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Tres columnas",
        detalle: "▶️ Start (empezar a hacer) · ⏹️ Stop (dejar de hacer) · 🔁 Continue (seguir haciendo).",
        duracionMin: 2,
      },
      {
        titulo: "Brainstorm individual",
        detalle: "Cada persona completa las tres columnas en silencio.",
        duracionMin: 8,
      },
      {
        titulo: "Leer y agrupar",
        detalle: "Recorran columna por columna agrupando lo similar.",
        duracionMin: 12,
      },
      {
        titulo: "Votar y accionar",
        detalle: "Dot voting y 2-3 acciones con responsable. Start y Stop suelen dar las mejores.",
        duracionMin: 18,
      },
    ],
    tips: [
      "El formato más simple que existe: ideal como primera retro de un equipo nuevo.",
      "Si 'Continue' queda vacío, dedíquenle un minuto: reconocer lo que funciona también es mejora.",
    ],
  },
  {
    id: "rosa-capullo-espina",
    columns: [
      { key: "rosa", label: "Rosa (logro)", emoji: "🌹" },
      { key: "capullo", label: "Capullo (oportunidad)", emoji: "🌱" },
      { key: "espina", label: "Espina (dolor)", emoji: "🌵" },
    ],
    nombre: "Rosa, Capullo, Espina",
    resumen:
      "Tres lentes botánicos: la rosa (lo que floreció), el capullo (lo que promete) y la espina (lo que duele).",
    ceremonias: ["retro"],
    objetivos: ["mejorar-proceso", "recolectar-feedback", "celebrar"],
    duracionMin: 35,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero con 3 columnas", "Post-its", "Marcadores"],
    pasos: [
      {
        titulo: "Presentar las tres categorías",
        detalle:
          "🌹 Rosa = un logro o algo que salió bien · 🌱 Capullo = una oportunidad que todavía no floreció · 🌵 Espina = un dolor o frustración.",
        duracionMin: 3,
      },
      {
        titulo: "Completar",
        detalle: "Cada persona aporta al menos una de cada categoría.",
        duracionMin: 8,
      },
      {
        titulo: "Compartir",
        detalle: "Ronda de lectura, agrupando temas repetidos.",
        duracionMin: 12,
      },
      {
        titulo: "Regar los capullos",
        detalle:
          "Elijan 1-2 capullos para convertir en acción concreta y 1 espina para quitar.",
        duracionMin: 12,
      },
    ],
    tips: ["Los 'capullos' son su diferencial: orienta la retro al futuro, no solo a quejas del pasado."],
  },
  {
    id: "lean-coffee",
    columns: [
      { key: "discutir", label: "Para discutir", emoji: "📋" },
      { key: "discutiendo", label: "Discutiendo", emoji: "💬" },
      { key: "discutido", label: "Discutido", emoji: "✅" },
    ],
    nombre: "Lean Coffee",
    resumen:
      "Agenda emergente: el equipo propone temas, los vota y los discute en timeboxes cortos con pulgar para extender.",
    ceremonias: ["retro", "refinement"],
    objetivos: ["priorizar", "mejorar-proceso", "alinear"],
    duracionMin: 45,
    equipoMin: 3,
    equipoMax: 10,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero de 3 columnas", "Post-its", "Timer visible"],
    pasos: [
      {
        titulo: "Proponer temas",
        detalle: "Cada persona escribe los temas que quiere discutir, uno por post-it.",
        duracionMin: 5,
      },
      {
        titulo: "Votar la agenda",
        detalle: "Dot voting: 2-3 votos por persona. Se ordena la columna 'Para discutir' por votos.",
        duracionMin: 4,
      },
      {
        titulo: "Discutir en timeboxes",
        detalle:
          "El tema más votado pasa a 'Discutiendo' con 8 minutos. Al sonar el timer: pulgar arriba (5 min más), al medio o abajo (siguiente tema).",
        duracionMin: 32,
      },
      {
        titulo: "Cierre",
        detalle: "Anoten acciones y temas que quedaron para la próxima.",
        duracionMin: 4,
      },
    ],
    tips: [
      "La agenda la arma el equipo, no el facilitador: salen los temas que de verdad importan.",
      "Sé estricto con el timer; el voto de pulgares es lo que evita que un tema se coma la sesión.",
    ],
  },
  {
    id: "ronda-de-kudos",
    nombre: "Ronda de Kudos",
    resumen:
      "Cierre en positivo: cada persona agradece o reconoce públicamente a alguien del equipo por algo concreto del sprint.",
    ceremonias: ["retro", "review"],
    objetivos: ["celebrar", "conocerse"],
    duracionMin: 15,
    equipoMin: 3,
    equipoMax: 15,
    energia: "alta",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno (opcional: tarjetas kudos)"],
    pasos: [
      {
        titulo: "Explicar la consigna",
        detalle:
          "Un kudo es un reconocimiento concreto: 'gracias X por Y'. No vale lo genérico ('buen trabajo todos').",
        duracionMin: 2,
      },
      {
        titulo: "Ronda de reconocimientos",
        detalle:
          "Por turnos o espontáneo: cada persona da al menos un kudo. Quien lo recibe solo dice gracias.",
        duracionMin: 11,
      },
      {
        titulo: "Cierre",
        detalle: "El facilitador cierra destacando un logro colectivo del sprint.",
        duracionMin: 2,
      },
    ],
    tips: [
      "Úsala como cierre de una retro intensa: el equipo se va con el ánimo arriba.",
      "Si alguien nunca recibe kudos, el facilitador puede sembrar uno genuino.",
    ],
  },

  // ──────────────── ICEBREAKERS: conocerse / descontracturar ────────────────
  {
    id: "dos-verdades-una-mentira",
    nombre: "Dos Verdades y Una Mentira",
    resumen:
      "Cada persona dice tres afirmaciones sobre sí; el resto adivina cuál es la mentira.",
    ceremonias: ["retro", "planning", "review", "refinement"],
    objetivos: ["conocerse", "descontracturar"],
    duracionMin: 15,
    equipoMin: 3,
    equipoMax: 10,
    energia: "alta",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno"],
    pasos: [
      {
        titulo: "Explicar",
        detalle:
          "Cada persona prepara 2 verdades y 1 mentira sobre sí misma (hobbies, viajes, anécdotas).",
        duracionMin: 3,
      },
      {
        titulo: "Por turnos",
        detalle:
          "Cada uno dice sus 3 frases y el resto vota cuál cree que es la mentira antes de revelar.",
        duracionMin: 10,
      },
      {
        titulo: "Cierre",
        detalle: "Quedate con la anécdota más sorprendente; suele dar tema de charla.",
        duracionMin: 2,
      },
    ],
    tips: ["Top para equipos nuevos o cuando entra gente nueva al equipo."],
  },
  {
    id: "si-fueras",
    nombre: "Si Fueras…",
    resumen:
      "Metáforas rápidas para abrir: 'si este sprint fuera una película / un animal / una canción, ¿cuál sería?'.",
    ceremonias: ["retro", "review"],
    objetivos: ["descontracturar", "conocerse"],
    duracionMin: 10,
    equipoMin: 2,
    equipoMax: 15,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno"],
    pasos: [
      {
        titulo: "Lanzar la pregunta",
        detalle:
          "Elegí una categoría: 🎬 película · 🐾 animal · 🎵 canción · 🌦️ clima. Ej: 'Si el sprint fuera un animal, ¿cuál y por qué?'.",
        duracionMin: 2,
      },
      {
        titulo: "Ronda relámpago",
        detalle: "Cada persona responde en 30-40 segundos. Sin debate.",
        duracionMin: 7,
      },
      {
        titulo: "Puente a la retro",
        detalle:
          "Las metáforas negativas ('un gato asustado') son entradas naturales a los temas del día.",
        duracionMin: 1,
      },
    ],
    tips: ["Funciona como check-in de 10 min antes de una retro larga."],
  },
  {
    id: "gif-del-sprint",
    nombre: "El GIF del Sprint",
    resumen:
      "Cada uno comparte un GIF o emoji que resuma cómo vivió el sprint. Rompe el hielo y mide el clima.",
    ceremonias: ["retro", "review"],
    objetivos: ["descontracturar", "recolectar-feedback"],
    duracionMin: 10,
    equipoMin: 2,
    equipoMax: 15,
    energia: "alta",
    presencial: false,
    remoto: true,
    materiales: ["Chat o tablero online (Slack, Miro, etc.)"],
    pasos: [
      {
        titulo: "Pedir el GIF",
        detalle:
          "Cada persona busca y pega un GIF/emoji que represente su sprint en el canal o tablero.",
        duracionMin: 4,
      },
      {
        titulo: "Mostrar y comentar",
        detalle: "Por turnos, cada uno explica en 30 seg por qué eligió ese GIF.",
        duracionMin: 6,
      },
    ],
    tips: [
      "Ideal para equipos remotos: rápido, divertido y termómetro del ánimo.",
      "Guardá los GIFs: la evolución sprint a sprint cuenta una historia.",
    ],
  },
  {
    id: "mapa-de-animo",
    nombre: "Mapa de Ánimo (Niko-Niko)",
    resumen:
      "Check-in silencioso: cada persona marca su nivel de energía/ánimo en una escala visual.",
    ceremonias: ["retro", "daily"],
    objetivos: ["descontracturar", "recolectar-feedback", "alinear"],
    duracionMin: 8,
    equipoMin: 2,
    equipoMax: 15,
    energia: "baja",
    presencial: true,
    remoto: true,
    materiales: ["Escala 1-5 o caras 😞😐😊", "Post-its o reacciones"],
    pasos: [
      {
        titulo: "Mostrar la escala",
        detalle:
          "Una escala de 😞 a 😄 (o 1 a 5). Cada persona coloca su marca de cómo llega hoy.",
        duracionMin: 3,
      },
      {
        titulo: "Leer el mapa",
        detalle:
          "Sin presionar a nadie a explicar. Quien quiera, comenta en una frase.",
        duracionMin: 4,
      },
      {
        titulo: "Tomar el pulso",
        detalle:
          "Si hay varias caras bajas, vale la pena ajustar el foco de la sesión.",
        duracionMin: 1,
      },
    ],
    tips: [
      "Bajo umbral de exposición: ideal para equipos tímidos o culturas introvertidas.",
      "Si lo hacés a diario, dibujás la curva de ánimo del equipo en el tiempo.",
    ],
  },
  {
    id: "pregunta-rompehielos",
    nombre: "Pregunta Rompehielos Rotativa",
    resumen:
      "Una pregunta liviana al inicio. Rota quién la elige cada sesión para repartir la voz.",
    ceremonias: ["daily", "retro", "planning", "review", "refinement"],
    objetivos: ["conocerse", "descontracturar"],
    duracionMin: 7,
    equipoMin: 2,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Lista de preguntas (opcional)"],
    pasos: [
      {
        titulo: "Elegir pregunta",
        detalle:
          "Quien rota esta semana elige una pregunta. Ej: '¿Qué app no podrías borrar del celu?', '¿Mejor comida de la semana?'.",
        duracionMin: 1,
      },
      {
        titulo: "Ronda",
        detalle: "Cada persona responde en una frase. Sin ahondar.",
        duracionMin: 5,
      },
      {
        titulo: "Pasar el testigo",
        detalle: "Se designa quién elegirá la pregunta la próxima vez.",
        duracionMin: 1,
      },
    ],
    tips: ["Repetirla a diario crea hábito y baja la barrera para hablar en el daily."],
  },
  {
    id: "conteo-a-20",
    nombre: "Conteo Ciego a 20",
    resumen:
      "Juego exprés de coordinación: el equipo cuenta hasta 20 sin orden previo; si dos hablan a la vez, se vuelve a cero.",
    ceremonias: ["retro", "daily", "planning", "review", "refinement"],
    objetivos: ["descontracturar", "alinear"],
    duracionMin: 8,
    equipoMin: 4,
    equipoMax: 15,
    energia: "alta",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno"],
    pasos: [
      {
        titulo: "Explicar la regla",
        detalle:
          "Hay que contar de 1 a 20 entre todos, de a un número por persona, sin acordar orden ni hacer señas. Si dos dicen un número a la vez, se arranca de nuevo.",
        duracionMin: 1,
      },
      {
        titulo: "Jugar",
        detalle:
          "En remoto es más difícil (latencia) y más gracioso. Intentos ilimitados hasta lograrlo o agotar el tiempo.",
        duracionMin: 6,
      },
      {
        titulo: "Micro-reflexión",
        detalle:
          "Una pregunta: ¿qué hizo que funcione? (escuchar, pausas, ceder el turno) — igual que en el trabajo diario.",
        duracionMin: 1,
      },
    ],
    tips: ["Funciona como metáfora relámpago de la comunicación del equipo: ganás cediendo espacio, no hablando más."],
  },

  // ─────────────────────────── DAILY ───────────────────────────
  {
    id: "ronda-clasica",
    nombre: "Ronda Clásica (3 Preguntas)",
    resumen:
      "El formato canónico: cada persona responde qué hizo ayer, qué hará hoy y qué la bloquea, con timebox por cabeza.",
    ceremonias: ["daily"],
    objetivos: ["alinear"],
    duracionMin: 15,
    equipoMin: 3,
    equipoMax: 9,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Timer visible (opcional)"],
    pasos: [
      {
        titulo: "Definir el orden",
        detalle:
          "Orden fijo, alfabético o aleatorio. Cambiarlo cada tanto evita el piloto automático.",
        duracionMin: 1,
      },
      {
        titulo: "Ronda con timebox",
        detalle:
          "Cada persona responde: ¿qué hice ayer? ¿qué hago hoy? ¿algo me bloquea? Máximo 90 segundos por cabeza.",
        duracionMin: 12,
      },
      {
        titulo: "Cierre",
        detalle:
          "Los bloqueos se anotan y se resuelven después con los involucrados, no en la ronda.",
        duracionMin: 2,
      },
    ],
    tips: [
      "Si la daily se volvió un reporte al líder, prueben Walking the Board o Daily por Objetivo.",
      "El timer por persona es la herramienta anti-monólogo más efectiva que existe.",
    ],
  },
  {
    id: "bloqueos-primero",
    nombre: "Bloqueos Primero",
    resumen:
      "La daily arranca por los impedimentos: primero se levantan todos los bloqueos, después una ronda corta de foco.",
    ceremonias: ["daily"],
    objetivos: ["alinear", "detectar-riesgos", "priorizar"],
    duracionMin: 12,
    equipoMin: 3,
    equipoMax: 9,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Lista visible de bloqueos del equipo"],
    pasos: [
      {
        titulo: "Levantar bloqueos",
        detalle:
          "Pregunta de apertura: ¿quién está bloqueado o por bloquearse? Solo se enuncian, sin resolverlos todavía.",
        duracionMin: 4,
      },
      {
        titulo: "Asignar destrabes",
        detalle:
          "Para cada bloqueo: quién ayuda y cuándo (hoy). Si nadie puede, escala el facilitador.",
        duracionMin: 4,
      },
      {
        titulo: "Ronda de foco exprés",
        detalle: "Una frase por persona: 'hoy mi foco es X'. Nada más.",
        duracionMin: 4,
      },
    ],
    tips: [
      "Ideal para sprints complicados o con muchas dependencias externas.",
      "Garantiza que lo importante (los impedimentos) no quede para el final cuando ya no hay tiempo.",
    ],
  },
  {
    id: "estacionamiento",
    columns: [{ key: "parking", label: "Para después", emoji: "🅿️" }],
    nombre: "Parking Lot (Estacionamiento)",
    resumen:
      "Daily corta con disciplina: todo tema que excede la sincronización va a una columna de 'estacionamiento' y se trata después solo con los interesados.",
    ceremonias: ["daily"],
    objetivos: ["alinear", "priorizar", "mejorar-proceso"],
    duracionMin: 15,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero o columna visible para estacionar temas"],
    pasos: [
      {
        titulo: "Acordar la regla",
        detalle:
          "Cualquiera puede decir 'parking' cuando una discusión se desvía: el tema se anota y la daily sigue.",
        duracionMin: 1,
      },
      {
        titulo: "Daily normal",
        detalle:
          "Corran su formato habitual (ronda o tablero). Los desvíos van al estacionamiento sin culpa.",
        duracionMin: 10,
      },
      {
        titulo: "Resolver el estacionamiento",
        detalle:
          "Al cerrar, por cada tema estacionado: quiénes se quedan a hablarlo y quiénes quedan libres. El resto se va.",
        duracionMin: 4,
      },
    ],
    tips: [
      "El 80% del valor está en que la gente NO involucrada recupera su tiempo.",
      "Si el mismo tema aparece estacionado 3 dailies seguidas, merece su propia reunión o una acción de retro.",
    ],
  },
  {
    id: "pasa-la-posta",
    nombre: "Pasá la Posta",
    resumen:
      "Juego de ritmo para la daily: quien tiene la 'posta' (pelota, objeto o emoji) habla y elige a quién pasársela. Nadie sabe cuándo le toca.",
    ceremonias: ["daily"],
    objetivos: ["alinear", "descontracturar"],
    duracionMin: 12,
    equipoMin: 3,
    equipoMax: 10,
    energia: "alta",
    presencial: true,
    remoto: true,
    materiales: ["Pelota u objeto (presencial) o mención/emoji (remoto)"],
    pasos: [
      {
        titulo: "Arranca cualquiera",
        detalle:
          "El facilitador lanza la posta a alguien al azar. Esa persona hace su update corto.",
        duracionMin: 1,
      },
      {
        titulo: "Pasar la posta",
        detalle:
          "Al terminar, se la pasa a alguien que todavía no habló (en remoto: lo nombra). El orden impredecible mantiene a todos atentos.",
        duracionMin: 10,
      },
      {
        titulo: "Cierre",
        detalle: "El último se la devuelve al facilitador, que cierra con bloqueos pendientes.",
        duracionMin: 1,
      },
    ],
    tips: [
      "Mata el 'ensayar mi parte mientras hablan los demás': nadie sabe cuándo le toca.",
      "En remoto, nombrar al siguiente reemplaza a la pelota y funciona igual de bien.",
    ],
  },
  {
    id: "walking-the-board",
    nombre: "Walking the Board",
    resumen:
      "En vez de ir persona por persona, recorrés el tablero de derecha a izquierda, priorizando lo más cercano a 'Done'.",
    ceremonias: ["daily"],
    objetivos: ["alinear", "mejorar-proceso", "priorizar"],
    duracionMin: 15,
    equipoMin: 3,
    equipoMax: 9,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero del sprint (físico o digital)"],
    pasos: [
      {
        titulo: "Arrancar por la derecha",
        detalle:
          "Empezá por las tareas más cercanas a 'Done'. El foco es terminar, no empezar.",
        duracionMin: 2,
      },
      {
        titulo: "Recorrer ítem por ítem",
        detalle:
          "Para cada tarjeta: ¿qué necesita para avanzar? ¿hay bloqueos? Habla quien la tiene.",
        duracionMin: 10,
      },
      {
        titulo: "Bloqueos y foco",
        detalle:
          "Anotá bloqueos para resolver después del daily. Reafirmen el objetivo del sprint.",
        duracionMin: 3,
      },
    ],
    tips: [
      "Cura el 'reporte de status' individual: pone el foco en el flujo de trabajo, no en las personas.",
    ],
  },
  {
    id: "daily-por-objetivo",
    nombre: "Daily por Objetivo del Sprint",
    resumen:
      "La pregunta no es '¿qué hice?' sino '¿qué nos acerca hoy al objetivo del sprint?'.",
    ceremonias: ["daily"],
    objetivos: ["alinear", "priorizar"],
    duracionMin: 12,
    equipoMin: 3,
    equipoMax: 9,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Objetivo del sprint visible"],
    pasos: [
      {
        titulo: "Releer el objetivo",
        detalle: "Mostrá el Sprint Goal en pantalla y léanlo en voz alta.",
        duracionMin: 1,
      },
      {
        titulo: "Tres preguntas reenfocadas",
        detalle:
          "¿Qué hicimos ayer que nos acercó al objetivo? ¿Qué haremos hoy? ¿Qué lo pone en riesgo?",
        duracionMin: 9,
      },
      {
        titulo: "Ajustar el plan",
        detalle:
          "Si algo no aporta al objetivo, cuestionen si va hoy. Reordenen prioridades.",
        duracionMin: 2,
      },
    ],
    tips: ["Combate el daily-reporte: todo se mide contra el Sprint Goal."],
  },

  // ─────────────────────────── PLANNING ───────────────────────────
  {
    id: "planning-poker",
    nombre: "Planning Poker",
    resumen:
      "Estimación por consenso: cada uno elige una carta (Fibonacci) en privado y se revela a la vez.",
    ceremonias: ["planning", "refinement"],
    objetivos: ["alinear", "priorizar"],
    duracionMin: 30,
    equipoMin: 3,
    equipoMax: 9,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Cartas de Fibonacci (físicas o app)"],
    pasos: [
      {
        titulo: "Presentar la historia",
        detalle:
          "El PO lee la historia y aclara dudas. El equipo entiende el alcance y criterios de aceptación.",
        duracionMin: 5,
      },
      {
        titulo: "Estimar en privado",
        detalle:
          "Cada persona elige una carta (1,2,3,5,8,13…) sin mostrarla.",
        duracionMin: 2,
      },
      {
        titulo: "Revelar a la vez",
        detalle: "Todos muestran simultáneamente. Buscá la mayor y la menor.",
        duracionMin: 1,
      },
      {
        titulo: "Discutir los extremos",
        detalle:
          "Quienes votaron alto y bajo explican por qué. Suele revelar supuestos ocultos.",
        duracionMin: 5,
      },
      {
        titulo: "Re-estimar",
        detalle: "Vuelvan a votar hasta acercarse al consenso. Repetir por cada historia.",
        duracionMin: 17,
      },
    ],
    tips: [
      "Si la discusión no converge en 2 rondas, la historia probablemente necesita refinarse o partirse.",
    ],
  },
  {
    id: "estimacion-remeras",
    nombre: "Estimación con Remeras (T-Shirt Sizing)",
    resumen:
      "Estimación gruesa y rápida: cada historia recibe un talle (XS, S, M, L, XL) en vez de un número.",
    ceremonias: ["planning", "refinement"],
    objetivos: ["priorizar", "alinear"],
    duracionMin: 25,
    equipoMin: 3,
    equipoMax: 10,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Escala de talles visible", "Backlog a estimar"],
    pasos: [
      {
        titulo: "Calibrar los talles",
        detalle:
          "Acuerden una historia de referencia para M. Todo se compara contra ella: ¿más grande o más chico?",
        duracionMin: 5,
      },
      {
        titulo: "Asignar talles",
        detalle:
          "Por cada historia, votación rápida de talle a mano alzada o en chat. Sin discutir las que coinciden.",
        duracionMin: 14,
      },
      {
        titulo: "Revisar los XL",
        detalle:
          "Todo XL es candidato a partirse antes de entrar a un sprint. Anótenlos para refinement.",
        duracionMin: 6,
      },
    ],
    tips: [
      "Mucho más rápida que Planning Poker para barrer un backlog grande; menos precisa por diseño.",
      "Útil también para que stakeholders entiendan magnitudes sin hablar de puntos.",
    ],
  },
  {
    id: "cinco-dedos",
    nombre: "Fist of Five (Confianza a Cinco Dedos)",
    resumen:
      "Chequeo de compromiso al cerrar el plan: cada persona muestra de 0 a 5 dedos según su confianza en lograr el objetivo.",
    ceremonias: ["planning"],
    objetivos: ["alinear", "detectar-riesgos"],
    duracionMin: 10,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno (en remoto: reacciones o números en chat)"],
    pasos: [
      {
        titulo: "Plantear la pregunta",
        detalle:
          "'¿Cuánta confianza tenés en que logramos el Sprint Goal con este plan?' 5 = total, 3 = con dudas, 0-1 = no lo veo.",
        duracionMin: 1,
      },
      {
        titulo: "Votar a la vez",
        detalle: "Todos muestran los dedos simultáneamente (o tipean el número juntos en el chat).",
        duracionMin: 1,
      },
      {
        titulo: "Escuchar los 3 o menos",
        detalle:
          "Quienes votaron 3 o menos explican qué les preocupa. Cada preocupación es un riesgo gratis detectado antes de empezar.",
        duracionMin: 6,
      },
      {
        titulo: "Ajustar y re-votar",
        detalle: "Si el plan cambió, segunda votación exprés. Cierre cuando no quedan 0-2.",
        duracionMin: 2,
      },
    ],
    tips: [
      "El valor está en los votos bajos: tratalos como regalos, no como objeciones.",
      "También sirve al cerrar una retro para validar las acciones acordadas.",
    ],
  },
  {
    id: "redaccion-sprint-goal",
    columns: [{ key: "candidatos", label: "Objetivos candidatos", emoji: "🎯" }],
    nombre: "Redacción del Sprint Goal",
    resumen:
      "Co-crear el objetivo del sprint: candidatos en paralelo, votación y refinado hasta una frase que el equipo pueda recitar.",
    ceremonias: ["planning"],
    objetivos: ["alinear", "priorizar"],
    duracionMin: 20,
    equipoMin: 3,
    equipoMax: 10,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero o doc compartido", "Backlog del sprint ya visible"],
    pasos: [
      {
        titulo: "Contexto del PO",
        detalle:
          "El PO resume en 2 minutos qué quiere lograr el negocio este sprint, sin proponer la frase todavía.",
        duracionMin: 3,
      },
      {
        titulo: "Candidatos en silencio",
        detalle:
          "Cada persona escribe su versión del objetivo en una frase: valor + para quién. Sin nombres de tickets.",
        duracionMin: 5,
      },
      {
        titulo: "Votar y combinar",
        detalle:
          "Dot voting sobre los candidatos. Tomen el más votado y mejórenlo con lo bueno de los otros.",
        duracionMin: 8,
      },
      {
        titulo: "Prueba de recitado",
        detalle:
          "Si alguien no puede repetir el objetivo sin leerlo, es demasiado largo. Acórtenlo.",
        duracionMin: 4,
      },
    ],
    tips: [
      "Un buen Sprint Goal cabe en un tuit y no menciona números de ticket.",
      "Escrito entre todos se defiende solo; impuesto por el PO se olvida el martes.",
    ],
  },

  // ─────────────────────────── REVIEW ───────────────────────────
  {
    id: "feria-de-demos",
    nombre: "Feria de Demos",
    resumen:
      "En lugar de una demo lineal, se arman estaciones simultáneas y los stakeholders rotan.",
    ceremonias: ["review"],
    objetivos: ["recolectar-feedback", "celebrar", "alinear"],
    duracionMin: 45,
    equipoMin: 4,
    equipoMax: 20,
    energia: "alta",
    presencial: true,
    remoto: false,
    materiales: ["Estaciones/pantallas por feature", "Stickers o formularios de feedback"],
    pasos: [
      {
        titulo: "Armar estaciones",
        detalle:
          "Cada feature terminado tiene su 'puesto' con quien lo construyó listo para mostrarlo.",
        duracionMin: 5,
      },
      {
        titulo: "Rotación libre",
        detalle:
          "Stakeholders circulan, prueban y dejan feedback en cada puesto. Más conversación, menos slides.",
        duracionMin: 30,
      },
      {
        titulo: "Cierre conjunto",
        detalle:
          "Vuelven a juntarse: highlights, feedback recurrente y próximos pasos.",
        duracionMin: 10,
      },
    ],
    tips: [
      "Energiza reviews que se volvieron presentaciones aburridas.",
      "Para equipos grandes con muchos stakeholders presenciales.",
    ],
  },
  {
    id: "muro-de-feedback",
    columns: [
      { key: "gusto", label: "Me gustó", emoji: "💚" },
      { key: "pregunto", label: "Me pregunto", emoji: "🤔" },
      { key: "ideas", label: "Ideas", emoji: "💡" },
    ],
    nombre: "Muro de Feedback",
    resumen:
      "Después de cada demo, los stakeholders vuelcan feedback en tres columnas: me gustó, me pregunto, ideas.",
    ceremonias: ["review"],
    objetivos: ["recolectar-feedback", "alinear"],
    duracionMin: 30,
    equipoMin: 4,
    equipoMax: 20,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tablero de 3 columnas visible durante las demos", "Post-its"],
    pasos: [
      {
        titulo: "Presentar el muro",
        detalle:
          "💚 Me gustó · 🤔 Me pregunto (dudas, inquietudes) · 💡 Ideas (sugerencias). Cualquiera escribe en cualquier momento.",
        duracionMin: 2,
      },
      {
        titulo: "Demos con muro abierto",
        detalle:
          "Mientras el equipo muestra, los stakeholders van dejando tarjetas sin interrumpir.",
        duracionMin: 18,
      },
      {
        titulo: "Recorrer el muro",
        detalle:
          "Al final, lean las tarjetas: respondan los 'me pregunto' y agradezcan las ideas. Lo que merece backlog, va al backlog.",
        duracionMin: 10,
      },
    ],
    tips: [
      "Captura el feedback de los que no se animan a interrumpir una demo.",
      "Las tarjetas de 'me pregunto' sin responder son input directo para el refinement.",
    ],
  },
  {
    id: "perfection-game",
    nombre: "Perfection Game",
    resumen:
      "Feedback estructurado: cada stakeholder puntúa lo demostrado de 1 a 10 y dice qué le faltó para ser un 10.",
    ceremonias: ["review"],
    objetivos: ["recolectar-feedback", "priorizar"],
    duracionMin: 25,
    equipoMin: 3,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Ninguno (opcional: planilla para registrar puntajes)"],
    pasos: [
      {
        titulo: "Explicar la regla de oro",
        detalle:
          "Solo se puede restar puntos por algo que puedas pedir concreto: 'le doy 7; para ser 10 necesitaría X e Y'. Sin pedido concreto, no se resta.",
        duracionMin: 3,
      },
      {
        titulo: "Puntuar tras cada demo",
        detalle:
          "Cada stakeholder da su puntaje y su 'para ser un 10…'. El equipo solo anota, no se defiende.",
        duracionMin: 15,
      },
      {
        titulo: "Convertir en backlog",
        detalle:
          "Los pedidos concretos se transforman en ítems de backlog priorizables. Lo vago se descarta sin culpa.",
        duracionMin: 7,
      },
    ],
    tips: [
      "Convierte la queja difusa en pedidos accionables: la regla de oro hace todo el trabajo.",
      "Registrar los puntajes sprint a sprint muestra si el producto mejora a ojos de los stakeholders.",
    ],
  },

  // ─────────────────────────── REFINEMENT ───────────────────────────
  {
    id: "example-mapping",
    nombre: "Example Mapping",
    resumen:
      "Refinás una historia con tarjetas de colores: reglas, ejemplos concretos y preguntas abiertas.",
    ceremonias: ["refinement"],
    objetivos: ["alinear", "detectar-riesgos", "priorizar"],
    duracionMin: 30,
    equipoMin: 3,
    equipoMax: 8,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Tarjetas de 4 colores (historia/regla/ejemplo/pregunta)"],
    pasos: [
      {
        titulo: "Historia en amarillo",
        detalle: "Escriban la historia de usuario en una tarjeta amarilla arriba.",
        duracionMin: 3,
      },
      {
        titulo: "Reglas en azul",
        detalle:
          "Identifiquen las reglas de negocio / criterios de aceptación como tarjetas azules.",
        duracionMin: 8,
      },
      {
        titulo: "Ejemplos en verde",
        detalle:
          "Para cada regla, escriban ejemplos concretos que la ilustren (tarjetas verdes).",
        duracionMin: 12,
      },
      {
        titulo: "Preguntas en rojo",
        detalle:
          "Toda duda sin responder va a una tarjeta roja. Muchas rojas = la historia no está lista.",
        duracionMin: 7,
      },
    ],
    tips: [
      "Una historia con pocas reglas, ejemplos claros y cero rojas está lista para el sprint.",
      "Si en ~25 min no se resuelve, la historia es demasiado grande: pártanla.",
    ],
  },
  {
    id: "magic-estimation",
    nombre: "Magic Estimation",
    resumen:
      "Estimación silenciosa y masiva: el equipo ordena decenas de historias sobre una escala sin hablar, moviendo las de los demás si no está de acuerdo.",
    ceremonias: ["refinement", "planning"],
    objetivos: ["priorizar", "alinear"],
    duracionMin: 30,
    equipoMin: 3,
    equipoMax: 10,
    energia: "alta",
    presencial: true,
    remoto: true,
    materiales: ["Escala visible (1, 2, 3, 5, 8, 13…)", "Historias en tarjetas movibles"],
    pasos: [
      {
        titulo: "Preparar la escala",
        detalle:
          "Una fila con los valores de la escala. Las historias se reparten entre las personas del equipo.",
        duracionMin: 4,
      },
      {
        titulo: "Primera pasada en silencio",
        detalle:
          "Cada persona ubica sus historias en la escala donde cree que van. Prohibido hablar.",
        duracionMin: 8,
      },
      {
        titulo: "Mover lo ajeno",
        detalle:
          "Siempre en silencio, cualquiera puede mover historias de otros. Las que rebotan ida y vuelta se marcan.",
        duracionMin: 10,
      },
      {
        titulo: "Hablar solo de las marcadas",
        detalle:
          "Recién ahora se discute, y únicamente las historias que se movieron mucho: ahí hay desacuerdo real.",
        duracionMin: 8,
      },
    ],
    tips: [
      "Estima un backlog de 30+ historias en media hora; Planning Poker tardaría toda la tarde.",
      "El silencio es la regla clave: evita el ancla del primero que opina fuerte.",
    ],
  },
  {
    id: "tres-amigos",
    nombre: "Tres Amigos",
    resumen:
      "Refinamiento en trío: negocio (PO), desarrollo y testing revisan juntos una historia desde sus tres lentes antes de darla por lista.",
    ceremonias: ["refinement"],
    objetivos: ["alinear", "detectar-riesgos"],
    duracionMin: 25,
    equipoMin: 3,
    equipoMax: 6,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Historia y criterios de aceptación visibles"],
    pasos: [
      {
        titulo: "Lente de negocio",
        detalle:
          "El PO cuenta el problema y el valor: ¿qué pasa si no lo hacemos? ¿quién lo usa?",
        duracionMin: 7,
      },
      {
        titulo: "Lente de desarrollo",
        detalle:
          "Dev plantea el cómo: alternativas técnicas, dependencias, deuda que toca de paso.",
        duracionMin: 8,
      },
      {
        titulo: "Lente de testing",
        detalle:
          "QA pregunta los bordes: ¿y si falla X? ¿con datos vacíos? Cada borde se vuelve criterio de aceptación.",
        duracionMin: 8,
      },
      {
        titulo: "Veredicto",
        detalle: "¿Lista para el sprint, necesita otra vuelta, o se parte? Se decide ahí.",
        duracionMin: 2,
      },
    ],
    tips: [
      "No hace falta que sean exactamente tres personas: importan los tres lentes.",
      "Hecho antes del planning, el poker converge mucho más rápido.",
    ],
  },
  {
    id: "rebanado-de-historias",
    nombre: "Rebanado de Historias (Story Slicing)",
    resumen:
      "Taller para partir épicas en rebanadas verticales que entregan valor: por flujo, por regla de negocio, por tipo de dato o por camino feliz/triste.",
    ceremonias: ["refinement"],
    objetivos: ["priorizar", "alinear", "mejorar-proceso"],
    duracionMin: 35,
    equipoMin: 3,
    equipoMax: 8,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: ["Épica o historia grande visible", "Lista de patrones de rebanado"],
    pasos: [
      {
        titulo: "Elegir la víctima",
        detalle: "Tomen la historia más grande del backlog próximo (toda XL es candidata).",
        duracionMin: 3,
      },
      {
        titulo: "Repasar los patrones",
        detalle:
          "Por pasos del flujo · por regla de negocio · por tipo de dato/usuario · camino feliz primero, errores después · manual antes que automático.",
        duracionMin: 5,
      },
      {
        titulo: "Rebanar en grupo",
        detalle:
          "Apliquen el patrón que mejor calce. Cada rebanada debe ser demostrable por sí sola (vertical: UI a datos).",
        duracionMin: 18,
      },
      {
        titulo: "Ordenar las rebanadas",
        detalle:
          "¿Cuál entrega más aprendizaje o valor primero? Esa entra antes. Las últimas quizás nunca hagan falta — eso es éxito, no fracaso.",
        duracionMin: 9,
      },
    ],
    tips: [
      "Rebanada vertical = algo que un usuario puede ver funcionando, no 'la parte del backend'.",
      "Si una rebanada no se puede demo-ear, no es una rebanada: es una tarea técnica disfrazada.",
    ],
  },
];

export function getDinamica(id: string): Dinamica | undefined {
  return DINAMICAS.find((d) => d.id === id);
}
