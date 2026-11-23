export function isFullscreen() {
  return typeof document !== 'undefined' && !!document.fullscreenElement
}

export function toggleFullscreen() {
  try {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  } catch {
    /* no soportado */
  }
}

export function openPresenter() {
  const url = `${window.location.origin}/presenter`
  window.open(url, 'reconstruir-presenter', 'width=1440,height=900')
}
