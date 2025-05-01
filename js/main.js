// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling for navigation links
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

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
        });
    });

    // Booking Form Validation
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateBookingForm()) {
                // Here you would typically send the form data to your server
                alert('Booking request submitted successfully!');
                this.reset();
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                // Here you would typically send the form data to your server
                alert('Message sent successfully!');
                this.reset();
            }
        });
    }

    // Initialize surf conditions widget
    initializeSurfConditions();
});

// Form Validation Functions
function validateBookingForm() {
    const name = document.querySelector('#booking-name').value;
    const email = document.querySelector('#booking-email').value;
    const date = document.querySelector('#booking-date').value;
    const classType = document.querySelector('#booking-class').value;

    if (!name || !email || !date || !classType) {
        alert('Please fill in all required fields');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

function validateContactForm() {
    const name = document.querySelector('#contact-name').value;
    const email = document.querySelector('#contact-email').value;
    const message = document.querySelector('#contact-message').value;

    if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Surf Conditions Widget
function initializeSurfConditions() {
    // This is a placeholder for the actual API integration
    // You would typically fetch real data from a surf conditions API
    const conditionsWidget = document.querySelector('.conditions-widget');
    if (conditionsWidget) {
        // Simulate API call
        setTimeout(() => {
            updateSurfConditions({
                waveHeight: '3-4ft',
                windSpeed: '10mph',
                windDirection: 'SW',
                waterTemp: '68°F',
                conditions: 'Good'
            });
        }, 1000);
    }
}

function updateSurfConditions(data) {
    const widget = document.querySelector('.conditions-widget');
    if (widget) {
        widget.innerHTML = `
            <h3>Current Conditions</h3>
            <div class="wave-height">${data.waveHeight}</div>
            <div class="conditions-details">
                <p><i class="fas fa-wind"></i> Wind: ${data.windSpeed} ${data.windDirection}</p>
                <p><i class="fas fa-temperature-high"></i> Water: ${data.waterTemp}</p>
                <p><i class="fas fa-check-circle"></i> Conditions: ${data.conditions}</p>
            </div>
        `;
    }
}

// Gallery Image Modal
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

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add animation classes to elements when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
}); 