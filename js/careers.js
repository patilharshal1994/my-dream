// Careers functionality
document.addEventListener('DOMContentLoaded', function() {
    initJobFilters();
    initApplicationForm();
    initJobModals();
});

// Job filter functionality
function initJobFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const jobCards = document.querySelectorAll('.job-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            jobCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Application form functionality
function initApplicationForm() {
    const form = document.getElementById('careerForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                submitApplication(data);
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'position', 'experience', 'resume'];
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
    
    // File validation
    const resumeInput = document.getElementById('resume');
    if (resumeInput.files.length > 0) {
        const file = resumeInput.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            showFieldError(resumeInput, 'Please upload a PDF, DOC, or DOCX file');
            isValid = false;
        } else if (file.size > maxSize) {
            showFieldError(resumeInput, 'File size must be less than 5MB');
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

// Submit application
function submitApplication(data) {
    const submitBtn = document.querySelector('#careerForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Application submitted successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('careerForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
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

// Job modal functionality
function initJobModals() {
    const viewDetailsLinks = document.querySelectorAll('.job-actions .btn-outline');
    
    viewDetailsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const jobId = link.getAttribute('href').substring(1);
            showJobModal(jobId);
        });
    });
}

// Show job modal
function showJobModal(jobId) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('jobModal');
    if (!modal) {
        modal = createJobModal();
        document.body.appendChild(modal);
    }

    // Get job data based on ID
    const jobData = getJobData(jobId);
    
    // Populate modal with job data
    populateJobModal(modal, jobData);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Create job modal
function createJobModal() {
    const modal = document.createElement('div');
    modal.id = 'jobModal';
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="job-header">
                        <h1 class="job-title"></h1>
                        <span class="job-type"></span>
                    </div>
                    <div class="job-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="job-location"></span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-building"></i>
                            <span class="job-department"></span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span class="job-experience"></span>
                        </div>
                    </div>
                    <div class="job-description">
                        <h3>Job Description</h3>
                        <div class="description-content"></div>
                    </div>
                    <div class="job-requirements">
                        <h3>Requirements</h3>
                        <ul class="requirements-list"></ul>
                    </div>
                    <div class="job-skills">
                        <h3>Required Skills</h3>
                        <div class="skills-container"></div>
                    </div>
                    <div class="job-benefits">
                        <h3>What We Offer</h3>
                        <ul class="benefits-list"></ul>
                    </div>
                    <div class="modal-actions">
                        <a href="#" class="btn btn-primary">Apply Now</a>
                        <button class="btn btn-outline share-job">Share</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Share functionality
    const shareBtn = modal.querySelector('.share-job');
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: modal.querySelector('.job-title').textContent,
                text: modal.querySelector('.description-content').textContent,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            shareBtn.textContent = 'Copied!';
            setTimeout(() => {
                shareBtn.textContent = 'Share';
            }, 2000);
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    return modal;
}

// Get job data
function getJobData(jobId) {
    const jobs = {
        'job1-details': {
            title: 'Senior Full-Stack Developer',
            type: 'Full-time',
            location: 'San Francisco, CA / Remote',
            department: 'Engineering',
            experience: '3-5 years experience',
            description: 'We\'re looking for a passionate Senior Full-Stack Developer to join our engineering team. You\'ll work on cutting-edge web applications using modern technologies like React, Node.js, and cloud platforms. As a senior developer, you\'ll mentor junior developers, lead technical decisions, and contribute to our architecture discussions.',
            requirements: [
                'Bachelor\'s degree in Computer Science or related field',
                '3-5 years of experience in full-stack development',
                'Strong proficiency in JavaScript, React, and Node.js',
                'Experience with cloud platforms (AWS, Azure, or GCP)',
                'Knowledge of database design and optimization',
                'Experience with version control systems (Git)',
                'Strong problem-solving and communication skills'
            ],
            skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes'],
            benefits: [
                'Competitive salary and equity package',
                'Comprehensive health, dental, and vision insurance',
                'Flexible working hours and remote work options',
                'Professional development budget',
                '401(k) with company matching',
                'Unlimited PTO policy',
                'Modern office space with latest equipment'
            ]
        }
    };

    return jobs[jobId] || jobs['job1-details'];
}

// Populate job modal
function populateJobModal(modal, data) {
    modal.querySelector('.job-title').textContent = data.title;
    modal.querySelector('.job-type').textContent = data.type;
    modal.querySelector('.job-location').textContent = data.location;
    modal.querySelector('.job-department').textContent = data.department;
    modal.querySelector('.job-experience').textContent = data.experience;
    modal.querySelector('.description-content').textContent = data.description;
    
    // Populate requirements
    const requirementsList = modal.querySelector('.requirements-list');
    requirementsList.innerHTML = '';
    data.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        requirementsList.appendChild(li);
    });
    
    // Populate skills
    const skillsContainer = modal.querySelector('.skills-container');
    skillsContainer.innerHTML = '';
    data.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        skillsContainer.appendChild(skillTag);
    });
    
    // Populate benefits
    const benefitsList = modal.querySelector('.benefits-list');
    benefitsList.innerHTML = '';
    data.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
}

// Add CSS for careers and modals
const careersStyles = document.createElement('style');
careersStyles.textContent = `
    .job-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        position: relative;
        background: var(--secondary-color);
        border-radius: 20px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid rgba(255, 107, 53, 0.2);
        box-shadow: var(--shadow-dark);
    }

    .modal-close {
        position: absolute;
        top: 0px;
        right: 11px;
        background: none;
        border: none;
        color: var(--text-light);
        font-size: 2rem;
        cursor: pointer;
        z-index: 1;
        transition: var(--transition);
    }

    .modal-close:hover {
        color: var(--primary-color);
    }

    .modal-body {
        padding: 2rem;
    }

    .job-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 107, 53, 0.1);
    }

    .job-title {
        font-size: 2rem;
        color: var(--text-light);
        margin-bottom: 0.5rem;
    }

    .job-type {
        background: var(--gradient-primary);
        color: var(--text-light);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .job-meta {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-muted);
    }

    .meta-item i {
        color: var(--primary-color);
    }

    .job-description,
    .job-requirements,
    .job-skills,
    .job-benefits {
        margin-bottom: 2rem;
    }

    .job-description h3,
    .job-requirements h3,
    .job-skills h3,
    .job-benefits h3 {
        color: var(--text-light);
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .description-content {
        color: var(--text-muted);
        line-height: 1.8;
    }

    .requirements-list,
    .benefits-list {
        list-style: none;
        padding: 0;
    }

    .requirements-list li,
    .benefits-list li {
        color: var(--text-muted);
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;
    }

    .requirements-list li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    .benefits-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .skill-tag {
        background: rgba(255, 107, 53, 0.1);
        color: var(--primary-color);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        border: 1px solid rgba(255, 107, 53, 0.2);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

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

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .modal-actions {
            flex-direction: column;
        }
        
        .job-meta {
            flex-direction: column;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(careersStyles);
