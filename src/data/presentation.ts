// Contenido visible de la presentación.
// Fuente: Guía Maestra del Webinar "Reconstrucción después de la Separación".
// Todo lo marcado con TODO(guía) es una formulación breve que debe validarse
// contra la guía original antes de presentar.

export const presentation = {
  title: 'RECONSTRUIR',
  subtitle: 'Después de la separación',
  brand: 'Club de Separados',
  presenterName: '[ TU NOMBRE ]',
  /** Ruta a un logo real (p. ej. '/logo.svg' en /public). null = placeholder tipográfico. */
  logoSrc: null as string | null,

  chapters: [
    'Ruptura',
    'Desorientación',
    'Claridad',
    'Control',
    'Soltar',
    'Perdonar',
    'Reorganizar',
    'Propósito',
    'Reconstruir',
  ],

  opening: {
    quote: [
      { t: 'No venimos a hablar de qué hacer para que no duela, sino de cómo sanar y reconstruir desde la ' },
      { t: 'cicatriz', em: true },
      { t: ', el ' },
      { t: 'aprendizaje', em: true },
      { t: ' y el ' },
      { t: 'propósito', em: true },
      { t: '.' },
    ],
    words: ['Cicatriz', 'Aprendizaje', 'Propósito'],
    finalWord: 'Reconstruir',
  },

  tools: {
    title: 'Hoy no vienes solamente a escuchar.',
    subtitle: 'Vienes a trabajar.',
    items: [
      { name: 'Rueda de la Vida', hint: 'Ver dónde estás hoy, área por área.' },
      { name: 'Círculo de Control', hint: 'Separar lo que depende de ti de lo que no.' },
      { name: 'BIFF', hint: 'Comunicarte: breve, informativo, firme y amable.' },
      { name: 'Ritual de Cierre', hint: 'Soltar con un gesto concreto.' },
      { name: 'Compromiso de 24 horas', hint: 'Una acción pequeña y concreta.' },
    ],
  },

  separation: {
    before: 'Una familia',
    after: 'Dos hogares',
    statement: 'Tu familia no se rompió, se reorganizó en dos hogares.',
    lossesIntro: 'La separación también puede implicar pérdida de',
    losses: ['Proyecto de vida', 'Rutina', 'Casa compartida', 'Planes', 'Identidad', 'Amigos', 'Familia política'],
    finalWord: 'Reorganización',
  },

  fears: {
    line1: 'El miedo guardado paraliza.',
    line2: 'El miedo nombrado se puede trabajar.',
    items: ['Economía', 'Hijos', 'Soledad', 'Qué dirán'],
  },

  semaforo: {
    kicker: 'Semáforo emocional',
    question: '¿Dónde estás hoy?',
    always: 'Todos los colores son válidos.',
    states: [
      { id: 'red', label: 'Sobreviviendo', color: 'var(--color-signal-red)', tint: '#a5483c', validation: 'Estás aquí. Eso ya cuenta.' },
      { id: 'yellow', label: 'Estabilizándome', color: 'var(--color-signal-amber)', tint: '#c49a45', validation: 'Paso a paso también se llega.' },
      { id: 'green', label: 'Reconstruyendo', color: 'var(--color-signal-green)', tint: '#5f7d5c', validation: 'Sigue. A tu ritmo.' },
    ],
  },

  map: {
    before: 'Sabía hacia dónde iba.',
    question: '¿Y ahora qué?',
    insight: 'La incertidumbre aparece cuando perdemos el mapa.',
    next: 'Primero necesitamos saber dónde estamos.',
    here: 'Estás aquí',
  },

  wheel: {
    kicker: 'Rueda de la Vida',
    title: '¿Dónde estás hoy?',
    areas: [
      'Emocional',
      'Salud física',
      'Hijos y crianza',
      'Economía',
      'Trabajo / estudio',
      'Red de apoyo',
      'Espiritualidad / sentido',
      'Tiempo para ti',
    ],
    question: '¿Qué área necesita más de ti ahora?',
    lowLabel: 'Área más baja',
    highLabel: 'Área más alta',
    bridge: '¿Puede tu área más fuerte ayudar a levantar la más débil?',
  },

  control: {
    kicker: 'Círculo de Control',
    center: 'Yo',
    outLabel: 'Lo que no controlo',
    inLabel: 'Lo que sí controlo',
    outside: ['Lo que piensa mi ex', 'Sus horarios', 'Su nueva vida', 'Sus decisiones', 'Su tono'],
    inside: ['Mi respuesta', 'Mi paz', 'Mis hábitos', 'Mi cuerpo', 'Cómo recibo a mis hijos'],
    message: 'No todo merece tu energía.',
  },

  grief: {
    kicker: 'El duelo',
    line1: 'Un día estás en verde y una fecha te devuelve al rojo.',
    line2: 'Eso no es un retroceso.',
    green: 'Verde',
    red: 'Rojo',
  },

  griefTools: {
    kicker: 'Tres herramientas para soltar',
    items: [
      // TODO(guía): validar las descripciones breves con la Guía Maestra.
      { name: 'Contacto cero emocional', hint: 'El contacto que quede, solo el necesario. Sin revisar, sin buscar, sin reabrir.' },
      { name: 'Ritual de cierre físico', hint: 'Un gesto concreto que marque el final de una etapa.' },
      { name: 'Carta de despedida', hint: 'Poner en palabras lo que termina y lo que te permites recibir.' },
    ],
  },

  letter: {
    title: 'Lo que me permito recibir ahora.',
    prompts: [
      'Me despido del proyecto de vida que soñé, que incluía…',
      'Lo que agradezco de esa etapa fue…',
      'Lo que me duele soltar es…',
      'Lo que me permito recibir ahora es…',
    ],
    privacy: 'Lo que escribes se queda en este dispositivo. No se envía a ningún lugar.',
    save: 'Guardar temporalmente',
    clear: 'Borrar',
    saved: 'Guardado en este navegador',
  },

  forgiveness: {
    title: 'Perdonar no es olvidar.',
    noLabel: 'Perdonar no es',
    yesLabel: 'Perdonar sí es',
    no: ['Decir que estuvo bien', 'Reconciliarse', 'Olvidar'],
    yes: ['Decidir no cargar más la deuda', 'Recuperar energía', 'Dejar de vivir atrapado en lo ocurrido'],
  },

  biff: {
    beforeLabel: 'Antes',
    afterLabel: 'Después',
    before: '¿Otra vez llegas tarde? Siempre igual, ¿te importan algo los niños?',
    after: 'Hola, los niños tienen cita a las 4:00. Por favor recógelos a las 3:30. Gracias.',
    letters: [
      { l: 'B', word: 'Breve' },
      { l: 'I', word: 'Informativo' },
      { l: 'F', word: 'Firme' },
      { l: 'F', word: 'Friendly / Amable' },
    ],
    toolPlaceholder: 'Escribe un mensaje…',
    toolButton: 'Transformar con BIFF',
    disclaimer: 'Esto es una herramienta educativa de comunicación. No sustituye asesoría legal.',
  },

  minute10: {
    headline: 'No respondas todavía.',
    steps: ['Escribe.', 'Espera.', 'Relee.', 'Envía.'],
  },

  coparenting: {
    from: 'Ex pareja',
    to: 'Socios de crianza',
    quote: 'La pareja se termina; la paternidad/maternidad es para siempre.',
    nodes: ['Calendario', 'Dinero', 'Salud', 'Colegio', 'Reglas'],
  },

  board: {
    kicker: 'Tablero de coparentalidad',
    sections: [
      { id: 'calendar', name: 'Calendario', items: ['Días de cada hogar', 'Festivos', 'Vacaciones'] },
      { id: 'money', name: 'Dinero', items: ['Qué paga cada uno', 'Cómo se reporta'] },
      { id: 'health', name: 'Salud y colegio', items: ['Citas', 'Reuniones', 'Información'] },
      { id: 'rules', name: 'Reglas básicas', items: ['Sueño', 'Pantallas', 'Comida'] },
    ],
  },

  purpose: {
    line1: 'Cuando dejas de pelear por el pasado,',
    line2: 'te queda energía para preguntar:',
    question: '¿Y ahora, para qué?',
    recap: ['Rueda', 'Control', 'Duelo', 'BIFF', 'Coparentalidad'],
  },

  commitment: {
    title: 'Mi próxima acción',
    fields: ['Mi área más baja es:', 'En las próximas 24 horas voy a:', 'Se lo voy a contar a:'],
    counter: '24 horas',
    button: 'Asumo este compromiso',
    done: 'Un pequeño movimiento también es movimiento.',
  },

  limits: {
    kicker: 'Recomendaciones y límites',
    main: 'Esta charla es educativa y de acompañamiento; no reemplaza la terapia psicológica ni la asesoría legal.',
    tools: 'Las herramientas de coparentalidad y BIFF están pensadas para conflictos sin violencia.',
    safety: 'Si existe violencia, amenazas o riesgo, la prioridad es la seguridad y la búsqueda de ayuda profesional y legal.',
  },

  closing: {
    line1: 'Tu paz',
    line2: 'no es negociable.',
    thanks: 'Gracias por estar aquí hoy.',
  },

  cta: [
    { n: '01', label: 'Unirme al Club de Separados' },
    { n: '02', label: 'Agendar sesión 1:1' },
  ],

  faq: [
    'Mi ex me provoca todo el tiempo.',
    'Mis hijos no quieren ir con el otro padre/madre.',
    'Mi ex tiene nueva pareja y me duele.',
    '¿Cuánto dura el duelo?',
    '¿Y si me siento culpable?',
    'No tengo plata para terapia.',
  ],
}

/** Microcopy de dirección creativa (no son citas de la guía). */
export const microcopy = {
  breathe: 'Respira.',
  oneThing: 'Empieza por una cosa.',
  noRush: 'No necesitas resolverlo todo hoy.',
}
