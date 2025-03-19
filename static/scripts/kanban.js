/**
 * Script pour le système Kanban de planning de recrutement
 * Ajoute les fonctionnalités de drag & drop, visualisation des détails et notifications
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants et variables
    const draggableCards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');
    const candidatePanel = document.getElementById('candidateDetailsPanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const btnAdd = document.getElementById('btnAdd');
    const btnAddMenu = document.getElementById('btnAddMenu');
    const btnAddItems = document.querySelectorAll('.btn-add-item');
    const addCardButtons = document.querySelectorAll('.kanban-add-card');
    const candidateActionButtons = document.querySelectorAll('.view-candidate');

    // Initialisation des tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // ===== Fonctionnalité 1: Drag & Drop =====
    
    // Configurer les cartes pour être glissables
    draggableCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        
        // Animation d'entrée pour les cartes
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + Math.random() * 300);
    });
    
    // Configurer les colonnes pour recevoir les cartes
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });
    
    function handleDragStart(e) {
        this.classList.add('dragging');
        // Stocker l'ID de la colonne d'origine
        this.dataset.originColumn = this.closest('.kanban-column').dataset.stage;
        // Ajouter des données au transfert
        e.dataTransfer.setData('text/plain', this.dataset.candidateId);
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd() {
        this.classList.remove('dragging');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }
    
    function handleDragLeave() {
        this.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        // Récupérer la carte glissée
        const draggedCardId = e.dataTransfer.getData('text/plain');
        const draggedCard = document.querySelector(`.kanban-card[data-candidate-id="${draggedCardId}"]`);
        
        if (draggedCard) {
            // Récupérer les colonnes d'origine et de destination
            const originColumnId = draggedCard.dataset.originColumn;
            const targetColumnId = this.dataset.stage;
            
            // Vérifier si la carte est déplacée vers une nouvelle colonne
            if (originColumnId !== targetColumnId) {
                const originColumn = document.querySelector(`.kanban-column[data-stage="${originColumnId}"]`);
                const targetColumn = this;
                
                // Mettre à jour les compteurs
                updateColumnCount(originColumn, -1);
                updateColumnCount(targetColumn, 1);
                
                // Mettre à jour la colonne d'origine
                draggedCard.dataset.originColumn = targetColumnId;
                
                // Afficher une notification de déplacement
                const candidateName = draggedCard.querySelector('.kanban-card-title').textContent;
                const targetStageName = targetColumn.querySelector('.kanban-column-title').textContent.trim();
                
                showNotification(`${candidateName} déplacé vers l'étape "${targetStageName}"`, 'success');
                
                // Mettre à jour les étapes visuelles
                updateCardForNewStage(draggedCard, targetColumnId);
            }
            
            // Ajouter la carte à la colonne cible (avant le bouton d'ajout)
            const addButton = this.querySelector('.kanban-add-card');
            if (addButton) {
                this.querySelector('.kanban-column-content').insertBefore(draggedCard, addButton);
            } else {
                this.querySelector('.kanban-column-content').appendChild(draggedCard);
            }
        }
    }
    
    // Fonction pour mettre à jour visuellement la carte selon la nouvelle étape
    function updateCardForNewStage(card, newStage) {
        // Exemple: changer les actions disponibles selon l'étape
        const actionsContainer = card.querySelector('.kanban-card-actions');
        const infoContainer = card.querySelector('.kanban-card-info');
        
        // Mise à jour des informations selon l'étape
        if (newStage === 'visio' || newStage === 'inperson') {
            // Remplacer la disponibilité par la date d'entretien
            const availabilityInfo = infoContainer.querySelector('p:last-child');
            if (availabilityInfo && availabilityInfo.innerHTML.includes('Disponible')) {
                const today = new Date();
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 3);
                
                const formattedDate = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;
                availabilityInfo.innerHTML = `<i class="fas fa-calendar-alt"></i> Entretien: ${formattedDate}`;
            }
        } else if (newStage === 'offer') {
            // Remplacer la disponibilité par la date d'envoi de l'offre
            const availabilityInfo = infoContainer.querySelector('p:last-child');
            if (availabilityInfo) {
                const today = new Date();
                const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                availabilityInfo.innerHTML = `<i class="fas fa-paper-plane"></i> Envoyée le: ${formattedDate}`;
            }
        } else if (newStage === 'accepted') {
            // Remplacer la disponibilité par la date d'acceptation
            const availabilityInfo = infoContainer.querySelector('p:last-child');
            if (availabilityInfo) {
                const today = new Date();
                const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                availabilityInfo.innerHTML = `<i class="fas fa-calendar-check"></i> Acceptée le: ${formattedDate}`;
            }
        }
    }
    
    // Fonction pour mettre à jour le compteur d'une colonne
    function updateColumnCount(column, delta) {
        if (!column) return;
        
        const countElement = column.querySelector('.kanban-column-count');
        if (countElement) {
            let currentCount = parseInt(countElement.textContent || '0');
            currentCount += delta;
            countElement.textContent = currentCount;
            
            // Mise à jour de l'animation
            countElement.classList.add('count-updated');
            setTimeout(() => {
                countElement.classList.remove('count-updated');
            }, 1000);
        }
    }

    // ===== Fonctionnalité 2: Panel de détails candidat =====
    
    // Configurer les boutons pour ouvrir le panel de détails
    candidateActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateId = this.dataset.candidateId;
            openCandidatePanel(candidateId);
        });
    });
    
    // Configurer la fermeture du panel
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', closeCandidatePanel);
    }
    
    if (panelOverlay) {
        panelOverlay.addEventListener('click', closeCandidatePanel);
    }
    
    function openCandidatePanel(candidateId) {
        if (!candidatePanel) return;
        
        // Dans une vraie application, on chargerait les détails du candidat ici
        // en fonction de son ID, via une API par exemple
        
        // Pour la démo, on affiche simplement le panel
        candidatePanel.classList.add('open');
        panelOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Ajout d'une classe pour l'animation d'entrée
        candidatePanel.classList.add('panel-animate-in');
        
        // Simulation de chargement de données
        const candidateName = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"] .kanban-card-title`);
        const candidateJob = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"] .job-tag`);
        
        if (candidateName && candidateJob) {
            document.querySelector('.candidate-name').textContent = candidateName.textContent;
            document.querySelector('.candidate-position').textContent = candidateJob.textContent;
            document.querySelector('.candidate-avatar').textContent = candidateName.textContent.substring(0, 2);
        }
    }
    
    function closeCandidatePanel() {
        if (!candidatePanel) return;
        
        candidatePanel.classList.remove('open');
        if (panelOverlay) {
            panelOverlay.classList.remove('open');
        }
        document.body.style.overflow = '';
        
        // Animation de sortie
        candidatePanel.classList.remove('panel-animate-in');
    }

    // ===== Fonctionnalité 3: Menu d'actions flottant =====
    
    if (btnAdd && btnAddMenu) {
        btnAdd.addEventListener('click', function() {
            this.classList.toggle('active');
            btnAddMenu.classList.toggle('open');
        });
        
        btnAddItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                btnAddMenu.classList.remove('open');
                btnAdd.classList.remove('active');
                
                // Selon l'élément cliqué
                if (index === 0) {
                    // Ajouter un candidat
                    const addCandidateModal = new bootstrap.Modal(document.getElementById('addCandidateModal'));
                    addCandidateModal.show();
                } else if (index === 1) {
                    // Planifier un entretien
                    const scheduleInterviewModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
                    scheduleInterviewModal.show();
                } else if (index === 2) {
                    // Créer une colonne (fonctionnalité future)
                    showNotification('Création de colonne à venir dans une prochaine mise à jour', 'info');
                }
            });
        });
    }

    // ===== Fonctionnalité 4: Ajout de candidats =====
    
    addCardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const column = this.closest('.kanban-column');
            const stage = column.dataset.stage;
            
            // Ouvrir la modal d'ajout de candidat
            const addCandidateModal = new bootstrap.Modal(document.getElementById('addCandidateModal'));
            
            // On pourrait pré-remplir l'étape dans la modal
            // basé sur la colonne où l'utilisateur a cliqué
            addCandidateModal.show();
        });
    });

    // Gérer le formulaire d'ajout de candidat
    const addCandidateForm = document.querySelector('#addCandidateModal form');
    const addCandidateButton = document.querySelector('#addCandidateModal .btn-success');
    
    if (addCandidateButton) {
        addCandidateButton.addEventListener('click', function() {
            // Dans une vraie application, on enverrait les données à une API
            // Ici, on simule l'ajout d'un candidat
            
            const firstName = document.getElementById('candidateFirstName')?.value || 'Prénom';
            const lastName = document.getElementById('candidateLastName')?.value || 'N.';
            const position = document.getElementById('candidatePosition');
            const experience = document.getElementById('candidateExperience')?.value || '3+';
            const location = document.getElementById('candidateLocation')?.value || 'Paris';
            const availability = document.getElementById('candidateAvailability');
            
            // Déterminer la priorité
            let priority = 'medium';
            const priorityRadios = document.querySelectorAll('input[name="candidatePriority"]');
            priorityRadios.forEach(radio => {
                if (radio.checked) {
                    priority = radio.value;
                }
            });
            
            // Créer un nouvel ID pour ce candidat
            const newId = Date.now();
            
            // Ajouter le candidat à la première colonne
            addNewCandidateCard({
                id: newId,
                name: `${firstName} ${lastName.charAt(0)}.`,
                job: position ? position.options[position.selectedIndex]?.text || 'Candidat' : 'Candidat',
                experience: `${experience} Années d'expérience`,
                location: `${location} (25 min)`,
                availability: availability ? availability.options[availability.selectedIndex]?.text || 'Immédiatement' : 'Immédiatement',
                priority: priority
            });
            
            // Fermer la modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCandidateModal'));
            modal.hide();
            
            // Afficher une notification
            showNotification(`Candidat ${firstName} ${lastName} ajouté avec succès`, 'success');
            
            // Réinitialiser le formulaire
            if (addCandidateForm) {
                addCandidateForm.reset();
            }
        });
    }
    
    function addNewCandidateCard(candidate) {
        // Créer une nouvelle carte
        const newCard = document.createElement('div');
        newCard.className = 'kanban-card';
        newCard.draggable = true;
        newCard.dataset.candidateId = candidate.id;
        newCard.dataset.originColumn = 'new'; // Première colonne
        newCard.style.opacity = '0';
        newCard.style.transform = 'translateY(20px)';
        
        // Créer le contenu de la carte
        newCard.innerHTML = `
            <div class="kanban-card-header">
                <div class="kanban-card-title">${candidate.name}</div>
                <div class="priority-indicator priority-${candidate.priority}">
                    <i class="fas fa-flag"></i> ${getPriorityLabel(candidate.priority)}
                </div>
            </div>
            <div class="kanban-card-job">
                <span class="job-tag">${candidate.job}</span>
            </div>
            <div class="kanban-card-info">
                <p><i class="fas fa-briefcase"></i> ${candidate.experience}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${candidate.location}</p>
                <p><i class="fas fa-clock"></i> ${candidate.availability}</p>
            </div>
            <div class="kanban-card-actions">
                <button class="btn btn-sm btn-outline-secondary view-candidate" data-candidate-id="${candidate.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <div>
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter la carte à la première colonne
        const firstColumn = document.querySelector('.kanban-column[data-stage="new"]');
        if (!firstColumn) return;
        
        const addButton = firstColumn.querySelector('.kanban-add-card');
        
        if (addButton) {
            firstColumn.querySelector('.kanban-column-content').insertBefore(newCard, addButton);
        } else {
            firstColumn.querySelector('.kanban-column-content').appendChild(newCard);
        }
        
        // Mettre à jour le compteur
        updateColumnCount(firstColumn, 1);
        
        // Configurer le drag & drop pour cette nouvelle carte
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        
        // Configurer l'action de voir les détails
        const viewButton = newCard.querySelector('.view-candidate');
        if (viewButton) {
            viewButton.addEventListener('click', function() {
                openCandidatePanel(candidate.id);
            });
        }
        
        // Animation d'entrée
        setTimeout(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    function getPriorityLabel(priority) {
        switch(priority) {
            case 'high':
                return 'Élevé';
            case 'medium':
                return 'Moyen';
            case 'low':
                return 'Bas';
            default:
                return 'Moyen';
        }
    }

    // ===== Fonctionnalité 5: Système de notifications =====
    
    // Fonction pour afficher des notifications
    function showNotification(message, type = 'info') {
        // Créer l'élément toast
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        // Animation d'entrée
        toastEl.style.transform = 'translateY(20px)';
        toastEl.style.opacity = '0';
        
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
        if (!toastContainer) return;
        
        toastContainer.appendChild(toastEl);
        
        // Animation d'entrée
        setTimeout(() => {
            toastEl.style.transform = 'translateY(0)';
            toastEl.style.opacity = '1';
        }, 50);
        
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

    // ===== Fonctionnalité 6: Recherche et filtrage =====
    
    const searchInput = document.querySelector('.search-input-group input');
    const filterBadges = document.querySelectorAll('.filter-badge');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            // Si l'utilisateur appuie sur Entrée
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm) {
                    filterCards(searchTerm);
                } else {
                    resetFilter();
                }
            }
        });
    }
    
    filterBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Supprimer le filtre
            this.remove();
            
            // Réappliquer les filtres restants
            applyFiltersFromBadges();
        });
    });
    
    function filterCards(searchTerm) {
        const cards = document.querySelectorAll('.kanban-card');
        let matchFound = false;
        
        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            
            if (cardText.includes(searchTerm)) {
                card.style.display = '';
                card.classList.add('highlight-match');
                setTimeout(() => {
                    card.classList.remove('highlight-match');
                }, 2000);
                matchFound = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!matchFound) {
            showNotification(`Aucun résultat trouvé pour "${searchTerm}"`, 'warning');
        } else {
            showNotification(`Résultats affichés pour "${searchTerm}"`, 'info');
            
            // Ajouter un badge de filtre
            addFilterBadge(`Recherche: ${searchTerm}`);
        }
    }
    
    function resetFilter() {
        const cards = document.querySelectorAll('.kanban-card');
        cards.forEach(card => {
            card.style.display = '';
        });
    }
    
    function applyFiltersFromBadges() {
        // Récupérer tous les filtres actifs
        const activeBadges = document.querySelectorAll('.filter-badge');
        const filters = Array.from(activeBadges).map(badge => badge.textContent.trim().toLowerCase());
        
        // Si aucun filtre, tout afficher
        if (filters.length === 0) {
            resetFilter();
            return;
        }
        
        // Appliquer les filtres
        const cards = document.querySelectorAll('.kanban-card');
        
        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            let shouldDisplay = false;
            
            // Vérifier si la carte correspond à au moins un filtre
            for (const filter of filters) {
                if (cardText.includes(filter)) {
                    shouldDisplay = true;
                    break;
                }
            }
            
            card.style.display = shouldDisplay ? '' : 'none';
        });
    }
    
    function addFilterBadge(text) {
        // Vérifier si ce badge existe déjà
        const existingBadges = document.querySelectorAll('.filter-badge');
        for (const badge of existingBadges) {
            if (badge.textContent.trim().toLowerCase() === text.toLowerCase()) {
                return; // Ne pas ajouter de doublons
            }
        }
        
        // Créer un nouveau badge
        const badge = document.createElement('div');
        badge.className = 'filter-badge';
        badge.innerHTML = `
            <span>${text}</span>
            <i class="fas fa-xmark"></i>
        `;
        
        // Ajouter l'événement de clic
        badge.addEventListener('click', function() {
            this.remove();
            applyFiltersFromBadges();
        });
        
        // Ajouter au conteneur
        const badgesContainer = document.querySelector('.filter-badges');
        if (badgesContainer) {
            badgesContainer.appendChild(badge);
        }
    }
});
