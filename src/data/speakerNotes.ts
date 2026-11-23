// Notas del presentador, frases puente y momentos [TU VIVENCIA].
// Solo visibles en /presenter. Las notas son operativas: qué hacer en pantalla.
// El desarrollo verbal sale de la Guía Maestra.

export const vivenciaQuestions = ['¿Qué pasó?', '¿Qué sentiste?', '¿Qué hiciste?', '¿Qué aprendiste?']
export const vivenciaStructure = ['Situación', 'Emoción', 'Acción', 'Aprendizaje']

export type Notes = {
  notes: string[]
  /** Frase puente hacia la siguiente slide. */
  bridge?: string
  /** Preguntas guía específicas para [TU VIVENCIA] en esta slide. */
  vivencia?: string[]
  cta?: string
}

export const speakerNotes: Record<string, Notes> = {
  cover: {
    notes: ['Deja correr la animación completa antes de hablar.', 'Preséntate en una frase. La portada se sostiene sola.'],
  },
  opening: {
    notes: [
      'Build 1: la frase completa. Léela despacio.',
      'Build 2: Cicatriz → Aprendizaje → Propósito → Reconstruir.',
    ],
  },
  tools: {
    notes: ['Hoy se trabaja. Nombra las cinco herramientas sin explicarlas todavía.', 'Puedes abrir cada una con click para dar una pista.'],
  },
  separation: {
    notes: [
      'Build 1: una familia. Build 2: dos hogares, la estructura no se destruye.',
      'Build 3: cada pérdida aparece y se desvanece. Déjalas pasar en silencio.',
      'Build 4: Reorganización.',
    ],
    vivencia: ['¿Cuál fue el momento exacto en que supiste que la separación iba en serio?'],
    bridge: 'Y cuando ya no tienes algo tan grande, lo primero que llega no es la tristeza. Es el miedo.',
  },
  fears: {
    notes: ['Build 2: los miedos llegan borrosos, sin nombre.', 'Build 3: al nombrarlos se ordenan. Esa es la idea.'],
    vivencia: ['¿Cuál de estos miedos fue el tuyo?'],
  },
  semaforo: {
    notes: ['Pregunta en qué color están hoy. Selecciona el color que más se repita en el chat.', 'Ningún color es mejor que otro.'],
    cta: 'Escribe tu color en el chat.',
    bridge: 'Para salir del miedo no es suficiente con sentirlo; hay que mirar con claridad dónde estamos parados.',
  },
  map: {
    notes: ['Build 2: el mapa se rompe.', 'Build 4: "Estás aquí" — el círculo anticipa la Rueda de la Vida.'],
  },
  wheel: {
    notes: [
      'Pulsa "Comenzar ejercicio" (2:00). Puntúa cada área de 1 a 10.',
      'Puedes arrastrar sobre la rueda o usar los controles.',
      'Build 2: área más baja / más alta y la pregunta puente.',
    ],
    cta: 'Puntúa tus 8 áreas del 1 al 10.',
    bridge: 'Ya sabemos dónde estamos. Ahora, ¿qué hago con esto hoy, no en un año?',
  },
  control: {
    notes: [
      'Click en cada elemento: lo que no controlo se aleja, lo que sí controlo se acerca.',
      '"Ordenar todo" resuelve el círculo completo. Build 2: el mensaje final.',
    ],
    bridge: 'Con los pies en el presente, ahora sí tenemos fuerza para algo que veníamos evitando: soltar.',
  },
  grief: {
    notes: ['Deja que la onda se dibuje entera.', 'Build 2: "Eso no es un retroceso."'],
    vivencia: ['¿Qué fecha o momento te devolvió al rojo?'],
  },
  griefTools: {
    notes: ['Abre cada herramienta con click. Una a la vez.', 'La Carta de despedida continúa en la siguiente slide.'],
  },
  letter: {
    notes: ['Ejercicio opcional, 3:00. Nada se envía: todo es local.', 'Invita a escribir a mano si lo prefieren.'],
    bridge: 'Hay un punto del duelo donde te das cuenta de que el dolor ya no viene de lo que pasó, sino de lo que sigues cargando.',
  },
  forgiveness: {
    notes: ['Build 2: la columna izquierda pierde peso; la derecha gana presencia.'],
  },
  biff: {
    notes: ['Build 1: mensaje Antes. Build 2: Después. Build 3: las cuatro letras.'],
    vivencia: ['¿Recuerdas un mensaje que enviaste y que hoy escribirías distinto?'],
  },
  biffTool: {
    notes: ['Pide un mensaje real (anonimizado) en el chat y transfórmalo en vivo.', 'Es una demostración: las reglas son locales, no hay IA.'],
  },
  minute10: {
    notes: ['Build 2 inicia el temporizador de 10:00.', 'Build 3: Escribe. Espera. Relee. Envía.'],
    bridge: 'Cuando hay hijos, seguimos siendo familia, pero transformada.',
  },
  coparenting: {
    notes: ['Build 2: la frase.', 'Build 3: los cinco nodos entre los dos hogares.'],
    vivencia: ['¿Qué acuerdo concreto cambió la relación de crianza?'],
  },
  board: {
    notes: ['Recorre las cuatro secciones. Todo son ejemplos, no datos reales.'],
    bridge: 'Cuando dejas de pelear por el pasado, te queda energía para la pregunta más importante: ¿y ahora, para qué?',
  },
  purpose: {
    notes: ['Build 2: las herramientas regresan y forman un solo camino.', 'Build 3: la pregunta. Silencio.'],
    vivencia: ['¿Cuál es hoy tu "para qué"?'],
  },
  commitment: {
    notes: ['El área más baja se completa con la Rueda de la Vida.', 'Pide que lo escriban y lo compartan con alguien.'],
    cta: 'Escribe tu acción de 24 horas.',
  },
  limits: {
    notes: ['Tono sereno. No alarmar.'],
  },
  closing: {
    notes: ['Deja la frase en silencio unos segundos.', 'Build 2: agradecimiento.'],
  },
  cta: {
    notes: ['Dos caminos: unirse al club o agendar sesión 1:1.', 'Comparte los enlaces en el chat.'],
    cta: 'Comparte los enlaces en el chat.',
  },
}

export const faqNotes = 'Responde según la Guía Maestra. [RESPUESTA DE LA GUÍA — completar]'
