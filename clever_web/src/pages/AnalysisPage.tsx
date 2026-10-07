import React from 'react'
import { Link } from 'react-router-dom'

export const AnalysisPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Análisis Técnico
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Guía práctica para la interpretación de gráficos de precios y estructuras de mercado.
          </p>
        </div>

        <Link
          to="/exchange"
          className="platform-btn-secondary py-1.5 px-3 text-xs self-start sm:self-auto"
        >
          Ver gráficos en vivo
        </Link>
      </div>

      <div className="platform-card p-6 space-y-6">
        <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
          Estructura de una Vela Japonesa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] rounded flex justify-around items-center">
            <div className="text-center space-y-2">
              <div className="text-xs font-semibold text-emerald-400">Vela Alcista</div>
              <div className="w-12 h-32 mx-auto flex flex-col items-center justify-center">
                <div className="w-0.5 h-6 bg-emerald-400"></div>
                <div className="w-8 h-16 bg-emerald-500 rounded-sm flex items-center justify-center text-[9px] text-black font-bold">
                  Cuerpo
                </div>
                <div className="w-0.5 h-6 bg-emerald-400"></div>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">Cierre &gt; Apertura</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-xs font-semibold text-rose-400">Vela Bajista</div>
              <div className="w-12 h-32 mx-auto flex flex-col items-center justify-center">
                <div className="w-0.5 h-6 bg-rose-400"></div>
                <div className="w-8 h-16 bg-rose-500 rounded-sm flex items-center justify-center text-[9px] text-white font-bold">
                  Cuerpo
                </div>
                <div className="w-0.5 h-6 bg-rose-400"></div>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">Cierre &lt; Apertura</div>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
            <p>
              El cuerpo muestra la diferencia entre el precio de apertura y el de cierre. Las mechas señalan los precios extremos alcanzados durante el periodo evaluado.
            </p>
            <p>
              Una mecha inferior pronunciada sugiere que los compradores lograron rechazar precios más bajos antes del cierre.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="platform-card p-5 space-y-2">
          <h3 className="text-xs font-bold text-[var(--text)]">
            Soportes y Resistencias
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Niveles horizontales donde históricamente se concentra la oferta o la demanda frenando movimientos.
          </p>
        </div>

        <div className="platform-card p-5 space-y-2">
          <h3 className="text-xs font-bold text-[var(--text)]">
            Tendencias de Mercado
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Sucesiones estructurales de máximos y mínimos ascendentes (alcistas) o descendentes (bajistas).
          </p>
        </div>

        <div className="platform-card p-5 space-y-2">
          <h3 className="text-xs font-bold text-[var(--text)]">
            Oscilador RSI
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Mide la velocidad del precio. Valores sobre 70 indican sobrecompra; bajo 30 señalan sobreventa.
          </p>
        </div>
      </div>
    </div>
  )
}
