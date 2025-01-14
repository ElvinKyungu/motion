import { onMounted, onUnmounted } from 'vue'

export function useRootClick(cb: () => void) {
  const handleMouseDown = (event: MouseEvent) => {
    // Prevent selection of text:
    // https://stackoverflow.com/a/43321596
    if (event.detail > 1) {
      event.preventDefault()
    }
  }

  onMounted(() => {
    document.documentElement.addEventListener('click', cb)
    document.documentElement.addEventListener('mousedown', handleMouseDown)
  })
  onUnmounted(() => {
    document.documentElement.removeEventListener('click', cb)
    document.documentElement.removeEventListener('mousedown', handleMouseDown)
  })
}
