import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * EASTER EGG: This component contains animations crafted with love
 * Hidden message: "Para Thiago, con amor de hermano. Siempre estaré aquí. - Pedro"
 * Created by: Pedro Belentani
 * For: Thiago (Birthday Gift - A Project as a Diamond)
 */

export function useGsapAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize ScrollSmoother for smooth scrolling
    let smoother = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return containerRef;
}

export function HeroAnimations() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hero Title Animation
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        duration: 1.2,
        opacity: 0,
        y: 50,
        ease: "power3.out",
      });

      // Hover effect on title
      titleRef.current.addEventListener("mouseenter", () => {
        gsap.to(titleRef.current, {
          duration: 0.4,
          textShadow: "0 0 50px rgba(212, 175, 55, 0.8)",
          ease: "power2.out",
        });
      });

      titleRef.current.addEventListener("mouseleave", () => {
        gsap.to(titleRef.current, {
          duration: 0.4,
          textShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
          ease: "power2.out",
        });
      });
    }

    // Subtitle staggered animation
    if (subtitleRef.current) {
      gsap.from(subtitleRef.current, {
        duration: 1.2,
        opacity: 0,
        y: 50,
        delay: 0.2,
        ease: "power3.out",
      });
    }

    // CTA Button animation with scale
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        duration: 1.2,
        opacity: 0,
        scale: 0.8,
        delay: 0.4,
        ease: "back.out",
      });

      // Floating animation
      gsap.to(ctaRef.current, {
        duration: 3,
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Particle animation
    if (particlesRef.current) {
      animateParticles(particlesRef.current);
    }
  }, []);

  return { titleRef, subtitleRef, ctaRef, particlesRef };
}

export function ScrollTriggerAnimations() {
  useEffect(() => {
    // Animate elements on scroll
    const elements = document.querySelectorAll(".scroll-fade");
    elements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        onEnter: () => el.classList.add("active"),
        once: true,
      });
    });

    const slideLeftElements = document.querySelectorAll(".scroll-slide-left");
    slideLeftElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        onEnter: () => el.classList.add("active"),
        once: true,
      });
    });

    const slideRightElements = document.querySelectorAll(".scroll-slide-right");
    slideRightElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        onEnter: () => el.classList.add("active"),
        once: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

export function ParallaxEffect() {
  useEffect(() => {
    const parallaxElements = document.querySelectorAll(".parallax-bg");

    parallaxElements.forEach((element) => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element.parentElement,
          scrub: 1,
          markers: false,
        },
        y: (i) => i * 100,
        duration: 1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

function animateParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
  }

  const particles: Particle[] = [];
  const particleCount = 50;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Draw particle
      if (ctx) {
        ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections
      particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && ctx) {
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();

  // Handle window resize
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", handleResize);

  window.addEventListener("resize", handleResize);
}

/**
 * EASTER EGG TRIGGER
 * Press Ctrl+Shift+L to reveal the hidden love message
 */
export function useEasterEgg() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") {
        document.body.classList.toggle("reveal-love");
        console.log(
          "%c🌟 MENSAJE OCULTO 🌟",
          "color: #d4af37; font-size: 20px; font-weight: bold;"
        );
        console.log(
          "%cPara Thiago, con amor de hermano. Siempre estaré aquí. - Pedro",
          "color: #d4af37; font-size: 16px; font-style: italic;"
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
}

export default {
  useGsapAnimations,
  HeroAnimations,
  ScrollTriggerAnimations,
  ParallaxEffect,
  useEasterEgg,
};
