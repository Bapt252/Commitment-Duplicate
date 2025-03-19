/**
 * Script amélioré pour le planning de recrutement avec fonctionnalités ajoutées:
 * - Gestion du filtrage par offre d'emploi
 * - Assignation de membres de l'organisation aux candidats
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants
    initKanbanSystem();
    initTeamAssignments();
    initJobOfferFilter();
    setupModals();
});

/**
 * Initialise le système Kanban et ses fonctionnalités
 */
function initKanbanSystem() {
    // Sélection des éléments DOM
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

    // Fonctionnalités de base du Kanban
    setupDragAndDrop(draggableCards, columns);
    setupCandidatePanel(candidateActionButtons, closePanelBtn, panelOverlay, candidatePanel);
    setupAddButtons(btnAdd, btnAddMenu, btnAddItems);
    setupSearch();
}

/**
 * Configure le drag & drop du Kanban
 */
function setupDragAndDrop(cards, columns) {
    // Événements pour les cartes
    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            // Stocker l'ID de la colonne d'origine
            this.dataset.originColumn = this.closest('.kanban-column').dataset.stage;
            // Ajouter des données au transfert
            e.dataTransfer.setData('text/plain', this.dataset.candidateId);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        card.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Événements pour les colonnes
    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        column.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', function(e) {
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
                    
                    // NOUVEAU: Si c'est une étape qui nécessite des participants, proposer d'en ajouter
                    if (targetColumnId === 'visio' || targetColumnId === 'inperson') {
                        // Vérifier si le candidat a déjà des participants assignés
                        const assignedMembers = draggedCard.querySelector('.assigned-members-avatars');
                        
                        if (assignedMembers && assignedMembers.childElementCount < 2) {
                            setTimeout(() => {
                                if (confirm(`Voulez-vous assigner plus de membres à l'entretien avec ${candidateName}?`)) {
                                    const assignMembersModal = new bootstrap.Modal(document.getElementById('assignMembersModal'));
                                    
                                    // Mettre à jour le titre de la modal pour préciser le candidat
                                    const modalTitle = document.getElementById('assignMembersModalLabel');
                                    if (modalTitle) {
                                        modalTitle.textContent = `Assigner des membres à l'entretien avec ${candidateName}`;
                                    }
                                    
                                    assignMembersModal.show();
                                }
                            }, 800);
                        }
                    }
                }
                
                // Ajouter la carte à la colonne cible (avant le bouton d'ajout)
                const addButton = this.querySelector('.kanban-add-card');
                if (addButton) {
                    this.querySelector('.kanban-column-content').insertBefore(draggedCard, addButton);
                } else {
                    this.querySelector('.kanban-column-content').appendChild(draggedCard);
                }
            }
        });
    });
}

/**
 * Configure le panneau de détails du candidat
 */
function setupCandidatePanel(actionButtons, closeButton, overlay, panel) {
    // Ouvrir le panel quand on clique sur un candidat
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateId = this.dataset.candidateId;
            openCandidatePanel(candidateId, panel, overlay);
        });
    });
    
    // Fermer le panel
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeCandidatePanel(panel, overlay);
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeCandidatePanel(panel, overlay);
        });
    }
}

/**
 * Ouvre le panel de détails du candidat
 */
function openCandidatePanel(candidateId, panel, overlay) {
    if (!panel) return;
    
    // Récupérer les informations du candidat
    const candidateCard = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"]`);
    
    if (candidateCard) {
        const candidateName = candidateCard.querySelector('.kanban-card-title')?.textContent || 'Prénom Nom';
        const candidateJob = candidateCard.querySelector('.job-tag')?.textContent || 'Poste';
        const candidateInitials = candidateName.substring(0, 2);
        
        // Mettre à jour le panel avec les informations du candidat
        panel.querySelector('.candidate-name').textContent = candidateName;
        panel.querySelector('.candidate-position').textContent = candidateJob;
        panel.querySelector('.candidate-avatar').textContent = candidateInitials;
        
        // NOUVEAU: Récupérer et afficher les membres assignés
        const assignedMembers = candidateCard.querySelectorAll('.member-avatar');
        const panelMembersContainer = panel.querySelector('.panel-section:first-of-type .d-flex.flex-wrap');
        
        if (panelMembersContainer) {
            // Vider le conteneur
            panelMembersContainer.innerHTML = '';
            
            // Si des membres sont assignés, les afficher
            if (assignedMembers.length > 0) {
                assignedMembers.forEach(member => {
                    const memberInitials = member.textContent;
                    let memberName = 'Membre';
                    let memberRole = 'Équipe';
                    
                    // Déterminer le nom et le rôle en fonction des initiales
                    if (memberInitials === 'TM') {
                        memberName = 'Thomas Martin';
                        memberRole = 'Directeur RH';
                    } else if (memberInitials === 'MD') {
                        memberName = 'Marie Durand';
                        memberRole = 'Responsable recrutement';
                    } else if (memberInitials === 'JB') {
                        memberName = 'Jean Bernard';
                        memberRole = 'Responsable technique';
                    } else if (memberInitials === 'CL') {
                        memberName = 'Claire Leroy';
                        memberRole = 'Responsable financier';
                    }
                    
                    const memberElement = document.createElement('div');
                    memberElement.className = 'd-flex align-items-center p-2 bg-light rounded';
                    memberElement.innerHTML = `
                        <div class="member-avatar me-2">${memberInitials}</div>
                        <div>
                            <div class="fw-bold">${memberName}</div>
                            <div class="small text-muted">${memberRole}</div>
                        </div>
                    `;
                    
                    panelMembersContainer.appendChild(memberElement);
                });
            } else {
                // Si aucun membre n'est assigné, afficher un message
                const noMembersMessage = document.createElement('div');
                noMembersMessage.className = 'text-muted fst-italic';
                noMembersMessage.textContent = 'Aucun membre assigné pour le moment.';
                panelMembersContainer.appendChild(noMembersMessage);
            }
        }
    }
    
    // Afficher le panel
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    panel.classList.add('panel-animate-in');
}

/**
 * Ferme le panel de détails du candidat
 */
function closeCandidatePanel(panel, overlay) {
    if (!panel) return;
    
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    panel.classList.remove('panel-animate-in');
}

/**
 * Configure les boutons d'ajout
 */
function setupAddButtons(mainButton, menu, items) {
    if (mainButton && menu) {
        mainButton.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('open');
        });
        
        items.forEach((item, index) => {
            item.addEventListener('click', function() {
                menu.classList.remove('open');
                mainButton.classList.remove('active');
                
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
                    // Créer une colonne
                    showNotification('Création de colonne à venir dans une prochaine mise à jour', 'info');
                }
            });
        });
    }
}

/**
 * Configure le système de recherche
 */
function setupSearch() {
    const searchInput = document.querySelector('.search-input-group input');
    const searchButton = document.querySelector('.search-input-group button');
    
    if (searchInput && searchButton) {
        // Recherche via le bouton
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                filterCards(searchTerm);
            } else {
                resetFilter();
            }
        });
        
        // Recherche en appuyant sur Entrée
        searchInput.addEventListener('keyup', function(e) {
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
    
    // Gestion des badges de filtre
    const filterBadges = document.querySelectorAll('.filter-badge');
    filterBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Supprimer le filtre
            this.remove();
            
            // Réappliquer les filtres restants
            applyFiltersFromBadges();
        });
    });
}

/**
 * Filtre les cartes en fonction du terme de recherche
 */
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

/**
 * Réinitialise le filtre
 */
function resetFilter() {
    const cards = document.querySelectorAll('.kanban-card');
    cards.forEach(card => {
        card.style.display = '';
    });
}

/**
 * Applique les filtres à partir des badges actifs
 */
function applyFiltersFromBadges() {
    const activeBadges = document.querySelectorAll('.filter-badge');
    const filters = Array.from(activeBadges).map(badge => badge.textContent.trim().toLowerCase());
    
    if (filters.length === 0) {
        resetFilter();
        return;
    }
    
    const cards = document.querySelectorAll('.kanban-card');
    
    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        let shouldDisplay = false;
        
        for (const filter of filters) {
            if (cardText.includes(filter)) {
                shouldDisplay = true;
                break;
            }
        }
        
        card.style.display = shouldDisplay ? '' : 'none';
    });
}

/**
 * Ajoute un badge de filtre
 */
function addFilterBadge(text) {
    const existingBadges = document.querySelectorAll('.filter-badge');
    for (const badge of existingBadges) {
        if (badge.textContent.trim().toLowerCase() === text.toLowerCase()) {
            return; // Éviter les doublons
        }
    }
    
    const badge = document.createElement('div');
    badge.className = 'filter-badge';
    badge.innerHTML = `
        <span>${text}</span>
        <i class="fas fa-xmark"></i>
    `;
    
    badge.addEventListener('click', function() {
        this.remove();
        applyFiltersFromBadges();
    });
    
    const badgesContainer = document.querySelector('.filter-badges');
    if (badgesContainer) {
        badgesContainer.appendChild(badge);
    }
}

/**
 * Met à jour le compteur d'une colonne
 */
function updateColumnCount(column, delta) {
    if (!column) return;
    
    const countElement = column.querySelector('.kanban-column-count');
    if (countElement) {
        let currentCount = parseInt(countElement.textContent || '0');
        currentCount += delta;
        countElement.textContent = currentCount;
    }
}

/**
 * NOUVELLE FONCTION: Initialise la gestion des assignations d'équipe
 */
function initTeamAssignments() {
    // Gestion du menu d'équipe
    const teamDropdown = document.getElementById('teamDropdown');
    const teamMembersDropdown = document.querySelector('.team-members-dropdown');
    
    if (teamDropdown && teamMembersDropdown) {
        teamDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            teamMembersDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (teamMembersDropdown && !teamMembersDropdown.contains(e.target) && e.target !== teamDropdown) {
                teamMembersDropdown.classList.remove('show');
            }
        });
    }
    
    // Recherche de membres
    const memberSearchInputs = document.querySelectorAll('.team-members-search input');
    memberSearchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const memberItems = this.closest('.team-members-search').parentElement.querySelectorAll('.team-member-item');
            
            memberItems.forEach(item => {
                const memberName = item.querySelector('.team-member-name').textContent.toLowerCase();
                const memberRole = item.querySelector('.team-member-role').textContent.toLowerCase();
                
                if (memberName.includes(searchTerm) || memberRole.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Gestion des boutons d'ajout de membre sur les cartes
    const addMemberButtons = document.querySelectorAll('.add-member-btn');
    addMemberButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateCard = this.closest('.kanban-card');
            const candidateName = candidateCard.querySelector('.kanban-card-title').textContent;
            
            // Mettre à jour le titre de la modal
            const modalTitle = document.getElementById('assignMembersModalLabel');
            if (modalTitle) {
                modalTitle.textContent = `Assigner des membres à ${candidateName}`;
            }
            
            // Pré-sélectionner les membres déjà assignés
            const assignedAvatars = candidateCard.querySelectorAll('.member-avatar');
            const checkboxes = document.querySelectorAll('#assignMembersModal .team-member-checkbox');
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                
                // Vérifier si ce membre est déjà assigné
                const memberInitials = checkbox.closest('.team-member-item').querySelector('.team-member-avatar').textContent;
                assignedAvatars.forEach(avatar => {
                    if (avatar.textContent === memberInitials) {
                        checkbox.checked = true;
                    }
                });
            });
            
            // Afficher la modal
            const assignMembersModal = new bootstrap.Modal(document.getElementById('assignMembersModal'));
            assignMembersModal.show();
            
            // Stocker l'ID du candidat dans la modal pour référence
            document.getElementById('assignMembersModal').dataset.candidateId = candidateCard.dataset.candidateId;
        });
    });
    
    // Gestion des paramètres de colonne
    const settingsButtons = document.querySelectorAll('.settings-btn');
    const settingsDropdowns = document.querySelectorAll('.column-settings-dropdown');
    
    settingsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Fermer tous les autres dropdowns
            settingsDropdowns.forEach(dropdown => {
                if (dropdown !== this.nextElementSibling) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Ouvrir/fermer le dropdown actuel
            this.nextElementSibling.classList.toggle('show');
        });
    });
    
    document.addEventListener('click', function(e) {
        settingsDropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target) && !e.target.classList.contains('settings-btn')) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // Gestion des options de colonne
    const columnSettingsItems = document.querySelectorAll('.column-settings-item');
    columnSettingsItems.forEach(item => {
        item.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            const columnTitle = this.closest('.kanban-column').querySelector('.kanban-column-title').textContent.trim();
            const columnId = this.closest('.kanban-column').dataset.stage;
            
            // Si c'est l'action "Ajouter des membres"
            if (actionText.includes('Ajouter des membres')) {
                // Mettre à jour le titre de la modal
                const modalTitle = document.getElementById('assignMembersModalLabel');
                if (modalTitle) {
                    modalTitle.textContent = `Assigner des membres à l'étape "${columnTitle}"`;
                }
                
                // Stocker l'ID de la colonne dans la modal pour référence
                document.getElementById('assignMembersModal').dataset.columnId = columnId;
                
                const assignMembersModal = new bootstrap.Modal(document.getElementById('assignMembersModal'));
                assignMembersModal.show();
            } else {
                // Simuler les autres actions
                showNotification(`Action "${actionText}" pour l'étape "${columnTitle}" - Fonctionnalité à venir`, 'info');
            }
            
            // Fermer le dropdown
            this.closest('.column-settings-dropdown').classList.remove('show');
        });
    });
}

/**
 * NOUVELLE FONCTION: Initialise le filtrage par offre d'emploi
 */
function initJobOfferFilter() {
    const jobOfferTabs = document.querySelectorAll('.job-offer-tab');
    
    jobOfferTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            jobOfferTabs.forEach(t => t.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Récupérer l'ID de l'offre
            const jobId = this.dataset.jobId;
            const jobTitle = this.querySelector('.job-offer-title').textContent;
            
            // Filtrer les cartes pour n'afficher que celles qui correspondent à l'offre
            filterCardsByJob(jobId, jobTitle);
        });
    });
}

/**
 * Filtre les cartes par offre d'emploi
 */
function filterCardsByJob(jobId, jobTitle) {
    const cards = document.querySelectorAll('.kanban-card');
    let matchCount = 0;
    
    cards.forEach(card => {
        const jobTag = card.querySelector('.job-tag').textContent.toLowerCase();
        
        // Comparer avec l'ID de l'offre
        let matches = false;
        if (jobId === 'comptabilite' && jobTag.includes('compta')) {
            matches = true;
        } else if (jobId === 'assistant' && jobTag.includes('assistant')) {
            matches = true;
        } else if (jobId === 'developpeur' && (jobTag.includes('dev') || jobTag.includes('développeur'))) {
            matches = true;
        }
        
        if (matches) {
            card.style.display = '';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mettre à jour les filtres et afficher une notification
    updateJobFilterBadges(jobTitle);
    showNotification(`Affichage des ${matchCount} candidats pour l'offre "${jobTitle}"`, 'info');
    
    // Mettre à jour les compteurs des colonnes
    updateColumnsCount();
}

/**
 * Met à jour les badges de filtre pour les offres d'emploi
 */
function updateJobFilterBadges(selectedJobTitle) {
    // Supprimer les badges de filtre existants liés aux offres d'emploi
    const badges = document.querySelectorAll('.filter-badge');
    badges.forEach(badge => {
        const badgeText = badge.textContent.trim();
        if (badgeText.includes('Comptabilité') || badgeText.includes('Assistant') || badgeText.includes('Développeur')) {
            badge.remove();
        }
    });
    
    // Ajouter le nouveau badge
    addFilterBadge(selectedJobTitle);
}

/**
 * Met à jour les compteurs des colonnes après filtrage
 */
function updateColumnsCount() {
    const columns = document.querySelectorAll('.kanban-column');
    
    columns.forEach(column => {
        const visibleCards = column.querySelectorAll('.kanban-card[style="display: ;"], .kanban-card:not([style])');
        const countElement = column.querySelector('.kanban-column-count');
        
        if (countElement) {
            countElement.textContent = visibleCards.length;
        }
    });
}

/**
 * Initialise les modals et leurs interactions
 */
function setupModals() {
    // Modal d'assignation de membres
    const assignMembersModal = document.getElementById('assignMembersModal');
    if (assignMembersModal) {
        const confirmButton = assignMembersModal.querySelector('.modal-footer .btn-primary');
        
        confirmButton.addEventListener('click', function() {
            // Récupérer les membres sélectionnés
            const selectedMembers = [];
            const checkboxes = assignMembersModal.querySelectorAll('.team-member-checkbox:checked');
            
            checkboxes.forEach(checkbox => {
                const memberItem = checkbox.closest('.team-member-item');
                const initials = memberItem.querySelector('.team-member-avatar').textContent;
                const name = memberItem.querySelector('.team-member-name').textContent;
                
                selectedMembers.push({ initials, name });
            });
            
            // Déterminer si nous modifions un candidat ou une colonne
            const candidateId = assignMembersModal.dataset.candidateId;
            const columnId = assignMembersModal.dataset.columnId;
            
            if (candidateId) {
                // Mettre à jour les membres assignés pour un candidat
                updateAssignedMembersForCandidate(candidateId, selectedMembers);
            } else if (columnId) {
                // Mettre à jour les membres assignés pour tous les candidats d'une colonne
                updateAssignedMembersForColumn(columnId, selectedMembers);
            }
            
            // Fermer la modal
            const modal = bootstrap.Modal.getInstance(assignMembersModal);
            modal.hide();
        });
    }
    
    // Modal de planification d'entretien
    const scheduleInterviewModal = document.getElementById('scheduleInterviewModal');
    if (scheduleInterviewModal) {
        const confirmButton = scheduleInterviewModal.querySelector('.modal-footer .btn-primary');
        
        confirmButton.addEventListener('click', function() {
            // Récupérer les données du formulaire
            const candidate = document.getElementById('candidate').value;
            const interviewType = document.getElementById('interviewType').value;
            const interviewDate = document.getElementById('interviewDate').value;
            const interviewTime = document.getElementById('interviewTime').value;
            
            // Valider les champs obligatoires
            if (!candidate || !interviewType || !interviewDate || !interviewTime) {
                showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
                return;
            }
            
            // Simuler la planification d'un entretien
            const candidateText = document.getElementById('candidate').options[document.getElementById('candidate').selectedIndex].text;
            const interviewTypeText = document.getElementById('interviewType').options[document.getElementById('interviewType').selectedIndex].text;
            
            showNotification(`Entretien planifié : ${interviewTypeText} avec ${candidateText} le ${formatDate(interviewDate)} à ${interviewTime}`, 'success');
            
            // Fermer la modal
            const modal = bootstrap.Modal.getInstance(scheduleInterviewModal);
            modal.hide();
        });
    }
}

/**
 * Met à jour les membres assignés pour un candidat
 */
function updateAssignedMembersForCandidate(candidateId, selectedMembers) {
    const candidateCard = document.querySelector(`.kanban-card[data-candidate-id="${candidateId}"]`);
    
    if (!candidateCard) return;
    
    // Mettre à jour les avatars des membres
    const avatarsContainer = candidateCard.querySelector('.assigned-members-avatars');
    
    if (avatarsContainer) {
        // Vider le conteneur
        avatarsContainer.innerHTML = '';
        
        // Limiter à 3 avatars + 1 compteur
        const visibleMembers = selectedMembers.slice(0, 3);
        const remainingCount = Math.max(0, selectedMembers.length - 3);
        
        // Ajouter les avatars visibles
        visibleMembers.forEach(member => {
            const avatar = document.createElement('div');
            avatar.className = 'member-avatar';
            avatar.textContent = member.initials;
            avatarsContainer.appendChild(avatar);
        });
        
        // Ajouter le compteur si nécessaire
        if (remainingCount > 0) {
            const counter = document.createElement('div');
            counter.className = 'member-avatar-count';
            counter.textContent = `+${remainingCount}`;
            avatarsContainer.appendChild(counter);
        }
    }
    
    // Notification
    showNotification(`Membres assignés au candidat mis à jour`, 'success');
}

/**
 * Met à jour les membres assignés pour tous les candidats d'une colonne
 */
function updateAssignedMembersForColumn(columnId, selectedMembers) {
    const column = document.querySelector(`.kanban-column[data-stage="${columnId}"]`);
    
    if (!column) return;
    
    // Récupérer tous les candidats de la colonne
    const cards = column.querySelectorAll('.kanban-card');
    
    cards.forEach(card => {
        // Mettre à jour les avatars des membres
        const avatarsContainer = card.querySelector('.assigned-members-avatars');
        
        if (avatarsContainer) {
            // Vider le conteneur
            avatarsContainer.innerHTML = '';
            
            // Limiter à 3 avatars + 1 compteur
            const visibleMembers = selectedMembers.slice(0, 3);
            const remainingCount = Math.max(0, selectedMembers.length - 3);
            
            // Ajouter les avatars visibles
            visibleMembers.forEach(member => {
                const avatar = document.createElement('div');
                avatar.className = 'member-avatar';
                avatar.textContent = member.initials;
                avatarsContainer.appendChild(avatar);
            });
            
            // Ajouter le compteur si nécessaire
            if (remainingCount > 0) {
                const counter = document.createElement('div');
                counter.className = 'member-avatar-count';
                counter.textContent = `+${remainingCount}`;
                avatarsContainer.appendChild(counter);
            }
        }
    });
    
    // Notification
    const columnTitle = column.querySelector('.kanban-column-title').textContent.trim();
    showNotification(`Membres assignés à l'étape "${columnTitle}" mis à jour`, 'success');
}

/**
 * Affiche une notification
 */
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

/**
 * Formate une date au format jj/mm/aaaa
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}
