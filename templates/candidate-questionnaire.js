document.addEventListener('DOMContentLoaded', function() {
    // Système de tags pour les intitulés de poste
    const tagsContainer = document.getElementById('job-titles-container');
    const tagsInput = document.getElementById('job-titles-input');
    const tags = [];

    if (tagsInput && tagsContainer) {
        tagsInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && tagsInput.value.trim() !== '') {
                e.preventDefault();
                addTag(tagsInput.value.trim());
                tagsInput.value = '';
            }
        });

        function addTag(tag) {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tag');
            tagElement.innerHTML = `
                <span>${tag}</span>
                <span class="tag-close">&times;</span>
            `;
            tagsContainer.insertBefore(tagElement, tagsInput);
            tags.push(tag);

            // Ajouter l'événement pour supprimer le tag
            const closeBtn = tagElement.querySelector('.tag-close');
            closeBtn.addEventListener('click', function() {
                tagElement.remove();
                tags.splice(tags.indexOf(tag), 1);
            });
        }
    }

    // Gestion des options cliquables
    initOptions();

    // Gestion de la navigation du formulaire
    const form = document.getElementById('candidate-form');
    const formSteps = document.querySelectorAll('.form-step');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentStep = 1;
    const totalSteps = formSteps.length; // Utiliser le nombre réel d'étapes
    
    // Mise à jour de la progression
    updateProgress(currentStep);
    
    // Navigation entre les étapes
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            } else {
                showSuccessStep();
            }
        } else {
            alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
        }
    });
    
    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Questionnaire complété avec succès! En production, vous seriez redirigé vers vos propositions d'emploi.");
        goToStep(1); // Reset du formulaire pour la démo
    });

    // Fonction pour afficher l'étape finale de succès
    function showSuccessStep() {
        for (let i = 0; i < formSteps.length; i++) {
            formSteps[i].style.display = 'none';
        }
        document.getElementById('step-6').style.display = 'block';
        document.getElementById('form-navigation').style.display = 'none';
    }
    
    // Fonction pour initialiser les options cliquables
    function initOptions() {
        // Radio options
        document.querySelectorAll('.radio-option').forEach(option => {
            const input = option.querySelector('input[type="radio"]');
            
            option.addEventListener('click', function() {
                input.checked = true;
                
                // Mise à jour de l'apparence
                const name = input.getAttribute('name');
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    const parentOption = radio.closest('.radio-option');
                    if (radio.checked) {
                        parentOption.classList.add('selected');
                    } else {
                        parentOption.classList.remove('selected');
                    }
                });
                
                // Gestion des sections conditionnelles
                if (name === 'sector-preference') {
                    const preferredSectorsContainer = document.getElementById('preferred-sectors-container');
                    if (input.value === 'Oui') {
                        preferredSectorsContainer.classList.add('visible');
                    } else {
                        preferredSectorsContainer.classList.remove('visible');
                    }
                }
            });
        });
        
        // Checkbox options
        document.querySelectorAll('.checkbox-option').forEach(option => {
            const input = option.querySelector('input[type="checkbox"]');
            
            option.addEventListener('click', function(e) {
                if (e.target !== input) {
                    input.checked = !input.checked;
                }
                
                if (input.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        });
    }
    
    // Fonction pour valider une étape
    function validateStep(step) {
        // Vérification réelle des champs obligatoires dans l'étape actuelle
        const currentStepElement = document.getElementById('step-' + step);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        // Pour les champs radio, nous devons vérifier qu'au moins un est coché par groupe
        const radioGroups = new Set();
        currentStepElement.querySelectorAll('input[type="radio"]').forEach(radio => {
            radioGroups.add(radio.name);
        });
        
        // Vérifier tous les champs obligatoires
        for (const field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                return false;
            }
        }
        
        // Vérifier les groupes radio
        for (const groupName of radioGroups) {
            const isAnyChecked = Array.from(
                currentStepElement.querySelectorAll(`input[name="${groupName}"]`)
            ).some(radio => radio.checked);
            
            if (!isAnyChecked) {
                // Mettre en évidence le groupe
                const firstRadio = currentStepElement.querySelector(`input[name="${groupName}"]`);
                if (firstRadio) {
                    firstRadio.focus();
                }
                return false;
            }
        }
        
        // Vérifier les tags si on est à l'étape 1
        if (step === 1 && tags.length === 0) {
            document.getElementById('job-titles-input').focus();
            return false;
        }
        
        // Si on arrive ici, tout est valide
        return true;
    }
    
    // Fonction pour naviguer entre les étapes
    function goToStep(step) {
        // Cacher toutes les étapes
        for (let i = 0; i < formSteps.length; i++) {
            formSteps[i].style.display = 'none';
        }
        
        // Afficher l'étape actuelle
        document.getElementById('step-' + step).style.display = 'block';
        
        // Mettre à jour les boutons de navigation
        prevButton.disabled = (step === 1);
        if (step === totalSteps) {
            nextButton.textContent = 'Terminer';
            nextButton.innerHTML = 'Terminer <i class="fas fa-check" style="margin-left: 0.5rem;"></i>';
        } else {
            nextButton.textContent = 'Suivant';
            nextButton.innerHTML = 'Suivant <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>';
        }
        
        // Mettre à jour l'étape actuelle
        currentStep = step;
        
        // Mettre à jour la barre de progression
        updateProgress(step);
    }
    
    // Fonction pour mettre à jour la barre de progression
    function updateProgress(step) {
        const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = progressPercentage + '%';
    }
});