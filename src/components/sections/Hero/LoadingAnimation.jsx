import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./LoadingAnimation.css";

const languages = [
  "• Hello",
  "• Bonjour",
  "• Hola",
  "• Ciao",
  "• こんにちは",
  "• 你好",
  "• مرحبا"
];

export default function LoadingAnimation() {
  const textRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    // Create master timeline
    const masterTl = gsap.timeline();
    
    // Create text animation timeline
    const textTl = gsap.timeline();
    
    // Initial text position
    gsap.set(textRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 0
    });

    // Animate each language with quick transitions
    languages.forEach((lang) => {
      textTl
        .to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: "back.out(2)",
          onStart: () => {
            textRef.current.textContent = lang;
          }
        })
        .to(textRef.current, {
          opacity: 0,
          scale: 1.05,
          duration: 0.1,
          ease: "back.in(2)",
          delay: 0.05
        });
    });

    // Final fade out
    masterTl
      .add(textTl)
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut"
      }, ">=0");

    // Speed up the text timeline
    textTl.timeScale(1.2);
    textTl.play();

    return () => {
      masterTl.kill();
      textTl.kill();
    };
  }, []);

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="loading-text-container">
        <div className="loading-text" ref={textRef}>
          • Hello
        </div>
      </div>
    </div>
  );
}
