# RECONSTRUIR — Después de la separación

Experiencia web de presentación para el webinar (~60 min). React + TypeScript + Vite + Tailwind 4 + Framer Motion.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
```

## Uso en vivo

| Tecla | Acción |
|---|---|
| → / Espacio / AvPág | Siguiente build o slide |
| ← / RePág | Anterior |
| Inicio / Fin | Primera / última slide |
| Esc | Cierra la interacción abierta o la slide de apoyo |
| F | Pantalla completa |

- **Barra de control**: aparece al mover el ratón (reloj, timer del ejercicio, presentador, sonido, pantalla completa).
- **Modo presentador**: botón de la barra o `/presenter`. Se abre en otra ventana del mismo navegador y se sincroniza sola (BroadcastChannel): slide actual y siguiente, reloj, ritmo frente al tiempo recomendado, timer, notas, frase puente, `[TU VIVENCIA]`, CTA y slides de apoyo (FAQ).
- **Sonido**: desactivado por defecto.
- No avanza solo: cada slide tiene *builds* que controla quien presenta.

## Dónde editar

- `src/data/presentation.ts` — todo el texto visible.
- `src/data/slides.ts` — orden, capítulo, transición, builds, minutos recomendados y timers.
- `src/data/speakerNotes.ts` — notas, frases puente y preguntas de `[TU VIVENCIA]`.
- Logo: pon el archivo en `public/` y asigna `presentation.logoSrc`.
- BIFF: `src/utils/biff.ts` implementa `BiffTransformer` con reglas locales (demo). Sustitúyelo por un transformador con LLM sin tocar la UI.

## Pendiente de validar con la Guía Maestra

- Descripciones breves de las tres herramientas de duelo y de las cinco herramientas (marcadas `TODO(guía)`).
- Frases de validación del semáforo (dirección creativa).
- En qué slides va `[TU VIVENCIA]` y sus preguntas guía.
- Respuestas a las FAQ (solo se muestra la pregunta).
- Minutos recomendados por slide y duración de los timers que no fija la guía.
- `[ TU NOMBRE ]` en la portada.
