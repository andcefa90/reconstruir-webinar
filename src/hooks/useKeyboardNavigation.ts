import { useEffect } from 'react'
import { slides } from '../data/slides'
import { usePresentation } from './usePresentation'
import { toggleFullscreen } from '../utils/fullscreen'

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

export function useKeyboardNavigation() {
  const { next, prev, goto, escape } = usePresentation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        if (isTyping(e.target)) (e.target as HTMLElement).blur()
        escape()
        return
      }
      if (isTyping(e.target)) return
      const onButton = e.target instanceof HTMLButtonElement
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          next()
          break
        case ' ':
          if (onButton) return // el botón enfocado recibe su propio click
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          goto(0)
          break
        case 'End':
          e.preventDefault()
          goto(slides.length - 1)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goto, escape])
}
