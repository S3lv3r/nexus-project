import React, { useState } from 'react'

interface SyncModalProps {
  isOpen: boolean
  onClose: () => void
  onSync: (query?: string, limit?: number) => Promise<void>
  onMassiveSync: () => Promise<void>
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onSync,
  onMassiveSync,
}) => {
  const [query, setQuery] = useState<string>('')
  const limit = 20
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMassiveLoading, setIsMassiveLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const presets = [
    'Grand Theft Auto',
    'Minecraft',
    'Zelda',
    'Elden Ring',
    'Cyberpunk',
    'Pokemon',
    'Final Fantasy',
    'Call of Duty',
    'Silent Hill',
    'Resident Evil',
  ]

  const handleSync = async (searchQuery?: string) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      await onSync(searchQuery || (query.trim() ? query.trim() : undefined), limit)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al sincronizar con IGDB')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMassive = async () => {
    setIsMassiveLoading(true)
    setErrorMsg(null)
    try {
      await onMassiveSync()
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al importar catálogo masivo')
    } finally {
      setIsMassiveLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <h3 className="font-semibold text-sm text-[var(--text)] flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-down text-[var(--primary)]"></i>
            Importar Videojuegos IGDB
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer border border-[var(--border)]"
          >
            <i className="fa-solid fa-xmark text-xs font-semibold"></i>
          </button>
        </div>

        <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-database text-[var(--primary)]"></i>
              Catálogo Masivo
            </span>
            <span className="text-[10px] font-mono font-semibold bg-[var(--primary)] text-[var(--primary-text)] px-2 py-0.5 rounded">
              200+ TÍTULOS
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-normal">
            Sincroniza franquicias legendarias, esports y lanzamientos con cotizaciones históricas desde el 1 de Julio de 2026.
          </p>
          <button
            onClick={handleMassive}
            disabled={isMassiveLoading || isLoading}
            className="w-full platform-btn-primary text-xs font-semibold uppercase flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
          >
            {isMassiveLoading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-solid fa-bolt"></i>
            )}
            <span>{isMassiveLoading ? 'Sincronizando...' : 'Sincronizar Catálogo Masivo'}</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[var(--border)]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-medium text-[var(--text-muted)]">O Búsqueda Específica</span>
          <div className="flex-grow border-t border-[var(--border)]"></div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
              Buscar juego en IGDB
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. Silent Hill 2, GTA VI, Metaphor..."
              className="w-full platform-input px-3 py-2 text-xs text-[var(--text)]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-medium text-[var(--text-muted)] mb-1.5">
              Sugerencias
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuery(preset)}
                  className="px-2.5 py-1 bg-[var(--surface-alt)] hover:bg-[var(--border)] rounded text-[var(--text)] text-[11px] font-medium transition-colors cursor-pointer border border-[var(--border)]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              type="button"
              className="platform-btn-secondary text-xs"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSync()}
              disabled={isLoading || isMassiveLoading || !query.trim()}
              type="button"
              className="platform-btn-primary text-xs"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className="fa-solid fa-magnifying-glass"></i>
              )}
              <span>Buscar e Importar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
