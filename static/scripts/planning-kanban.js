/**
 * Script pour la gestion du Kanban par offre d'emploi
 * Permet le glisser-déposer des candidats entre différentes étapes
 * et la navigation vers la fiche détaillée des candidats
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const kanbanCards = document.querySelectorAll('.candidate-card');
    const kanbanColumns = document.querySelectorAll('.kanban-cards');

    // Gestion du glisser-déposer
    initializeDragAndDrop();
    
    // Gestion des boutons d'avancement d'étape
    initializeAdvanceButtons();
    
    // Gestion des liens vers les profils candidats
    initializeProfileLinks();
    
    // Mettre à jour les compteurs de colonnes
    updateColumnCounters();

    /**
     * Initialise le système de glisser-déposer pour les cartes candidats
     */
    function initializeDragAndDrop() {
        kanbanCards.forEach(card => {
            card.setAttribute('draggable', 'true');
            
            card.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', card.id || 'card');
                this.classList.add('dragging');
            });
            
            card.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });
        
        kanbanColumns.forEach(column => {
            column.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                const card = document.querySelector('.dragging');
                if (card) {
                    // Si le conteneur a un placeholder, on le supprime
                    const placeholder = this.querySelector('.add-candidate');
                    if (placeholder && placeholder.textContent.includes('Aucun candidat')) {
                        placeholder.remove();
                    }
                    
                    this.appendChild(card);
                    
                    // Mise à jour des compteurs
                    updateColumnCounters();
                    
                    // Affichage de la notification
                    showNotification('Candidat déplacé avec succès !', 'success');
                }
            });
        });
    }

    /**
     * Initialise les boutons d'avancement d'étape
     */
    function initializeAdvanceButtons() {
        const advanceButtons = document.querySelectorAll('.fa-chevron-right');
        advanceButtons.forEach(icon => {
            const button = icon.closest('button');
            if (button) {
                button.addEventListener('click', function() {
                    const card = this.closest('.candidate-card');
                    const currentColumn = card.closest('.kanban-column');
                    const nextColumn = currentColumn.nextElementSibling;
                    
                    if (nextColumn && nextColumn.classList.contains('kanban-column')) {
                        const nextCardsContainer = nextColumn.querySelector('.kanban-cards');
                        if (nextCardsContainer) {
                            // Si le conteneur a un placeholder, on le supprime
                            const placeholder = nextCardsContainer.querySelector('.add-candidate');
                            if (placeholder && placeholder.textContent.includes('Aucun candidat')) {
                                placeholder.remove();
                            }
                            
                            // Déplacer la carte
                            nextCardsContainer.appendChild(card);
                            
                            // Mise à jour des compteurs
                            updateColumnCounters();
                            
                            // Affichage de la notification
                            showNotification('Candidat avancé à l\'étape suivante !', 'success');
                        }
                    }
                });
            }
        });
    }

    /**
     * Initialise les liens vers les profils candidats
     */
    function initializeProfileLinks() {
        const profileLinks = document.querySelectorAll('.fa-user');
        profileLinks.forEach(icon => {
            const link = icon.closest('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    // Stockage d'informations sur le candidat pour la page de détail
                    const card = this.closest('.candidate-card');
                    const jobContainer = card.closest('.job-offer-container');
                    
                    const candidateData = {
                        name: card.querySelector('.candidate-name').textContent,
                        job: jobContainer.querySelector('.job-offer-title h3').textContent,
                        experience: card.querySelector('.fa-briefcase + span').textContent,
                        location: card.querySelector('.fa-map-marker-alt + span').textContent,
                    };
                    
                    // Stocker les données pour la page de profil
                    localStorage.setItem('currentCandidate', JSON.stringify(candidateData));
                });
            }
        });
    }

    /**
     * Met à jour les compteurs de candidats dans chaque colonne
     */
    function updateColumnCounters() {
        document.querySelectorAll('.kanban-column').forEach(column => {
            const cards = column.querySelectorAll('.candidate-card').length;
            const counter = column.querySelector('.kanban-column-count');
            if (counter) {
                counter.textContent = cards;
            }
        });
    }

    /**
     * Affiche une notification à l'utilisateur
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (success, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Supprimer les anciennes notifications
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(notif => notif.remove());
        
        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">${message}</div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Afficher la notification avec une animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Fermer automatiquement après 4 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        // Gestion du bouton de fermeture
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Si la page a été chargée avec un hash pour le tab Kanban, s'assurer qu'il est actif
    if (window.location.hash === '#candidates') {
        const candidatesTab = document.querySelector('#candidates-tab');
        if (candidatesTab) {
            candidatesTab.click();
        }
    }
});