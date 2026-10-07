import React from 'react'
import { usePlatform } from '../context/PlatformContext'

interface LeaderboardUser {
  name: string
  username: string
  level: number
  levelLabel: string
  xp: number
  streak: number
  isMe?: boolean
}

const BASE_LEADERBOARD: LeaderboardUser[] = [
  { name: 'Valeria Morales', username: 'valeriam', level: 12, levelLabel: 'Estratega', xp: 5400, streak: 24 },
  { name: 'Diego Ramirez', username: 'diegor', level: 10, levelLabel: 'Analista', xp: 4200, streak: 18 },
  { name: 'Sofia Torres', username: 'sofiat', level: 9, levelLabel: 'Analista', xp: 3850, streak: 15 },
  { name: 'Andres Paredes', username: 'andresp', level: 7, levelLabel: 'Aprendiz', xp: 2600, streak: 11 },
  { name: 'Camila Gomez', username: 'camilag', level: 6, levelLabel: 'Aprendiz', xp: 2150, streak: 9 },
]

export const RankingPage: React.FC = () => {
  const { user } = usePlatform()

  const myUser: LeaderboardUser = {
    name: user.name || user.username,
    username: user.username,
    level: user.level,
    levelLabel: user.levelLabel,
    xp: (user.level - 1) * 500 + user.xp,
    streak: user.streak,
    isMe: true,
  }

  const combined = [...BASE_LEADERBOARD, myUser].sort((a, b) => b.xp - a.xp)

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Ranking Global
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Clasificación basada en experiencia acumulada y constancia de estudio.
          </p>
        </div>
      </div>

      <div className="platform-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[var(--bg-alt)] border-b border-[var(--border)] text-[var(--text-muted)] font-mono text-[10px] uppercase">
              <th className="py-2.5 px-4 w-12 text-center">#</th>
              <th className="py-2.5 px-4">Usuario</th>
              <th className="py-2.5 px-4">Nivel</th>
              <th className="py-2.5 px-4 text-center">Racha</th>
              <th className="py-2.5 px-4 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono">
            {combined.map((u, i) => (
              <tr
                key={u.username}
                className={u.isMe ? 'bg-[var(--surface)] font-bold text-[var(--primary)]' : ''}
              >
                <td className="py-3 px-4 text-center text-[var(--text-muted)]">{i + 1}</td>
                <td className="py-3 px-4 font-sans font-medium text-[var(--text)]">
                  {u.name} {u.isMe && <span className="text-[10px] text-[var(--primary)]">(Tú)</span>}
                </td>
                <td className="py-3 px-4 text-[var(--text-muted)] font-sans">{u.levelLabel} (Nv. {u.level})</td>
                <td className="py-3 px-4 text-center text-[var(--text-muted)]">{u.streak}D</td>
                <td className="py-3 px-4 text-right text-[var(--text)] font-semibold">{u.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
