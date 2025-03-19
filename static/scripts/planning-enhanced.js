/**
 * Script pour les fonctionnalités améliorées du planning de recrutement
 * Ce script gère les interactions avancées du planning de recrutement:
 * - Drag and drop des cartes Kanban
 * - Fonctionnalités des menus flottants
 * - Système de notifications
 */

document.addEventListener('DOMContentLoaded', function() {
    // ------ Fonctionnalités du Kanban amélioré ------
    initKanbanDragDrop();
    initFloatingMenu();
    
    // Système de notifications
    window.showNotification = function(message, type = 'info') {
        // Créer l'élément toast
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        // Contenu du toast
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Ajouter au conteneur
        const toastContainer = document.querySelector('.toast-container');
        if (toastContainer) {
            toastContainer.appendChild(toastEl);
            
            // Créer et afficher le toast
            const toast = new bootstrap.Toast(toastEl, {
                delay: 5000
            });
            toast.show();
            
            // Supprimer le toast après qu'il soit caché
            toastEl.addEventListener('hidden.bs.toast', function() {
                toastEl.remove();
            });
        }
    };
});

/**
 * Initialisation du drag & drop pour le Kanban
 */
function initKanbanDragDrop() {
    const kanbanCards = document.querySelectorAll('.kanban-card');
    const kanbanColumns = document.querySelectorAll('.kanban-column');
    let draggedCard = null;
    
    // Pour chaque carte kanban
    kanbanCards.forEach(card => {
        // Événement quand on commence à glisser
        card.addEventListener('dragstart', function(e) {
            draggedCard = card;
            setTimeout(() => {
                card.classList.add('dragging');
            }, 0);
        });
        
        // Événement quand on arrête de glisser
        card.addEventListener('dragend', function() {
            card.classList.remove('dragging');
            draggedCard = null;
            
            // Mettre à jour les compteurs de colonnes
            updateColumnCounts();
        });
    });
    
    // Pour chaque colonne kanban
    kanbanColumns.forEach(column => {
        // Événement quand on survole une colonne avec un élément
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        // Événement quand on quitte le survol
        column.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        // Événement quand on lâche un élément dans la colonne
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedCard) {
                // Obtenir la zone de contenu de la colonne
                const columnContent = this.querySelector('.kanban-column-content');
                
                // Insérer la carte avant le bouton "Ajouter"
                const addButton = columnContent.querySelector('.kanban-add-card');
                columnContent.insertBefore(draggedCard, addButton);
                
                // Animer la carte
                draggedCard.classList.add('animate-card');
                setTimeout(() => {
                    draggedCard.classList.remove('animate-card');
                }, 500);
                
                // Notifier le changement
                const cardTitle = draggedCard.querySelector('.kanban-card-title').textContent;
                const columnTitle = this.querySelector('.kanban-column-title').textContent.trim();
                showNotification(`${cardTitle} déplacé vers "${columnTitle}"`, 'success');
            }
        });
    });
}

/**
 * Mise à jour des compteurs de cartes dans les colonnes
 */
function updateColumnCounts() {
    const kanbanColumns = document.querySelectorAll('.kanban-column');
    
    kanbanColumns.forEach(column => {
        const cardCount = column.querySelectorAll('.kanban-card').length;
        const countElement = column.querySelector('.kanban-column-count');
        
        if (countElement) {
            countElement.textContent = cardCount;
        }
    });
}

/**
 * Initialisation du menu flottant
 */
function initFloatingMenu() {
    const btnAdd = document.getElementById('btnAdd');
    const btnAddMenu = document.getElementById('btnAddMenu');
    const btnAddItems = document.querySelectorAll('.btn-add-item');
    
    if (btnAdd && btnAddMenu) {
        btnAdd.addEventListener('click', function() {
            btnAddMenu.classList.toggle('open');
            this.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!btnAddMenu.contains(e.target) && e.target !== btnAdd) {
                btnAddMenu.classList.remove('open');
                btnAdd.classList.remove('active');
            }
        });
        
        // Gestion des actions du menu flottant
        btnAddItems.forEach(item => {
            item.addEventListener('click', function() {
                const label = this.querySelector('.btn-add-menu-label').textContent;
                
                if (label.includes('Ajouter un candidat')) {
                    const addCandidateModal = new bootstrap.Modal(document.getElementById('addCandidateModal'));
                    addCandidateModal.show();
                } else if (label.includes('Planifier un entretien')) {
                    const scheduleInterviewModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
                    scheduleInterviewModal.show();
                } else if (label.includes('Créer une colonne')) {
                    showNotification('Fonctionnalité à venir: Création de colonne personnalisée', 'info');
                }
                
                // Fermer le menu
                btnAddMenu.classList.remove('open');
                btnAdd.classList.remove('active');
            });
        });
    }
}
