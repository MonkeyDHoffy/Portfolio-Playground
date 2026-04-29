import { lazy, Suspense, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Ticker } from './components/sections/Ticker';
import { GradientBlobs } from './components/fx/GradientBlobs';
import { Spotlight } from './components/fx/Spotlight';
import { ScrollbarController } from './components/fx/ScrollbarController';
import { useAutoScrollReveal } from './hooks/useAnim';

const About    = lazy(() => import('./components/sections/About').then(m => ({ default: m.About })));
const Skills   = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects })));
const Voices   = lazy(() => import('./components/sections/Voices').then(m => ({ default: m.Voices })));
const Contact  = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact })));
const Runner   = lazy(() => import('./components/sections/Runner').then(m => ({ default: m.Runner })));

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  useAutoScrollReveal(rootRef);

  useEffect(() => {
    const preload = () => {
      import('./components/sections/About');
      import('./components/sections/Skills');
      import('./components/sections/Projects');
      import('./components/sections/Voices');
      import('./components/sections/Contact');
      import('./components/sections/Runner');
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    idle ? idle(preload) : setTimeout(preload, 200);
  }, []);

  return (
    <div ref={rootRef} className="app-shell">
      <GradientBlobs />
      <Spotlight />
      <ScrollbarController />
      <div className="content-layer">
        <Header />
        <main>
          <Hero />
          <Ticker />
          <Suspense fallback={null}><About /></Suspense>
          <Suspense fallback={null}><Skills /></Suspense>
          <Suspense fallback={null}><Projects /></Suspense>
          <Suspense fallback={null}><Voices /></Suspense>
          <Suspense fallback={null}><Contact /></Suspense>
          <Suspense fallback={null}><Runner /></Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
