// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initBlogFilter();
    initNewsletterForm();
    initTagCloud();
    initArticlePreview();
});

// Blog category filter functionality
function initBlogFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-category');

            blogCards.forEach(card => {
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

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter-form-large');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = '#28a745';
                form.reset();
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 2000);
            }, 1000);
        });
    });
}

// Tag cloud functionality
function initTagCloud() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            tags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // Filter articles by tag (simplified implementation)
            const tagText = tag.textContent.toLowerCase();
            const blogCards = document.querySelectorAll('.blog-card');
            
            blogCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(tagText)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Article preview functionality
function initArticlePreview() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = link.getAttribute('href').substring(1);
            showArticlePreview(articleId);
        });
    });
}

// Show article preview modal
function showArticlePreview(articleId) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('articleModal');
    if (!modal) {
        modal = createArticleModal();
        document.body.appendChild(modal);
    }

    // Get article data based on ID
    const articleData = getArticleData(articleId);
    
    // Populate modal with article data
    populateArticleModal(modal, articleData);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Create article modal
function createArticleModal() {
    const modal = document.createElement('div');
    modal.id = 'articleModal';
    modal.className = 'article-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="article-header">
                        <div class="article-meta">
                            <span class="category"></span>
                            <span class="date"></span>
                            <span class="read-time"></span>
                        </div>
                        <h1 class="article-title"></h1>
                        <div class="article-author">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="author-info">
                                <h4 class="author-name"></h4>
                                <p class="author-title"></p>
                            </div>
                        </div>
                    </div>
                    <div class="article-image">
                        <div class="image-placeholder">
                            <i class="fas fa-newspaper"></i>
                            <p>Article Image</p>
                        </div>
                    </div>
                    <div class="article-content">
                        <div class="article-excerpt"></div>
                        <div class="article-tags"></div>
                    </div>
                    <div class="modal-actions">
                        <a href="#" class="btn btn-primary">Read Full Article</a>
                        <button class="btn btn-outline share-btn">Share</button>
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
    const shareBtn = modal.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: modal.querySelector('.article-title').textContent,
                text: modal.querySelector('.article-excerpt').textContent,
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

// Get article data
function getArticleData(articleId) {
    const articles = {
        'article1': {
            title: 'The Future of Artificial Intelligence in Business',
            category: 'Technology',
            date: 'December 15, 2025',
            readTime: '5 min read',
            author: 'Sarah Johnson',
            authorTitle: 'CEO & AI Expert',
            excerpt: 'Artificial Intelligence is no longer a futuristic concept but a present reality that\'s transforming how businesses operate. From automating routine tasks to providing deep insights through data analysis, AI is becoming an integral part of modern business strategy. In this comprehensive guide, we explore the current state of AI in business, emerging trends, and practical steps companies can take to leverage AI for competitive advantage.',
            tags: ['Artificial Intelligence', 'Business Strategy', 'Technology', 'Innovation']
        },
        'article2': {
            title: 'Machine Learning Best Practices for 2025',
            category: 'Technology',
            date: 'December 12, 2025',
            readTime: '4 min read',
            author: 'Michael Chen',
            authorTitle: 'CTO',
            excerpt: 'Machine Learning continues to evolve rapidly, and staying updated with best practices is crucial for successful implementation. This article covers the latest techniques, tools, and methodologies that are shaping the ML landscape in 2025.',
            tags: ['Machine Learning', 'Data Science', 'Technology', 'Best Practices']
        }
    };

    return articles[articleId] || articles['article1'];
}

// Populate article modal
function populateArticleModal(modal, data) {
    modal.querySelector('.article-title').textContent = data.title;
    modal.querySelector('.category').textContent = data.category;
    modal.querySelector('.date').textContent = data.date;
    modal.querySelector('.read-time').textContent = data.readTime;
    modal.querySelector('.author-name').textContent = data.author;
    modal.querySelector('.author-title').textContent = data.authorTitle;
    modal.querySelector('.article-excerpt').textContent = data.excerpt;
    
    // Populate tags
    const tagsContainer = modal.querySelector('.article-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// Add CSS for blog and modal
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    .article-modal {
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
        padding: 2rem;
    }

    .article-header {
        margin-bottom: 2rem;
    }

    .article-title {
        font-size: 2rem;
        color: var(--text-light);
        margin: 1rem 0;
        line-height: 1.3;
    }

    .article-image {
        margin-bottom: 2rem;
    }

    .article-image .image-placeholder {
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

    .article-image .image-placeholder i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .article-content {
        margin-bottom: 2rem;
    }

    .article-excerpt {
        color: var(--text-muted);
        line-height: 1.8;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .article-tags .tag {
        background: rgba(255, 107, 53, 0.1);
        color: var(--primary-color);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        border: 1px solid rgba(255, 107, 53, 0.2);
        cursor: pointer;
        transition: var(--transition);
    }

    .article-tags .tag:hover {
        background: var(--primary-color);
        color: var(--text-light);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .tag.active {
        background: var(--primary-color);
        color: var(--text-light);
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
        
        .article-title {
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(blogStyles);
