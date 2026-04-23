import { useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Ticker } from './components/sections/Ticker';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Voices } from './components/sections/Voices';
import { Runner } from './components/sections/Runner';
import { Contact } from './components/sections/Contact';
import { GradientBlobs } from './components/fx/GradientBlobs';
import { Spotlight } from './components/fx/Spotlight';
import { useAutoScrollReveal } from './hooks/useAnim';

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  useAutoScrollReveal(rootRef);

  return (
    <div ref={rootRef}>
      <GradientBlobs />
      <Spotlight />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <About />
        <Runner />
        <Skills />
        <Projects />
         
        <Voices />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
