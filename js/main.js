/**
 * Main application logic
 * - Navigation & Smooth scroll
 * - Hero particle background canvas
 * - Simulation tab switching
 * - Scroll animations
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroParticles();
  initSimTabs();
  initScrollObserver();
});

/* ================================================
   1. NAVBAR
   ================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting on scroll
    let current = "";
    const sections = document.querySelectorAll("section[id]");
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Mobile menu toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });

    links.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
      });
    });
  }
}

/* ================================================
   2. HERO PARTICLE BACKGROUND CANVAS
   ================================================ */
function initHeroParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Create positive and negative floating charges
  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 3 + 2,
      isPositive: Math.random() > 0.5,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isPositive
        ? `rgba(255, 100, 100, ${p.alpha})`
        : `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();

      // Connect close opposite particles with electric spark lines
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          let lineAlpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = p.isPositive !== p2.isPositive
            ? `rgba(124, 58, 237, ${lineAlpha * 1.5})`
            : `rgba(0, 212, 255, ${lineAlpha * 0.8})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ================================================
   3. SIMULATION TABS
   ================================================ */
function initSimTabs() {
  const tabs = document.querySelectorAll(".sim-tab");
  const panels = document.querySelectorAll(".sim-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");

        // Trigger resize event so p5 canvases adjust their container width
        window.dispatchEvent(new Event('resize'));
      }
    });
  });
}

/* ================================================
   4. SCROLL OBSERVER (REVEAL ANIMATIONS)
   ================================================ */
function initScrollObserver() {
  const cards = document.querySelectorAll(".concept-card, .ref-card, .tip-card");
  cards.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}
