import { lazy, Suspense, useRef } from 'react';
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
          <Suspense fallback={null}>
            <About />
            <Skills />
            <Projects />
            <Voices />
            <Contact />
            <Runner />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
