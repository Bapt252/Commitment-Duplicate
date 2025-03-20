/**
 * Organization section - Améliorations UI/UX
 * Script pour la page organisation améliorée
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants
    initializeComponents();
    
    // Gestion du formulaire de contact
    setupContactForm();
    
    // Actions sur les contacts
    setupContactActions();
    
    // Formulaire d'invitation
    setupInvitationForm();
    
    // Gestion des permissions
    setupPermissionsHandling();
    
    // Paramètres de l'organisation
    setupOrganizationSettings();
    
    // Assignation aux recrutements
    setupRecruitmentAssignment();
    
    // Recherche de contacts
    setupContactSearch();
    
    // Animations d'entrée pour améliorer l'expérience utilisateur
    setupEntranceAnimations();
});

/**
 * Initialise les composants Bootstrap et les animations
 */
function initializeComponents() {
    // Initialisation des tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Animation d'entrée pour les cartes
    animateElements('.card', 'fadeInUp', 100);
    
    // Notification de bienvenue
    setTimeout(() => {
        showNotification('Bienvenue dans la gestion de votre organisation', 'info');
    }, 1000);
}

/**
 * Configure le formulaire d'ajout de contact avec validation et animation
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
                
                // Ajouter le contact au tableau avec animation
                addContactToTable(newContact);
                
                // Fermer la modal et réinitialiser le formulaire
                const modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
                modal.hide();
                
                // Réinitialiser le formulaire
                addContactForm.reset();
                
                // Notification de succès
                showNotification(`Contact ${newContact.firstName} ${newContact.lastName} ajouté avec succès`, 'success');
            } else {
                // Validation de formulaire
                addContactForm.classList.add('was-validated');
                
                // Trouver le premier champ invalide et mettre le focus dessus
                const invalidField = addContactForm.querySelector(':invalid');
                if (invalidField) {
                    invalidField.focus();
                    
                    // Notification d'erreur
                    showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
                }
            }
        });
    }
    
    // Validation en temps réel pour améliorer l'UX
    const formInputs = addContactForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });
}

/**
 * Ajoute un contact au tableau avec animation
 */
function addContactToTable(contact) {
    const tbody = document.querySelector('#contactsTable tbody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td data-label="Prénom">${contact.firstName}</td>
        <td data-label="Nom">${contact.lastName}</td>
        <td data-label="Fonction">${contact.function || ''}</td>
        <td data-label="Email">${contact.email}</td>
        <td data-label="Téléphone">${contact.phone || ''}</td>
        <td data-label="Actions">
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-purple dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
    tbody.prepend(newRow);
    
    // Déclencher l'animation après l'ajout au DOM
    setTimeout(() => {
        newRow.style.transition = 'all 0.5s ease-out';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    // Mettre en évidence le nouveau contact temporairement
    setTimeout(() => {
        newRow.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        
        setTimeout(() => {
            newRow.style.backgroundColor = '';
        }, 3000);
    }, 500);
}

/**
 * Configure les actions sur les contacts (modification, suppression)
 */
function setupContactActions() {
    document.addEventListener('click', function(e) {
        // Gestion de la suppression de contact
        if (e.target.classList.contains('delete-contact') || e.target.closest('.delete-contact')) {
            e.preventDefault();
            const contactRow = e.target.closest('tr');
            const contactName = contactRow.cells[0].textContent + ' ' + contactRow.cells[1].textContent;
            
            if (contactRow && confirm(`Êtes-vous sûr de vouloir supprimer le contact ${contactName} ?`)) {
                // Animation de sortie
                contactRow.style.transition = 'all 0.5s ease-out';
                contactRow.style.opacity = '0';
                contactRow.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    contactRow.remove();
                    showNotification(`Contact ${contactName} supprimé avec succès`, 'warning');
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
                const modalTitle = document.querySelector('#addContactModalLabel');
                if (modalTitle) {
                    modalTitle.innerHTML = '<i class="fas fa-user-edit me-2"></i>Modifier un contact';
                }
                
                const addButton = document.querySelector('[form="addContactForm"]');
                if (addButton) {
                    addButton.innerHTML = '<i class="fas fa-check me-2"></i>Mettre à jour';
                    addButton.dataset.editMode = 'true';
                    addButton.dataset.rowIndex = Array.from(contactRow.parentElement.children).indexOf(contactRow);
                }
                
                // Ouvrir la modal
                const modal = new bootstrap.Modal(document.getElementById('addContactModal'));
                modal.show();
            }
        }
    });
    
    // Écouter la fermeture de la modal pour réinitialiser le formulaire
    const addContactModal = document.getElementById('addContactModal');
    if (addContactModal) {
        addContactModal.addEventListener('hidden.bs.modal', function() {
            // Réinitialiser le formulaire et les messages d'erreur
            const form = document.getElementById('addContactForm');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
                
                // Réinitialiser les classes de validation
                form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
            }
            
            // Réinitialiser le titre et le bouton
            const modalTitle = document.querySelector('#addContactModalLabel');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-user-plus me-2"></i>Ajouter un contact';
            }
            
            const addButton = document.querySelector('[form="addContactForm"]');
            if (addButton) {
                addButton.innerHTML = '<i class="fas fa-check me-2"></i>Ajouter';
                addButton.dataset.editMode = 'false';
                delete addButton.dataset.rowIndex;
            }
        });
    }
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
            // Animation du bouton pendant l'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
                
                // Simuler l'envoi
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Envoyer une invitation';
                    
                    // Notification de succès
                    showNotification(`Invitation envoyée à ${emailInput.value}`, 'info');
                    emailInput.value = '';
                }, 1500);
            }
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
            
            // Animation du changement
            const roleItem = this.closest('.role-item');
            if (roleItem) {
                roleItem.style.transition = 'all 0.3s ease';
                
                if (isEnabled) {
                    roleItem.style.borderLeftColor = 'var(--purple)';
                    roleItem.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.1)';
                } else {
                    roleItem.style.borderLeftColor = 'var(--gray-light)';
                    roleItem.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                }
                
                // Animation légère pour indiquer le changement
                roleItem.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    roleItem.style.transform = 'translateX(0)';
                }, 300);
            }
            
            // Notification
            showNotification(`Rôle "${roleName}" ${isEnabled ? 'activé' : 'désactivé'}`, 'info');
            
            // Gérer les permissions associées
            togglePermissionsForRole(roleItem, isEnabled);
        });
    });
    
    // Gestion des permissions par utilisateur
    const userPermissionCheckboxes = document.querySelectorAll('.permissions-detail .form-check-input');
    userPermissionCheckboxes.forEach(checkbox => {
        if (!checkbox.disabled) {
            checkbox.addEventListener('change', function() {
                const permission = this.nextElementSibling.textContent;
                const isEnabled = this.checked;
                
                // Notification
                showNotification(`Permission "${permission}" ${isEnabled ? 'activée' : 'désactivée'}`, 'info');
            });
        }
    });
}

/**
 * Active/désactive les permissions associées à un rôle
 */
function togglePermissionsForRole(roleItem, isEnabled) {
    if (!roleItem) return;
    
    const checkboxes = roleItem.querySelectorAll('.permissions-detail .form-check-input:not([disabled])');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = !isEnabled;
        
        if (!isEnabled) {
            checkbox.checked = false;
        }
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
        
        // Récupération des données
        const formData = {
            companyName: document.getElementById('companyName').value,
            companyDescription: document.getElementById('companyDescription').value,
            companyIndustry: document.getElementById('companyIndustry').value,
            companyWebsite: document.getElementById('companyWebsite').value
        };
        
        // Animation du bouton de sauvegarde
        const saveBtn = this.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sauvegarde en cours...';
            
            // Simuler la sauvegarde
            setTimeout(() => {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Sauvegarder les modifications';
                
                // Mettre à jour les informations visibles
                updateCompanyInfo(formData);
                
                // Notification de succès
                showNotification('Paramètres sauvegardés avec succès', 'success');
            }, 1500);
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
                    // Mettre à jour la prévisualisation
                    const logoPreview = document.getElementById('logoPreview');
                    if (logoPreview) {
                        logoPreview.src = e.target.result;
                        
                        // Animation
                        logoPreview.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            logoPreview.style.transition = 'transform 0.5s ease';
                            logoPreview.style.transform = 'scale(1)';
                        }, 10);
                    }
                    
                    // Mettre à jour également le logo dans la bannière
                    const companyLogoImg = document.querySelector('.company-logo img');
                    if (companyLogoImg) {
                        companyLogoImg.src = e.target.result;
                        
                        // Petite animation
                        companyLogoImg.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            companyLogoImg.style.transition = 'transform 0.5s ease';
                            companyLogoImg.style.transform = 'scale(1)';
                        }, 10);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/**
 * Met à jour les informations de l'entreprise dans l'interface
 */
function updateCompanyInfo(formData) {
    // Mettre à jour le nom dans la bannière
    const companyNameElement = document.querySelector('.company-name');
    if (companyNameElement && formData.companyName) {
        companyNameElement.textContent = formData.companyName.toUpperCase();
        
        // Animation
        companyNameElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            companyNameElement.style.transition = 'transform 0.5s ease';
            companyNameElement.style.transform = 'scale(1)';
        }, 10);
    }
    
    // Mettre à jour la catégorie dans la bannière
    const companyCategoryElement = document.querySelector('.company-category');
    if (companyCategoryElement && formData.companyIndustry) {
        const industrySelect = document.getElementById('companyIndustry');
        const selectedOption = industrySelect.options[industrySelect.selectedIndex];
        companyCategoryElement.textContent = selectedOption.textContent;
        
        // Animation
        companyCategoryElement.style.opacity = '0.5';
        setTimeout(() => {
            companyCategoryElement.style.transition = 'opacity 0.5s ease';
            companyCategoryElement.style.opacity = '1';
        }, 10);
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
            const recruitmentItem = this.closest('.recruitment-item');
            const recruitmentId = recruitmentItem.dataset.recruitmentId;
            const recruitmentTitle = recruitmentItem.querySelector('.recruitment-title').textContent;
            
            // Animation du bouton
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simuler l'assignation
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.classList.remove('btn-light');
                this.classList.add('btn-success');
                
                // Notification
                showNotification(`Contact assigné au recrutement "${recruitmentTitle}"`, 'success');
                
                // Réinitialiser après animation
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-plus"></i>';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-light');
                    this.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
}

/**
 * Configure la recherche dans le tableau des contacts
 */
function setupContactSearch() {
    const searchInput = document.getElementById('searchContact');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase().trim();
        const tableRows = document.querySelectorAll('#contactsTable tbody tr');
        let matchCount = 0;
        
        tableRows.forEach(row => {
            let match = false;
            const cells = row.querySelectorAll('td');
            
            // Recherche dans toutes les cellules sauf "Actions"
            for (let i = 0; i < cells.length - 1; i++) {
                if (cells[i].textContent.toLowerCase().includes(searchValue)) {
                    match = true;
                    break;
                }
            }
            
            if (match) {
                row.style.display = '';
                matchCount++;
                
                // Mettre en évidence les correspondances
                if (searchValue) {
                    highlightText(row, searchValue);
                } else {
                    // Réinitialiser le surligneur
                    clearHighlight(row);
                }
            } else {
                row.style.display = 'none';
            }
        });
        
        // Afficher un message si aucun résultat
        const tableBody = document.querySelector('#contactsTable tbody');
        const noResultsRow = tableBody.querySelector('.no-results');
        
        if (matchCount === 0 && searchValue) {
            if (!noResultsRow) {
                const newRow = document.createElement('tr');
                newRow.className = 'no-results';
                newRow.innerHTML = `<td colspan="6" class="text-center py-4">
                    <i class="fas fa-search me-2 text-purple"></i> Aucun résultat trouvé pour "${searchValue}"
                </td>`;
                tableBody.appendChild(newRow);
            }
        } else if (noResultsRow) {
            noResultsRow.remove();
        }
    });
    
    // Réinitialiser la recherche quand le champ perd le focus
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            const tableRows = document.querySelectorAll('#contactsTable tbody tr');
            tableRows.forEach(row => {
                clearHighlight(row);
            });
        }
    });
}

/**
 * Met en évidence le texte recherché
 */
function highlightText(row, searchValue) {
    const cells = row.querySelectorAll('td');
    
    // Parcourir toutes les cellules sauf la dernière (Actions)
    for (let i = 0; i < cells.length - 1; i++) {
        const cell = cells[i];
        
        // Sauvegarder le texte original s'il n'est pas encore sauvegardé
        if (!cell.dataset.originalText) {
            cell.dataset.originalText = cell.textContent;
        }
        
        const originalText = cell.dataset.originalText;
        const regex = new RegExp(`(${searchValue})`, 'gi');
        cell.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
    }
}

/**
 * Efface la mise en évidence du texte
 */
function clearHighlight(row) {
    const cells = row.querySelectorAll('td');
    
    for (let i = 0; i < cells.length - 1; i++) {
        const cell = cells[i];
        if (cell.dataset.originalText) {
            cell.textContent = cell.dataset.originalText;
        }
    }
}

/**
 * Anime l'entrée des éléments pour améliorer l'expérience
 */
function setupEntranceAnimations() {
    // Animation de la bannière
    const banner = document.querySelector('.company-banner');
    if (banner) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            banner.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animation du titre de la page
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.style.opacity = '0';
        pageTitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            pageTitle.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            pageTitle.style.opacity = '1';
            pageTitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animation du bouton de retour
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.style.opacity = '0';
        backBtn.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            backBtn.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            backBtn.style.opacity = '1';
            backBtn.style.transform = 'translateX(0)';
        }, 700);
    }
    
    // Animation de la carte principale
    const mainCard = document.querySelector('.organization-section .card');
    if (mainCard) {
        mainCard.style.opacity = '0';
        mainCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            mainCard.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            mainCard.style.opacity = '1';
            mainCard.style.transform = 'translateY(0)';
        }, 900);
    }
}

/**
 * Anime les éléments avec un délai progressif
 */
function animateElements(selector, animationClass, delayIncrement = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-' + animationClass);
        }, index * delayIncrement);
    });
}

/**
 * Affiche une notification
 */
function showNotification(message, type = 'info') {
    // Créer l'élément toast
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    // Icône selon le type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    else if (type === 'danger') icon = 'exclamation-circle';
    
    // Créer la notification
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${icon} me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Ajouter au DOM
    toastContainer.appendChild(toastElement);
    
    // Initialiser et afficher la notification
    const toast = new bootstrap.Toast(toastElement, {
        delay: 5000
    });
    
    // Animation d'entrée
    toastElement.style.transform = 'translateX(100%)';
    toastElement.style.opacity = '0';
    
    setTimeout(() => {
        toastElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        toastElement.style.transform = 'translateX(0)';
        toastElement.style.opacity = '1';
        toast.show();
    }, 10);
    
    // Supprimer après disparition
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}
