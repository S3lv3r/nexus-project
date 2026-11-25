import type { TeamMember } from '../types'
import { carlosAvelino } from './carlos-avelino'
import { carlosRuiz } from './carlos-ruiz'
import { cristianHernandez } from './cristian-hernandez'
import { emilianoBriones } from './emiliano-briones'
import { fernandoFlores } from './fernando-flores'
import { julianCana } from './julian-cana'
import { leonardoSanchez } from './leonardo-sanchez'
import { oscarDelgado } from './oscar-delgado'
import { robertoGallegos } from './roberto-gallegos'

export const LEAD: TeamMember = cristianHernandez

export const TEAM: TeamMember[] = [
  robertoGallegos,
  leonardoSanchez,
  fernandoFlores,
  carlosAvelino,
  oscarDelgado,
  emilianoBriones,
  julianCana,
  carlosRuiz,
]

export const MEMBERS: TeamMember[] = [LEAD, ...TEAM]

export const findMember = (slug: string | undefined) => MEMBERS.find((member) => member.slug === slug)
