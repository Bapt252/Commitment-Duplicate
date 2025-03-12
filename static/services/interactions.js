/**
 * Nexten - Interactions avancées
 * Gestion des animations et interactions pour une expérience utilisateur moderne
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des particules dans le hero
    initParticles();
    
    // Ajout d'effets de parallaxe
    initParallax();
    
    // Effet de scroll pour le header
    initScrollEffects();
    
    // Menu mobile toggle
    initMobileMenu();
    
    // Animation au défilement
    initScrollAnimations();
    
    // Bouton de retour en haut
    initScrollToTop();
    
    // Effet de hover 3D sur les cartes
    init3DCardEffect();
});

/**
 * Initialise les particules dans la section hero
 */
function initParticles() {
    // Vérifie si la section hero et le conteneur de particules existent
    const heroSection = document.querySelector('.hero');
    let particlesContainer = document.querySelector('.hero-particles');
    
    // Si la section hero existe mais pas le conteneur de particules, créez-le
    if (heroSection && !particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'hero-particles';
        heroSection.appendChild(particlesContainer);
    }
    
    // Si le conteneur de particules existe, créez des particules
    if (particlesContainer) {
        // Nombre de particules à créer
        const particleCount = 5;
        const sizes = [20, 25, 30, 35, 40];
        const positions = [
            { top: '20%', left: '80%' },
            { top: '60%', left: '10%' },
            { top: '30%', left: '30%' },
            { top: '70%', left: '70%' },
            { top: '40%', left: '50%' }
        ];
        
        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = sizes[i] + 'px';
            particle.style.height = sizes[i] + 'px';
            particle.style.background = 'rgba(124, 58, 237, 0.0' + (i + 1) + ')';
            particle.style.top = positions[i].top;
            particle.style.left = positions[i].left;
            particle.style.animationDelay = (i * 0.5) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
}

/**
 * Initialise les effets de parallaxe
 */
function initParallax() {
    const particles = document.querySelectorAll('.particle');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach(function(particle, index) {
            const offsetX = (mouseX - 0.5) * (index + 1) * 15;
            const offsetY = (mouseY - 0.5) * (index + 1) * 15;
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

/**
 * Initialise les effets de défilement
 */
function initScrollEffects() {
    const header = document.querySelector('header');
    
    if (header) {
        // Vérifier si le header doit être scrolled dès le chargement
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initialise le menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach(function(element, index) {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Si l'élément est visible dans la fenêtre
            if (elementBottom > windowTop && elementTop < windowBottom) {
                // Ajouter un délai progressif pour une animation en cascade
                setTimeout(function() {
                    element.classList.add('visible');
                }, index * 100);
            }
        });
    }
    
    // Vérifier au chargement de la page avec un léger délai
    setTimeout(checkIfInView, 300);
    
    // Vérifier lors du défilement
    window.addEventListener('scroll', checkIfInView);
}

/**
 * Initialise le bouton de retour en haut
 */
function initScrollToTop() {
    const scrollToTopButton = document.getElementById('scroll-to-top');
    
    if (scrollToTopButton) {
        // Vérifier si le bouton doit être visible dès le chargement
        if (window.scrollY > 500) {
            scrollToTopButton.classList.add('visible');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        });
        
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialise l'effet 3D sur les cartes
 */
function init3DCardEffect() {
    const cards = document.querySelectorAll('.user-type-card, .feature-card, .step, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Obtenir les coordonnées relatives de la souris par rapport à la carte
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculer le centre de la carte
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculer la rotation en fonction de la position de la souris
            // Limiter la rotation à 10 degrés maximum
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            // Appliquer les transformations
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        // Restaurer la position originale lorsque la souris quitte la carte
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}
