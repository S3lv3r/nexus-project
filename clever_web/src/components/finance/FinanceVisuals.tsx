import React from 'react'
import type { FinanceVisualKey } from './types'

/* Esquemas estáticos y sobrios. Ninguno usa datos reales de mercado: solo ilustran conceptos. */

const Figure: React.FC<{ caption: string; children: React.ReactNode }> = ({ caption, children }) => (
  <figure className="fin-figure">
    {children}
    <figcaption>{caption}</figcaption>
  </figure>
)

/** Barra horizontal dividida en segmentos proporcionales. */
const SplitBar: React.FC<{ parts: Array<{ label: string; share: number; tone: string }> }> = ({ parts }) => (
  <div className="flex h-14 overflow-hidden rounded-xl">
    {parts.map((p) => (
      <div key={p.label} className={`fin-seg ${p.tone}`} style={{ flexGrow: p.share, flexBasis: 0 }}>
        {p.label}
      </div>
    ))}
  </div>
)

/** Columnas con título y lista breve. */
const Columns: React.FC<{ cols: Array<{ title: string; items: string[]; tone?: string }> }> = ({ cols }) => (
  <div className={`grid gap-3 ${cols.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
    {cols.map((c) => (
      <div key={c.title} className={`rounded-xl p-4 ${c.tone ?? 'fin-tone-3'}`}>
        <p className="text-sm font-semibold text-[var(--text)]">{c.title}</p>
        <ul className="mt-2 space-y-1 text-[13px] leading-snug text-[var(--text-muted)]">
          {c.items.map((it) => (
            <li key={it} className="flex gap-2">
              <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-none rounded-full bg-[var(--fin)]" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

/** Línea de tiempo con etapas. */
const Timeline: React.FC<{ steps: Array<{ label: string; hint: string }> }> = ({ steps }) => (
  <ol className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
    {steps.map((s, i) => (
      <li key={s.label} className="relative pl-6 sm:pl-0 sm:pt-6">
        <span aria-hidden="true" className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--fin)] ring-4 ring-[color-mix(in_srgb,var(--fin)_16%,transparent)] sm:top-0" />
        {i < steps.length - 1 && (
          <span aria-hidden="true" className="absolute left-[4px] top-5 h-[calc(100%-0.5rem)] w-px bg-[var(--fin-line)] sm:left-5 sm:top-[4px] sm:h-px sm:w-[calc(100%-0.5rem)]" />
        )}
        <p className="text-sm font-semibold text-[var(--text)]">{s.label}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-[var(--text-muted)]">{s.hint}</p>
      </li>
    ))}
  </ol>
)

/** Curvas ilustrativas de crecimiento (sin escala numérica). */
const CompoundChart: React.FC = () => (
  <svg viewBox="0 0 320 150" className="h-auto w-full" role="img" aria-label="El interés compuesto crece cada vez más rápido que el simple">
    <g stroke="var(--border)" strokeDasharray="3 5">
      <line x1="30" x2="310" y1="40" y2="40" />
      <line x1="30" x2="310" y1="80" y2="80" />
    </g>
    <line x1="30" x2="310" y1="125" y2="125" stroke="var(--border)" />
    <path d="M30 118 L310 70" fill="none" stroke="color-mix(in srgb, var(--text) 35%, transparent)" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
    <path d="M30 118 C130 112 220 90 310 22" fill="none" stroke="var(--fin)" strokeWidth="3" strokeLinecap="round" />
    <text x="250" y="88" fontSize="11" fill="var(--text-muted)">Simple</text>
    <text x="232" y="30" fontSize="11" fill="var(--fin-strong)" fontWeight="600">Compuesto</text>
    <text x="30" y="142" fontSize="10" fill="var(--text-dim)">Inicio</text>
    <text x="268" y="142" fontSize="10" fill="var(--text-dim)">Tiempo</text>
  </svg>
)

const RiskScale: React.FC = () => {
  const items = ['Cuentas y depósitos', 'CETES y deuda gubernamental', 'Bonos corporativos', 'Fondos y ETFs', 'Acciones', 'Criptomonedas']
  return (
    <div>
      <div className="h-2 rounded-full bg-gradient-to-r from-[color-mix(in_srgb,var(--fin)_20%,var(--surface))] via-[color-mix(in_srgb,#f59e0b_35%,var(--surface))] to-[color-mix(in_srgb,#f43f5e_40%,var(--surface))]" />
      <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-[var(--text-dim)]">
        <span>Menor riesgo y rendimiento esperado</span>
        <span className="text-right">Mayor</span>
      </div>
      <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((it, i) => (
          <li key={it} className="rounded-lg bg-[var(--surface)] px-3 py-2 text-[12px] leading-snug text-[var(--text-muted)] ring-1 ring-[var(--border)]">
            <span className="block text-[10px] font-semibold text-[var(--text-dim)]">{String(i + 1).padStart(2, '0')}</span>
            {it}
          </li>
        ))}
      </ol>
    </div>
  )
}

const VISUALS: Record<FinanceVisualKey, () => React.ReactElement> = {
  'rule-50-30-20': () => (
    <Figure caption="La regla reparte el ingreso neto en tres partes. Es una referencia que puedes ajustar.">
      <SplitBar
        parts={[
          { label: '50% Necesidades', share: 50, tone: 'fin-tone-1' },
          { label: '30% Deseos', share: 30, tone: 'fin-tone-2' },
          { label: '20% Ahorro', share: 20, tone: 'fin-tone-3' },
        ]}
      />
    </Figure>
  ),
  'gross-net': () => (
    <Figure caption="Del ingreso bruto se restan retenciones; lo que queda es el ingreso neto. Proporciones ilustrativas.">
      <div className="space-y-2">
        <SplitBar parts={[{ label: 'Ingreso bruto', share: 1, tone: 'fin-tone-2' }]} />
        <SplitBar
          parts={[
            { label: 'Ingreso neto', share: 82, tone: 'fin-tone-1' },
            { label: 'Retenciones', share: 18, tone: 'fin-tone-muted' },
          ]}
        />
      </div>
    </Figure>
  ),
  'savings-horizons': () => (
    <Figure caption="Mientras más cercana la meta, más importa la disponibilidad del dinero.">
      <Timeline
        steps={[
          { label: 'Corto plazo', hint: 'Menos de 1 año · prioriza disponibilidad' },
          { label: 'Mediano plazo', hint: '1 a 5 años · equilibrio' },
          { label: 'Largo plazo', hint: 'Más de 5 años · busca crecimiento' },
        ]}
      />
    </Figure>
  ),
  'card-cycle': () => (
    <Figure caption="Ciclo de una tarjeta de crédito. Los días entre el corte y la fecha límite varían por institución.">
      <Timeline
        steps={[
          { label: 'Periodo de compras', hint: 'Usas la tarjeta durante el mes' },
          { label: 'Fecha de corte', hint: 'Se cierra el periodo y se emite el estado de cuenta' },
          { label: 'Fecha límite de pago', hint: 'Último día para pagar sin cargos por atraso' },
        ]}
      />
    </Figure>
  ),
  'risk-return': () => (
    <Figure caption="Orden general y aproximado. El riesgo real depende de cada instrumento, emisor y plazo.">
      <RiskScale />
    </Figure>
  ),
  compound: () => (
    <Figure caption="Curvas ilustrativas: con interés compuesto, los intereses también generan intereses.">
      <CompoundChart />
    </Figure>
  ),
  'debt-strategies': () => (
    <Figure caption="En ambos métodos se paga el mínimo en todas las deudas y el dinero extra va a una sola.">
      <Columns
        cols={[
          { title: 'Avalancha', items: ['Ordena por tasa de interés, de mayor a menor', 'Suele pagar menos intereses en total'], tone: 'fin-tone-2' },
          { title: 'Bola de nieve', items: ['Ordena por saldo, de menor a mayor', 'Da victorias rápidas que motivan'], tone: 'fin-tone-3' },
        ]}
      />
    </Figure>
  ),
  deductible: () => (
    <Figure caption="Reparto del ejemplo ilustrativo: deducible y coaseguro a tu cargo, el resto lo cubre la aseguradora.">
      <SplitBar
        parts={[
          { label: 'Deducible', share: 10, tone: 'fin-tone-muted' },
          { label: 'Coaseguro', share: 9, tone: 'fin-tone-3' },
          { label: 'Aseguradora', share: 81, tone: 'fin-tone-1' },
        ]}
      />
    </Figure>
  ),
  'retirement-pillars': () => (
    <Figure caption="Un retiro suele sostenerse en más de una fuente de ingresos.">
      <Columns
        cols={[
          { title: 'Pensión', items: ['Ahorro obligatorio', 'Seguridad social'], tone: 'fin-tone-2' },
          { title: 'Ahorro voluntario', items: ['Aportaciones a la afore', 'Plan Personal de Retiro'], tone: 'fin-tone-3' },
          { title: 'Patrimonio', items: ['Inversiones', 'Bienes que generan ingresos'], tone: 'fin-tone-3' },
        ]}
      />
    </Figure>
  ),
}

export const FinanceVisual: React.FC<{ visual: FinanceVisualKey }> = ({ visual }) => VISUALS[visual]()
