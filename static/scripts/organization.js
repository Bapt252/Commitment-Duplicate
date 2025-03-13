/**
 * Organization section - Company Dashboard
 * Script for managing organization functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des onglets et des tooltips
    initializeComponents();
    
    // Gestion du formulaire d'ajout de contact
    setupContactForm();
    
    // Gestion des actions sur les contacts (modifier, supprimer)
    setupContactActions();
    
    // Gestion des invitations par email
    setupInvitationForm();
    
    // Gestion des permissions et des rôles
    setupPermissionsHandling();
    
    // Gestion des paramètres de l'organisation
    setupOrganizationSettings();
    
    // Gestion de l'ajout de membres à un recrutement
    setupRecruitmentAssignment();
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
    const organizationElements = document.querySelectorAll('.organization-section .card, .organization-section .table');
    organizationElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 100);
    });
}

/**
 * Configure le formulaire d'ajout de contact
 */
function setupContactForm() {
    const addContactForm = document.getElementById('addContactForm');
    if (!addContactForm) return;
    
    const addContactBtn = document.querySelector('[form="addContactForm"]');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', function() {
            if (addContactForm.checkValidity()) {
                const newContact = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    function: document.getElementById('function').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    role: document.getElementById('role').value
                };
                
                // Ajouter le contact au tableau
                addContactToTable(newContact);
                
                // Fermer la modal et réinitialiser le formulaire
                const modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
                modal.hide();
                addContactForm.reset();
                
                // Afficher une notification de succès
                showNotification('Contact ajouté avec succès', 'success');
            } else {
                // Déclencher la validation native du formulaire
                addContactForm.reportValidity();
            }
        });
    }
}

/**
 * Ajoute un contact au tableau
 */
function addContactToTable(contact) {
    const tbody = document.querySelector('#contactsTable tbody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.function || ''}</td>
        <td>${contact.email}</td>
        <td>${contact.phone || ''}</td>
        <td>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item edit-contact" href="#" data-id="${Date.now()}"><i class="fas fa-edit me-2"></i>Modifier</a></li>
                    <li><a class="dropdown-item delete-contact" href="#" data-id="${Date.now()}"><i class="fas fa-trash me-2"></i>Supprimer</a></li>
                </ul>
            </div>
        </td>
    `;
    
    // Animation d'entrée
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(20px)';
    tbody.appendChild(newRow);
    
    setTimeout(() => {
        newRow.style.transition = 'all 0.5s ease-out';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    // Afficher le message de contact ajouté
    const contactAddedAlert = document.querySelector('.contact-added-alert');
    if (contactAddedAlert) {
        contactAddedAlert.classList.remove('d-none');
        setTimeout(() => {
            contactAddedAlert.classList.add('d-none');
        }, 5000);
    }
}

/**
 * Configure les actions sur les contacts (modifier, supprimer)
 */
function setupContactActions() {
    document.addEventListener('click', function(e) {
        // Gestion de la suppression de contact
        if (e.target.classList.contains('delete-contact') || e.target.closest('.delete-contact')) {
            e.preventDefault();
            const contactRow = e.target.closest('tr');
            
            if (contactRow && confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                // Animation de sortie
                contactRow.style.transition = 'all 0.5s ease-out';
                contactRow.style.opacity = '0';
                contactRow.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    contactRow.remove();
                    showNotification('Contact supprimé avec succès', 'warning');
                }, 500);
            }
        }
        
        // Gestion de la modification de contact
        if (e.target.classList.contains('edit-contact') || e.target.closest('.edit-contact')) {
            e.preventDefault();
            const contactRow = e.target.closest('tr');
            
            if (contactRow) {
                const cells = contactRow.querySelectorAll('td');
                const contactData = {
                    firstName: cells[0].textContent,
                    lastName: cells[1].textContent,
                    function: cells[2].textContent,
                    email: cells[3].textContent,
                    phone: cells[4].textContent
                };
                
                // Remplir le formulaire avec les données du contact
                document.getElementById('firstName').value = contactData.firstName;
                document.getElementById('lastName').value = contactData.lastName;
                document.getElementById('function').value = contactData.function;
                document.getElementById('email').value = contactData.email;
                document.getElementById('phone').value = contactData.phone;
                
                // Changer le texte du bouton dans la modal
                const addButton = document.querySelector('[form="addContactForm"]');
                if (addButton) {
                    addButton.textContent = 'Mettre à jour';
                    addButton.dataset.editMode = 'true';
                    addButton.dataset.rowIndex = Array.from(contactRow.parentElement.children).indexOf(contactRow);
                }
                
                // Ouvrir la modal
                const modal = new bootstrap.Modal(document.getElementById('addContactModal'));
                modal.show();
            }
        }
    });
}

/**
 * Configure le formulaire d'invitation
 */
function setupInvitationForm() {
    const invitationForm = document.getElementById('invitationForm');
    if (!invitationForm) return;
    
    invitationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            // Simulation d'envoi d'invitation
            console.log('Invitation envoyée à:', emailInput.value);
            
            // Afficher une notification de succès
            showNotification(`Invitation envoyée à ${emailInput.value}`, 'info');
            
            // Réinitialiser le formulaire
            emailInput.value = '';
        }
    });
}

/**
 * Configure la gestion des permissions et des rôles
 */
function setupPermissionsHandling() {
    const roleSwitches = document.querySelectorAll('.role-switch');
    roleSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const roleName = this.dataset.role;
            const isEnabled = this.checked;
            
            // Simulation de mise à jour des permissions
            console.log(`Rôle ${roleName} ${isEnabled ? 'activé' : 'désactivé'}`);
            
            // Afficher une notification
            showNotification(`Permissions du rôle "${roleName}" mises à jour`, 'info');
        });
    });
    
    // Gestion des permissions par utilisateur
    const userPermissionCheckboxes = document.querySelectorAll('.user-permission');
    userPermissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const userId = this.dataset.userId;
            const permission = this.dataset.permission;
            const isEnabled = this.checked;
            
            // Simulation de mise à jour des permissions
            console.log(`Permission "${permission}" pour l'utilisateur ${userId} ${isEnabled ? 'activée' : 'désactivée'}`);
            
            // Afficher une notification
            showNotification('Permissions utilisateur mises à jour', 'info');
        });
    });
}

/**
 * Configure les paramètres de l'organisation
 */
function setupOrganizationSettings() {
    const settingsForm = document.getElementById('organizationSettingsForm');
    if (!settingsForm) return;
    
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = {
            companyName: document.getElementById('companyName').value,
            companyDescription: document.getElementById('companyDescription').value
        };
        
        // Simulation de sauvegarde des paramètres
        console.log('Paramètres de l\'organisation sauvegardés:', formData);
        
        // Afficher une notification de succès
        showNotification('Paramètres sauvegardés avec succès', 'success');
        
        // Mettre à jour les informations de l'entreprise dans la bannière
        const companyNameElement = document.querySelector('.company-name');
        if (companyNameElement) {
            companyNameElement.textContent = formData.companyName;
        }
    });
    
    // Prévisualisation du logo
    const logoInput = document.getElementById('companyLogo');
    if (logoInput) {
        logoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const logoPreview = document.getElementById('logoPreview');
                    if (logoPreview) {
                        logoPreview.src = e.target.result;
                        logoPreview.classList.remove('d-none');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/**
 * Configure l'assignation de membres à un recrutement
 */
function setupRecruitmentAssignment() {
    const assignButtons = document.querySelectorAll('.assign-to-recruitment');
    assignButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactId = this.dataset.contactId;
            const recruitmentId = this.closest('.recruitment-item').dataset.recruitmentId;
            
            // Simulation d'assignation
            console.log(`Contact ${contactId} assigné au recrutement ${recruitmentId}`);
            
            // Afficher une notification
            showNotification('Contact assigné au recrutement', 'success');
            
            // Animation de confirmation
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.classList.remove('btn-light');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i>';
                this.classList.remove('btn-success');
                this.classList.add('btn-light');
            }, 2000);
        });
    });
}

/**
 * Affiche une notification
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
