/**
 * Nav Enhancement - Script pour améliorer la navigation entre les pages candidat
 * Commitment - Plateforme de Recrutement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration de la navigation contextuelle
    const candidatePages = [
        { id: 'dashboard', title: 'Tableau de bord', url: 'candidate-dashboard-new.html', icon: 'fas fa-home' },
        { id: 'opportunities', title: 'Mes opportunités', url: 'candidate-opportunities.html', icon: 'fas fa-briefcase' },
        { id: 'offers', title: 'Mes offres reçues', url: 'candidate-offers.html', icon: 'fas fa-paper-plane' },
        { id: 'quick-apply', title: 'Postuler en un clic', url: 'candidate-quick-apply.html', icon: 'fas fa-bolt' },
        { id: 'cv', title: 'Travailler mon CV', url: 'candidate-cv.html', icon: 'fas fa-file-alt' },
        { id: 'resources', title: 'Centre de ressources', url: 'candidate-resources.html', icon: 'fas fa-graduation-cap' },
        { id: 'messaging', title: 'Messagerie', url: 'candidate-messaging.html', icon: 'fas fa-comments' }
    ];

    // Détecter la page actuelle
    const currentPath = window.location.pathname;
    const currentPageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Trouver l'index de la page actuelle
    const currentPageIndex = candidatePages.findIndex(page => page.url === currentPageName);
    
    if (currentPageIndex !== -1 && currentPageName !== 'candidate-dashboard-new.html') {
        addContextualNavigation(currentPageIndex);
        highlightCurrentPageInMenu();
    }
    
    // Pour toutes les pages, ajouter le suivi de progression
    if (currentPageIndex !== -1) {
        addProgressTracker(currentPageIndex);
    }

    // Ajouter des animations de transition pour les clics de navigation
    addNavigationTransitions();
    
    // Ajouter des tooltips d'aide à la navigation
    addNavigationTooltips();
    
    // Ajouter des interactions pour améliorer l'expérience utilisateur
    enhanceUserExperience();
});

/**
 * Ajoute une barre de navigation contextuelle en haut de la page
 */
function addContextualNavigation(currentPageIndex) {
    const candidatePages = [
        { id: 'dashboard', title: 'Tableau de bord', url: 'candidate-dashboard-new.html', icon: 'fas fa-home' },
        { id: 'opportunities', title: 'Mes opportunités', url: 'candidate-opportunities.html', icon: 'fas fa-briefcase' },
        { id: 'offers', title: 'Mes offres reçues', url: 'candidate-offers.html', icon: 'fas fa-paper-plane' },
        { id: 'quick-apply', title: 'Postuler en un clic', url: 'candidate-quick-apply.html', icon: 'fas fa-bolt' },
        { id: 'cv', title: 'Travailler mon CV', url: 'candidate-cv.html', icon: 'fas fa-file-alt' },
        { id: 'resources', title: 'Centre de ressources', url: 'candidate-resources.html', icon: 'fas fa-graduation-cap' },
        { id: 'messaging', title: 'Messagerie', url: 'candidate-messaging.html', icon: 'fas fa-comments' }
    ];
    
    // Créer le conteneur de navigation contextuelle
    const contextualNav = document.createElement('div');
    contextualNav.className = 'contextual-nav';
    
    // Ajouter le lien vers la page précédente
    if (currentPageIndex > 0) {
        const prevPage = candidatePages[currentPageIndex - 1];
        const prevLink = document.createElement('a');
        prevLink.href = prevPage.url;
        prevLink.className = 'previous-page';
        prevLink.innerHTML = `<i class="fas fa-chevron-left"></i> ${prevPage.title}`;
        contextualNav.appendChild(prevLink);
    } else {
        // Espace vide pour l'alignement
        const emptyDiv = document.createElement('div');
        contextualNav.appendChild(emptyDiv);
    }
    
    // Ajouter le lien vers le tableau de bord
    const dashboardLink = document.createElement('a');
    dashboardLink.href = 'candidate-dashboard-new.html';
    dashboardLink.className = 'dashboard-link';
    dashboardLink.innerHTML = `<i class="fas fa-th-large"></i> Tableau de bord`;
    contextualNav.appendChild(dashboardLink);
    
    // Ajouter le lien vers la page suivante
    if (currentPageIndex < candidatePages.length - 1) {
        const nextPage = candidatePages[currentPageIndex + 1];
        const nextLink = document.createElement('a');
        nextLink.href = nextPage.url;
        nextLink.className = 'next-page';
        nextLink.innerHTML = `${nextPage.title} <i class="fas fa-chevron-right"></i>`;
        contextualNav.appendChild(nextLink);
    } else {
        // Espace vide pour l'alignement
        const emptyDiv = document.createElement('div');
        contextualNav.appendChild(emptyDiv);
    }
    
    // Insérer la navigation contextuelle après le fil d'Ariane
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.parentNode.insertBefore(contextualNav, breadcrumb.nextSibling);
    } else {
        // Si pas de fil d'Ariane, insérer au début du contenu principal
        const mainContent = document.querySelector('#main-content');
        if (mainContent) {
            mainContent.insertBefore(contextualNav, mainContent.firstChild);
        }
    }
}

/**
 * Met en évidence la page actuelle dans le menu latéral
 */
function highlightCurrentPageInMenu() {
    const currentPath = window.location.pathname;
    const currentPageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    const menuItems = document.querySelectorAll('.sidebar-menu a, .dashboard-menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPageName) {
            item.classList.add('active');
        }
    });
}

/**
 * Ajoute un traceur de progression en haut de la page
 */
function addProgressTracker(currentPageIndex) {
    const candidatePages = [
        { id: 'dashboard', title: 'Tableau de bord', url: 'candidate-dashboard-new.html', icon: 'fas fa-home' },
        { id: 'opportunities', title: 'Mes opportunités', url: 'candidate-opportunities.html', icon: 'fas fa-briefcase' },
        { id: 'offers', title: 'Mes offres reçues', url: 'candidate-offers.html', icon: 'fas fa-paper-plane' },
        { id: 'quick-apply', title: 'Postuler en un clic', url: 'candidate-quick-apply.html', icon: 'fas fa-bolt' },
        { id: 'cv', title: 'Travailler mon CV', url: 'candidate-cv.html', icon: 'fas fa-file-alt' },
        { id: 'resources', title: 'Centre de ressources', url: 'candidate-resources.html', icon: 'fas fa-graduation-cap' },
        { id: 'messaging', title: 'Messagerie', url: 'candidate-messaging.html', icon: 'fas fa-comments' }
    ];
    
    // Ne pas afficher le progress tracker sur le tableau de bord
    if (candidatePages[currentPageIndex].id === 'dashboard') {
        return;
    }
    
    // Créer le conteneur du traceur de progression
    const progressTracker = document.createElement('div');
    progressTracker.className = 'progress-tracker';
    
    // Créer les étapes
    candidatePages.slice(1).forEach((page, index) => {
        const progressStep = document.createElement('div');
        progressStep.className = 'progress-step';
        
        if (index < currentPageIndex - 1) {
            progressStep.classList.add('completed');
        } else if (index === currentPageIndex - 1) {
            progressStep.classList.add('active');
        }
        
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'step-indicator';
        
        if (index < currentPageIndex - 1) {
            stepIndicator.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            stepIndicator.textContent = index + 1;
        }
        
        const stepLabel = document.createElement('div');
        stepLabel.className = 'step-label';
        stepLabel.textContent = page.title;
        
        progressStep.appendChild(stepIndicator);
        progressStep.appendChild(stepLabel);
        progressTracker.appendChild(progressStep);
    });
    
    // Insérer le traceur de progression au début du contenu principal
    const sectionHeading = document.querySelector('.section-heading');
    if (sectionHeading) {
        sectionHeading.parentNode.insertBefore(progressTracker, sectionHeading.nextSibling);
    }
}

/**
 * Ajouter des transitions d'animation pour les clics de navigation
 */
function addNavigationTransitions() {
    // Intercepter tous les clics sur les liens internes pour ajouter une animation de transition
    document.addEventListener('click', function(event) {
        const target = event.target.closest('a');
        if (target && target.href && target.href.includes(window.location.hostname)) {
            // Vérifier si c'est un lien interne (pas un téléchargement ou un ancre)
            if (!target.getAttribute('download') && !target.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = target.href;
                }, 300);
            }
        }
    });
}

/**
 * Ajouter des tooltips d'aide à la navigation
 */
function addNavigationTooltips() {
    // Ajouter des tooltips aux éléments de navigation
    const navElements = document.querySelectorAll('.dashboard-menu-item, .previous-page, .next-page, .dashboard-link');
    
    navElements.forEach(element => {
        if (element.classList.contains('dashboard-menu-item')) {
            const heading = element.querySelector('h3');
            if (heading) {
                element.setAttribute('data-tooltip', heading.textContent);
            }
        } else if (element.classList.contains('previous-page')) {
            element.setAttribute('data-tooltip', 'Page précédente');
        } else if (element.classList.contains('next-page')) {
            element.setAttribute('data-tooltip', 'Page suivante');
        } else if (element.classList.contains('dashboard-link')) {
            element.setAttribute('data-tooltip', 'Retour au tableau de bord');
        }
    });
}

/**
 * Améliorer l'expérience utilisateur avec des interactions supplémentaires
 */
function enhanceUserExperience() {
    // Animer l'entrée des éléments au défilement
    const animatedElements = document.querySelectorAll('.dashboard-menu-item, .activity-item, .profile-container');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach(function(element, index) {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            // Ajouter un délai progressif pour l'animation
            setTimeout(() => {
                if (elementTop < windowBottom) {
                    element.classList.add('visible');
                }
            }, index * 100);
        });
    }
    
    // Vérifier au chargement de la page
    setTimeout(checkIfInView, 100);
    
    // Vérifier lors du défilement
    window.addEventListener('scroll', checkIfInView);
}