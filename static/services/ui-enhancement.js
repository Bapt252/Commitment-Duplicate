/**
 * Script d'amélioration de l'interface utilisateur pour Nexten
 * Ce script applique des modifications d'UI/UX directement dans le navigateur
 */

document.addEventListener('DOMContentLoaded', function() {
    // Injecter le CSS d'amélioration de l'UI
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '../static/styles/ui-improvements.css';
    document.head.appendChild(linkElement);
    
    // Supprimer les éléments demandés
    removeElements();
    
    // Améliorer l'interface utilisateur
    enhanceUI();
    
    // Ajouter des animations
    addAnimations();
    
    console.log('✅ UI/UX améliorations appliquées !');
});

/**
 * Supprime les éléments spécifiés
 */
function removeElements() {
    // Supprimer le bouton "messagerie"
    const messagerieBtns = document.querySelectorAll('a[href="#messagerie"], .job-step-item:nth-child(6)');
    messagerieBtns.forEach(btn => btn.style.display = 'none');
    
    // Supprimer le bouton "travailler mon CV"
    const cvBtns = document.querySelectorAll('a[href="#travailler-mon-cv"], .job-step-item:nth-child(4)');
    cvBtns.forEach(btn => btn.style.display = 'none');
    
    // Supprimer le parcours de navigation
    const steps = document.querySelectorAll('.job-step-item');
    steps.forEach(step => step.style.display = 'none');
}

/**
 * Améliore l'interface utilisateur
 */
function enhanceUI() {
    // Améliorer l'apparence des cartes
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        card.classList.add('enhanced');
        
        // Ajouter une ombre portée
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        card.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
        
        // Ajouter un effet hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
            this.style.borderColor = '#A78BFA';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            this.style.borderColor = 'transparent';
        });
    });
    
    // Améliorer les filtres
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.style.borderRadius = '20px';
        tag.style.padding = '6px 14px';
        tag.style.transition = 'all 0.3s ease';
        
        tag.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        tag.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = '';
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Améliorer la barre de recherche
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.style.borderRadius = '30px';
        searchInput.style.transition = 'all 0.3s ease';
        searchInput.style.border = '1px solid #EFEEE9';
        
        searchInput.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
            this.style.borderColor = '#A78BFA';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            this.style.borderColor = '#EFEEE9';
        });
    }
    
    // Améliorer l'en-tête de section
    const sectionHeadings = document.querySelectorAll('.section-heading');
    sectionHeadings.forEach(heading => {
        // Ajouter un effet de soulignement
        heading.style.position = 'relative';
        heading.style.paddingBottom = '12px';
        
        // Créer une ligne de soulignement
        const underline = document.createElement('div');
        underline.style.position = 'absolute';
        underline.style.left = '0';
        underline.style.bottom = '0';
        underline.style.height = '3px';
        underline.style.width = '80px';
        underline.style.background = 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)';
        underline.style.borderRadius = '3px';
        underline.style.transition = 'width 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        
        heading.appendChild(underline);
        
        // Ajouter un effet hover
        heading.addEventListener('mouseenter', function() {
            underline.style.width = '120px';
        });
        
        heading.addEventListener('mouseleave', function() {
            underline.style.width = '80px';
        });
    });
}

/**
 * Ajoute des animations à l'interface
 */
function addAnimations() {
    // Animer les éléments lors du défilement
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Fonction pour vérifier si un élément est visible dans la fenêtre
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        fadeInElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Si l'élément est visible dans la fenêtre
            if (elementBottom > windowTop && elementTop < windowBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Vérifier au chargement de la page
    checkIfInView();
    
    // Vérifier lors du défilement
    window.addEventListener('scroll', checkIfInView);
    
    // Ajouter un effet d'éclaircissement de l'en-tête lors du défilement
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backdropFilter = 'blur(15px)';
                header.style.WebkitBackdropFilter = 'blur(15px)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                header.style.padding = '5px 0';
            } else {
                header.style.backdropFilter = 'blur(0px)';
                header.style.WebkitBackdropFilter = 'blur(0px)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = 'none';
                header.style.padding = '12px 0';
            }
        });
    }
}
