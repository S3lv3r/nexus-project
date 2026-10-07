import React from 'react'
import { Navigate } from 'react-router-dom'

export const SimuladorPage: React.FC = () => {
  return <Navigate to="/exchange" replace />
}

export default SimuladorPage
