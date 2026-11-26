import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { PageTutorial } from './components/PageTutorial'
import { ToastContainer, type ToastData } from './components/Toast'
import { LockedSection } from './components/LockedSection'
import { PlatformProvider, usePlatform } from './context/PlatformContext'
import { AboutPage } from './pages/AboutPage'
import { AnalysisPreview } from './components/analysis/AnalysisPreview'
import { CustomizationPage } from './pages/CustomizationPage'
import { DiagnosticPage } from './pages/DiagnosticPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LoginPage } from './pages/LoginPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProgressPage } from './pages/ProgressPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResultPage } from './pages/ResultPage'
import { SettingsPage } from './pages/SettingsPage'
import { TermsPage } from './pages/TermsPage'
import { loadMemberPage } from './components/about/preload'
import { TOTAL_LESSONS, TOTAL_TOPICS } from './data/course'
import { useProfileCustomization } from './services/profileCustomizationService'

const REMOVED_PATHS = ['/experiencias', '/misiones', '/mentor', '/logros', '/ranking', '/comunidad', '/explorar', '/simulador', '/exchange', '/trade/:id', '/portfolio', '/history', '/analisis/acciones', '/analisis/criptos', '/analisis/*']

const MemberPage = lazy(() => loadMemberPage().then((m) => ({ default: m.MemberPage })))

const MainAppContent: React.FC = () => {
  const { toasts, dismissToast, user, isGuest } = usePlatform()
  const [customization] = useProfileCustomization(user.username)
  const hasRail = !isGuest && customization.navStyle === 'sidebar'

  return (
    <div className={`flex flex-col min-h-screen text-[var(--text)] pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 ${hasRail ? 'md:pl-[76px]' : ''}`}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aprender" element={<LearnPage />} />
          <Route path="/conocenos" element={<AboutPage />} />
          <Route
            path="/conocenos/:slug"
            element={
              <Suspense fallback={null}>
                <MemberPage />
              </Suspense>
            }
          />
          <Route
            path="/analisis"
            element={
              <LockedSection
                heading="Análisis Técnico"
                title="Este módulo se abrirá muy pronto"
                message="Estamos terminando el Análisis Técnico para que llegue completo. Mientras tanto, avanza en tus lecciones: todo lo que aprendas ahí te servirá aquí."
              >
                <AnalysisPreview />
              </LockedSection>
            }
          />
          <Route path="/progreso" element={<ProgressPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/personalizacion" element={<CustomizationPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
          <Route path="/diagnostico" element={<DiagnosticPage />} />
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          {REMOVED_PATHS.map((path) => (
            <Route key={path} path={path} element={<Navigate to={path.startsWith('/analisis') ? '/analisis' : '/'} replace />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <PageTutorial />

      <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)] px-6 py-4 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text)]">CLEVER</span>
            <span>&bull;</span>
            <span>Plataforma de aprendizaje en trading, blockchain y finanzas digitales</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <Link to="/terminos" className="font-semibold text-[var(--text)] underline-offset-4 hover:text-[var(--primary)] hover:underline">
              Términos y condiciones
            </Link>
            <span>&bull;</span>
            <span className="font-mono">{TOTAL_TOPICS} temas</span>
            <span>&bull;</span>
            <span className="font-mono">{TOTAL_LESSONS} lecciones</span>
          </div>
        </div>
      </footer>

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
