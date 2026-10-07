import React, { useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES } from '../data/catalog'

interface PostItem {
  id: string
  user: string
  category: string
  text: string
  reactions: number
  createdAt: number
}

const SAMPLE_POSTS: PostItem[] = [
  {
    id: 'p1',
    user: 'Valeria Morales',
    category: 'trading',
    text: 'Soporte en GTA-VI respetado en $400 con volumen sostenido. Análisis de ratio 1:3.',
    reactions: 12,
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'p2',
    user: 'Diego Ramirez',
    category: 'gaming',
    text: 'Evaluación del impacto financiero tras el anuncio de un nuevo motor gráfico en publishers.',
    reactions: 8,
    createdAt: Date.now() - 3600000 * 6,
  },
]

export const CommunityPage: React.FC = () => {
  const { user, addCommunityPost, likeCommunityPost } = usePlatform()
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [newPostText, setNewPostText] = useState('')
  const [targetCategory, setTargetCategory] = useState(user.interests[0] || 'trading')

  const storedPosts: PostItem[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('edu_community_posts') || '[]')
    } catch {
      return []
    }
  })()

  const allPosts = [...storedPosts, ...SAMPLE_POSTS]
  const filteredPosts = selectedCat === 'all'
    ? allPosts
    : allPosts.filter((p) => p.category === selectedCat)

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return
    addCommunityPost(targetCategory, newPostText.trim())
    setNewPostText('')
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Comunidad
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Comparte análisis técnicos, tesis de mercado y reflexiones conceptuales.
        </p>
      </div>

      <form onSubmit={handleCreatePost} className="platform-card p-5 space-y-3">
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="Escribe tu análisis o consulta..."
          className="platform-input resize-none text-xs"
        ></textarea>

        <div className="flex items-center justify-between gap-3">
          <select
            value={targetCategory}
            onChange={(e) => setTargetCategory(e.target.value)}
            className="bg-[var(--bg-alt)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text)]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!newPostText.trim()}
            className="platform-btn-primary py-1.5 px-4 text-xs disabled:opacity-40"
          >
            Publicar
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--primary)]'
                : 'bg-[var(--bg-alt)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            Todos
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--primary)]'
                  : 'bg-[var(--bg-alt)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          {filteredPosts.map((p) => (
            <div key={p.id} className="platform-card p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text)]">{p.user}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {p.text}
              </p>

              <div className="pt-2 border-t border-[var(--border)] flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <button
                  onClick={() => likeCommunityPost(p.id)}
                  className="hover:text-[var(--primary)] cursor-pointer text-[11px]"
                >
                  <i className="fa-regular fa-heart mr-1"></i>
                  <span>{p.reactions}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
