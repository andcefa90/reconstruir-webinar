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
  // hash en lugar de ruta: funciona también en hosting estático (GitHub Pages)
  const url = `${window.location.origin}${import.meta.env.BASE_URL}#presenter`
  window.open(url, 'reconstruir-presenter', 'width=1440,height=900')
}
