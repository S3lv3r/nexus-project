export type CardAvatarShape = 'circle' | 'rounded' | 'hexagon'

export interface ProfileCardData {
  shape?: CardAvatarShape
  displayName: string
  username: string
  lessonsDone: number
  lessonsTotal: number
  topicsDone: number
  topicsTotal: number
  progress: number
  currentTopicLabel: string
  avatar?: string
  initials: string
  colorA: string
  colorB: string
  status: string
}

const CARD_WIDTH = 1200
const CARD_HEIGHT = 630
const FONT_FAMILY = 'Inter, system-ui, -apple-system, Segoe UI, sans-serif'

const readAccent = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
  return value || '#0a84c6'
}

const readCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const resolveColor = (value: string, fallback: string) => {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value
  return fallback
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    image.src = src
  })

const drawCard = (
  canvas: HTMLCanvasElement,
  data: ProfileCardData,
  avatarImage: HTMLImageElement | null
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo crear la tarjeta')

  const colorA = resolveColor(data.colorA, resolveColor(readCssVar('--grad-a'), readAccent()))
  const colorB = resolveColor(data.colorB, resolveColor(readCssVar('--grad-b'), '#6366f1'))

  const background = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
  background.addColorStop(0, colorA)
  background.addColorStop(1, colorB)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  ctx.fillStyle = 'rgba(255,255,255,0.10)'
  ctx.beginPath()
  ctx.arc(1050, 90, 260, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.beginPath()
  ctx.arc(120, 600, 280, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,255,255,0.94)'
  ctx.beginPath()
  ctx.roundRect(60, 60, CARD_WIDTH - 120, CARD_HEIGHT - 120, 36)
  ctx.fill()

  const avatarSize = 190
  const avatarX = 120
  const avatarY = 130

  const traceAvatarShape = () => {
    ctx.beginPath()
    const shape = data.shape || 'rounded'
    if (shape === 'circle') {
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
    } else if (shape === 'hexagon') {
      const points: [number, number][] = [
        [0.25, 0.05],
        [0.75, 0.05],
        [1, 0.5],
        [0.75, 0.95],
        [0.25, 0.95],
        [0, 0.5],
      ]
      points.forEach(([px, py], index) => {
        const x = avatarX + px * avatarSize
        const y = avatarY + py * avatarSize
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
    } else {
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, avatarSize * 0.26)
    }
  }

  ctx.save()
  traceAvatarShape()
  ctx.clip()
  if (avatarImage) {
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize)
  } else {
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize)
    ctx.fillStyle = '#0f172a'
    ctx.font = `700 72px ${FONT_FAMILY}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(data.initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 4)
  }
  ctx.restore()

  ctx.lineWidth = 8
  ctx.lineJoin = 'round'
  ctx.strokeStyle = colorA
  traceAvatarShape()
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#0f172a'
  ctx.font = `800 64px ${FONT_FAMILY}`
  ctx.fillText(data.displayName.slice(0, 22), 350, 195)

  ctx.fillStyle = '#64748b'
  ctx.font = `500 30px ${FONT_FAMILY}`
  ctx.fillText(`@${data.username}`, 352, 245)

  ctx.font = `700 24px ${FONT_FAMILY}`
  const pillText = data.currentTopicLabel.slice(0, 34)
  const pillWidth = Math.min(640, ctx.measureText(pillText).width + 48)
  ctx.fillStyle = colorA
  ctx.beginPath()
  ctx.roundRect(352, 270, pillWidth, 48, 24)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillText(pillText, 376, 303)

  if (data.status) {
    ctx.fillStyle = '#334155'
    ctx.font = `italic 500 26px ${FONT_FAMILY}`
    ctx.fillText(data.status, 352, 365)
  }

  const stats = [
    { label: 'Lecciones', value: `${data.lessonsDone}/${data.lessonsTotal}` },
    { label: 'Temas', value: `${data.topicsDone}/${data.topicsTotal}` },
    { label: 'Avance', value: `${data.progress}%` },
    { label: 'Curso', value: data.progress >= 100 ? 'Listo' : 'En curso' },
  ]

  const boxWidth = 235
  const boxGap = 24
  stats.forEach((stat, index) => {
    const x = 120 + index * (boxWidth + boxGap)
    const y = 420
    ctx.fillStyle = '#f1f5f9'
    ctx.beginPath()
    ctx.roundRect(x, y, boxWidth, 120, 22)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.font = `800 46px ${FONT_FAMILY}`
    ctx.textAlign = 'center'
    ctx.fillText(stat.value, x + boxWidth / 2, y + 62)
    ctx.fillStyle = '#64748b'
    ctx.font = `500 22px ${FONT_FAMILY}`
    ctx.fillText(stat.label, x + boxWidth / 2, y + 98)
  })

  ctx.textAlign = 'right'
  ctx.fillStyle = colorA
  ctx.font = `700 24px ${FONT_FAMILY}`
  ctx.fillText('CLEVER plataforma', CARD_WIDTH - 110, 120)
}

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('No se pudo generar la imagen'))
    }, 'image/png')
  })

export const exportProfileCard = async (data: ProfileCardData) => {
  let avatarImage: HTMLImageElement | null = null
  if (data.avatar) {
    try {
      avatarImage = await loadImage(data.avatar)
    } catch {
      avatarImage = null
    }
  }

  const buildBlob = async (image: HTMLImageElement | null) => {
    const canvas = document.createElement('canvas')
    canvas.width = CARD_WIDTH
    canvas.height = CARD_HEIGHT
    drawCard(canvas, data, image)
    return canvasToBlob(canvas)
  }

  let blob: Blob
  try {
    blob = await buildBlob(avatarImage)
  } catch {
    blob = await buildBlob(null)
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `clever-${data.username || 'perfil'}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}