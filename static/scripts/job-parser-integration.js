/**
 * Intégration du parsing de fiche de poste dans le questionnaire client
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script d'intégration du parsing de fiche de poste chargé");
    
    // Vérifier si l'utilisateur revient de la page de parsing
    const fromParser = sessionStorage.getItem('fromJobParser');
    
    if (fromParser === 'true') {
        console.log("Utilisateur revient de la page de parsing");
        // Revenir à l'étape 2 du questionnaire
        if (document.getElementById('step1') && document.getElementById('form-step1')) {
            if (document.getElementById('step1').classList.contains('active') && 
                document.getElementById('form-step1').classList.contains('active')) {
                
                // Masquer l'étape 1
                document.getElementById('form-step1').classList.remove('active');
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step1').classList.add('completed');
                
                // Afficher l'étape 2
                document.getElementById('form-step2').classList.add('active');
                document.getElementById('step2').classList.add('active');
                
                // Mettre à jour la barre de progression
                if (document.getElementById('stepper-progress')) {
                    document.getElementById('stepper-progress').style.width = '50%';
                }
                
                // Simuler la sélection du bouton radio "Oui"
                const yesRadio = document.querySelector('input[name="has-position"][value="yes"]');
                if (yesRadio) {
                    yesRadio.checked = true;
                    
                    // Afficher les détails de recrutement
                    if (document.getElementById('recruitment-details')) {
                        document.getElementById('recruitment-details').style.display = 'block';
                    }
                }
                
                // Scroll vers le haut du formulaire
                if (document.querySelector('.form-container')) {
                    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
        
        // Supprimer le marqueur après avoir restauré l'état
        sessionStorage.removeItem('fromJobParser');
    }
    
    // Modifier le comportement des boutons radio "Avez-vous un poste sur lequel vous souhaitez recruter ?"
    const hasPositionRadios = document.querySelectorAll('input[name="has-position"]');
    
    if (hasPositionRadios.length > 0) {
        console.log("Boutons radio 'has-position' trouvés");
        
        // Ajouter un gestionnaire d'événements pour tous les boutons radio
        hasPositionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                console.log("Radio 'has-position' changé:", this.value);
                if (this.value === 'yes') {
                    // Afficher les détails de recrutement (comportement normal)
                    if (document.getElementById('recruitment-details')) {
                        document.getElementById('recruitment-details').style.display = 'block';
                        
                        // Ajouter un bouton pour aller vers l'analyse de fiche de poste
                        const recruitmentDetails = document.getElementById('recruitment-details');
                        
                        // Vérifier si le bouton existe déjà pour éviter les doublons
                        if (!document.getElementById('parse-job-description-btn')) {
                            console.log("Ajout du bouton d'analyse de fiche de poste");
                            const parseButton = document.createElement('button');
                            parseButton.id = 'parse-job-description-btn';
                            parseButton.type = 'button';
                            parseButton.className = 'btn-generate';
                            parseButton.innerHTML = '<i class="fas fa-file-import"></i> Analyser une fiche de poste';
                            parseButton.style.marginTop = 'var(--spacing-md)';
                            parseButton.style.marginBottom = 'var(--spacing-sm)';
                            
                            parseButton.addEventListener('click', function() {
                                // Rediriger vers la page de parsing de fiche de poste
                                console.log("Redirection vers job-description-parser.html");
                                sessionStorage.setItem('fromQuestionnaire', 'true');
                                window.location.href = 'job-description-parser.html';
                            });
                            
                            // Insérer le bouton au début du conteneur
                            recruitmentDetails.insertBefore(parseButton, recruitmentDetails.firstChild);
                        }
                    }
                } else {
                    // Comportement par défaut pour "Non"
                    if (document.getElementById('recruitment-details')) {
                        document.getElementById('recruitment-details').style.display = 'none';
                    }
                    
                    // Supprimer le bouton d'analyse s'il existe
                    const parseButton = document.getElementById('parse-job-description-btn');
                    if (parseButton) {
                        parseButton.remove();
                    }
                }
            });
        });
    }
    
    // Pre-remplir l'étape 3 avec les données d'analyse de fiche de poste
    const jobData = localStorage.getItem('jobDescriptionData');
    
    if (jobData) {
        console.log("Données d'analyse de fiche de poste trouvées dans localStorage");
        const parsedData = JSON.parse(jobData);
        
        // Observer l'étape 3 pour pré-remplir les champs
        const formStep3 = document.getElementById('form-step3');
        
        if (formStep3) {
            console.log("Étape 3 du formulaire trouvée, configuration de l'observateur");
            
            // Vérifier si l'étape 3 est déjà active
            if (formStep3.classList.contains('active')) {
                console.log("Étape 3 déjà active, pré-remplissage immédiat");
                preFillFormWithJobData(parsedData);
            } else {
                // Observer les changements sur l'étape 3
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.target.classList.contains('active')) {
                            console.log("Étape 3 devenue active, pré-remplissage");
                            preFillFormWithJobData(parsedData);
                            // Arrêter l'observation après le premier remplissage
                            observer.disconnect();
                        }
                    });
                });
                
                // Observer les changements de classe
                observer.observe(formStep3, { attributes: true, attributeFilter: ['class'] });
            }
        }
    }
    
    // Fonction pour pré-remplir les champs du formulaire avec les données d'analyse
    function preFillFormWithJobData(parsedData) {
        // Vérifier si les éléments existent avant de tenter de les remplir
        const contractTypeInput = document.getElementById('contract-type');
        const compensationInput = document.getElementById('compensation');
        const experienceSelect = document.getElementById('required-experience');
        
        // Pré-remplir les champs avec les données d'analyse
        if (contractTypeInput && parsedData.contractType) {
            console.log("Pré-remplissage du type de contrat:", parsedData.contractType);
            contractTypeInput.value = parsedData.contractType;
        }
        
        if (compensationInput && parsedData.salary) {
            console.log("Pré-remplissage de la rémunération:", parsedData.salary);
            compensationInput.value = parsedData.salary;
        }
        
        // Sélectionner le niveau d'expérience approprié
        if (experienceSelect && parsedData.experience) {
            console.log("Pré-remplissage de l'expérience requise:", parsedData.experience);
            // Analyse basique du texte d'expérience pour déterminer la valeur à sélectionner
            let experienceValue = '';
            
            if (parsedData.experience.includes('Junior') || parsedData.experience.includes('0-2')) {
                experienceValue = 'junior';
            } else if (parsedData.experience.includes('2-3') || parsedData.experience.includes('2 ans')) {
                experienceValue = '2-3years';
            } else if (parsedData.experience.includes('5-10') || parsedData.experience.includes('5 ans')) {
                experienceValue = '5-10years';
            } else if (parsedData.experience.includes('10+') || parsedData.experience.includes('10 ans')) {
                experienceValue = '10+years';
            }
            
            if (experienceValue) {
                experienceSelect.value = experienceValue;
            }
        }
        
        // Afficher une notification pour informer l'utilisateur
        if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification('Les informations de la fiche de poste ont été automatiquement intégrées au formulaire.');
        }
    }
});