/**
 * Planning section - Company Dashboard
 * Script for managing recruitment planning functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des onglets et des tooltips
    initializeComponents();
    
    // Gestion des étapes de recrutement
    setupRecruitmentSteps();
    
    // Gestion du calendrier
    setupCalendar();
    
    // Gestion des entretiens
    setupInterviewScheduling();
    
    // Gestion des filtres
    setupFilters();
    
    // Animations et transitions
    setupAnimations();
});

/**
 * Initialise les composants Bootstrap
 */
function initializeComponents() {
    // Initialisation des tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Animation d'entrée pour les éléments de la section
    const planningElements = document.querySelectorAll('.recruitment-need, .card');
    planningElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 100);
    });
}

/**
 * Configure la gestion des étapes de recrutement
 */
function setupRecruitmentSteps() {
    const stepButtons = document.querySelectorAll('.step-button');
    
    stepButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer tous les boutons de l'étape
            const stepContainer = this.parentElement;
            const steps = stepContainer.querySelectorAll('.step-button');
            const currentIndex = Array.from(steps).indexOf(this);
            
            // Mettre à jour le statut des étapes
            steps.forEach((step, index) => {
                if (index < currentIndex) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index === currentIndex) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
            
            // Simuler une notification de mise à jour
            const candidateName = this.closest('.candidate-card').querySelector('.candidate-info h4').textContent;
            const stepName = this.textContent.trim();
            
            showNotification(`État mis à jour : ${candidateName} est maintenant à l'étape "${stepName}"`, 'success');
        });
    });
    
    // Gestion des boutons d'action
    const actionButtons = document.querySelectorAll('.candidate-action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const candidateCard = this.closest('.candidate-card');
            const candidateName = candidateCard.querySelector('.candidate-info h4').textContent;
            
            if (action === 'Poser une question') {
                // Simuler l'ouverture d'une boîte de dialogue pour poser une question
                showModal('Poser une question', `
                    <form>
                        <div class="form-group mb-3">
                            <label for="questionTitle">Sujet</label>
                            <input type="text" class="form-control" id="questionTitle" placeholder="Sujet de votre question">
                        </div>
                        <div class="form-group mb-3">
                            <label for="questionContent">Question</label>
                            <textarea class="form-control" id="questionContent" rows="3" placeholder="Votre question pour le candidat"></textarea>
                        </div>
                    </form>
                `);
            } else if (action === 'Enlever shortlist') {
                // Simuler la suppression d'un candidat de la shortlist
                if (confirm(`Êtes-vous sûr de vouloir retirer ${candidateName} de la shortlist ?`)) {
                    candidateCard.style.opacity = '0';
                    candidateCard.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        candidateCard.remove();
                        showNotification(`${candidateName} a été retiré de la shortlist`, 'info');
                    }, 500);
                }
            }
        });
    });
}

/**
 * Configure la gestion du calendrier
 */
function setupCalendar() {
    // Gestion des jours du calendrier
    const calendarDays = document.querySelectorAll('td:not(.text-muted)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Si le jour contient déjà des entretiens
            if (this.classList.contains('bg-light')) {
                // Simuler l'affichage des entretiens pour ce jour
                const date = this.textContent.trim();
                const month = document.querySelector('.calendar-view h4').textContent.trim();
                
                // Trouver le nombre d'entretiens
                let numInterviews = 0;
                const badge = this.querySelector('.badge');
                if (badge) {
                    const badgeText = badge.textContent.trim();
                    numInterviews = parseInt(badgeText.split(' ')[0]);
                }
                
                showNotification(`Affichage des ${numInterviews} entretiens du ${date} ${month}`, 'info');
            } else {
                // Simuler la planification d'un nouvel entretien
                const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
                const date = this.textContent.trim();
                const month = document.querySelector('.calendar-view h4').textContent.trim();
                
                // Pré-remplir la date
                const monthNum = getMonthNumber(month.split(' ')[0]);
                const year = month.split(' ')[1];
                const dateInput = document.getElementById('interviewDate');
                if (dateInput) {
                    dateInput.value = `${year}-${monthNum}-${date.padStart(2, '0')}`;
                }
                
                scheduleModal.show();
            }
        });
    });
    
    // Gestion des boutons de navigation du calendrier
    const calendarNavButtons = document.querySelectorAll('.calendar-view .btn-outline-secondary');
    calendarNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer le titre actuel du calendrier
            const calendarTitle = document.querySelector('.calendar-view h4');
            const currentMonth = calendarTitle.textContent.trim();
            
            // Simuler le changement de mois
            let newMonth;
            if (this.innerHTML.includes('chevron-left')) {
                newMonth = getPreviousMonth(currentMonth);
            } else {
                newMonth = getNextMonth(currentMonth);
            }
            
            calendarTitle.textContent = newMonth;
            showNotification(`Calendrier mis à jour : ${newMonth}`, 'info');
        });
    });
    
    // Gestion du filtrage des entretiens
    const filterCheckboxes = document.querySelectorAll('.form-check-input');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.id.replace('filter', '');
            if (this.checked) {
                showNotification(`Affichage des entretiens pour "${filterType}"`, 'info');
            } else {
                showNotification(`Masquage des entretiens pour "${filterType}"`, 'info');
            }
        });
    });
}

/**
 * Configure la planification des entretiens
 */
function setupInterviewScheduling() {
    // Gestion du bouton de planification d'entretien
    const scheduleButtons = document.querySelectorAll('button.btn-primary');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.trim().includes('Planifier')) {
                const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
                scheduleModal.show();
            }
        });
    });
    
    // Gestion du formulaire de planification
    const scheduleForm = document.getElementById('scheduleInterviewModal');
    if (scheduleForm) {
        const modalSubmitButton = scheduleForm.querySelector('.modal-footer .btn-primary');
        if (modalSubmitButton) {
            modalSubmitButton.addEventListener('click', function() {
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
                const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleInterviewModal'));
                modal.hide();
            });
        }
    }
    
    // Gestion des actions sur les entretiens existants
    const interviewButtons = document.querySelectorAll('.list-group-item .btn');
    interviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interview = this.closest('.list-group-item');
            const interviewTitle = interview.querySelector('h6').textContent;
            
            if (this.querySelector('.fa-video')) {
                showNotification(`Lancement de la vidéoconférence pour "${interviewTitle}"`, 'info');
            } else if (this.querySelector('.fa-edit')) {
                showNotification(`Modification de l'entretien "${interviewTitle}"`, 'info');
                const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleInterviewModal'));
                scheduleModal.show();
            }
        });
    });
}

/**
 * Configure les filtres
 */
function setupFilters() {
    // Gestion des filtres d'affichage
    const filterLinks = document.querySelectorAll('.list-group-item-action');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mettre à jour l'état actif
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Simuler le filtrage
            const filterText = this.querySelector('span').textContent.trim();
            showNotification(`Affichage des entretiens pour "${filterText}"`, 'info');
        });
    });
}

/**
 * Configure les animations et transitions
 */
function setupAnimations() {
    // Animation des cartes de candidats
    const candidateCards = document.querySelectorAll('.candidate-card');
    candidateCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (success, info, warning, danger)
 */
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `toast align-items-center text-white bg-${type} border-0`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    
    notification.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Ajouter au conteneur de notifications
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // Créer le conteneur s'il n'existe pas
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '11';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        toastContainer.appendChild(notification);
    }
    
    // Initialiser et afficher la notification
    const toast = new bootstrap.Toast(notification, {
        delay: 5000
    });
    toast.show();
    
    // Supprimer la notification après disparition
    notification.addEventListener('hidden.bs.toast', function() {
        notification.remove();
    });
}

/**
 * Affiche une modal avec un contenu personnalisé
 * @param {string} title - Le titre de la modal
 * @param {string} content - Le contenu HTML de la modal
 */
function showModal(title, content) {
    // Vérifier si la modal existe déjà
    let modal = document.getElementById('dynamicModal');
    
    if (!modal) {
        // Créer la modal si elle n'existe pas
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'dynamicModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'dynamicModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dynamicModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary">Envoyer</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les gestionnaires d'événements
        modal.querySelector('.btn-primary').addEventListener('click', function() {
            showNotification('Action effectuée avec succès', 'success');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        });
    } else {
        // Mettre à jour le contenu si la modal existe déjà
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;
    }
    
    // Afficher la modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

/**
 * Formate une date au format jj/mm/aaaa
 * @param {string} dateString - La date au format aaaa-mm-jj
 * @returns {string} La date formatée
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Retourne le numéro du mois à partir de son nom en français
 * @param {string} monthName - Le nom du mois en français
 * @returns {string} Le numéro du mois (01-12)
 */
function getMonthNumber(monthName) {
    const months = {
        'Janvier': '01',
        'Février': '02',
        'Mars': '03',
        'Avril': '04',
        'Mai': '05',
        'Juin': '06',
        'Juillet': '07',
        'Août': '08',
        'Septembre': '09',
        'Octobre': '10',
        'Novembre': '11',
        'Décembre': '12'
    };
    
    return months[monthName] || '01';
}

/**
 * Retourne le mois précédent
 * @param {string} currentMonth - Le mois actuel au format "Mois AAAA"
 * @returns {string} Le mois précédent au format "Mois AAAA"
 */
function getPreviousMonth(currentMonth) {
    const [month, year] = currentMonth.split(' ');
    const monthIndex = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ].indexOf(month);
    
    if (monthIndex === 0) {
        return `Décembre ${parseInt(year) - 1}`;
    } else {
        return `${[
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ][monthIndex - 1]} ${year}`;
    }
}

/**
 * Retourne le mois suivant
 * @param {string} currentMonth - Le mois actuel au format "Mois AAAA"
 * @returns {string} Le mois suivant au format "Mois AAAA"
 */
function getNextMonth(currentMonth) {
    const [month, year] = currentMonth.split(' ');
    const monthIndex = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ].indexOf(month);
    
    if (monthIndex === 11) {
        return `Janvier ${parseInt(year) + 1}`;
    } else {
        return `${[
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ][monthIndex + 1]} ${year}`;
    }
}