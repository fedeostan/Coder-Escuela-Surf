/**
 * Escuela de Surf - Main JavaScript
 * Author: Claude 3.7 Sonnet
 * Version: 2.0
 */

// Global state
const state = {
  currentLang: localStorage.getItem('language') || 'en',
  menuOpen: false,
  animationObserver: null,
  surfConditions: null
};

// DOM Elements
const DOM = {
  // Cached elements to be populated on DOMContentLoaded
  navbar: null,
  navToggle: null,
  navMenu: null,
  conditionsWidget: null,
  galleryItems: null,
  animatedElements: null,
  forms: {
    booking: null,
    contact: null
  }
};

/**
 * Initialize the application
 */
function init() {
  // Cache DOM elements 
  cacheElements();
  
  // Initialize features
  initLanguage();
  initNavigation();
  initAnimations();
  initForms();
  initGallery();
  initSurfConditions();
  
  // Add event listeners
  addEventListeners();
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
  DOM.navbar = document.querySelector('.navbar');
  DOM.navToggle = document.querySelector('.nav-toggle');
  DOM.navMenu = document.querySelector('.nav-menu');
  DOM.conditionsWidget = document.querySelector('.conditions-widget');
  DOM.galleryItems = document.querySelectorAll('.gallery-item');
  DOM.animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Forms
  DOM.forms.booking = document.querySelector('#booking-form');
  DOM.forms.contact = document.querySelector('#contact-form'); 
}

/**
 * Add global event listeners
 */
function addEventListeners() {
  // Navigation toggle for mobile
  if (DOM.navToggle) {
    DOM.navToggle.addEventListener('click', toggleNavigation);
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
  });
  
  // Navbar transformation on scroll
  window.addEventListener('scroll', handleScroll);
  
  // FAQ accordion if present
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', toggleFaqAnswer);
  });
  
  // Add resize listener to handle responsive adjustments
  window.addEventListener('resize', debounce(handleResize, 150));
}

/**
 * Navigation Functions
 */
function initNavigation() {
  // Add click outside to close menu
  document.addEventListener('click', (e) => {
    if (state.menuOpen && DOM.navMenu.classList.contains('active') && 
        !DOM.navMenu.contains(e.target) && 
        !DOM.navToggle.contains(e.target)) {
      toggleNavigation();
    }
  });
}

function toggleNavigation() {
  DOM.navMenu.classList.toggle('active');
  state.menuOpen = DOM.navMenu.classList.contains('active');
  
  // Animate hamburger icon to X
  if (DOM.navToggle) {
    const spans = DOM.navToggle.querySelectorAll('span');
    
    if (state.menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
  
  // Prevent body scrolling when menu is open
  document.body.style.overflow = state.menuOpen ? 'hidden' : '';
}

function handleScroll() {
  if (DOM.navbar) {
    if (window.scrollY > 50) {
      DOM.navbar.classList.add('navbar-scrolled');
    } else {
      DOM.navbar.classList.remove('navbar-scrolled');
    }
  }
}

function smoothScroll(e) {
  e.preventDefault();
  const target = document.querySelector(this.getAttribute('href'));
  if (target) {
    // Close mobile menu if open
    if (state.menuOpen) {
      toggleNavigation();
    }
    
    // Add smooth scroll with offset for fixed header
    const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Language handling
 */
function initLanguage() {
  // If translations available, update content
  if (typeof translations !== 'undefined') {
    updateContent();
  }

  // Add language switcher listener
  const langSwitcher = document.querySelector('.language-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', (e) => {
      const newLang = e.target.getAttribute('data-lang');
      if (newLang) {
        setLanguage(newLang);
      }
    });
  }
}

function setLanguage(lang) {
  state.currentLang = lang;
  localStorage.setItem('language', lang);
  updateContent();
}

function updateContent() {
  // Only update if translations exist
  if (typeof translations === 'undefined') return;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const keys = element.getAttribute('data-i18n').split('.');
    let value = translations[state.currentLang];
    
    for (const key of keys) {
      if (value) value = value[key];
    }
    
    if (value) {
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = value;
      } else {
        element.textContent = value;
      }
    }
  });
}

/**
 * Animation system
 */
function initAnimations() {
  // Set up animation observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  state.animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        state.animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add all animated elements to observer
  if (DOM.animatedElements) {
    DOM.animatedElements.forEach(element => {
      state.animationObserver.observe(element);
    });
  }
}

/**
 * Form validation
 */
function initForms() {
  // Booking form
  if (DOM.forms.booking) {
    DOM.forms.booking.addEventListener('submit', handleBookingFormSubmit);
  }

  // Contact form
  if (DOM.forms.contact) {
    DOM.forms.contact.addEventListener('submit', handleContactFormSubmit);
  }
}

function handleBookingFormSubmit(e) {
  e.preventDefault();
  
  if (validateBookingForm()) {
    submitForm(this, 'booking');
  }
}

function handleContactFormSubmit(e) {
  e.preventDefault();
  
  if (validateContactForm()) {
    submitForm(this, 'contact');
  }
}

function validateBookingForm() {
  const name = document.querySelector('#booking-name')?.value;
  const email = document.querySelector('#booking-email')?.value;
  const date = document.querySelector('#booking-date')?.value;
  const classType = document.querySelector('#booking-class')?.value;

  if (!name || !email || !date || !classType) {
    showNotification('Please fill in all required fields', 'error');
    return false;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }

  return true;
}

function validateContactForm() {
  const name = document.querySelector('#contact-name')?.value;
  const email = document.querySelector('#contact-email')?.value;
  const message = document.querySelector('#contact-message')?.value;

  if (!name || !email || !message) {
    showNotification('Please fill in all required fields', 'error');
    return false;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function submitForm(form, type) {
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.innerHTML = '<span class="loader"></span>';
  submitBtn.disabled = true;
  
  // In a real app, you would send the form data to your server here
  // For demo purposes, we'll just simulate a server response
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Show success message
    showNotification(`Your ${type} has been submitted successfully!`, 'success');
    
    // Reset form
    form.reset();
  }, 2000);
}

/**
 * Surf Conditions Widget
 */
function initSurfConditions() {
  if (DOM.conditionsWidget) {
    fetchSurfConditions();
  }
}

function fetchSurfConditions() {
  // In a real application, you would fetch from a real API
  // For demo purposes, we're simulating an API response
  
  // Show loading state
  DOM.conditionsWidget.innerHTML = '<div class="loader"></div>';
  
  // Simulate API call
  setTimeout(() => {
    const conditions = {
      waveHeight: '3-4ft',
      windSpeed: '10mph',
      windDirection: 'SW',
      waterTemp: '68°F',
      conditions: 'Good',
      updatedAt: new Date().toLocaleTimeString()
    };
    
    state.surfConditions = conditions;
    updateSurfConditions(conditions);
  }, 1500);
}

function updateSurfConditions(data) {
  if (!DOM.conditionsWidget) return;
  
  DOM.conditionsWidget.innerHTML = `
    <h3>Current Surf Conditions</h3>
    <div class="wave-height">${data.waveHeight}</div>
    <div class="conditions-details">
      <p><svg class="icon" viewBox="0 0 24 24"><path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z"></path></svg> Wind: ${data.windSpeed} ${data.windDirection}</p>
      <p><svg class="icon" viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></path></svg> Water: ${data.waterTemp}</p>
      <p><svg class="icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"></path></svg> Conditions: ${data.conditions}</p>
      <p class="text-muted update-time">Updated: ${data.updatedAt}</p>
    </div>
    <button class="btn btn-outline-primary refresh-conditions">Refresh</button>
  `;
  
  // Add refresh button listener
  DOM.conditionsWidget.querySelector('.refresh-conditions').addEventListener('click', fetchSurfConditions);
}

/**
 * Image Gallery
 */
function initGallery() {
  if (DOM.galleryItems) {
    DOM.galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        openImageModal(imgSrc);
      });
    });
  }
}

function openImageModal(imageSrc) {
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${imageSrc}" alt="Gallery Image">
    </div>
  `;
  document.body.appendChild(modal);
  
  // Prevent scrolling on body
  document.body.style.overflow = 'hidden';

  // Close on X click
  modal.querySelector('.close-modal').addEventListener('click', () => {
    closeImageModal(modal);
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeImageModal(modal);
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeImageModal(modal);
    }
  });
}

function closeImageModal(modal) {
  // Add closing animation
  modal.classList.add('closing');
  setTimeout(() => {
    modal.remove();
    document.body.style.overflow = '';
  }, 300);
}

/**
 * FAQ accordion functionality
 */
function toggleFaqAnswer() {
  const answer = this.nextElementSibling;
  const isActive = answer.classList.contains('active');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-answer.active').forEach(item => {
    if (item !== answer) {
      item.classList.remove('active');
      item.style.maxHeight = null;
      item.previousElementSibling.classList.remove('active');
    }
  });
  
  // Toggle current FAQ
  answer.classList.toggle('active');
  this.classList.toggle('active');
  
  if (!isActive) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  } else {
    answer.style.maxHeight = null;
  }
}

/**
 * Notifications System
 */
function showNotification(message, type = 'success') {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="close-notification">&times;</button>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Add close button listener
  notification.querySelector('.close-notification').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

/**
 * Window resize handler for responsive adjustments
 */
function handleResize() {
  // Close mobile menu if window resizes beyond mobile breakpoint
  if (window.innerWidth > 768 && state.menuOpen) {
    DOM.navMenu.classList.remove('active');
    state.menuOpen = false;
    document.body.style.overflow = '';
    
    // Reset toggle button
    if (DOM.navToggle) {
      const spans = DOM.navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
}

/**
 * Utility Functions
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 