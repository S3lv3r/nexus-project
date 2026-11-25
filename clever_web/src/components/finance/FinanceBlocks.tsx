import React from 'react'
import { HUD_ICONS } from '../hud/HudIcons'
import type { FinanceFormula, FinanceSection, FinanceTable } from './types'

/* Piezas de lectura reutilizables para los artículos de Finanzas personales. */

const Info = HUD_ICONS.info
const Clock = HUD_ICONS.clock

export const Bullets: React.FC<{ items: string[]; ordered?: boolean }> = ({ items, ordered }) =>
  ordered ? (
    <ol className="fin-ol">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ol>
  ) : (
    <ul className="fin-ul">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  )

export const DataTable: React.FC<{ table: FinanceTable }> = ({ table }) => (
  <figure className="fin-datatable">
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {table.caption && <figcaption>{table.caption}</figcaption>}
  </figure>
)

export const Formula: React.FC<{ formula: FinanceFormula }> = ({ formula }) => (
  <div className="fin-formula">
    <p className="fin-section-label">Fórmula</p>
    <p className="fin-formula-expr">{formula.expression}</p>
    <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
      {formula.variables.map((v) => (
        <React.Fragment key={v.symbol}>
          <dt className="font-semibold text-[var(--text)]">{v.symbol}</dt>
          <dd className="text-[var(--text-muted)]">{v.meaning}</dd>
        </React.Fragment>
      ))}
    </dl>
    {formula.steps && (
      <>
        <p className="fin-section-label mt-4">Paso a paso</p>
        <Bullets items={formula.steps} ordered />
      </>
    )}
  </div>
)

export const Callout: React.FC<{ title: string; text: string; icon?: 'info' | 'clock' }> = ({ title, text, icon = 'info' }) => {
  const Icon = icon === 'clock' ? Clock : Info
  return (
    <aside className="fin-note flex gap-3 px-5 py-4">
      <Icon className="mt-0.5 h-[18px] w-[18px] flex-none text-[var(--fin)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{text}</p>
      </div>
    </aside>
  )
}

/** Un apartado de la explicación. */
export const Section: React.FC<{ section: FinanceSection }> = ({ section }) => (
  <section className="fin-prose space-y-4">
    <h3 className="fin-h3">{section.heading}</h3>
    {section.paragraphs?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
    {section.list && <Bullets items={section.list} ordered={section.ordered} />}
    {section.table && <DataTable table={section.table} />}
    {section.formula && <Formula formula={section.formula} />}
    {section.callout && <Callout title="Importante" text={section.callout} />}
  </section>
)
