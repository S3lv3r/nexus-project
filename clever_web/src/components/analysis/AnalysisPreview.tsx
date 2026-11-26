import React from 'react'

const BARS = [38, 62, 48, 74, 56, 88, 64, 92, 70, 84, 58, 76, 66, 90]

const Lines: React.FC<{ widths: string[] }> = ({ widths }) => (
  <div className="space-y-2.5">
    {widths.map((width, index) => (
      <span key={index} className="block h-2.5 rounded-full bg-[color-mix(in_srgb,var(--text)_14%,transparent)]" style={{ width }}></span>
    ))}
  </div>
)

const Candles: React.FC = () => (
  <svg viewBox="0 0 420 160" className="h-full w-full" preserveAspectRatio="none">
    {[40, 80, 120].map((y) => (
      <line key={y} x1="0" x2="420" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
    ))}
    {BARS.map((height, index) => {
      const x = 18 + index * 28
      const down = index % 4 === 2
      const top = 150 - height
      return (
        <g key={index}>
          <line x1={x} x2={x} y1={top - 12} y2={top + height * 0.55 + 10} stroke={down ? 'var(--danger)' : 'var(--success)'} strokeWidth="2" />
          <rect x={x - 7} y={top} width="14" height={height * 0.55} rx="2" fill={down ? 'var(--danger)' : 'var(--success)'} />
        </g>
      )
    })}
    <path d="M10 120 C80 90 120 110 180 70 S300 60 410 30" fill="none" stroke="var(--primary)" strokeWidth="3" />
  </svg>
)

export const AnalysisPreview: React.FC = () => (
  <div className="grid h-full gap-5 p-6 lg:grid-cols-[14rem_1fr]">
    <div className="hidden flex-col gap-3 lg:flex">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <span className="h-9 w-9 rounded-xl bg-[color-mix(in_srgb,var(--primary)_30%,transparent)]"></span>
          <span className="h-2.5 flex-1 rounded-full bg-[color-mix(in_srgb,var(--text)_16%,transparent)]"></span>
        </div>
      ))}
    </div>
    <div className="grid gap-5 lg:grid-rows-2">
      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <span className="mb-5 block h-5 w-2/3 rounded-full bg-[color-mix(in_srgb,var(--text)_22%,transparent)]"></span>
          <Lines widths={['92%', '86%', '74%', '80%', '58%']} />
        </div>
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <Candles />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="mb-4 block h-10 w-10 rounded-2xl bg-[color-mix(in_srgb,var(--primary)_28%,transparent)]"></span>
            <Lines widths={['70%', '90%', '64%']} />
          </div>
        ))}
      </div>
    </div>
  </div>
)
