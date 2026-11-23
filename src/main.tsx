import { MotionConfig } from 'framer-motion'
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Presentation } from './components/presentation/Presentation'
import { PresentationProvider } from './hooks/usePresentation'
import './styles/index.css'

const PresenterView = lazy(() => import('./components/presenter/PresenterView'))

const isPresenter = window.location.pathname.startsWith('/presenter') || window.location.hash === '#presenter'
if (isPresenter) document.body.classList.add('presenter')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <PresentationProvider role={isPresenter ? 'presenter' : 'audience'}>
        {isPresenter ? (
          <Suspense fallback={null}>
            <PresenterView />
          </Suspense>
        ) : (
          <Presentation />
        )}
      </PresentationProvider>
    </MotionConfig>
  </StrictMode>,
)
