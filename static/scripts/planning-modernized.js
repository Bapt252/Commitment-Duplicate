/**
 * planning-modernized.js
 * Script pour la version modernisée de la page planning
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des composants
  initSidebar();
  initUserMenu();
  initThemeToggle();
  initViewTabs();
  initFilterTabs();
  initKanban();
  initCandidatePanel();
  initActionButton();
  initToasts();
  initSearchBox();
  initResponsiveSupport();
  initAccessibilitySupport();
  
  // Animation d'entrée pour les éléments de la page
  animateEntrance();
});

/**
 * Gestion de la sidebar et de la navigation
 */
function initSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
  const sidebar = document.querySelector('.app-sidebar');
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '99';
  overlay.style.display = 'none';
  
  document.body.appendChild(overlay);
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      } else {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
  
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  });
}

/**
 * Gestion du menu utilisateur
 */
function initUserMenu() {
  const userMenuToggle = document.querySelector('.user-menu-toggle');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userMenuToggle && userDropdown) {
    userMenuToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      
      // Fermer si on clique ailleurs
      document.addEventListener('click', function closeDropdown(e) {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
          userMenuToggle.setAttribute('aria-expanded', 'false');
          document.removeEventListener('click', closeDropdown);
        }
      });
    });
  }
}

/**
 * Gestion du toggle de thème (clair/sombre)
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    // Vérifier s'il existe une préférence sauvegardée
    const savedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème initial
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
      updateThemeIcons(true);
    }
    
    themeToggle.addEventListener('click', function() {
      // Basculer la classe sur le document
      document.body.classList.toggle('dark-mode');
      
      // Sauvegarder la préférence
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      
      // Mettre à jour l'icône
      updateThemeIcons(isDarkMode);
      
      // Animation du bouton
      themeToggle.classList.add('rotate');
      setTimeout(() => {
        themeToggle.classList.remove('rotate');
      }, 500);
    });
  }
  
  function updateThemeIcons(isDarkMode) {
    // Assurez-vous que les icônes sont disponibles
    const sunIcon = document.createElement('i');
    sunIcon.className = 'ph-sun';
    const moonIcon = document.createElement('i');
    moonIcon.className = 'ph-moon';
    
    // Vider le conteneur
    if (themeToggle) {
      themeToggle.innerHTML = '';
      themeToggle.appendChild(isDarkMode ? moonIcon : sunIcon);
    }
  }
}

/**
 * Gestion des onglets de vue
 */
function initViewTabs() {
  const viewTabs = document.querySelectorAll('.view-tab');
  const viewContents = document.querySelectorAll('.view-content');
  
  viewTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Retirer la classe active de tous les onglets et contenus
      viewTabs.forEach(t => t.classList.remove('active'));
      viewContents.forEach(c => c.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet cliqué
      this.classList.add('active');
      
      // Afficher le contenu correspondant
      const view = this.getAttribute('data-view');
      const content = document.getElementById(`${view}-view`);
      if (content) {
        content.classList.add('active');
      }
      
      // Sauvegarder la préférence
      localStorage.setItem('planning-active-view', view);
    });
  });
  
  // Restaurer l'onglet actif s'il y en a un
  const savedView = localStorage.getItem('planning-active-view');
  if (savedView) {
    const tab = document.querySelector(`.view-tab[data-view="${savedView}"]`);
    if (tab) {
      tab.click();
    }
  }
}

/**
 * Gestion des filtres d'emploi
 */
function initFilterTabs() {
  const filterTabs = document.querySelectorAll('.job-filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Retirer la classe active de tous les onglets
      filterTabs.forEach(t => t.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet cliqué
      this.classList.add('active');
      
      // Filtrer les cartes en fonction du job sélectionné
      const jobId = this.getAttribute('data-job-id');
      filterCardsByJob(jobId);
      
      // Afficher une notification
      const tabName = this.querySelector('.job-tab-name').textContent;
      showToast(`Filtrage par "${tabName}"`, 'info');
    });
  });
  
  function filterCardsByJob(jobId) {
    const cards = document.querySelectorAll('.kanban-card');
    
    if (jobId === 'tous') {
      // Afficher toutes les cartes
      cards.forEach(card => {
        card.style.display = '';
      });
      return;
    }
    
    cards.forEach(card => {
      const jobTag = card.querySelector('.job-tag');
      if (jobTag) {
        const jobText = jobTag.textContent.toLowerCase();
        const matchesFilter = jobId === 'comptabilite' && jobText.includes('comptabilité') ||
                             jobId === 'assistant' && jobText.includes('assistant') ||
                             jobId === 'developpeur' && jobText.includes('développeur');
        
        card.style.display = matchesFilter ? '' : 'none';
      }
    });
  }
}

/**
 * Système Kanban amélioré
 */
function initKanban() {
  const draggableCards = document.querySelectorAll('.kanban-card');
  const dropZones = document.querySelectorAll('.kanban-column-content');
  
  // Rendre les cartes glissables
  draggableCards.forEach(card => {
    // Stocker la colonne d'origine
    card.dataset.originColumn = card.closest('.kanban-column').dataset.stage;
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    // Prévisualisation au survol
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover');
    });
    
    // Boutons d'action
    setupCardActions(card);
  });
  
  // Configurer les zones de drop
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);
  });
  
  function handleDragStart(e) {
    this.classList.add('dragging');
    // Stocker l'ID de la colonne d'origine s'il n'existe pas déjà
    if (!this.dataset.originColumn) {
      this.dataset.originColumn = this.closest('.kanban-column').dataset.stage;
    }
    // Ajouter des données au transfert
    e.dataTransfer.setData('text/plain', this.dataset.candidateId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Animation démarrage du drag
    setTimeout(() => {
      this.style.opacity = '0.6';
      this.style.transform = 'scale(0.98)';
    }, 0);
  }
  
  function handleDragEnd() {
    this.classList.remove('dragging');
    this.style.opacity = '';
    this.style.transform = '';
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const draggingCard = document.querySelector('.dragging');
    if (!draggingCard) return;
    
    const cardAfterDraggingCard = getClosestCardBelowDraggingCard(this, e.clientY);
    
    if (cardAfterDraggingCard) {
      this.insertBefore(draggingCard, cardAfterDraggingCard);
    } else {
      // Insérer avant le bouton "Ajouter un candidat"
      const addButton = this.querySelector('.kanban-add-card');
      if (addButton) {
        this.insertBefore(draggingCard, addButton);
      } else {
        this.appendChild(draggingCard);
      }
    }
  }
  
  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drop-target');
    this.closest('.kanban-column').style.backgroundColor = 'var(--primary-light)';
  }
  
  function handleDragLeave(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.classList.remove('drop-target');
    this.closest('.kanban-column').style.backgroundColor = '';
  }
  
  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drop-target');
    this.closest('.kanban-column').style.backgroundColor = '';
    
    // Récupérer la carte glissée
    const candidateId = e.dataTransfer.getData('text/plain');
    const draggedCard = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"]`);
    
    if (!draggedCard) return;
    
    // Récupérer les colonnes d'origine et de destination
    const originColumnId = draggedCard.dataset.originColumn;
    const targetColumnId = this.closest('.kanban-column').dataset.stage;
    
    // Vérifier si la carte est déplacée vers une nouvelle colonne
    if (originColumnId !== targetColumnId) {
      const originColumn = document.querySelector(`.kanban-column[data-stage="${originColumnId}"]`);
      const targetColumn = this.closest('.kanban-column');
      
      // Mettre à jour les compteurs
      updateColumnCount(originColumn, -1);
      updateColumnCount(targetColumn, 1);
      
      // Mettre à jour la colonne d'origine
      draggedCard.dataset.originColumn = targetColumnId;
      
      // Afficher une notification de déplacement
      const candidateName = draggedCard.querySelector('.kanban-card-title').textContent;
      const targetStageName = targetColumn.querySelector('.kanban-column-title').textContent.trim();
      
      showToast(`${candidateName} déplacé vers l'étape "${targetStageName}"`, 'success');
      
      // Animation de succès
      draggedCard.classList.add('moved');
      setTimeout(() => {
        draggedCard.classList.remove('moved');
      }, 500);
    }
  }
  
  function getClosestCardBelowDraggingCard(container, mouseY) {
    const cardElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
    
    return cardElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = mouseY - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  function updateColumnCount(column, delta) {
    if (!column) return;
    
    const countElement = column.querySelector('.kanban-column-count');
    if (countElement) {
      let currentCount = parseInt(countElement.textContent || '0');
      currentCount += delta;
      countElement.textContent = currentCount;
      
      // Animation de mise à jour
      countElement.animate([
        { transform: 'scale(1.3)', backgroundColor: 'var(--primary-dark)' },
        { transform: 'scale(1)', backgroundColor: 'var(--primary)' }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
    }
  }
  
  function setupCardActions(card) {
    // Bouton "Voir le candidat"
    const viewBtn = card.querySelector('.view-candidate');
    if (viewBtn) {
      viewBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Éviter la propagation au parent
        const candidateId = this.getAttribute('data-candidate-id');
        openCandidatePanel(candidateId);
      });
    }
    
    // Gestion des dropdowns d'actions
    const actionToggle = card.querySelector('.action-dropdown-toggle');
    const actionMenu = card.querySelector('.action-dropdown-menu');
    
    if (actionToggle && actionMenu) {
      actionToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Éviter la propagation au parent
        
        // Fermer tous les autres menus
        document.querySelectorAll('.action-dropdown-menu.show').forEach(menu => {
          if (menu !== actionMenu) {
            menu.classList.remove('show');
          }
        });
        
        // Basculer l'affichage du menu
        actionMenu.classList.toggle('show');
        
        // Fermer si on clique ailleurs
        function closeMenu(e) {
          if (!actionToggle.contains(e.target) && !actionMenu.contains(e.target)) {
            actionMenu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
          }
        }
        
        document.addEventListener('click', closeMenu);
      });
      
      // Configurer les actions du menu
      const actionItems = actionMenu.querySelectorAll('.action-dropdown-item');
      actionItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation(); // Éviter la propagation au parent
          
          const action = this.textContent.trim();
          const candidateName = card.querySelector('.kanban-card-title').textContent;
          
          if (action.includes('Planifier')) {
            showToast(`Planification d'un entretien avec ${candidateName}`, 'info');
            const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
            scheduleModal.show();
          } else if (action.includes('Contacter')) {
            showToast(`Envoi d'un message à ${candidateName}`, 'info');
          } else if (action.includes('Assigner')) {
            showToast(`Attribution du candidat ${candidateName}`, 'info');
          } else if (action.includes('Supprimer')) {
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${candidateName} ?`)) {
              // Animation de suppression
              card.style.opacity = '0';
              card.style.transform = 'translateY(-20px)';
              
              setTimeout(() => {
                // Mettre à jour le compteur de la colonne
                const column = card.closest('.kanban-column');
                updateColumnCount(column, -1);
                
                // Supprimer la carte
                card.remove();
                
                showToast(`${candidateName} a été supprimé`, 'warning');
              }, 300);
            }
          }
          
          // Fermer le menu
          actionMenu.classList.remove('show');
        });
      });
    }
    
    // Rendre la carte entière cliquable pour voir les détails
    card.addEventListener('click', function(e) {
      // Éviter le déclenchement si on clique sur un bouton ou un menu
      if (!e.target.closest('.kanban-card-actions') && !e.target.closest('.action-dropdown-menu')) {
        const candidateId = this.getAttribute('data-candidate-id');
        openCandidatePanel(candidateId);
      }
    });
  }
  
  // Fonctionnalité d'ajout de carte
  const addCardButtons = document.querySelectorAll('.kanban-add-card');
  addCardButtons.forEach(button => {
    button.addEventListener('click', function() {
      const column = this.closest('.kanban-column');
      showToast("Fonctionnalité d'ajout de candidat à venir", 'info');
      
      // Exemple d'animation pour montrer que le bouton fonctionne
      button.classList.add('pulse');
      setTimeout(() => {
        button.classList.remove('pulse');
      }, 500);
    });
  });
}

/**
 * Gestion du panneau de détails des candidats
 */
function initCandidatePanel() {
  const panel = document.getElementById('candidateDetailsPanel');
  const overlay = document.getElementById('panelOverlay');
  const closeBtn = document.getElementById('closePanelBtn');
  
  if (!panel) return;
  
  function openCandidatePanel(candidateId) {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    panel.classList.add('panel-animate-in');
    
    // Simuler le chargement des données du candidat
    const candidateCard = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"]`);
    if (candidateCard) {
      const candidateName = candidateCard.querySelector('.kanban-card-title').textContent;
      const candidateJob = candidateCard.querySelector('.job-tag').textContent;
      
      panel.querySelector('.candidate-name').textContent = candidateName;
      panel.querySelector('.candidate-position').textContent = candidateJob;
      panel.querySelector('.profile-avatar').textContent = candidateName.substring(0, 2);
      
      // Mettre à jour la correspondance (matching) aléatoire
      const matchBar = panel.querySelector('.match-bar');
      const matchPercent = Math.floor(Math.random() * 15) + 85; // Entre 85 et 99%
      matchBar.style.width = `${matchPercent}%`;
      panel.querySelector('.candidate-match span').textContent = `${matchPercent}% de compatibilité`;
    }
    
    // Gérer les onglets dans le panel
    const panelTabs = panel.querySelectorAll('.panel-tab');
    const panelContents = panel.querySelectorAll('.panel-tab-content');
    
    panelTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        panelTabs.forEach(t => t.classList.remove('active'));
        panelContents.forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        
        const tabId = this.getAttribute('data-tab');
        const content = panel.querySelector(`[data-tab-content="${tabId}"]`);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  }
  
  function closeCandidatePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    panel.classList.remove('panel-animate-in');
  }
  
  // Exposer la fonction pour une utilisation globale
  window.openCandidatePanel = openCandidatePanel;
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCandidatePanel);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeCandidatePanel);
  }
  
  // Fermeture avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeCandidatePanel();
    }
  });
}

/**
 * Bouton d'action flottant
 */
function initActionButton() {
  const actionBtn = document.getElementById('btnAdd');
  const actionMenu = document.getElementById('btnAddMenu');
  
  if (!actionBtn || !actionMenu) return;
  
  actionBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    actionMenu.classList.toggle('open');
    
    // Fermer si on clique ailleurs
    function closeMenu(e) {
      if (!actionBtn.contains(e.target) && !actionMenu.contains(e.target)) {
        actionBtn.classList.remove('active');
        actionMenu.classList.remove('open');
        document.removeEventListener('click', closeMenu);
      }
    }
    
    if (actionMenu.classList.contains('open')) {
      document.addEventListener('click', closeMenu);
    } else {
      document.removeEventListener('click', closeMenu);
    }
  });
  
  // Actions du menu
  const menuItems = actionMenu.querySelectorAll('.action-menu-item');
  menuItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      actionBtn.classList.remove('active');
      actionMenu.classList.remove('open');
      
      // Traiter l'action en fonction de l'index
      if (index === 0) {
        // Ajouter un candidat
        showToast("Fonctionnalité d'ajout de candidat à venir", 'info');
      } else if (index === 1) {
        // Planifier un entretien
        const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
        scheduleModal.show();
      } else if (index === 2) {
        // Créer une colonne
        showToast("Fonctionnalité de création de colonne à venir", 'info');
      }
    });
  });
}

/**
 * Système de notifications Toast
 */
function initToasts() {
  // Créer le conteneur s'il n'existe pas
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  // Exposer la fonction showToast globalement
  window.showToast = function(message, type = 'info', duration = 3000) {
    // Créer un nouvel élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icône selon le type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'warning';
    if (type === 'error') icon = 'x-circle';
    
    // Structure du toast
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="ph-${icon}"></i>
      </div>
      <div class="toast-content">
        <p>${message}</p>
      </div>
      <button class="toast-close">
        <i class="ph-x"></i>
      </button>
    `;
    
    // Ajouter le toast au conteneur
    const toastContainer = document.querySelector('.toast-container');
    toastContainer.appendChild(toast);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
    
    // Bouton de fermeture
    toast.querySelector('.toast-close').addEventListener('click', () => {
      closeToast(toast);
    });
    
    // Fermeture automatique
    if (duration !== 0) {
      setTimeout(() => {
        closeToast(toast);
      }, duration);
    }
    
    function closeToast(toastElement) {
      toastElement.style.transform = 'translateX(100%)';
      toastElement.style.opacity = '0';
      
      toastElement.addEventListener('transitionend', () => {
        toastElement.remove();
      });
    }
    
    return toast;
  };
}

/**
 * Gestion de la recherche
 */
function initSearchBox() {
  const searchInput = document.querySelector('.search-box input');
  const clearSearchBtn = document.querySelector('.search-clear');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    // Afficher le bouton d'effacement si le champ n'est pas vide
    if (clearSearchBtn) {
      clearSearchBtn.style.display = this.value ? 'block' : 'none';
    }
    
    // Si l'utilisateur appuie sur Entrée
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase().trim();
        if (searchTerm) {
          performSearch(searchTerm);
        } else {
          resetSearch();
        }
      }
    });
  });
  
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      resetSearch();
    });
  }
  
  function performSearch(searchTerm) {
    const cards = document.querySelectorAll('.kanban-card');
    let matchCount = 0;
    
    cards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      
      if (cardText.includes(searchTerm)) {
        card.style.display = '';
        highlightMatches(card, searchTerm);
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    if (matchCount > 0) {
      showToast(`${matchCount} résultat${matchCount > 1 ? 's' : ''} trouvé${matchCount > 1 ? 's' : ''}`, 'info');
    } else {
      showToast('Aucun résultat trouvé', 'warning');
    }
  }
  
  function highlightMatches(card, searchTerm) {
    // Restaurer le texte original
    if (card.originalHTML) {
      card.innerHTML = card.originalHTML;
    } else {
      card.originalHTML = card.innerHTML;
    }
    
    // Fonction récursive pour parcourir et mettre en évidence le texte
    function highlightNode(node) {
      if (node.nodeType === 3) { // Nœud texte
        const content = node.textContent;
        const lowercaseContent = content.toLowerCase();
        const index = lowercaseContent.indexOf(searchTerm);
        
        if (index >= 0) {
          const before = content.substring(0, index);
          const match = content.substring(index, index + searchTerm.length);
          const after = content.substring(index + searchTerm.length);
          
          const span = document.createElement('span');
          span.className = 'search-highlight';
          span.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
          span.style.color = 'var(--primary)';
          span.style.borderRadius = '2px';
          span.style.padding = '0 2px';
          span.textContent = match;
          
          const fragment = document.createDocumentFragment();
          fragment.appendChild(document.createTextNode(before));
          fragment.appendChild(span);
          fragment.appendChild(document.createTextNode(after));
          
          node.parentNode.replaceChild(fragment, node);
          return true;
        }
      } else if (node.nodeType === 1) { // Élément
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
          Array.from(node.childNodes).forEach(child => highlightNode(child));
        }
      }
      return false;
    }
    
    Array.from(card.childNodes).forEach(node => highlightNode(node));
  }
  
  function resetSearch() {
    const cards = document.querySelectorAll('.kanban-card');
    
    cards.forEach(card => {
      card.style.display = '';
      
      // Restaurer le contenu original
      if (card.originalHTML) {
        card.innerHTML = card.originalHTML;
        card.originalHTML = null;
      }
    });
  }
}

/**
 * Support pour les appareils mobiles
 */
function initResponsiveSupport() {
  const isMobile = window.innerWidth < 768;
  const kanbanContainer = document.querySelector('.kanban-container');
  
  if (isMobile && kanbanContainer) {
    setupMobileKanban();
  }
  
  // Réinitialiser en cas de redimensionnement
  window.addEventListener('resize', function() {
    const isMobileNow = window.innerWidth < 768;
    if (isMobileNow !== isMobile && kanbanContainer) {
      location.reload(); // Solution simple: recharger la page
    }
  });
  
  function setupMobileKanban() {
    const scrollButtons = document.querySelector('.kanban-scroll-buttons');
    const btnScrollLeft = document.querySelector('.btn-scroll-left');
    const btnScrollRight = document.querySelector('.btn-scroll-right');
    
    if (scrollButtons && btnScrollLeft && btnScrollRight) {
      // Navigation dans les colonnes
      btnScrollLeft.addEventListener('click', () => {
        kanbanContainer.scrollBy({
          left: -320,
          behavior: 'smooth'
        });
      });
      
      btnScrollRight.addEventListener('click', () => {
        kanbanContainer.scrollBy({
          left: 320,
          behavior: 'smooth'
        });
      });
      
      // Masquer/afficher les boutons selon la position de défilement
      kanbanContainer.addEventListener('scroll', () => {
        if (kanbanContainer.scrollLeft <= 10) {
          btnScrollLeft.classList.add('hidden');
        } else {
          btnScrollLeft.classList.remove('hidden');
        }
        
        if (kanbanContainer.scrollLeft + kanbanContainer.clientWidth >= kanbanContainer.scrollWidth - 10) {
          btnScrollRight.classList.add('hidden');
        } else {
          btnScrollRight.classList.remove('hidden');
        }
        
        updateColumnIndicators();
      });
      
      // Déclencher l'événement scroll pour initialiser l'état des boutons
      kanbanContainer.dispatchEvent(new Event('scroll'));
    }
    
    // Ajouter des indicateurs de colonne pour savoir où on se trouve
    const columnIndicators = document.querySelector('.column-indicators');
    if (columnIndicators) {
      const columns = kanbanContainer.querySelectorAll('.kanban-column');
      
      columns.forEach((col, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'column-indicator';
        indicator.dataset.column = index;
        indicator.setAttribute('aria-label', `Aller à ${col.querySelector('.kanban-column-title').textContent}`);
        
        indicator.addEventListener('click', () => {
          // Calculer la position de scroll
          const columnLeft = columns[index].offsetLeft;
          kanbanContainer.scrollTo({
            left: columnLeft,
            behavior: 'smooth'
          });
        });
        
        columnIndicators.appendChild(indicator);
      });
      
      // Mise à jour initiale
      updateColumnIndicators();
    }
    
    function updateColumnIndicators() {
      const columns = kanbanContainer.querySelectorAll('.kanban-column');
      const indicators = document.querySelectorAll('.column-indicator');
      const containerRect = kanbanContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      let activeIndex = 0;
      let minDistance = Infinity;
      
      columns.forEach((col, index) => {
        const colRect = col.getBoundingClientRect();
        const colCenter = colRect.left + colRect.width / 2;
        const distance = Math.abs(containerCenter - colCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });
      
      indicators.forEach((ind, i) => {
        if (i === activeIndex) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    }
  }
}

/**
 * Support d'accessibilité amélioré
 */
function initAccessibilitySupport() {
  // Skip to content
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
  
  // Support clavier pour les cartes Kanban
  const kanbanCards = document.querySelectorAll('.kanban-card');
  kanbanCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', function(e) {
      // Ouvrir le panel avec Entrée ou Espace
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const candidateId = this.getAttribute('data-candidate-id');
        openCandidatePanel(candidateId);
      }
    });
  });
  
  // Labels ARIA pour les éléments interactifs
  document.querySelectorAll('button:not([aria-label])').forEach(btn => {
    const text = btn.textContent.trim();
    if (text) {
      btn.setAttribute('aria-label', text);
    }
  });
}

/**
 * Animation d'entrée pour les éléments de la page
 */
function animateEntrance() {
  const elements = [
    document.querySelector('.page-header'),
    document.querySelector('.stats-cards'),
    document.querySelector('.recruitment-progress'),
    document.querySelector('.job-filters'),
    document.querySelector('.filter-toolbar')
  ];
  
  elements.forEach((element, index) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, index * 100);
    }
  });
  
  // Animation des colonnes Kanban
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach((column, index) => {
    column.style.animationDelay = `${index * 100}ms`;
  });
}
