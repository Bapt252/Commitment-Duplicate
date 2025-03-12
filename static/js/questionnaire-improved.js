/**
 * Fichier JavaScript amélioré pour le questionnaire candidat
 * Ce fichier contient toutes les fonctionnalités UI/UX améliorées
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du formulaire
    const form = document.getElementById('candidate-form');
    const formSteps = document.querySelectorAll('.form-step');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.querySelector('.progress-bar');
    const stepIndicator = document.getElementById('step-indicator');
    const currentStepIndicator = document.getElementById('current-step-indicator').querySelector('span');
    
    // Variables de gestion du formulaire
    let currentStep = 1;
    const totalSteps = formSteps.length;
    
    // Afficher l'indicateur d'étape
    stepIndicator.style.display = 'block';
    
    // Gestion des étapes conditionnelles
    const sectorPreferenceRadios = document.querySelectorAll('input[name="sector-preference"]');
    const preferredSectorsContainer = document.getElementById('preferred-sectors-container');
    const excludingSectorsRadios = document.querySelectorAll('input[name="has-excluding-sectors"]');
    const excludingSectorsContainer = document.getElementById('excluding-sectors-container');
    const currentJobRadios = document.querySelectorAll('input[name="currently-employed"]');
    
    // Initialisation des options cliquables
    initOptions();
    
    // Initialisation de la fonctionnalité de glisser-déposer pour les motivations
    initSortableList();
    
    // Initialisation des tags pour les postes
    initTagsInput();
    
    // Mise à jour de la progression
    updateProgress(currentStep);
    updateStepIndicator(currentStep);
    
    // Navigation entre les étapes
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            animateStepTransition(currentStep, currentStep - 1);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            // Si on est à l'étape 4, déterminer quelle version de l'étape 5 afficher
            if (currentStep === 4) {
                const isEmployed = document.getElementById('current-job-yes').checked;
                if (isEmployed) {
                    document.getElementById('step-5-unemployed').style.display = 'none';
                    document.getElementById('step-5-employed').style.display = 'block';
                } else {
                    document.getElementById('step-5-employed').style.display = 'none';
                    document.getElementById('step-5-unemployed').style.display = 'block';
                }
            }
            
            if (currentStep < totalSteps) {
                animateStepTransition(currentStep, currentStep + 1);
            } else {
                submitForm();
            }
        }
    });
    
    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // Gestion des secteurs d'activité
    sectorPreferenceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Oui') {
                preferredSectorsContainer.classList.add('visible');
            } else {
                preferredSectorsContainer.classList.remove('visible');
            }
        });
    });
    
    // Gestion des secteurs exclus
    excludingSectorsRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Oui') {
                excludingSectorsContainer.classList.add('visible');
            } else {
                excludingSectorsContainer.classList.remove('visible');
            }
        });
    });
    
    // Fonction pour initialiser les options cliquables
    function initOptions() {
        // Initialisation des options de type radio
        document.querySelectorAll('.radio-option').forEach(option => {
            const input = option.querySelector('input[type="radio"]');
            
            if (input && input.checked) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', function(e) {
                if (e.target.tagName.toLowerCase() !== 'input') {
                    input.checked = true;
                    
                    // Effet d'onde ripple
                    createRippleEffect(e, this);
                }
                
                // Mettre à jour l'apparence
                const name = input.getAttribute('name');
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    const parentOption = radio.closest('.radio-option');
                    if (radio.checked) {
                        parentOption.classList.add('selected');
                    } else {
                        parentOption.classList.remove('selected');
                    }
                });
                
                // Déclencher l'événement change pour les radios avec logique conditionnelle
                if (input.name === 'sector-preference' || input.name === 'has-excluding-sectors' || input.name === 'currently-employed') {
                    const event = new Event('change');
                    input.dispatchEvent(event);
                }
            });
        });
        
        // Initialisation des options de type checkbox
        document.querySelectorAll('.checkbox-option').forEach(option => {
            const input = option.querySelector('input[type="checkbox"]');
            
            if (input && input.checked) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', function(e) {
                // Ne pas changer si on a cliqué sur l'input directement
                if (e.target.tagName.toLowerCase() !== 'input') {
                    input.checked = !input.checked;
                    
                    // Effet d'onde ripple
                    createRippleEffect(e, this);
                }
                
                // Mettre à jour l'apparence
                if (input.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
                
                // Gestion spéciale pour l'option "Peu importe" dans les structures
                if (input.id === 'structure-any' && input.checked) {
                    document.querySelectorAll('input[name="company-structure"]').forEach(checkbox => {
                        if (checkbox.id !== 'structure-any') {
                            checkbox.checked = false;
                            checkbox.closest('.checkbox-option').classList.remove('selected');
                        }
                    });
                } else if (input.name === 'company-structure' && input.id !== 'structure-any' && input.checked) {
                    const anyOption = document.getElementById('structure-any');
                    if (anyOption && anyOption.checked) {
                        anyOption.checked = false;
                        anyOption.closest('.checkbox-option').classList.remove('selected');
                    }
                }
            });
        });
    }
    
    // Fonctions pour le drag & drop
    function initSortableList() {
        const sortableList = document.getElementById('motivation-factors');
        if (!sortableList) return;
        
        let draggedItem = null;
        let dragStartIndex;
        
        // Ajouter l'attribut draggable et l'écouteur d'événements
        const listItems = sortableList.querySelectorAll('.sortable-item');
        listItems.forEach((item, index) => {
            // Configurer l'élément pour le glisser-déposer
            item.setAttribute('draggable', 'true');
            
            // Événements de drag and drop
            item.addEventListener('dragstart', function() {
                draggedItem = this;
                dragStartIndex = [...listItems].indexOf(this);
                
                // Ajouter une classe pour le style pendant le drag
                setTimeout(() => {
                    this.classList.add('dragging');
                    this.style.opacity = '0.5';
                }, 0);
                
                // Effet de tremblement pour les autres éléments
                listItems.forEach(li => {
                    if (li !== this) {
                        li.classList.add('shake-hint');
                        setTimeout(() => {
                            li.classList.remove('shake-hint');
                        }, 500);
                    }
                });
            });
            
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
                this.style.opacity = '1';
                draggedItem = null;
                
                // Mettre à jour les numéros
                updateItemNumbers();
                checkOtherMotivation();
                
                // Effet de succès pour montrer que le réordonnement est terminé
                sortableList.classList.add('success-animation');
                setTimeout(() => {
                    sortableList.classList.remove('success-animation');
                }, 800);
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            item.addEventListener('dragenter', function(e) {
                e.preventDefault();
                this.style.background = 'rgba(108, 99, 255, 0.1)';
            });
            
            item.addEventListener('dragleave', function() {
                this.style.background = '';
                this.classList.remove('drag-over');
            });
            
            item.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.background = '';
                this.classList.remove('drag-over');
                
                if (draggedItem !== this) {
                    const dragEndIndex = [...listItems].indexOf(this);
                    
                    if (dragStartIndex < dragEndIndex) {
                        this.parentNode.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        this.parentNode.insertBefore(draggedItem, this);
                    }
                }
            });
        });
        
        // Mettre à jour les numéros après un glisser-déposer
        function updateItemNumbers() {
            const items = sortableList.querySelectorAll('.sortable-item');
            items.forEach((item, index) => {
                const numberElement = item.querySelector('.item-number');
                if (numberElement) {
                    numberElement.textContent = index + 1;
                    
                    // Petit effet d'animation
                    numberElement.classList.add('pulse');
                    setTimeout(() => {
                        numberElement.classList.remove('pulse');
                    }, 300);
                }
            });
        }
        
        // Vérifier si "Autre" est dans les 3 premiers pour afficher le champ
        function checkOtherMotivation() {
            const otherMotivationContainer = document.getElementById('other-motivation-container');
            if (!otherMotivationContainer) return;
            
            const items = sortableList.querySelectorAll('.sortable-item');
            let otherFound = false;
            let otherIndex = -1;
            
            items.forEach((item, index) => {
                if (item.getAttribute('data-value') === 'Autre') {
                    otherFound = true;
                    otherIndex = index;
                }
            });
            
            if (otherFound && otherIndex < 3) {
                otherMotivationContainer.style.display = 'block';
                
                // Animation d'apparition
                otherMotivationContainer.style.opacity = '0';
                setTimeout(() => {
                    otherMotivationContainer.style.opacity = '1';
                }, 50);
            } else {
                // Animation de disparition
                if (otherMotivationContainer.style.display === 'block') {
                    otherMotivationContainer.style.opacity = '0';
                    setTimeout(() => {
                        otherMotivationContainer.style.display = 'none';
                    }, 300);
                } else {
                    otherMotivationContainer.style.display = 'none';
                }
            }
        }
        
        // Vérification initiale
        checkOtherMotivation();
    }
    
    // Fonction pour initialiser le système de tags
    function initTagsInput() {
        const container = document.getElementById('job-titles-container');
        const input = document.getElementById('job-titles-input');
        
        if (!container || !input) return;
        
        // Tableau pour stocker les tags
        const tags = [];
        
        // Événement au clic sur le conteneur pour focus sur l'input
        container.addEventListener('click', function() {
            input.focus();
        });
        
        // Événement d'ajout de tag
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                e.preventDefault();
                
                const tagValue = this.value.trim();
                if (!tags.includes(tagValue)) {
                    addTag(tagValue);
                    this.value = '';
                    
                    // Effet d'animation sur le conteneur
                    container.classList.add('success-animation');
                    setTimeout(() => {
                        container.classList.remove('success-animation');
                    }, 500);
                }
            }
        });
        
        // Fonction pour ajouter un tag
        function addTag(text) {
            if (tags.length >= 5) {
                showInputError(input, "Maximum 5 postes autorisés");
                return;
            }
            
            tags.push(text);
            
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                <span>${text}</span>
                <span class="close-tag">×</span>
            `;
            
            // Événement pour supprimer le tag
            tag.querySelector('.close-tag').addEventListener('click', function() {
                tag.remove();
                const index = tags.indexOf(text);
                if (index !== -1) {
                    tags.splice(index, 1);
                }
                
                // Créer un champ caché pour la valeur
                updateHiddenField();
            });
            
            // Ajouter le tag avant l'input
            container.insertBefore(tag, input);
            
            // Animation d'apparition
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 10);
            
            // Créer un champ caché pour la valeur
            updateHiddenField();
        }
        
        // Mettre à jour le champ caché avec les valeurs des tags
        function updateHiddenField() {
            let hiddenField = document.getElementById('job-titles-hidden');
            
            if (!hiddenField) {
                hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'job-titles';
                hiddenField.id = 'job-titles-hidden';
                container.appendChild(hiddenField);
            }
            
            hiddenField.value = JSON.stringify(tags);
        }
    }
    
    // Fonction pour créer un effet de vague (ripple)
    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Animation de transition entre les étapes
    function animateStepTransition(from, to) {
        const currentStepElement = document.getElementById(`step-${from}`);
        const nextStepElement = document.getElementById(`step-${to}`);
        
        if (!currentStepElement || !nextStepElement) return;
        
        // Animation de sortie pour l'étape actuelle
        currentStepElement.classList.add('fade-out');
        
        setTimeout(() => {
            currentStepElement.style.display = 'none';
            currentStepElement.classList.remove('fade-out');
            
            // Animation d'entrée pour la nouvelle étape
            nextStepElement.classList.add('fade-in');
            nextStepElement.style.display = 'block';
            
            // Mettre à jour l'étape actuelle
            currentStep = to;
            updateButtons();
            updateProgress(to);
            updateStepIndicator(to);
            
            // Scroller en haut de la page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }
    
    // Mise à jour des boutons de navigation
    function updateButtons() {
        prevButton.disabled = currentStep === 1;
        
        if (currentStep >= totalSteps) {
            nextButton.textContent = 'Soumettre';
            nextButton.innerHTML = 'Soumettre <i class="fas fa-check" style="margin-left: 0.5rem;"></i>';
        } else {
            nextButton.textContent = 'Suivant';
            nextButton.innerHTML = 'Suivant <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>';
        }
        
        // Effet d'animation pour les boutons
        prevButton.classList.add('button-update');
        nextButton.classList.add('button-update');
        
        setTimeout(() => {
            prevButton.classList.remove('button-update');
            nextButton.classList.remove('button-update');
        }, 300);
    }
    
    // Mise à jour de la barre de progression
    function updateProgress(step) {
        const progress = (step - 1) / (totalSteps - 1) * 100;
        
        // Animation de la barre de progression
        progressBar.style.width = `${progress}%`;
    }
    
    // Mise à jour de l'indicateur d'étape
    function updateStepIndicator(step) {
        if (currentStepIndicator) {
            currentStepIndicator.textContent = step;
        }
    }
    
    // Validation des champs du formulaire
    function validateStep(step) {
        let isValid = true;
        const currentStepElement = document.getElementById(`step-${step}`);
        
        if (!currentStepElement) return true;
        
        // Réinitialiser les messages d'erreur
        const existingErrors = currentStepElement.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Récupérer tous les champs obligatoires de l'étape actuelle
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        // Vérifier les champs obligatoires
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showInputError(field, "Ce champ est obligatoire");
                isValid = false;
            } else {
                showInputSuccess(field);
            }
        });
        
        // Validation spécifique pour les boutons radio
        const radioGroups = currentStepElement.querySelectorAll('.radio-options');
        
        radioGroups.forEach(group => {
            const groupName = group.querySelector('input[type="radio"]')?.name;
            
            if (groupName) {
                const radioButtons = currentStepElement.querySelectorAll(`input[name="${groupName}"]`);
                const isChecked = Array.from(radioButtons).some(radio => radio.checked);
                
                if (!isChecked) {
                    const label = group.parentElement.querySelector('.form-label');
                    if (label && label.textContent.includes('*')) {
                        isValid = false;
                        const errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Veuillez sélectionner une option';
                        group.insertAdjacentElement('beforebegin', errorElement);
                        
                        // Animation d'erreur
                        group.classList.add('shake-error');
                        setTimeout(() => {
                            group.classList.remove('shake-error');
                        }, 600);
                    }
                }
            }
        });
        
        // Validation spécifique pour les checkbox
        const checkboxGroups = currentStepElement.querySelectorAll('.checkbox-options');
        
        checkboxGroups.forEach(group => {
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            const isRequired = group.parentElement.querySelector('.form-label')?.textContent.includes('*');
            
            if (isRequired && !Array.from(checkboxes).some(checkbox => checkbox.checked)) {
                isValid = false;
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Veuillez sélectionner au moins une option';
                group.insertAdjacentElement('beforebegin', errorElement);
                
                // Animation d'erreur
                group.classList.add('shake-error');
                setTimeout(() => {
                    group.classList.remove('shake-error');
                }, 600);
            }
        });
        
        // Validation des tags pour les postes recherchés
        if (step === 1) {
            const jobTitlesContainer = document.getElementById('job-titles-container');
            const tags = jobTitlesContainer.querySelectorAll('.tag');
            
            if (tags.length === 0) {
                showInputError(document.getElementById('job-titles-input'), "Veuillez ajouter au moins un poste");
                isValid = false;
            }
        }
        
        // Pour le formulaire de démonstration, permettre la navigation même avec des erreurs
        return true;
    }
    
    // Affichage d'un message d'erreur pour un champ
    function showInputError(input, message) {
        // Supprimer les anciens messages
        const parentElement = input.parentElement;
        const existingError = parentElement.querySelector('.error-message');
        const existingSuccess = parentElement.querySelector('.input-success-message');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Ajouter la classe d'erreur
        input.classList.add('error');
        input.classList.remove('success');
        
        // Créer le message d'erreur
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Ajouter après l'input
        if (input.nextElementSibling) {
            input.parentNode.insertBefore(errorElement, input.nextElementSibling);
        } else {
            input.parentNode.appendChild(errorElement);
        }
        
        // Animation de secouement
        input.classList.add('shake-error');
        setTimeout(() => {
            input.classList.remove('shake-error');
        }, 600);
    }
    
    // Affichage d'un message de succès pour un champ
    function showInputSuccess(input, message) {
        // Supprimer les anciens messages
        const parentElement = input.parentElement;
        const existingError = parentElement.querySelector('.error-message');
        const existingSuccess = parentElement.querySelector('.input-success-message');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Ajouter la classe de succès
        input.classList.add('success');
        input.classList.remove('error');
        
        // Si un message est fourni, l'afficher
        if (message) {
            const successElement = document.createElement('div');
            successElement.className = 'input-success-message';
            successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            
            // Ajouter après l'input
            if (input.nextElementSibling) {
                input.parentNode.insertBefore(successElement, input.nextElementSibling);
            } else {
                input.parentNode.appendChild(successElement);
            }
        }
    }
    
    // Soumission du formulaire
    function submitForm() {
        // Collecter toutes les données du formulaire
        const formData = new FormData(form);
        const data = {};
        
        // Convertir FormData en objet
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Ajouter les données spéciales
        data.motivationFactors = Array.from(document.querySelectorAll('#motivation-factors .sortable-item')).map(item => {
            return {
                rank: parseInt(item.querySelector('.item-number').textContent),
                value: item.getAttribute('data-value')
            };
        });
        
        // Récupérer les tags des postes
        const jobTitlesContainer = document.getElementById('job-titles-container');
        data.jobTitles = Array.from(jobTitlesContainer.querySelectorAll('.tag')).map(tag => {
            return tag.querySelector('span').textContent;
        });
        
        // Ajouter les coordonnées de l'adresse si disponibles
        const addressInput = document.getElementById('address');
        if (addressInput.dataset.lat && addressInput.dataset.lng) {
            data.addressCoordinates = {
                lat: parseFloat(addressInput.dataset.lat),
                lng: parseFloat(addressInput.dataset.lng)
            };
            data.formattedAddress = addressInput.dataset.formattedAddress || addressInput.value;
        }
        
        // Déboguer les données collectées
        console.log('Données du formulaire :', data);
        
        // Sauvegarder dans localStorage pour le matching
        localStorage.setItem('candidateQuestionnaire', JSON.stringify(data));
        
        // Animer le bouton de soumission
        const submitButton = document.querySelector('.btn-submit-final');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Traitement en cours...';
        }
        
        // Simuler un chargement et rediriger
        setTimeout(() => {
            window.location.href = 'candidate-matching-improved.html';
        }, 2000);
    }
    
    // Initialisation de l'autocomplete Google Maps
    window.initAutocomplete = function() {
        const addressInput = document.getElementById('address');
        const loadingElement = document.getElementById('location-loading');
        
        if (addressInput) {
            try {
                // Vérifier si l'API Google Maps est chargée
                if (typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined') {
                    console.error("L'API Google Maps n'a pas été chargée correctement");
                    handleGoogleMapsError();
                    return;
                }
                
                const autocomplete = new google.maps.places.Autocomplete(addressInput, {
                    types: ['address'],
                    componentRestrictions: { country: ['fr'] },
                    fields: ['address_components', 'formatted_address', 'geometry', 'name']
                });
                
                addressInput.addEventListener('focus', function() {
                    if (loadingElement) loadingElement.style.display = 'block';
                });
                
                addressInput.addEventListener('blur', function() {
                    setTimeout(() => {
                        if (loadingElement) loadingElement.style.display = 'none';
                    }, 300);
                });
                
                // Traitement de l'adresse sélectionnée
                autocomplete.addListener('place_changed', function() {
                    if (loadingElement) loadingElement.style.display = 'none';
                    
                    const place = autocomplete.getPlace();
                    if (!place || !place.geometry) {
                        console.error("Aucune information géométrique reçue pour cette adresse");
                        showInputError(addressInput, "Adresse invalide. Veuillez sélectionner une suggestion.");
                        return;
                    }
                    
                    // Sauvegarder les coordonnées et l'adresse formatée
                    const formattedAddress = place.formatted_address || addressInput.value;
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    
                    // Stocker les données de géolocalisation
                    addressInput.dataset.formattedAddress = formattedAddress;
                    addressInput.dataset.lat = lat;
                    addressInput.dataset.lng = lng;
                    
                    // Mettre à jour le champ avec l'adresse formatée
                    addressInput.value = formattedAddress;
                    
                    // Confirmation visuelle
                    showInputSuccess(addressInput, "Adresse validée!");
                });
            } catch (error) {
                console.error("Erreur lors de l'initialisation de l'autocomplete Google Maps:", error);
                handleGoogleMapsError();
            }
        }
    };
    
    // Gestion des erreurs Google Maps
    window.handleGoogleMapsError = function() {
        console.error("Erreur de chargement de l'API Google Maps");
        const addressInput = document.getElementById('address');
        if (addressInput && addressInput.parentNode) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> L\'autocomplétion d\'adresses est indisponible. Saisissez l\'adresse manuellement.';
            
            // Supprimer les anciens messages d'erreur
            const existingErrors = addressInput.parentNode.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());
            
            addressInput.parentNode.appendChild(errorMsg);
        }
    };
    
    // Ajouter des styles pour les animations supplémentaires
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .shake-error {
            animation: shake 0.5s ease-in-out;
        }
        
        .shake-hint {
            animation: shakeMild 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes shakeMild {
            0%, 100% { transform: translateX(0); }
            25%, 75% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
        }
        
        .pulse {
            animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .button-update {
            animation: buttonPulse 0.3s ease-in-out;
        }
        
        @keyframes buttonPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .dragging {
            border: 2px dashed var(--primary);
            background-color: rgba(99, 102, 241, 0.05);
        }
        
        .drag-over {
            border: 2px solid var(--primary);
            box-shadow: var(--shadow-md);
        }
    `;
    document.head.appendChild(styleElement);
});
