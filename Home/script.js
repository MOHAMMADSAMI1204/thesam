// script.js - Main Website Functionality

// ---------------------- FOOTER ----------------------
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

// ---------------------- NOTIFICATIONS ----------------------
function showNotification(message, type = 'info') {
  // Remove any existing notifications to prevent overlap
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  });

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add styles if not already in CSS
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(15, 27, 51, 0.95);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out forwards;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    max-width: 350px;
    border-left: 4px solid #76c7ff;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  // Type-specific styles
  if (type === 'success') {
    notification.style.borderLeftColor = '#4CAF50';
    notification.style.background = 'rgba(76, 175, 80, 0.15)';
    notification.style.borderColor = 'rgba(76, 175, 80, 0.3)';
  } else if (type === 'error') {
    notification.style.borderLeftColor = '#F44336';
    notification.style.background = 'rgba(244, 67, 54, 0.15)';
    notification.style.borderColor = 'rgba(244, 67, 54, 0.3)';
  } else if (type === 'info') {
    notification.style.borderLeftColor = '#76c7ff';
    notification.style.background = 'rgba(33, 150, 243, 0.15)';
    notification.style.borderColor = 'rgba(33, 150, 243, 0.3)';
  }

  document.body.appendChild(notification);

  // Add CSS animations if not already defined
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100px);
          opacity: 0;
        }
      }
      
      .notification.fade-out {
        animation: slideOutDown 0.5s ease-out forwards !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Auto remove after delay
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }
  }, 4000);
}



// ---------------------- HERO TYPING EFFECT ----------------------
const dynamicText = document.querySelector("h2 span");
const words = [
  { 
    text: "YOUTUBER", 
    gradient: "linear-gradient(135deg, #FF0000, #f73636ff, #FF0000)",
    glow: "0 0 20px rgba(255, 0, 0, 0.47), 0 0 40px rgba(255, 0, 0, 0.37), 0 0 60px rgba(255, 0, 0, 0.19)"
  },
  { 
    text: "GAMER", 
    gradient: "linear-gradient(135deg, #5cbfe4, #1E90FF, #104E8B)",
    glow: "0 0 20px rgba(30, 143, 255, 0.56), 0 0 40px rgba(30, 143, 255, 0.1), 0 0 60px rgba(30, 144, 255, 0.3)"
  },
  { 
    text: "DEVELOPER", 
    gradient: "linear-gradient(135deg, #4CAF50, #2E8B57, #006400)",
    glow: "0 0 20px rgba(76, 175, 79, 0.56), 0 0 40px rgba(76, 175, 79, 0.29), 0 0 60px rgba(76, 175, 79, 0.16)"
  }
];

let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  if (!dynamicText) return;
  
  const currentWord = words[wordIndex];
  dynamicText.style.background = currentWord.gradient;
  dynamicText.style.webkitBackgroundClip = "text";
  dynamicText.style.backgroundClip = "text";
  dynamicText.style.webkitTextFillColor = "transparent";
  dynamicText.style.textShadow = currentWord.glow; // Add glowing effect
  dynamicText.style.transition = "text-shadow 0.5s ease"; // Smooth transition

  const text = currentWord.text;
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  dynamicText.textContent = text.substring(0, charIndex);

  // Slower typing speeds
  let typingSpeed = isDeleting ? 100 : 200;
  let pauseTime = isDeleting ? 700 : 1500;

  if (!isDeleting && charIndex === text.length) {
    isDeleting = true;
    setTimeout(typeEffect, pauseTime);
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 800);
    return;
  }
  setTimeout(typeEffect, typingSpeed);
}

// Add CSS for enhanced glow effect
if (!document.querySelector('#typing-glow-styles')) {
  const style = document.createElement('style');
  style.id = 'typing-glow-styles';
  style.textContent = `
    .water-card h2 .text {
      position: relative;
      display: inline-block;
      font-weight: 600;
      min-width: 120px;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: text-shadow 0.3s ease;
      animation: pulse-glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes pulse-glow {
      from {
        filter: brightness(1);
      }
      to {
        filter: brightness(1.2);
      }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------- RIPPLE EFFECT ----------------------
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size/2) + 'px';
    r.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

// ---------------------- DROPS & SHINE ----------------------
const dropsContainer = document.querySelector('.drops');
if (dropsContainer) {
  for (let i = 0; i < 20; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left = (Math.random()*110-5)+'%';
    d.style.top = (Math.random()*140-20)+'%';
    const size = 24 + Math.random()*120;
    d.style.width = d.style.height = size+'px';
    d.style.opacity = (0.06+Math.random()*0.22).toString();
    const duration = (10 + Math.random()*22);
    d.style.setProperty('--t', duration+'s');
    d.style.animationDelay = (Math.random()*duration*-1)+'s';
    dropsContainer.appendChild(d);
  }
}

const shine = document.querySelector('.shine');
if (shine) {
  window.addEventListener('mousemove', e => {
    const x = (e.clientX/window.innerWidth)*100;
    const y = (e.clientY/window.innerHeight)*100;
    shine.style.setProperty('--x', x+'%');
    shine.style.setProperty('--y', y+'%');
  });
}

// ---------------------- MOBILE MENU TOGGLE ----------------------
function setupMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
      });
    });
  }
}

// ---------------------- SMOOTH SCROLLING ----------------------
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ---------------------- LAZY LOADING ----------------------
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ---------------------- PERFORMANCE OPTIMIZATION ----------------------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ---------------------- INITIALIZATION ----------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script.js loaded - Main website functionality initialized');
  
  // Set up loyalty points refresh
  const refreshPointsBtn = document.getElementById('refresh-points');
  if (refreshPointsBtn) {
    refreshPointsBtn.addEventListener('click', refreshLoyaltyPoints);
  }

  // Start typing effect
  setTimeout(typeEffect, 1000);

  // Setup mobile menu
  setupMobileMenu();

  // Setup smooth scrolling
  setupSmoothScrolling();

  // Setup lazy loading
  setupLazyLoading();

  // Test notification system
  setTimeout(() => {
    console.log('Testing notification system...');
    // Only show test notification if no user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      showNotification('Welcome to THE SAM!', 'success');
    }
  }, 2000);
});

// ---------------------- OFFLINE DETECTION ----------------------
window.addEventListener('online', () => {
  showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
  showNotification('You are currently offline', 'error');
});

// ---------------------- EXPORT FUNCTIONS FOR GLOBAL USE ----------------------
window.showNotification = showNotification;
window.refreshLoyaltyPoints = refreshLoyaltyPoints;