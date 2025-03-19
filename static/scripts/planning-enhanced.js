/**
 * planning-enhanced.js
 * Script amélioré pour la page planning avec des interactions modernes
 */

document.addEventListener('DOMContentLoaded', function() {
    // === INITIALISATION DES COMPOSANTS ===
    initSidebar();
    initUserDropdown();
    initKanban();
    initDetailPanel();
    initTabs();
    initFilters();
    initActionButton();
    initTooltips();
    initNotifications();
    initSwipeDetection();
    initProgressBar();
    initThemeToggle();
    initSearchBoxes();
    initAnimations();
    
    // === FONCTIONS D'INITIALISATION ===

    // Initialisation de la sidebar responsive
    function initSidebar() {
        const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
        const sidebar = document.querySelector('.app-sidebar');
        const content = document.querySelector('.app-content');
        const overlay = document.createElement('div');
        
        overlay.classList.add('sidebar-overlay');
        document.body.appendChild(overlay);
        
        sidebarToggle?.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
            overlay.classList.remove('active');
        });
        
        // Animation des icônes dans le menu
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        sidebarLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        icon.style.transform = '';
                    }, 300);
                }
            });
        });
    }
    
    // Initialisation du dropdown d'utilisateur
    function initUserDropdown() {
        const userMenuToggle = document.querySelector('.user-menu-toggle');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                this.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    // Animation d'entrée
                    userDropdown.style.display = 'block';
                    userDropdown.style.opacity = '0';
                    userDropdown.style.transform = 'scale(0.95)';
                    
                    // Force reflow
                    void userDropdown.offsetWidth;
                    
                    userDropdown.style.opacity = '1';
                    userDropdown.style.transform = 'scale(1)';
                }
            });
            
            document.addEventListener('click', function(e) {
                if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                    userMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // Initialisation du Kanban avec drag and drop
    function initKanban() {
        const kanbanCards = document.querySelectorAll('.kanban-card[draggable="true"]');
        const kanbanColumns = document.querySelectorAll('.kanban-column');
        let draggedCard = null;
        
        // Effets audio pour les interactions (optionnels - activables par l'utilisateur)
        const dropSound = new Audio();
        dropSound.src = '../static/sounds/drop.mp3'; // À ajouter au projet
        dropSound.volume = 0.2;
        
        const moveSound = new Audio();
        moveSound.src = '../static/sounds/move.mp3'; // À ajouter au projet
        moveSound.volume = 0.1;
        
        // État pour les sons
        let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
        
        kanbanCards.forEach(card => {
            card.addEventListener('dragstart', function(e) {
                draggedCard = this;
                this.classList.add('dragging');
                
                // Effet visuel sur toutes les colonnes possibles
                setTimeout(() => {
                    kanbanColumns.forEach(column => {
                        if (column !== this.closest('.kanban-column')) {
                            column.classList.add('potential-target');
                        }
                    });
                }, 50);
                
                // Son subtil de déplacement
                if (soundEnabled) {
                    moveSound.currentTime = 0;
                    moveSound.play().catch(() => {});
                }
                
                // Stockage des données pour le transfert
                e.dataTransfer.setData('text/plain', this.dataset.candidateId);
                e.dataTransfer.effectAllowed = 'move';
                
                // Image fantôme personnalisée (plus esthétique)
                const ghost = this.cloneNode(true);
                ghost.style.position = 'absolute';
                ghost.style.top = '-1000px';
                ghost.style.opacity = '0.8';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 20, 20);
                
                // Supprimer le clone après un court délai
                setTimeout(() => {
                    document.body.removeChild(ghost);
                }, 100);
            });
            
            card.addEventListener('dragend', function() {
                this.classList.remove('dragging');
                kanbanColumns.forEach(column => {
                    column.classList.remove('potential-target');
                    column.classList.remove('active-target');
                });
            });
            
            // Effet de hover sur les cartes
            card.addEventListener('mouseenter', function() {
                const allOtherCards = document.querySelectorAll('.kanban-card:not(:hover)');
                allOtherCards.forEach(otherCard => {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.98)';
                });
            });
            
            card.addEventListener('mouseleave', function() {
                const allCards = document.querySelectorAll('.kanban-card');
                allCards.forEach(anyCard => {
                    anyCard.style.opacity = '';
                    anyCard.style.transform = '';
                });
            });
        });
        
        kanbanColumns.forEach(column => {
            column.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('active-target');
                e.dataTransfer.dropEffect = 'move';
            });
            
            column.addEventListener('dragleave', function(e) {
                this.classList.remove('active-target');
            });
            
            column.addEventListener('drop', function(e) {
                e.preventDefault();
                
                const candidateId = e.dataTransfer.getData('text/plain');
                const card = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"]`);
                
                if (card && draggedCard) {
                    const container = this.querySelector('.kanban-column-content');
                    const addButton = container.querySelector('.kanban-add-card');
                    
                    // Insérer avant le bouton d'ajout
                    container.insertBefore(card, addButton);
                    
                    // Mettre à jour les compteurs
                    updateColumnCounts();
                    
                    // Ajouter une animation de succès
                    card.classList.add('drop-success');
                    setTimeout(() => {
                        card.classList.remove('drop-success');
                    }, 800);
                    
                    // Jouer le son de dépose
                    if (soundEnabled) {
                        dropSound.currentTime = 0;
                        dropSound.play().catch(() => {});
                    }
                    
                    // Afficher une notification
                    showToast('Candidat déplacé avec succès', 'success');
                }
                
                this.classList.remove('active-target');
                kanbanColumns.forEach(col => {
                    col.classList.remove('potential-target');
                });
            });
        });
        
        // Effet de parallaxe sur les cartes
        document.querySelectorAll('.kanban-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX * 3;
                const deltaY = (y - centerY) / centerY * 3;
                
                this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) translateZ(5px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
        
        // Navigation Kanban pour mobile
        const scrollButtons = document.querySelectorAll('.btn-scroll');
        if (scrollButtons.length) {
            const kanbanContainer = document.querySelector('.kanban-container');
            
            scrollButtons[0]?.addEventListener('click', function() {
                kanbanContainer.scrollBy({ left: -300, behavior: 'smooth' });
            });
            
            scrollButtons[1]?.addEventListener('click', function() {
                kanbanContainer.scrollBy({ left: 300, behavior: 'smooth' });
            });
            
            // Création d'indicateurs de colonnes
            const columnIndicators = document.querySelector('.column-indicators');
            if (columnIndicators) {
                kanbanColumns.forEach((column, index) => {
                    const indicator = document.createElement('button');
                    indicator.classList.add('column-indicator');
                    indicator.setAttribute('aria-label', `Aller à la colonne ${index + 1}`);
                    
                    if (index === 0) {
                        indicator.classList.add('active');
                    }
                    
                    indicator.addEventListener('click', function() {
                        column.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                    });
                    
                    columnIndicators.appendChild(indicator);
                });
                
                // Mise à jour des indicateurs lors du défilement
                kanbanContainer.addEventListener('scroll', function() {
                    const indicators = document.querySelectorAll('.column-indicator');
                    const containerRect = kanbanContainer.getBoundingClientRect();
                    
                    let activeIndex = 0;
                    let minDistance = Infinity;
                    
                    kanbanColumns.forEach((column, index) => {
                        const rect = column.getBoundingClientRect();
                        const distance = Math.abs(rect.left - containerRect.left);
                        
                        if (distance < minDistance) {
                            minDistance = distance;
                            activeIndex = index;
                        }
                    });
                    
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === activeIndex);
                    });
                    
                    // Masquer/afficher les boutons de défilement en fonction de la position
                    const isAtStart = kanbanContainer.scrollLeft < 50;
                    const isAtEnd = kanbanContainer.scrollLeft + kanbanContainer.clientWidth >= kanbanContainer.scrollWidth - 50;
                    
                    scrollButtons[0].classList.toggle('hidden', isAtStart);
                    scrollButtons[1].classList.toggle('hidden', isAtEnd);
                });
            }
        }
        
        // Mise à jour des compteurs de cartes par colonne
        function updateColumnCounts() {
            kanbanColumns.forEach(column => {
                const cards = column.querySelectorAll('.kanban-card').length;
                const counter = column.querySelector('.kanban-column-count');
                if (counter) {
                    counter.textContent = cards;
                    
                    // Animation du compteur
                    counter.classList.add('update-animation');
                    setTimeout(() => {
                        counter.classList.remove('update-animation');
                    }, 500);
                }
            });
        }
        
        // Initialiser les compteurs au chargement
        updateColumnCounts();
    }
    
    // Initialisation du panneau de détails
    function initDetailPanel() {
        const viewButtons = document.querySelectorAll('.view-candidate');
        const panel = document.getElementById('candidateDetailsPanel');
        const overlay = document.getElementById('panelOverlay');
        const closeBtn = document.getElementById('closePanelBtn');
        
        if (panel && overlay) {
            viewButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const candidateId = this.dataset.candidateId;
                    
                    // Animation d'ouverture plus fluide
                    panel.classList.add('open');
                    overlay.classList.add('open');
                    document.body.style.overflow = 'hidden';
                    
                    // Animation des éléments internes du panneau
                    const panelElements = panel.querySelectorAll('.panel-animate-in');
                    panelElements.forEach((el, index) => {
                        el.style.animationDelay = `${0.1 + (index * 0.05)}s`;
                    });
                    
                    // Simuler le chargement des données (à remplacer par un appel API réel)
                    fetchCandidateDetails(candidateId);
                });
            });
            
            closeBtn?.addEventListener('click', function() {
                panel.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            });
            
            overlay?.addEventListener('click', function() {
                panel.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
        
        // Onglets dans le panneau de détails
        const panelTabs = document.querySelectorAll('.panel-tab');
        panelTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Activer l'onglet
                panelTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Afficher le contenu
                const tabContents = document.querySelectorAll('.panel-tab-content');
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.dataset.tabContent === tabId);
                    
                    if (content.dataset.tabContent === tabId) {
                        // Animation du contenu
                        content.style.animation = 'fadeIn 0.3s ease forwards';
                    }
                });
            });
        });
        
        function fetchCandidateDetails(id) {
            // Simuler un chargement pour une meilleure UX
            const profileInfo = panel.querySelector('.candidate-profile');
            if (profileInfo) {
                profileInfo.innerHTML = '<div class="loading-skeleton"></div>'.repeat(5);
                
                // Après un délai, afficher les données simulées
                setTimeout(() => {
                    // Ici, on simulerait un appel API
                    // Pour la démo, on réaffiche simplement le contenu d'origine
                    profileInfo.innerHTML = `
                        <div class="profile-header">
                            <div class="profile-avatar">PN</div>
                            <div class="profile-info">
                                <h4 class="candidate-name">Prénom Nom</h4>
                                <p class="candidate-position">Comptabilité général</p>
                                <div class="candidate-match">
                                    <div class="match-progress">
                                        <div class="match-bar" style="width: 90%"></div>
                                    </div>
                                    <span>90% de compatibilité</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="btn btn-primary btn-sm"><i class="ph-calendar-plus"></i> Planifier</button>
                            <button class="btn btn-outline btn-sm"><i class="ph-envelope-simple"></i> Contacter</button>
                            <button class="btn-icon btn-outline btn-sm"><i class="ph-dots-three-outline"></i></button>
                        </div>
                    `;
                }, 600);
            }
        }
    }
    
    // Initialisation des onglets
    function initTabs() {
        const tabs = document.querySelectorAll('.view-tab');
        const views = document.querySelectorAll('.view-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const viewId = this.dataset.view;
                
                // Activation de l'onglet
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Affichage de la vue
                views.forEach(view => {
                    if (view.id === viewId + '-view') {
                        view.classList.add('active');
                        
                        // Animation d'entrée
                        view.style.animation = 'fadeIn 0.3s ease forwards';
                    } else {
                        view.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Initialisation des filtres
    function initFilters() {
        const jobTabs = document.querySelectorAll('.job-filter-tab');
        const filterChips = document.querySelectorAll('.filter-chip');
        const dropdownItems = document.querySelectorAll('.dropdown-item[data-filter-type]');
        
        // Filtres d'emploi
        jobTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                jobTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const jobId = this.dataset.jobId;
                filterJobView(jobId);
            });
        });
        
        // Suppression de filtres
        filterChips.forEach(chip => {
            const removeBtn = chip.querySelector('.remove-filter');
            removeBtn?.addEventListener('click', function() {
                chip.classList.add('removing');
                
                setTimeout(() => {
                    chip.remove();
                    updateFilters();
                }, 300);
            });
        });
        
        // Ajout de filtres depuis le dropdown
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const type = this.dataset.filterType;
                const value = this.dataset.filterValue;
                
                // Mise à jour visuelle des éléments du dropdown
                const items = document.querySelectorAll(`.dropdown-item[data-filter-type="${type}"]`);
                items.forEach(i => {
                    const icon = i.querySelector('i');
                    if (icon) {
                        icon.className = 'ph-square text-gray me-2';
                    }
                });
                
                const thisIcon = this.querySelector('i');
                if (thisIcon) {
                    thisIcon.className = 'ph-check text-primary me-2';
                }
                
                // Ajout du filtre visuel si pas déjà présent
                if (!document.querySelector(`.filter-chip[data-type="${type}"][data-value="${value}"]`)) {
                    addFilterChip(type, value, this.textContent.trim());
                }
                
                // Appliquer le filtre
                updateFilters();
            });
        });
        
        function addFilterChip(type, value, label) {
            const chipsContainer = document.querySelector('.filter-chips');
            
            if (chipsContainer) {
                // Supprimer les filtres du même type si exclusifs (comme le tri)
                if (type === 'sort') {
                    const existingSortChips = document.querySelectorAll('.filter-chip[data-type="sort"]');
                    existingSortChips.forEach(chip => chip.remove());
                }
                
                const chip = document.createElement('div');
                chip.classList.add('filter-chip');
                chip.dataset.type = type;
                chip.dataset.value = value;
                chip.innerHTML = `
                    <span>${label}</span>
                    <button class="remove-filter" aria-label="Supprimer le filtre">
                        <i class="ph-x"></i>
                    </button>
                `;
                
                // Animation d'entrée
                chip.style.opacity = '0';
                chip.style.transform = 'scale(0.8)';
                
                chipsContainer.appendChild(chip);
                
                // Force reflow
                void chip.offsetWidth;
                
                chip.style.opacity = '1';
                chip.style.transform = 'scale(1)';
                
                // Ajouter l'événement de suppression
                const removeBtn = chip.querySelector('.remove-filter');
                removeBtn.addEventListener('click', function() {
                    chip.classList.add('removing');
                    setTimeout(() => {
                        chip.remove();
                        updateFilters();
                    }, 300);
                });
            }
        }
        
        function updateFilters() {
            // Ici, on collecterait tous les filtres actifs et on les appliquerait
            const activeFilters = document.querySelectorAll('.filter-chip');
            const filters = {
                job: [],
                stage: [],
                sort: null
            };
            
            activeFilters.forEach(filter => {
                const type = filter.dataset.type;
                const value = filter.dataset.value;
                
                if (type === 'job') {
                    filters.job.push(value);
                } else if (type === 'stage') {
                    filters.stage.push(value);
                } else if (type === 'sort') {
                    filters.sort = value;
                }
            });
            
            console.log('Filtres appliqués:', filters);
            
            // Pour la démo, on montre juste une notification
            showToast('Filtres mis à jour', 'info');
        }
        
        function filterJobView(jobId) {
            // Ici, on implémente le filtrage réel des cartes
            // Pour la démo, juste un message de console
            console.log('Filtrage par job:', jobId);
            
            if (jobId === 'tous') {
                // Afficher toutes les cartes
                document.querySelectorAll('.kanban-card').forEach(card => {
                    card.style.display = '';
                });
            } else {
                // Filtrer par type de job
                document.querySelectorAll('.kanban-card').forEach(card => {
                    const jobTag = card.querySelector('.job-tag');
                    
                    if (jobTag && jobTag.textContent.toLowerCase().includes(jobId)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        }
    }
    
    // Initialisation du bouton d'action flottant
    function initActionButton() {
        const actionBtn = document.getElementById('btnAdd');
        const actionMenu = document.getElementById('btnAddMenu');
        
        if (actionBtn && actionMenu) {
            actionBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                actionMenu.classList.toggle('open');
            });
            
            // Fermeture du menu au clic à l'extérieur
            document.addEventListener('click', function(e) {
                if (!actionBtn.contains(e.target) && !actionMenu.contains(e.target)) {
                    actionBtn.classList.remove('active');
                    actionMenu.classList.remove('open');
                }
            });
            
            // Animation des options du menu
            const menuItems = actionMenu.querySelectorAll('.action-menu-item');
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.05 * index}s`;
            });
        }
    }
    
    // Initialisation des tooltips
    function initTooltips() {
        // Sélectionner les éléments qui devraient avoir des tooltips
        const elements = document.querySelectorAll('[title]:not([data-tooltip-disabled])');
        
        elements.forEach(el => {
            const title = el.getAttribute('title');
            
            if (title) {
                // Créer le tooltip
                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                // Supprimer l'attribut title original pour éviter le double tooltip
                el.removeAttribute('title');
                el.dataset.tooltip = title;
                
                // Ajouter les événements
                el.addEventListener('mouseenter', function(e) {
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = rect.left + (rect.width / 2) + 'px';
                    tooltip.style.top = rect.top - 8 + 'px';
                    tooltip.classList.add('show');
                });
                
                el.addEventListener('mouseleave', function() {
                    tooltip.classList.remove('show');
                });
                
                // Nettoyer le tooltip lorsque l'élément n'est plus visible
                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            tooltip.classList.remove('show');
                        }
                    });
                }).observe(el);
            }
        });
        
        // Style pour le tooltip
        const style = document.createElement('style');
        style.textContent = `
            .tooltip {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transform: translate(-50%, -100%) scale(0.8);
                transition: opacity 0.2s, transform 0.2s;
                white-space: nowrap;
            }
            
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
            }
            
            .tooltip.show {
                opacity: 1;
                transform: translate(-50%, calc(-100% - 8px)) scale(1);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialisation des notifications toast
    function initNotifications() {
        // Créer un conteneur pour les toasts s'il n'existe pas
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.classList.add('toast-container');
            document.body.appendChild(toastContainer);
        }
        
        // Styles pour les toasts s'ils ne sont pas déjà définis
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 350px;
                }
                
                .toast {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .toast.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .toast-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    flex-shrink: 0;
                }
                
                .toast-success .toast-icon {
                    background-color: rgba(16, 185, 129, 0.1);
                    color: #10B981;
                }
                
                .toast-info .toast-icon {
                    background-color: rgba(79, 70, 229, 0.1);
                    color: #4F46E5;
                }
                
                .toast-warning .toast-icon {
                    background-color: rgba(245, 158, 11, 0.1);
                    color: #F59E0B;
                }
                
                .toast-error .toast-icon {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #EF4444;
                }
                
                .toast-content {
                    flex: 1;
                    font-size: 14px;
                    color: #4B5563;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    color: #9CA3AF;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .toast-close:hover {
                    background-color: #F3F4F6;
                    color: #4B5563;
                }
                
                @media (max-width: 640px) {
                    .toast-container {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    // Fonction pour afficher une notification
    window.showToast = function(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.toast-container');
        
        if (container) {
            const toast = document.createElement('div');
            toast.classList.add('toast', `toast-${type}`);
            
            let icon = 'info';
            if (type === 'success') icon = 'check';
            if (type === 'warning') icon = 'warning';
            if (type === 'error') icon = 'x';
            
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="ph-${icon}"></i>
                </div>
                <div class="toast-content">${message}</div>
                <button class="toast-close" aria-label="Fermer">
                    <i class="ph-x"></i>
                </button>
            `;
            
            container.appendChild(toast);
            
            // Animation d'entrée
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Auto-fermeture
            const timeout = setTimeout(() => {
                closeToast(toast);
            }, duration);
            
            // Bouton fermer
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(timeout);
                closeToast(toast);
            });
            
            function closeToast(toast) {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => {
                    toast.remove();
                });
            }
            
            return toast;
        }
    };
    
    // Détection de balayage (swipe) sur mobile
    function initSwipeDetection() {
        const kanbanContainer = document.querySelector('.kanban-container');
        if (!kanbanContainer) return;
        
        let touchstartX = 0;
        let touchendX = 0;
        
        kanbanContainer.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        });
        
        kanbanContainer.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const diff = touchstartX - touchendX;
            const threshold = 70; // Seuil pour le swipe
            
            if (Math.abs(diff) < threshold) return;
            
            if (diff > 0) {
                // Swipe gauche - aller à droite
                kanbanContainer.scrollBy({ left: 280, behavior: 'smooth' });
            } else {
                // Swipe droit - aller à gauche
                kanbanContainer.scrollBy({ left: -280, behavior: 'smooth' });
            }
        }
    }
    
    // Animation de la barre de progression
    function initProgressBar() {
        const progressLine = document.querySelector('.progress-line-filled');
        const progressSteps = document.querySelectorAll('.step-circle');
        
        if (progressLine && progressSteps.length) {
            // Animation initiale
            setTimeout(() => {
                progressLine.style.transition = 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                // Trouver l'étape active
                let activeIndex = 0;
                progressSteps.forEach((step, index) => {
                    if (step.classList.contains('active')) {
                        activeIndex = index;
                    }
                });
                
                // Calculer la largeur en pourcentage
                const totalSteps = progressSteps.length - 1;
                const progress = (activeIndex / totalSteps) * 100;
                
                // Animer la barre
                progressLine.style.width = `${progress}%`;
            }, 500);
        }
    }
    
    // Alternance du mode clair/sombre
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            // Vérifier le mode initial
            const darkMode = localStorage.getItem('darkMode') === 'true';
            
            if (darkMode) {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="ph-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="ph-sun"></i>';
            }
            
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                // Mettre à jour l'icône
                themeToggle.innerHTML = isDarkMode ? '<i class="ph-moon"></i>' : '<i class="ph-sun"></i>';
                
                // Animation de rotation
                themeToggle.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    themeToggle.style.transform = '';
                }, 500);
                
                // Sauvegarder la préférence
                localStorage.setItem('darkMode', isDarkMode);
                
                // Afficher une notification
                showToast(`Mode ${isDarkMode ? 'sombre' : 'clair'} activé`, 'info', 1500);
            });
        }
    }
    
    // Améliorations pour les barres de recherche
    function initSearchBoxes() {
        const searchBoxes = document.querySelectorAll('.search-box input, .search-global input');
        
        searchBoxes.forEach(input => {
            // Clear button
            const clearBtn = input.parentElement.querySelector('.search-clear');
            
            input.addEventListener('input', function() {
                if (clearBtn) {
                    clearBtn.style.display = this.value ? 'block' : 'none';
                }
            });
            
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    input.value = '';
                    input.focus();
                    this.style.display = 'none';
                    
                    // Déclencher l'événement input pour la recherche en temps réel
                    const event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);
                });
            }
            
            // Suggestions de recherche (pour la démo)
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.value.trim()) {
                    showToast(`Recherche: "${this.value}"`, 'info');
                    
                    // Pour la démo, filtrage simple
                    const searchTerm = this.value.toLowerCase();
                    document.querySelectorAll('.kanban-card').forEach(card => {
                        const cardText = card.textContent.toLowerCase();
                        card.style.display = cardText.includes(searchTerm) ? '' : 'none';
                    });
                }
            });
        });
    }
    
    // Animations générales
    function initAnimations() {
        // Animation des stat-cards au hover (effet 3D)
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX * 5;
                const deltaY = (y - centerY) / centerY * 5;
                
                this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
        
        // Animation des éléments au scroll
        const animateOnScroll = document.querySelectorAll('.animated-fade-in');
        
        if (animateOnScroll.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animateOnScroll.forEach(el => {
                observer.observe(el);
            });
        }
    }
});

// Classes CSS pour les styles du tooltip et animations (si non définies dans le CSS)
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Animations diverses */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    /* Animation de suppression des filtres */
    .filter-chip.removing {
        transform: scale(0.8);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    
    /* Animation pour les compteurs de colonnes */
    .kanban-column-count.update-animation {
        animation: pulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Animation pour les cartes déposées */
    .kanban-card.drop-success {
        animation: successPulse 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes successPulse {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    
    /* Overlay de la sidebar mobile */
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 99;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        backdrop-filter: blur(4px);
    }
    
    .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    /* Skeleton loading pour le panel */
    .loading-skeleton {
        height: 20px;
        margin: 10px 0;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    /* Utilitaire d'animation pour les éléments visibles au scroll */
    .animated-fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .animated-fade-in.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);
