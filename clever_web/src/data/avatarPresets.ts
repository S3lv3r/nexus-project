export interface AvatarPreset {
  id: string
  name: string
  url: string
}

type HairStyle = 'short' | 'long' | 'bun' | 'curly' | 'cap' | 'buzz' | 'none'

type Accessory = 'none' | 'glasses' | 'headphones'

interface HumanConfig {
  skin: string
  skinShade: string
  hair: string
  shirt: string
  style: HairStyle
  accessory: Accessory
  bgA: string
  bgB: string
  capColor?: string
}

const wrapSvg = (inner: string, bgA: string, bgB: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient></defs><rect width="128" height="128" fill="url(#bg)"/>${inner}</svg>`

const SHORT_HAIR = 'M37 62 C33 36 44 19 64 19 C84 19 95 34 91 60 C89 52 86 47 82 44 C75 49 61 50 50 44 C46 49 41 54 37 62 Z'

const LONG_FRINGE = 'M37 66 C32 34 46 19 64 19 C82 19 96 34 91 66 C88 53 82 45 74 41 C68 46 57 48 47 44 C43 50 39 57 37 66 Z'

const BUZZ_HAIR = 'M39 54 C37 30 50 23 64 23 C78 23 91 30 89 54 C86 44 78 38 64 38 C50 38 42 44 39 54 Z'

const buildHuman = (config: HumanConfig) => {
  const { skin, skinShade, hair, shirt, style, accessory, bgA, bgB, capColor } = config

  const backHair =
    style === 'long'
      ? `<path d="M33 66 C27 22 101 22 95 66 L99 110 L29 110 Z" fill="${hair}"/>`
      : ''

  const frontHair = (() => {
    if (style === 'short') return `<path d="${SHORT_HAIR}" fill="${hair}"/>`
    if (style === 'long') return `<path d="${LONG_FRINGE}" fill="${hair}"/>`
    if (style === 'buzz') return `<path d="${BUZZ_HAIR}" fill="${hair}"/>`
    if (style === 'bun') return `<circle cx="64" cy="16" r="11" fill="${hair}"/><path d="${SHORT_HAIR}" fill="${hair}"/>`
    if (style === 'curly') {
      const circles = [
        [42, 44, 12],
        [54, 36, 13],
        [66, 34, 13],
        [78, 38, 13],
        [88, 48, 11],
        [40, 56, 8],
        [88, 58, 8],
      ]
      return circles.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hair}"/>`).join('')
    }
    if (style === 'cap') {
      const cap = capColor || hair
      return `<path d="M36 46 H48 V60 C46 66 43 71 40 72 C37 66 36 58 36 50 Z" fill="${hair}"/><path d="M92 46 H80 V60 C82 66 85 71 88 72 C91 66 92 58 92 50 Z" fill="${hair}"/><path d="M35 54 C35 21 93 21 93 54 Z" fill="${cap}"/><path d="M32 52 H100 C100 60 90 60 84 57 H32 Z" fill="${cap}" opacity="0.85"/>`
    }
    return ''
  })()

  const accessories =
    accessory === 'glasses'
      ? '<g fill="none" stroke="#111827" stroke-width="2.4"><circle cx="54" cy="60" r="8"/><circle cx="74" cy="60" r="8"/><path d="M62 60 H66"/></g>'
      : accessory === 'headphones'
        ? '<path d="M35 58 C35 14 93 14 93 58" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/><rect x="29" y="54" width="11" height="19" rx="5.5" fill="#0f172a"/><rect x="88" y="54" width="11" height="19" rx="5.5" fill="#0f172a"/><circle cx="34.5" cy="63" r="2" fill="#38bdf8"/><circle cx="93.5" cy="63" r="2" fill="#38bdf8"/>'
        : ''

  const inner = `${backHair}<path d="M14 128 C14 98 38 88 64 88 C90 88 114 98 114 128 Z" fill="${shirt}"/><rect x="55" y="74" width="18" height="20" rx="7" fill="${skinShade}"/><ellipse cx="64" cy="58" rx="25" ry="28" fill="${skin}"/>${frontHair}<circle cx="54" cy="61" r="2.8" fill="#1f2937"/><circle cx="74" cy="61" r="2.8" fill="#1f2937"/><path d="M56 71 Q64 78 72 71" fill="none" stroke="#1f2937" stroke-width="2.6" stroke-linecap="round"/><circle cx="47" cy="68" r="4" fill="#f87171" opacity="0.28"/><circle cx="81" cy="68" r="4" fill="#f87171" opacity="0.28"/>${accessories}`

  return wrapSvg(inner, bgA, bgB)
}

const buildRobot = () =>
  wrapSvg(
    '<path d="M20 128 C20 104 40 96 64 96 C88 96 108 104 108 128 Z" fill="#f8fafc"/><rect x="40" y="16" width="5" height="18" rx="2.5" fill="#0f172a"/><rect x="83" y="16" width="5" height="18" rx="2.5" fill="#0f172a"/><rect x="30" y="30" width="68" height="62" rx="28" fill="#f8fafc"/><circle cx="28" cy="60" r="7" fill="#0f172a"/><circle cx="100" cy="60" r="7" fill="#0f172a"/><rect x="38" y="42" width="52" height="38" rx="18" fill="#0b101d"/><ellipse cx="53" cy="60" rx="5" ry="9" fill="#ffffff"/><path d="M81 53 L70 60 L81 67" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="64" cy="108" r="4" fill="#38bdf8"/>',
    '#bae6fd',
    '#6366f1'
  )

const buildCat = () =>
  wrapSvg(
    '<path d="M14 128 C14 100 38 92 64 92 C90 92 114 100 114 128 Z" fill="#fed7aa"/><path d="M34 52 L38 20 L60 38 Z" fill="#f97316"/><path d="M94 52 L90 20 L68 38 Z" fill="#f97316"/><path d="M40 44 L42 29 L53 39 Z" fill="#fda4af"/><path d="M88 44 L86 29 L75 39 Z" fill="#fda4af"/><ellipse cx="64" cy="64" rx="31" ry="28" fill="#fb923c"/><ellipse cx="64" cy="74" rx="17" ry="12" fill="#ffedd5"/><circle cx="52" cy="62" r="3.2" fill="#1f2937"/><circle cx="76" cy="62" r="3.2" fill="#1f2937"/><path d="M60 70 H68 L64 75 Z" fill="#f472b6"/><path d="M64 75 V79 M64 79 Q58 83 54 80 M64 79 Q70 83 74 80" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/><path d="M36 70 H22 M36 76 L23 80 M92 70 H106 M92 76 L105 80" stroke="#7c2d12" stroke-width="1.8" stroke-linecap="round"/>',
    '#fde68a',
    '#f97316'
  )

const toDataUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const RAW_PRESETS: { id: string; name: string; svg: string }[] = [
  {
    id: 'nova',
    name: 'Nova',
    svg: buildHuman({ skin: '#f1c27d', skinShade: '#d9a45f', hair: '#3b2f2f', shirt: '#6366f1', style: 'short', accessory: 'none', bgA: '#c7d2fe', bgB: '#6366f1' }),
  },
  {
    id: 'luna',
    name: 'Luna',
    svg: buildHuman({ skin: '#e0ac69', skinShade: '#c48d4d', hair: '#1f1720', shirt: '#ec4899', style: 'long', accessory: 'none', bgA: '#fbcfe8', bgB: '#ec4899' }),
  },
  {
    id: 'orion',
    name: 'Orion',
    svg: buildHuman({ skin: '#8d5524', skinShade: '#70431c', hair: '#111827', shirt: '#0ea5e9', style: 'curly', accessory: 'glasses', bgA: '#bae6fd', bgB: '#0ea5e9' }),
  },
  {
    id: 'sol',
    name: 'Sol',
    svg: buildHuman({ skin: '#ffdbb4', skinShade: '#eab98a', hair: '#92400e', shirt: '#fb923c', style: 'cap', accessory: 'none', bgA: '#fed7aa', bgB: '#f97316', capColor: '#f97316' }),
  },
  {
    id: 'rio',
    name: 'Río',
    svg: buildHuman({ skin: '#c68642', skinShade: '#a96d30', hair: '#78350f', shirt: '#10b981', style: 'bun', accessory: 'headphones', bgA: '#a7f3d0', bgB: '#10b981' }),
  },
  {
    id: 'kai',
    name: 'Kai',
    svg: buildHuman({ skin: '#f1c27d', skinShade: '#d9a45f', hair: '#1f2937', shirt: '#14b8a6', style: 'short', accessory: 'glasses', bgA: '#99f6e4', bgB: '#14b8a6' }),
  },
  {
    id: 'zoe',
    name: 'Zoe',
    svg: buildHuman({ skin: '#ffdbb4', skinShade: '#eab98a', hair: '#b45309', shirt: '#8b5cf6', style: 'long', accessory: 'headphones', bgA: '#ddd6fe', bgB: '#8b5cf6' }),
  },
  {
    id: 'max',
    name: 'Max',
    svg: buildHuman({ skin: '#8d5524', skinShade: '#70431c', hair: '#3b2417', shirt: '#ef4444', style: 'buzz', accessory: 'headphones', bgA: '#fecaca', bgB: '#ef4444' }),
  },
  { id: 'kor', name: 'Kor', svg: buildRobot() },
  { id: 'mishi', name: 'Mishi', svg: buildCat() },
]

export const AVATAR_PRESETS: AvatarPreset[] = RAW_PRESETS.map((preset) => ({
  id: preset.id,
  name: preset.name,
  url: toDataUrl(preset.svg),
}))

export const getDefaultAvatarPreset = (username: string): AvatarPreset => {
  const seed = (username || 'guest').split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return AVATAR_PRESETS[seed % AVATAR_PRESETS.length]
}

const backgroundKey = (svg: string) => (svg.match(/stop-color="(#[0-9a-fA-F]{3,8})"/g) || []).join('|')

const PRESET_BY_BACKGROUND = new Map(RAW_PRESETS.map((preset, index) => [backgroundKey(preset.svg), AVATAR_PRESETS[index]]))

export const normalizeAvatar = (avatar: string | null | undefined): string | null => {
  if (!avatar) return null
  if (!avatar.startsWith('data:image/svg+xml') || AVATAR_PRESETS.some((preset) => preset.url === avatar)) return avatar
  try {
    const svg = decodeURIComponent(avatar.slice(avatar.indexOf(',') + 1))
    return PRESET_BY_BACKGROUND.get(backgroundKey(svg))?.url || avatar
  } catch {
    return avatar
  }
}

export const resolveAvatarSrc = (avatar: string | null | undefined, username: string): string =>
  normalizeAvatar(avatar) || getDefaultAvatarPreset(username).url
