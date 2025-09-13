// Contact functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initMapInteraction();
});

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                submitContactForm(data);
            }
        });
    }
}

// Form validation
function validateContactForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        showFieldError(document.getElementById('email'), 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (if provided)
    if (data.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

// Show field error
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

// Clear field error
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
}

// Submit contact form
function submitContactForm(data) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Map interaction functionality
function initMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', () => {
            // Open Google Maps in new tab
            const address = '123 Tech Street, San Francisco, CA 94105';
            const encodedAddress = encodeURIComponent(address);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            window.open(mapsUrl, '_blank');
        });
        
        // Add hover effect
        mapPlaceholder.addEventListener('mouseenter', () => {
            mapPlaceholder.style.transform = 'scale(1.02)';
        });
        
        mapPlaceholder.addEventListener('mouseleave', () => {
            mapPlaceholder.style.transform = 'scale(1)';
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
}

// Smooth scroll to form
function scrollToForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add smooth scroll functionality to CTA buttons
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('a[href="#contactForm"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToForm();
        });
    });
});

// Add CSS for contact page and notifications
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .field-error {
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    }

    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #ff6b6b;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-color);
        border: 1px solid rgba(255, 107, 53, 0.2);
        border-radius: 10px;
        padding: 1rem;
        z-index: 10001;
        box-shadow: var(--shadow-dark);
        animation: slideInRight 0.3s ease-out;
    }

    .notification-success {
        border-left: 4px solid #28a745;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
    }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 1rem;
    }

    .faq-item {
        border-bottom: 1px solid rgba(255, 107, 53, 0.1);
        transition: var(--transition);
    }

    .faq-question {
        display: flex;
        color: var(--primary-color);
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 0;
        cursor: pointer;
        transition: var(--transition);
    }

    .faq-question:hover {
        color: var(--primary-color);
    }

    .faq-question h4 {
        color: var(--primary-color);
        margin: 7px;
        font-size: 1.1rem;
    }

    .faq-question i {
        color: var(--primary-color);
        transition: var(--transition);
    }

    .faq-item.active .faq-question i {
        transform: rotate(180deg);
    }

    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .faq-item.active .faq-answer {
        max-height: 200px;
    }

    .faq-answer p {
        color: var(--text-muted);
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
    }

    .map-placeholder {
        cursor: pointer;
        transition: var(--transition);
        border-radius: 15px;
        overflow: hidden;
    }

    .map-placeholder:hover {
        box-shadow: var(--shadow-light);
    }

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

    @media (max-width: 768px) {
        .faq-question {
            padding: 1rem 0;
        }
        
        .faq-question h4 {
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(contactStyles);
