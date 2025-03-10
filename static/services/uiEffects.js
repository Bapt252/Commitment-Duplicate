/**
 * Module pour gérer les effets d'interface utilisateur et améliorer l'UX
 */

class UIEffects {
  constructor() {
    this.init();
  }

  /**
   * Initialise tous les effets UI
   */
  init() {
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupAnimations();
    this.setupAccessibility();
    this.setupDarkMode();
    this.setupSearchBarEffects();
    this.setupCardHoverEffects();
  }

  /**
   * Configure les effets basés sur le défilement
   */
  setupScrollEffects() {
    const header = document.querySelector('header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    // Vérifier si le header existe
    if (header) {
      // Effet de header au défilement
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
    
    // Vérifier si le bouton de retour en haut existe
    if (scrollToTopBtn) {
      // Afficher/cacher le bouton de retour en haut
      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          scrollToTopBtn.classList.add('show');
        } else {
          scrollToTopBtn.classList.remove('show');
        }
      });
      
      // Action du bouton de retour en haut
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Animation des éléments au défilement
    this.setupScrollAnimation();
  }

  /**
   * Configuration des animations au scroll
   */
  setupScrollAnimation() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Optionnellement, arrêter d'observer après l'animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Configuration du menu mobile
   */
  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      
      // Gestion de l'attribut aria-expanded pour l'accessibilité
      const isExpanded = navMenu.classList.contains('show');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      
      // Animation d'icône si présente
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (isExpanded) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Fermer le menu si on clique ailleurs sur la page
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('show') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)
      ) {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', false);
        
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  /**
   * Configuration d'animations générales
   */
  setupAnimations() {
    // Ajouter progressivement des classes d'animation aux cartes
    const cards = document.querySelectorAll('.user-type-card, .feature-card');
    
    if (cards.length === 0) return;
    
    // Animer les cartes avec un délai progressif
    cards.forEach((card, index) => {
      card.classList.add('animate-on-scroll');
      card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Ajouter des animations aux étapes du processus
    const steps = document.querySelectorAll('.step');
    
    if (steps.length === 0) return;
    
    // Animation séquentielle des étapes
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      }
      
      step.addEventListener('mouseenter', () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      });
    });
  }

  /**
   * Configuration pour l'accessibilité
   */
  setupAccessibility() {
    // Ajouter les attributs ARIA appropriés
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Menu principal');
      navMenu.setAttribute('role', 'menu');
    }
    
    // Gestion des focus pour les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focus-visible');
      });
    });
    
    // Support de navigation au clavier pour les cartes d'emploi
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
      card.setAttribute('tabindex', '0');
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const detailsButton = card.querySelector('.btn-details');
          if (detailsButton) {
            detailsButton.click();
          }
        }
      });
    });
  }

  /**
   * Configuration pour la gestion du mode sombre
   */
  setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    // Vérifier la préférence de l'utilisateur
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Appliquer le mode sombre si nécessaire
    if (savedDarkMode === 'enabled' || (savedDarkMode === null && prefersDarkMode)) {
      document.body.classList.add('dark-mode');
      darkModeToggle.classList.add('active');
    }
    
    // Gestion du basculement du mode sombre
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      darkModeToggle.classList.toggle('active');
      
      // Sauvegarder la préférence de l'utilisateur
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }

  /**
   * Effets spéciaux pour la barre de recherche
   */
  setupSearchBarEffects() {
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.getElementById('search-input');
    
    if (!searchBar || !searchInput) return;
    
    // Effet de focus sur la barre de recherche
    searchInput.addEventListener('focus', () => {
      searchBar.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', () => {
      searchBar.classList.remove('focused');
    });
    
    // Ajout de suggestions de recherche
    const setupAutoComplete = () => {
      const searchTerms = [
        'Développeur', 'Designer', 'Marketing', 'Chef de projet', 
        'Data Scientist', 'UX/UI', 'Full Stack', 'Product Manager'
      ];
      
      searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase();
        
        if (value.length < 2) return;
        
        // Trouver des correspondances
        const matches = searchTerms.filter(term => 
          term.toLowerCase().includes(value)
        );
        
        if (matches.length > 0 && matches[0] !== value && !document.querySelector('.autocomplete')) {
          const autocomplete = document.createElement('div');
          autocomplete.className = 'autocomplete';
          
          matches.slice(0, 5).forEach(match => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = match;
            
            suggestion.addEventListener('click', () => {
              searchInput.value = match;
              autocomplete.remove();
            });
            
            autocomplete.appendChild(suggestion);
          });
          
          searchBar.appendChild(autocomplete);
        } else if (document.querySelector('.autocomplete') && (matches.length === 0 || value.length < 2)) {
          document.querySelector('.autocomplete').remove();
        }
      });
      
      // Cacher l'autocomplétion lorsqu'on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && document.querySelector('.autocomplete')) {
          document.querySelector('.autocomplete').remove();
        }
      });
    };
    
    // Activer l'autocomplétion si nécessaire
    setupAutoComplete();
  }

  /**
   * Effets au survol des cartes
   */
  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.job-card, .user-type-card, .feature-card');
    
    if (cards.length === 0) return;
    
    cards.forEach(card => {
      // Effet de perspective 3D subtil au survol
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculer la rotation basée sur la position de la souris
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        
        // Appliquer la transformation
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });
      
      // Réinitialiser la transformation au départ de la souris
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        
        // Ajouter une transition pour un retour en douceur
        card.style.transition = 'transform 0.5s ease';
        
        // Supprimer la transition après l'animation
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }
}

// Initialiser les effets d'interface utilisateur
document.addEventListener('DOMContentLoaded', () => {
  const uiEffects = new UIEffects();
});
