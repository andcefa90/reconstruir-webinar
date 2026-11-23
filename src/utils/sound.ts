// Sonido opcional, sintetizado (sin archivos). Desactivado por defecto.
export type SoundKind = 'transition' | 'complete' | 'timer'

let ctx: AudioContext | null = null

function tone(freq: number, start: number, length: number, gain: number) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length)
  osc.connect(g).connect(ctx.destination)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + length + 0.05)
}

export function playSound(kind: SoundKind) {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    if (kind === 'transition') tone(392, 0, 0.5, 0.025)
    if (kind === 'complete') {
      tone(523.25, 0, 0.6, 0.035)
      tone(659.25, 0.12, 0.8, 0.03)
    }
    if (kind === 'timer') {
      tone(440, 0, 1.4, 0.04)
      tone(660, 0.02, 1.2, 0.015)
    }
  } catch {
    /* audio no disponible: silencio */
  }
}
