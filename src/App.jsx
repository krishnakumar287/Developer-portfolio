import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import LoadingAnimation from './components/sections/Hero/LoadingAnimation';
import Navigation from './components/sections/Navigation/Navigation';
import Hero from './components/sections/Hero/Hero';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const appRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Create fade out animation for loading screen with snappier timing
      gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          setLoading(false);
          // Fade in the main content with snappier timing
          gsap.from(appRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
    }, 2000); // Reduced to 2000ms for a faster experience

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingAnimation />;

  return (
    <main className="app" ref={appRef}>
      <Navigation />
      <Hero />
      {/* Other sections will be added here */}
    </main>
  );
}

export default App
