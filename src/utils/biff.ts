// Transformación BIFF (Breve, Informativo, Firme, Friendly/Amable).
// Implementación local y demostrativa basada en reglas. La interfaz permite
// sustituirla por un LLM (p. ej. un endpoint propio) sin tocar la UI.

export type BiffChange = { letter: 'B' | 'I' | 'F' | 'A'; note: string }
export type BiffResult = { original: string; rewritten: string; changes: BiffChange[] }

export interface BiffTransformer {
  transform(text: string): Promise<BiffResult>
}

const REPROACH = [
  'otra vez',
  'siempre',
  'nunca',
  'como siempre',
  'igual',
  'típico',
  'irresponsable',
  'te importa',
  'te importan',
  'no te importa',
  'qué te pasa',
  'eres un',
  'eres una',
  'por tu culpa',
  'cansad',
  'harto',
  'harta',
]

const TOPICS: [RegExp, string][] = [
  [/\b(cita|m[eé]dic|doctor|pediatra|salud)/i, 'la cita'],
  [/\b(colegio|escuela|profe|reuni[oó]n|tarea)/i, 'el colegio'],
  [/\b(pag|plata|dinero|cuota|pensi[oó]n|gasto)/i, 'el pago'],
  [/\b(recog|llev|busca|entreg|tarde|llegas|hora)/i, 'la recogida de los niños'],
  [/\b(vacacion|festivo|fin de semana|puente)/i, 'el calendario'],
]

const TIME = /\b(\d{1,2}(:\d{2})?\s?(am|pm|h)?)\b/gi
const DAY = /\b(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|hoy|mañana)\b/gi

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}

export const localBiff: BiffTransformer = {
  async transform(text) {
    const original = text.trim()
    const lower = original.toLowerCase()
    const removed = REPROACH.filter((r) => lower.includes(r))
    const topic = TOPICS.find(([re]) => re.test(original))?.[1] ?? 'los niños'
    const times = [...new Set((original.match(TIME) ?? []).filter((t) => /\d/.test(t)))]
    const days = [...new Set((original.match(DAY) ?? []).map((d) => d.toLowerCase()))]
    const when = [...days, ...times.map((t) => `a las ${t}`)].join(' ')

    const request =
      topic === 'el pago' ? '¿Me confirmas la fecha?' : topic === 'la recogida de los niños' ? '¿Me confirmas la hora?' : '¿Me confirmas?'

    const rewritten = `Hola. Sobre ${topic}${when ? ` ${when}` : ''}: ${request} Gracias.`
    const before = wordCount(original)
    const after = wordCount(rewritten)

    const changes: BiffChange[] = [
      { letter: 'B', note: after < before ? `De ${before} a ${after} palabras.` : 'Un mensaje, un solo tema.' },
      { letter: 'I', note: when ? `Solo los datos: ${topic}, ${when}.` : `Un solo tema: ${topic}.` },
      { letter: 'F', note: 'Una petición concreta, sin abrir discusión.' },
      {
        letter: 'A',
        note: removed.length ? `Saludo y gracias. Fuera: “${removed.slice(0, 3).join('”, “')}”.` : 'Saludo y gracias, tono neutro.',
      },
    ]
    return { original, rewritten, changes }
  },
}
