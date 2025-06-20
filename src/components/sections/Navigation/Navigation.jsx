import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Navigation.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);  const tooltipRef = useRef(null);
  const animationRef = useRef(null);
  const lerpFactorRef = useRef(0.15);
  const velocityRef = useRef(0); // For physics-based animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial intro animation for the navigation
    gsap.fromTo(".navigation", 
      { 
        y: -20, 
        opacity: 0,
        scale: 0.98
      }, 
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      }
    );
    
    // Stagger animation for nav links
    gsap.fromTo(".nav-link", 
      { y: -10, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.08, 
        delay: 0.6, 
        duration: 0.5, 
        ease: "power2.out" 
      }
    );
    
    // Logo and contact button animations
    gsap.fromTo([".nav-logo", ".nav-contact-btn"],
      { y: -10, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        delay: 0.5, 
        ease: "power2.out" 
      }
    );
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 
  
  // Premium UX tooltip animation system with cinematic physics - adjusted for below positioning
  const animateTooltip = () => {
    if (!tooltipRef.current || !showTooltip) return;
    
    // Enhanced cinematic motion algorithm with advanced physics and easing mechanics
    const cinematicMotion = (start, end, velocity, friction = 0.85, acceleration = 0.12) => {
      // Calculate distance with directionality
      const distance = end - start;
      
      // Apply non-linear acceleration curve for more natural movement
      // Accelerates faster when further away, gentler when closer
      const distanceRatio = Math.min(1, Math.abs(distance) / 100);
      const adaptiveAcceleration = acceleration * (0.5 + distanceRatio * 0.5);
      
      // Calculate force with adaptive acceleration
      let force = distance * adaptiveAcceleration;
      
      // Apply variable friction based on velocity for better damping
      // Higher velocities get more friction for more stable deceleration
      const velocityFactor = Math.min(1, Math.abs(velocityRef.current) / 10);
      const adaptiveFriction = friction - (velocityFactor * 0.08);
      
      // Calculate new velocity with adaptive parameters
      const newVelocity = (velocityRef.current * adaptiveFriction) + force;
      
      // Apply subtle easing near target for smoother settling
      const isNearTarget = Math.abs(distance) < 10;
      const easedVelocity = isNearTarget 
        ? newVelocity * (Math.abs(distance) / 10) 
        : newVelocity;
      
      // Update reference velocity with threshold detection
      velocityRef.current = Math.abs(easedVelocity) < 0.005 ? 0 : easedVelocity;
      
      // Return new position with velocity applied
      return start + velocityRef.current;
    };
    
    // Calculate visual metrics for adaptive response
    const distance = Math.abs(targetPosition.x - tooltipPosition.x);
    const isNearTarget = distance < 5;
    
    // Calculate new position with enhanced physics
    const newX = isNearTarget ? targetPosition.x : cinematicMotion(
      tooltipPosition.x, 
      targetPosition.x, 
      velocityRef.current
    );
    
    // Update position with smooth physics-based motion
    setTooltipPosition(prev => ({
      x: newX,
      y: targetPosition.y
    }));
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animateTooltip);
  };
  
  // Premium animation orchestrator - optimized for below positioning
  useEffect(() => {
    // Create references for animation values
    velocityRef.current = 0; // Reset velocity on each show/hide cycle
    
    if (showTooltip && tooltipRef.current) {
      // Initialize tooltip position
      setTooltipPosition(targetPosition);
      
      // Create master animation director
      const director = gsap.timeline({
        defaults: { 
          ease: "power3.out", 
          overwrite: "auto"
        },
        onStart: () => {
          // Set custom properties for animation tracking
          gsap.set(tooltipRef.current, { 
            attr: { "data-animated": "true" } 
          });
        }
      });
      
      // Create advanced particle system if enabled
      if (tooltipRef.current) {
        const particleContainer = document.createElement("div");
        particleContainer.className = "tooltip-particles";
        tooltipRef.current.appendChild(particleContainer);
          // Generate enhanced decorative particles with varying sizes and colors
        for (let i = 0; i < 8; i++) { // Increased number of particles
          const particle = document.createElement("div");
          particle.className = "tooltip-particle";
          
          // Add size and color variation for more organic feel
          const size = gsap.utils.random(3, 6);
          const hue = gsap.utils.random(15, 35); // Orange-ish hues
          
          gsap.set(particle, {
            width: size,
            height: size,
            backgroundColor: `hsla(${hue}, 100%, 60%, ${gsap.utils.random(0.6, 0.9)})`,
            boxShadow: `0 0 ${size * 2}px hsla(${hue}, 100%, 60%, 0.7)`
          });
          
          particleContainer.appendChild(particle);
          
          // Animate each particle with enhanced unique trajectory
          gsap.fromTo(particle, 
            {
              opacity: 0,
              scale: 0.2,
              x: gsap.utils.random(-20, 20),
              y: gsap.utils.random(-20, -8) // Adjusted for better dispersion
            },
            {              opacity: gsap.utils.random(0.4, 0.7),
              scale: gsap.utils.random(0.4, 1),
              x: gsap.utils.random(-25, 25),
              y: gsap.utils.random(10, 30), // Positive values for particles to fall
              duration: gsap.utils.random(1, 1.5),
              delay: gsap.utils.random(0, 0.5),
              ease: "power2.out",
              repeat: -1,
              repeatRefresh: true,
              yoyo: true
            }
          );
        }
      }      // Characters are now pre-rendered in JSX for better GSAP targeting
      
      // Cinematic multi-phase entrance sequence - adapted for below positioning
      director      // Phase 1: Enhanced smooth entrance with improved 3D transform
        .fromTo(tooltipRef.current, 
          { 
            y: 25, // Start slightly further below for more dramatic entrance
            z: -25,
            opacity: 0, 
            scale: 0.85,
            rotateX: 12, // Refined rotation for smoother appearance
            transformPerspective: 800, // Increased for better 3D effect
            transformOrigin: "50% 0%", // Origin at top for below positioning
            filter: "blur(5px)" // Start with slight blur for smoother appearance
          }, 
          { 
            y: 0, 
            z: 0,
            opacity: 1, 
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.7, // Slightly longer for smoother motion
            ease: "elastic.out(1.1, 0.5)" // Elastic overshoot for more organic feel
          }
        )
        
        // Phase 2: Enhanced character animation with cascading effect - with null check
        .fromTo(tooltipRef.current ? tooltipRef.current.querySelectorAll('.tooltip-character') : [], 
          {
            opacity: 0,
            y: 15, // Characters start further down
            rotateY: 40,
            scale: 0.9,
            filter: "blur(2px)",
            stagger: { 
              amount: 0.4, // Increased stagger amount
              from: "start", // More predictable reading pattern
              ease: "power1.inOut" // Smooth stagger timing
            }
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            filter: "blur(0px)",
            stagger: { 
              amount: 0.4,
              from: "start",
              ease: "power1.inOut"
            },
            ease: "back.out(1.3)", // Back overshoot for bounce effect
            duration: 0.5,
            delay: -0.3
          }, "-=0.5")
          // Phase 3: Border glow effect animation - with null check
        .fromTo(tooltipRef.current || null, 
          { 
            boxShadow: "0 0 0 0 rgba(var(--btn-color-rgb), 0)" 
          },
          { 
            boxShadow: "0 0 20px 0 rgba(var(--btn-color-rgb), 0.3)",
            duration: 1.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
          }, "-=0.2")        
        
        // Phase 4: Enhanced organic floating animation - with null check
        .to(tooltipRef.current || null, {
          y: "-=4", // Slightly more vertical movement
          rotation: 0.3, // Very subtle rotation for organic feel
          duration: 2.2, // Longer duration for more gentle floating
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: -1.2
        })
        
        // Add subtle glow pulse for extra dimension - with null check
        .to(tooltipRef.current || null, {
          boxShadow: "0 15px 50px -8px rgba(0, 0, 0, 0.45), 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 5px 15px -3px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(var(--btn-color-rgb), 0.12)",
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: -2.0
        }, "-=2.0");// Animation has already set up the characters
      
      // Start physics-based follow animation
      animationRef.current = requestAnimationFrame(animateTooltip);
    }
    
    return () => {
      // Comprehensive cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
        // Kill all tooltip-related animations with null checks
      if (tooltipRef.current) {
        gsap.killTweensOf(tooltipRef.current);
        
        // Only kill specific animations if elements exist
        const characters = tooltipRef.current.querySelectorAll(".tooltip-character");
        if (characters.length > 0) {
          gsap.killTweensOf(characters);
        }
        
        const particles = tooltipRef.current.querySelectorAll(".tooltip-particle");
        if (particles.length > 0) {
          gsap.killTweensOf(particles);
        }
      }
      
      if (tooltipRef.current) {
        // Remove generated elements
        const particles = tooltipRef.current.querySelector('.tooltip-particles');
        if (particles) particles.remove();
      }    };
  }, [showTooltip, targetPosition]);
  
  // Function to handle mouse movement
  const handleMouseMove = (e) => {
    if (showTooltip && hoveredItem) {
      // Get nav container dimensions
      const navContainer = e.currentTarget.getBoundingClientRect();
      
      // Calculate position relative to the nav container
      const relativeX = e.clientX - navContainer.left;
      
      // Set position, ensuring it stays within the nav container
      setTargetPosition({ 
        x: relativeX,
        y: navContainer.height + 15 // Position below the nav item with spacing
      });
    }
  };  // Premium tooltip positioning system for below navigation positioning
  const handleShowTooltip = (text, element) => {
    // Store text and element references
    setTooltipText(text);
    setHoveredItem(element);
    
    // Reset physics values for clean start
    velocityRef.current = 0;
    
    // Get precise measurements for perfect positioning
    const navContainer = element.closest('.navigation').getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    
    // Calculate optimal position with smart centering
    const elementCenterX = rect.left - navContainer.left + rect.width / 2;
    const containerWidth = navContainer.width;
    
    // Calculate vertical position to show tooltip BELOW the navigation items
    // Position below with positive values
    const textLengthFactor = Math.min(1, text.length / 15);
    const navHeight = rect.height;
    
    // Position the tooltip below the navigation item with proper spacing
    // Add additional padding to ensure tooltip appears below the nav element
    const verticalOffset = navHeight + 20; // Increased spacing
    
    // Apply contextual positioning based on element position
    const edgeThreshold = 100;  // Distance from edge to be considered "near edge"
    const isNearLeftEdge = elementCenterX < edgeThreshold;
    const isNearRightEdge = containerWidth - elementCenterX < edgeThreshold;
    
    // Calculate final position with all factors considered
    let finalY = verticalOffset;
    
    // Special case adjustments for specific elements if needed
    if (element.classList.contains('nav-contact-btn')) {
      finalY += 2; // Slight adjustment for contact button
    }
    
    // Set target position with all calculations applied
    setTargetPosition({
      x: elementCenterX,
      y: finalY
    });
    
    // Create intentional micro-delay for better UX perception
    setTimeout(() => {
      setShowTooltip(true);
    }, 30);
  };// Cinematic tooltip exit sequence with advanced visual effects - adjusted for below positioning
  const handleHideTooltip = () => {
    if (tooltipRef.current) {
      // Halt all active animations for clean transition
      gsap.killTweensOf(tooltipRef.current);
      gsap.killTweensOf(".tooltip-character");
      gsap.killTweensOf(".tooltip-particle");
      
      // Create dynamic particles for exit effect
      const createExitParticles = () => {
        const particlesContainer = document.createElement("div");
        particlesContainer.className = "tooltip-exit-particles";
        tooltipRef.current.appendChild(particlesContainer);
        
        // Generate exit particles that disperse outward
        for (let i = 0; i < 8; i++) {
          const particle = document.createElement("div");
          particle.className = "tooltip-exit-particle";
          particlesContainer.appendChild(particle);
          
          // Position particles randomly around tooltip center
          gsap.set(particle, {
            left: "50%",
            top: "50%",
            width: gsap.utils.random(3, 6),
            height: gsap.utils.random(3, 6),
            opacity: gsap.utils.random(0.6, 0.9),
            backgroundColor: `rgba(var(--btn-color-rgb), ${gsap.utils.random(0.7, 1)})`,
            borderRadius: "50%"
          });
          
          // Animate particles outward and fade
          gsap.to(particle, {
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-40, 40),
            opacity: 0,
            duration: gsap.utils.random(0.6, 0.9),
            ease: "power2.out"
          });
        }
      };
      
      // Create cinematic exit director
      const director = gsap.timeline({
        onComplete: () => {
          setShowTooltip(false);
          // Clean up any remaining elements
          if (tooltipRef.current) {
            const particles = tooltipRef.current.querySelector('.tooltip-exit-particles');
            if (particles) particles.remove();
          }
        },
        defaults: { 
          overwrite: "auto",
          ease: "power3.inOut"
        }
      });
      
      // Create shockwave effect container if needed
      if (!document.querySelector('.tooltip-shockwave')) {
        const shockwave = document.createElement("div");
        shockwave.className = "tooltip-shockwave";
        tooltipRef.current.appendChild(shockwave);
      }
        // Execute sophisticated multi-phase exit choreography - adjusted for below positioning
      director
        // Phase 1: Text scatter effect - with null check
        .to(tooltipRef.current ? tooltipRef.current.querySelectorAll('.tooltip-character') : [], {
          opacity: 0,
          scale: 0.5,
          y: gsap.utils.random(-20, 20),
          x: gsap.utils.random(-20, 20),
          rotationY: gsap.utils.random(-90, 90),
          stagger: { 
            amount: 0.2,
            from: "random"
          },
          ease: "back.in(1.7)",
          duration: 0.35
        })
          // Phase 2: Anticipation effect - slight movement downward (instead of upward) - with null check
        .to(tooltipRef.current || null, {
          y: 5,
          scale: 1.05,
          duration: 0.15,
          ease: "sine.out"
        }, "-=0.2")
        
        // Phase 3: Create particle burst
        .add(() => createExitParticles())
          // Phase 4: Shockwave effect animation - with null check
        .fromTo(tooltipRef.current ? tooltipRef.current.querySelector('.tooltip-shockwave') : null, 
          {
            opacity: 0.7,
            scale: 0.1,
            borderWidth: "2px"
          },
          {
            opacity: 0,
            scale: 2,
            borderWidth: "0px",
            duration: 0.6,
            ease: "power1.out"
          }, "-=0.1")
          // Phase 5: Enhanced multi-step collapse for more dramatic exit - with null check
        .to(tooltipRef.current || null, {
          y: 5, // Small anticipation move up first
          scale: 1.03,
          duration: 0.15,
          ease: "power1.out"
        }, "-=0.45")
        .to(tooltipRef.current || null, {
          y: 30, // Then move down further
          z: -40,
          opacity: 0,
          scale: 0.8,
          rotateX: 20, // More pronounced rotation
          filter: "blur(12px)", // Increased blur for smoother fade
          transformPerspective: 800,
          transformOrigin: "50% 0%", 
          duration: 0.5, // Slightly longer for smoother exit
          ease: "power4.in" // Sharper easing for dramatic exit
        }, "-=0.05");
        
    } else {
      setShowTooltip(false);
    }
  };

  // Navigation items without Contact - it will be a separate button
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' }
  ];
  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`} onMouseMove={handleMouseMove}>
      <div className="nav-container">        
        <a 
          href="#home" 
          className="nav-logo" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={(e) => {
            handleShowTooltip('KRISHNAKUMAR', e.currentTarget);
            handleMouseMove(e);
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleHideTooltip}
        >
          KRISHNA
        </a>

        {/* Mobile Menu Button */}
        <button          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                handleShowTooltip(item.label, e.currentTarget);
                handleMouseMove(e);
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleHideTooltip}
            >
              {item.label}
            </a>
          ))}{/* Only show this contact button in mobile view */}
          <a            href="#contact" 
            className="nav-contact-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={(e) => {
              handleShowTooltip('Get in Touch', e.currentTarget);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleHideTooltip}
          >
            Contact
          </a>
        </div>
          {/* Contact button for desktop view */}
        <a          href="#contact" 
          className="nav-contact-btn desktop-only"
          onClick={() => setIsMobileMenuOpen(false)}
          onMouseEnter={(e) => {
            handleShowTooltip('Get in Touch', e.currentTarget);
            handleMouseMove(e);
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleHideTooltip}
        >
          Contact
        </a>
      </div>      {/* Tooltip Container - Now inside nav container */}      <div className="tooltip-container">
        {showTooltip && (
          <div 
            className="tooltip" 
            ref={tooltipRef} 
            role="tooltip"
            aria-live="polite"
            style={{ 
              left: `${tooltipPosition.x}px`, 
              top: `${tooltipPosition.y}px`,
              pointerEvents: 'none',
              // Dynamic width scaling with golden ratio proportions
              minWidth: tooltipText.length > 8 ? 
                `${Math.max(110, tooltipText.length * (10 - Math.min(2, tooltipText.length * 0.08)))}px` : 
                'auto'
            }}
          >            {/* Tooltip content with proper structure for GSAP animations */}
            <div className="tooltip-content" aria-hidden="false">
              <div className="tooltip-text-wrapper">
                {tooltipText.split('').map((char, index) => (
                  <span key={index} className="tooltip-character">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>    </nav>
  );
};

export default Navigation;
