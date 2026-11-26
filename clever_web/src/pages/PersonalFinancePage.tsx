import React from 'react'
import { FinanceHud } from '../components/finance/FinanceHud'

/**
 * Finanzas personales: recurso de aprendizaje autodidacta.
 * Categorías en la barra lateral, subtemas en la barra inferior y el contenido de lectura al centro.
 */
export const PersonalFinancePage: React.FC = () => (
  <FinanceHud
    header={
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">Finanzas personales</h1>
        <p className="mt-1 text-sm tracking-tight text-[var(--text-muted)] sm:text-base">
          Aprende a administrar, proteger y hacer crecer tu dinero, a tu ritmo y por temas.
        </p>
      </div>
    }
  />
)
