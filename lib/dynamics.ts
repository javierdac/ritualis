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

  // ──────────────── ICEBREAKERS: conocerse / descontracturar ────────────────
  {
    id: "dos-verdades-una-mentira",
    nombre: "Dos Verdades y Una Mentira",
    resumen:
      "Cada persona dice tres afirmaciones sobre sí; el resto adivina cuál es la mentira.",
    ceremonias: ["retro", "daily", "planning", "review", "refinement"],
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
    ceremonias: ["retro", "daily", "review"],
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

  // ─────────────────────────── DAILY ───────────────────────────
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
];

export function getDinamica(id: string): Dinamica | undefined {
  return DINAMICAS.find((d) => d.id === id);
}
