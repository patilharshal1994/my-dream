// Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilter();
    initPortfolioModal();
    initTestimonialSlider();
});

// Portfolio filter functionality
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Portfolio modal functionality
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const viewDetailsBtn = item.querySelector('.btn-primary');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = viewDetailsBtn.getAttribute('href').substring(1);
                showProjectModal(projectId);
            });
        }
    });
}

// Show project modal
function showProjectModal(projectId) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('projectModal');
    if (!modal) {
        modal = createProjectModal();
        document.body.appendChild(modal);
    }

    // Get project data based on ID
    const projectData = getProjectData(projectId);
    
    // Populate modal with project data
    populateModal(modal, projectData);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Create project modal
function createProjectModal() {
    const modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <div class="image-placeholder">
                            <i class="fas fa-image"></i>
                            <p>Project Screenshot</p>
                        </div>
                    </div>
                    <div class="modal-info">
                        <h2 class="modal-title">Project Title</h2>
                        <p class="modal-description">Project description goes here...</p>
                        <div class="modal-tech-stack">
                            <h4>Technologies Used:</h4>
                            <div class="tech-tags"></div>
                        </div>
                        <div class="modal-features">
                            <h4>Key Features:</h4>
                            <ul class="features-list"></ul>
                        </div>
                        <div class="modal-actions">
                            <a href="#" class="btn btn-primary">Live Demo</a>
                            <a href="#" class="btn btn-outline">GitHub</a>
                        </div>
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

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    return modal;
}

// Get project data
function getProjectData(projectId) {
    const projects = {
        'project1': {
            title: 'E-commerce Platform',
            description: 'A comprehensive e-commerce solution built with modern technologies. Features include product catalog, shopping cart, payment processing, order management, and admin dashboard.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
            features: [
                'Responsive design for all devices',
                'Secure payment processing',
                'Real-time inventory management',
                'Advanced search and filtering',
                'Order tracking and notifications',
                'Admin dashboard for management'
            ],
            demoUrl: '#',
            githubUrl: '#'
        },
        'project2': {
            title: 'Mobile Banking App',
            description: 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management features.',
            technologies: ['React Native', 'Node.js', 'PostgreSQL', 'JWT', 'AWS'],
            features: [
                'Biometric authentication',
                'Real-time transaction processing',
                'Account balance and history',
                'Transfer and payment features',
                'Push notifications',
                'Advanced security measures'
            ],
            demoUrl: '#',
            githubUrl: '#'
        },
        'project3': {
            title: 'AI Analytics Platform',
            description: 'A machine learning platform that provides business intelligence and predictive analytics. Built with Python and deployed on AWS cloud infrastructure.',
            technologies: ['Python', 'TensorFlow', 'AWS', 'Docker', 'PostgreSQL'],
            features: [
                'Machine learning models',
                'Data visualization dashboards',
                'Predictive analytics',
                'Real-time data processing',
                'API for third-party integration',
                'Scalable cloud infrastructure'
            ],
            demoUrl: '#',
            githubUrl: '#'
        }
    };

    return projects[projectId] || projects['project1'];
}

// Populate modal with project data
function populateModal(modal, data) {
    modal.querySelector('.modal-title').textContent = data.title;
    modal.querySelector('.modal-description').textContent = data.description;
    
    // Populate technologies
    const techTags = modal.querySelector('.tech-tags');
    techTags.innerHTML = '';
    data.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techTags.appendChild(tag);
    });

    // Populate features
    const featuresList = modal.querySelector('.features-list');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Set action URLs
    const demoBtn = modal.querySelector('.btn-primary');
    const githubBtn = modal.querySelector('.btn-outline');
    demoBtn.href = data.demoUrl;
    githubBtn.href = data.githubUrl;
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length === 0) return;

    // Auto-rotate testimonials
    setInterval(() => {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 5000);

    // Initialize first testimonial as active
    if (testimonials.length > 0) {
        testimonials[0].classList.add('active');
    }
}

// Add CSS for modal and animations
const portfolioStyles = document.createElement('style');
portfolioStyles.textContent = `
    .project-modal {
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
        top: 20px;
        right: 20px;
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }

    .modal-image {
        position: relative;
    }

    .modal-image .image-placeholder {
        width: 100%;
        height: 300px;
        background: var(--gradient-dark);
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
    }

    .modal-image .image-placeholder i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .modal-info h2 {
        color: var(--text-light);
        margin-bottom: 1rem;
    }

    .modal-description {
        color: var(--text-muted);
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .modal-tech-stack h4,
    .modal-features h4 {
        color: var(--text-light);
        margin-bottom: 1rem;
    }

    .modal-tech-stack .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .modal-tech-stack .tech-tag {
        background: rgba(255, 107, 53, 0.1);
        color: var(--primary-color);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        border: 1px solid rgba(255, 107, 53, 0.2);
    }

    .features-list {
        list-style: none;
        margin-bottom: 2rem;
    }

    .features-list li {
        color: var(--text-muted);
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;
    }

    .features-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
    }

    .testimonial {
        opacity: 0.7;
        transition: var(--transition);
    }

    .testimonial.active {
        opacity: 1;
        transform: scale(1.02);
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
        .modal-body {
            grid-template-columns: 1fr;
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(portfolioStyles);
