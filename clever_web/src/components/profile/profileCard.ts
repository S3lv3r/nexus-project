import { toPng } from 'html-to-image'

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const waitForImages = async (node: HTMLElement) => {
  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map((image) =>
      image.complete && image.naturalWidth > 0
        ? Promise.resolve()
        : image.decode().catch(() => undefined),
    ),
  )
}

export const exportCredentialImage = async (node: HTMLElement, username: string) => {
  if (document.fonts?.ready) await document.fonts.ready
  await waitForImages(node)
  await nextFrame()
  await nextFrame()

  const background = getComputedStyle(node.closest('.note-home') || document.body).getPropertyValue('--bg').trim() || '#ffffff'
  const options = { pixelRatio: 3, cacheBust: true, backgroundColor: background, style: { margin: '0' } }
  let dataUrl: string
  try {
    dataUrl = await toPng(node, options)
  } catch {
    dataUrl = await toPng(node, { ...options, skipFonts: true })
  }

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `clever-credencial-${username || 'perfil'}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
