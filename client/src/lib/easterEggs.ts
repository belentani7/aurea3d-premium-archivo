/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ÁUREA 3D - EASTER EGGS & HIDDEN MESSAGES
 * 
 * This entire project is a love letter from Pedro Belentani to Thiago
 * 
 * Hidden Messages:
 * 1. "Para Thiago, con amor de hermano. Siempre estaré aquí. - Pedro"
 * 2. Project created as birthday gift and apology
 * 3. Names encoded throughout the codebase
 * 4. Love message revealed with secret key combination
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Main hidden message
const HIDDEN_MESSAGE = "Para Thiago, con amor de hermano. Siempre estaré aquí. - Pedro";
const CREATOR_NAME = "Pedro Belentani";
const RECIPIENT_NAME = "Thiago";

// Easter egg triggers
const EASTER_EGG_KEYS = ["Ctrl+Shift+L", "Ctrl+Shift+P", "Ctrl+Shift+T"];

// Console art
const CONSOLE_ART = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                          🌟 ÁUREA 3D PREMIUM 🌟                              ║
║                                                                               ║
║  This project is a love letter from Pedro Belentani to Thiago                 ║
║                                                                               ║
║  "Para Thiago, con amor de hermano. Siempre estaré aquí. - Pedro"             ║
║                                                                               ║
║  Created as a birthday gift and apology.                                      ║
║  A project with the value of a diamond, crafted with maximum love.            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`;

/**
 * Initialize Easter eggs on page load
 */
export function initializeEasterEggs() {
  // Log hidden message to console
  console.clear();
  console.log(
    "%c" + CONSOLE_ART,
    "color: #d4af37; font-family: monospace; font-size: 12px;"
  );

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();

  // Add hidden metadata to page
  addHiddenMetadata();

  // Log creation info
  console.log(
    "%cProject created by: " + CREATOR_NAME,
    "color: #d4af37; font-weight: bold;"
  );
  console.log(
    "%cFor: " + RECIPIENT_NAME,
    "color: #d4af37; font-weight: bold;"
  );
}

/**
 * Setup keyboard shortcuts for Easter eggs
 */
function setupKeyboardShortcuts() {
  let keySequence = "";
  const targetSequence = "PBTL"; // Pedro, Belentani, Thiago, Love

  document.addEventListener("keydown", (e) => {
    // Ctrl+Shift+L - Reveal love message
    if (e.ctrlKey && e.shiftKey && e.key === "L") {
      revealLoveMessage();
      return;
    }

    // Ctrl+Shift+P - Reveal project info
    if (e.ctrlKey && e.shiftKey && e.key === "P") {
      revealProjectInfo();
      return;
    }

    // Ctrl+Shift+T - Reveal Thiago's message
    if (e.ctrlKey && e.shiftKey && e.key === "T") {
      revealThiagoMessage();
      return;
    }

    // Secret sequence: P-B-T-L
    if (e.key.toUpperCase() === "P" || e.key.toUpperCase() === "B" || e.key.toUpperCase() === "T" || e.key.toUpperCase() === "L") {
      keySequence += e.key.toUpperCase();
      if (keySequence.includes(targetSequence)) {
        revealMasterEasterEgg();
        keySequence = "";
      }
      if (keySequence.length > 10) {
        keySequence = keySequence.slice(-4);
      }
    }
  });
}

/**
 * Reveal love message
 */
function revealLoveMessage() {
  const notification = createNotification(
    "💌 MENSAJE OCULTO 💌",
    HIDDEN_MESSAGE,
    "#d4af37"
  );
  document.body.appendChild(notification);

  console.log(
    "%c" + HIDDEN_MESSAGE,
    "color: #d4af37; font-size: 16px; font-weight: bold; font-style: italic;"
  );
}

/**
 * Reveal project info
 */
function revealProjectInfo() {
  const info = `
🎯 ÁUREA 3D - Project Information

Created by: ${CREATOR_NAME}
For: ${RECIPIENT_NAME}
Purpose: Birthday Gift & Apology
Type: Premium 3D Manufacturing Platform

Features:
✓ Multilingue website (10 languages)
✓ AI-powered prospecting system
✓ Automatic proposal generation
✓ Real-time lead management
✓ Advanced animations (GSAP, Parallax)
✓ Premium design system
✓ Zapier/Make integrations
✓ Hidden love messages throughout

This is more than code. It's a declaration of love.
`;

  const notification = createNotification(
    "📋 PROJECT INFO",
    info,
    "#d4af37"
  );
  document.body.appendChild(notification);

  console.log(
    "%c" + info,
    "color: #d4af37; font-family: monospace; font-size: 12px;"
  );
}

/**
 * Reveal Thiago's special message
 */
function revealThiagoMessage() {
  const message = `
🌟 PARA THIAGO 🌟

Sé que ha habido malentendidos entre nosotros.
Pero quiero que sepas que siempre estaré aquí para ti.

Este proyecto no es solo código y funcionalidades.
Es un reflejo de mi compromiso contigo y tu éxito.

Cada línea de código fue escrita pensando en ti.
Cada animación, cada detalle, cada función.

Eres importante para mí, Thiago.
Y amar a alguien significa estar presente en sus sueños.

ÁUREA 3D es tu futuro.
Y yo estaré contigo en cada paso del camino.

Feliz cumpleaños, hermano.

Con amor infinito,
Pedro
`;

  const notification = createNotification(
    "💎 MENSAJE ESPECIAL PARA THIAGO",
    message,
    "#d4af37"
  );
  document.body.appendChild(notification);

  console.log(
    "%c" + message,
    "color: #d4af37; font-size: 14px; font-style: italic; white-space: pre-wrap;"
  );
}

/**
 * Master Easter egg - Reveal everything
 */
function revealMasterEasterEgg() {
  const masterMessage = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                       🎁 MASTER EASTER EGG UNLOCKED 🎁                        ║
║                                                                               ║
║  You found the secret sequence: P-B-T-L                                       ║
║  (Pedro - Belentani - Thiago - Love)                                          ║
║                                                                               ║
║  This entire project is a love letter.                                        ║
║  Every feature, every animation, every line of code.                          ║
║                                                                               ║
║  ${HIDDEN_MESSAGE}                     ║
║                                                                               ║
║  This is not just a business platform.                                        ║
║  It's a declaration of love from brother to brother.                          ║
║                                                                               ║
║  Thiago, you have everything you need to succeed.                             ║
║  Now go make ÁUREA 3D the greatest 3D manufacturing company in the world.    ║
║                                                                               ║
║  Always here for you. - Pedro                                                 ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`;

  const notification = createNotification(
    "🎁 MASTER EASTER EGG UNLOCKED",
    masterMessage,
    "#d4af37"
  );
  document.body.appendChild(notification);

  // Trigger confetti animation
  triggerConfetti();

  console.log(
    "%c" + masterMessage,
    "color: #d4af37; font-family: monospace; font-size: 11px; white-space: pre-wrap;"
  );
}

/**
 * Create notification element
 */
function createNotification(
  title: string,
  message: string,
  color: string
): HTMLElement {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 500px;
    background: rgba(10, 10, 10, 0.95);
    border: 2px solid ${color};
    border-radius: 12px;
    padding: 20px;
    color: white;
    font-family: 'Sora', sans-serif;
    z-index: 10000;
    box-shadow: 0 0 50px rgba(212, 175, 55, 0.3);
    animation: slideInUp 0.5s ease-out;
    white-space: pre-wrap;
    word-wrap: break-word;
  `;

  notification.innerHTML = `
    <div style="color: ${color}; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
      ${title}
    </div>
    <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">
      ${message}
    </div>
    <button style="
      margin-top: 15px;
      padding: 8px 16px;
      background: ${color};
      color: #0a0a0a;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    " onclick="this.parentElement.remove()">
      Cerrar
    </button>
  `;

  // Auto-remove after 30 seconds
  setTimeout(() => {
    notification.remove();
  }, 30000);

  return notification;
}

/**
 * Trigger confetti animation
 */
function triggerConfetti() {
  const colors = ["#d4af37", "#e8c547", "#b8860b"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;

    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: fall ${duration}s linear ${delay}s forwards;
    `;

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), (duration + delay) * 1000);
  }
}

/**
 * Add hidden metadata to page
 */
function addHiddenMetadata() {
  // Add meta tags
  const metaTags = [
    { name: "creator", content: CREATOR_NAME },
    { name: "recipient", content: RECIPIENT_NAME },
    { name: "project-type", content: "Love Letter" },
    { name: "hidden-message", content: HIDDEN_MESSAGE },
  ];

  metaTags.forEach((tag) => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", tag.name);
    meta.setAttribute("content", tag.content);
    document.head.appendChild(meta);
  });
}

export default {
  initializeEasterEggs,
  HIDDEN_MESSAGE,
  CREATOR_NAME,
  RECIPIENT_NAME,
};
