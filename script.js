document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });

    // Glossary functionality
    const glossaryCards = document.querySelectorAll('.glossary-card');
    const filterTags = document.querySelectorAll('.tag');
    const searchInput = document.querySelector('.search-input');
    const loadMoreBtn = document.querySelector('.load-more .cta-button');
    const cardsPerPage = 6;
    let visibleCards = cardsPerPage;
    let currentFilter = 'all';
    let searchTerm = '';

    // Filter cards by category
    function filterCards() {
        let visibleCount = 0;
        
        glossaryCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const term = card.querySelector('.term').textContent.toLowerCase();
            const definition = card.querySelector('.definition').textContent.toLowerCase();
            const matchesSearch = term.includes(searchTerm) || definition.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            if (matchesSearch && matchesFilter) {
                if (visibleCount < visibleCards) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            const totalVisible = [...glossaryCards].filter(card => {
                const category = card.getAttribute('data-category');
                const term = card.querySelector('.term').textContent.toLowerCase();
                const definition = card.querySelector('.definition').textContent.toLowerCase();
                const matchesSearch = term.includes(searchTerm) || definition.includes(searchTerm);
                const matchesFilter = currentFilter === 'all' || category === currentFilter;
                return matchesSearch && matchesFilter;
            }).length;

            loadMoreBtn.style.display = visibleCount >= totalVisible ? 'none' : 'inline-block';
        }
    }


    // Event listeners for filter tags
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Remove active class from all tags
                filterTags.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tag
                this.classList.add('active');
                // Update current filter
                currentFilter = this.getAttribute('data-filter');
                // Reset visible cards counter
                visibleCards = cardsPerPage;
                // Filter cards
                filterCards();
            });
        });
    }


    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.trim().toLowerCase();
            visibleCards = cardsPerPage; // Reset to first page when searching
            filterCards();
        });
    }


    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCards += cardsPerPage;
            filterCards();
            // Smooth scroll to show newly loaded cards
            const cards = document.querySelectorAll('.glossary-card[style*="display: flex"]');
            if (cards.length > 0) {
                cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Initialize the glossary
    filterCards();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate the position to scroll to, accounting for the fixed header
                const headerOffset = 80; // Height of your fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    
    function highlightNavigation() {
        let scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.add('active');
            } else {
                const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
                if (navLink) navLink.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Initialize
    highlightNavigation();
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.game-card, .principle, .glossary-term');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.game-card, .principle, .glossary-term').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Trigger animation on page load
    setTimeout(animateOnScroll, 300);
});
