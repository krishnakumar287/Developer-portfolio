import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import './Hero.css';
import pattern from '../../../assets/patterns/dot-pattern.svg';

const Hero = () => {
  const heroRef = useRef(null);
  const greetingRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const primaryBtnRef = useRef(null);
  const secondaryBtnRef = useRef(null);

  useEffect(() => {
    // Split button text into characters
    const primaryText = new SplitType(primaryBtnRef.current, { types: 'chars' });
    const secondaryText = new SplitType(secondaryBtnRef.current, { types: 'chars' });

    // Ensure button text is visible by default
    gsap.set([primaryText.chars, secondaryText.chars], {
      y: 0,
      rotation: 0,
      opacity: 1
    });

    // Initial state for hero animation
    gsap.set([greetingRef.current, nameRef.current, titleRef.current, descriptionRef.current, ctaRef.current], {
      y: 30,
      opacity: 0
    });

    // Create timeline for hero entrance
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    tl.to(heroRef.current, {
      duration: 1,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: "power4.inOut"
    })
    .to(greetingRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1
    })
    .to(nameRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1
    }, "-=0.6")
    .to(titleRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1
    }, "-=0.6")
    .to(descriptionRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1
    }, "-=0.4")
    .to(ctaRef.current, {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.2
    }, "-=0.4");

    // Button hover animations
    const createButtonAnimation = (chars) => {
      // Create the animation timeline
      const tl = gsap.timeline({ paused: true });
      
      // Forward animation (hover in)
      tl.to(chars, {
        y: -15,
        rotation: 45, // Anticlockwise rotation
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        stagger: { 
          each: 0.03,
          from: "start"
        }
      })
      .fromTo(chars,
        {
          y: 20,
          rotation: -45,
          opacity: 0
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { 
            each: 0.03,
            from: "start"
          }
        },
        ">-0.25"
      );

      return tl;
    };

    // Setup primary button animation
    const primaryBtnAnimation = createButtonAnimation(primaryText.chars);
    let primaryIsAnimating = false;

    primaryBtnRef.current.addEventListener('mouseenter', () => {
      if (!primaryIsAnimating) {
        primaryIsAnimating = true;
        primaryBtnAnimation.play().then(() => {
          primaryIsAnimating = false;
        });
      }
    });

    primaryBtnRef.current.addEventListener('mouseleave', () => {
      primaryBtnAnimation.reverse();
    });

    // Setup secondary button animation
    const secondaryBtnAnimation = createButtonAnimation(secondaryText.chars);
    let secondaryIsAnimating = false;

    secondaryBtnRef.current.addEventListener('mouseenter', () => {
      if (!secondaryIsAnimating) {
        secondaryIsAnimating = true;
        secondaryBtnAnimation.play().then(() => {
          secondaryIsAnimating = false;
        });
      }
    });

    secondaryBtnRef.current.addEventListener('mouseleave', () => {
      secondaryBtnAnimation.reverse();
    });

    // Cleanup
    return () => {
      primaryText.revert();
      secondaryText.revert();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} style={{ backgroundImage: `url(${pattern})` }} id="home">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="greeting" ref={greetingRef}>Hi, I'm</span>
          <span className="name" ref={nameRef}>KRISHNAKUMAR</span>
          <span className="title" ref={titleRef}>Frontend Developer</span>
        </h1>
        <p className="hero-description" ref={descriptionRef}>
          Turning ideas into interactive realities through clean and efficient code.
        </p>
        <div className="hero-cta" ref={ctaRef}>
          <button className="btn-primary" ref={primaryBtnRef}>View Projects</button>
          <button className="btn-secondary" ref={secondaryBtnRef}>Contact Me</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
