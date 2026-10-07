import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EventSimulatorModal } from './components/EventSimulatorModal'
import { MentorWidget } from './components/MentorWidget'
import { Navbar } from './components/Navbar'
import { SyncModal } from './components/SyncModal'
import { ToastContainer, type ToastData } from './components/Toast'
import { PlatformProvider, usePlatform } from './context/PlatformContext'
import { AchievementsPage } from './pages/AchievementsPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { CommunityPage } from './pages/CommunityPage'
import { CustomizationPage } from './pages/CustomizationPage'
import { DiagnosticPage } from './pages/DiagnosticPage'
import { ExperiencesPage } from './pages/ExperiencesPage'
import { ExplorePage } from './pages/ExplorePage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LoginPage } from './pages/LoginPage'
import { MarketPage } from './pages/MarketPage'
import { MentorPage } from './pages/MentorPage'
import { MissionsPage } from './pages/MissionsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProgressPage } from './pages/ProgressPage'
import { RankingPage } from './pages/RankingPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResultPage } from './pages/ResultPage'
import { SettingsPage } from './pages/SettingsPage'
import { TradingTerminalPage } from './pages/TradingTerminalPage'
import { api } from './services/api'
import type { Asset, MarketEvent, MarketOverview, Portfolio, Top10ComparisonItem, Transaction } from './types'

const MainAppContent: React.FC = () => {
  const { toasts, dismissToast, showToast } = usePlatform()
  const [assets, setAssets] = useState<Asset[]>([])
  const [top10Data, setTop10Data] = useState<Top10ComparisonItem[]>([])
  const [overview, setOverview] = useState<MarketOverview | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [events, setEvents] = useState<MarketEvent[]>([])
  const [searchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false)
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState<boolean>(false)

  const loadData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    try {
      const [assetsData, top10Res, overviewData, portfolioData, transactionsData, eventsData] =
        await Promise.all([
          api.getAssets({ limit: 300 }).catch(() => []),
          api.getTop10Comparison().catch(() => []),
          api.getMarketOverview().catch(() => null),
          api.getPortfolio().catch(() => null),
          api.getTransactions().catch(() => []),
          api.getEvents(20).catch(() => []),
        ])

      setAssets(assetsData)
      setTop10Data(top10Res)
      setOverview(overviewData)
      setPortfolio(portfolioData)
      setTransactions(transactionsData)
      setEvents(eventsData)
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(true)
  }, [loadData])

  const handleSync = async (query?: string, limit?: number) => {
    try {
      const synced = await api.syncAssets({ query, limit })
      showToast(`Sincronizados ${synced.length} videojuegos desde IGDB`, 'success')
      await loadData()
    } catch (err: any) {
      showToast(err.message || 'Error al sincronizar con IGDB', 'error')
      throw err
    }
  }

  const handleMassiveSync = async () => {
    try {
      const synced = await api.syncMassiveCatalog()
      showToast(`Catálogo masivo sincronizado: ${synced.length} títulos`, 'success')
      await loadData()
    } catch (err: any) {
      showToast(err.message || 'Error al sincronizar catálogo', 'error')
      throw err
    }
  }

  const handleEventTriggered = async (eventResult: any) => {
    showToast(`Evento: "${eventResult.title}"`, 'info')
    await loadData()
  }

  const handleTrade = async (assetId: number, action: 'BUY' | 'SELL', quantity: number) => {
    try {
      const res = await api.executeTrade({
        portfolio_id: 'default_user',
        asset_id: assetId,
        action,
        quantity,
      })
      showToast(`Orden ejecutada: $${res.transaction.total_amount.toFixed(2)}`, 'success')
      await loadData()
    } catch (err: any) {
      showToast(err.message || 'Error al procesar la orden', 'error')
      throw err
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aprender" element={<LearnPage />} />
          <Route path="/experiencias" element={<ExperiencesPage />} />
          <Route path="/misiones" element={<MissionsPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/analisis" element={<AnalysisPage />} />
          <Route path="/logros" element={<AchievementsPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/comunidad" element={<CommunityPage />} />
          <Route path="/progreso" element={<ProgressPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/personalizacion" element={<CustomizationPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/diagnostico" element={<DiagnosticPage />} />
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route path="/simulador" element={<Navigate to="/exchange" replace />} />

          <Route
            path="/exchange"
            element={
              <MarketPage
                assets={assets}
                overview={overview}
                events={events}
                top10Data={top10Data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onOpenSync={() => setIsSyncModalOpen(true)}
                onOpenSimulator={() => setIsSimulatorModalOpen(true)}
              />
            }
          />
          <Route
            path="/trade/:id"
            element={
              <TradingTerminalPage
                portfolio={portfolio}
                onTrade={handleTrade}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioPage
                portfolio={portfolio}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage
                transactions={transactions}
                isLoading={isLoading}
              />
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)] px-6 py-4 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text)]">CLEVER</span>
            <span>&bull;</span>
            <span>Plataforma de Aprendizaje y Exchange Spot</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>{assets.length} Activos Listados</span>
            <span>&bull;</span>
            <span>Entorno Práctico</span>
          </div>
        </div>
      </footer>

      <MentorWidget />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSync={handleSync}
        onMassiveSync={handleMassiveSync}
      />

      <EventSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        onEventTriggered={handleEventTriggered}
      />

      <ToastContainer toasts={toasts as ToastData[]} onDismiss={dismissToast} />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <MainAppContent />
      </BrowserRouter>
    </PlatformProvider>
  )
}

export default App
